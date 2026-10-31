# Iteration 4: verify follow-up fixes (traversal 400, concurrency, non-image 502, fetch_news retry)
import os
import sys
import shutil
import asyncio
import concurrent.futures as cf
import pytest
import requests
import httpx

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
PREFIX = "https://nbg1.your-objectstorage.com/koodh-clara/"
sys.path.insert(0, "/app/backend")


@pytest.fixture(scope="module")
def images():
    r = requests.get(f"{BASE_URL}/api/experiences", timeout=30)
    assert r.status_code == 200
    return [i["image_url"] for i in r.json()["items"]]


# '..' and backslash rejected
@pytest.mark.parametrize("src", [
    PREFIX + "../other/x.jpg",
    PREFIX + "a/../../x.jpg",
    PREFIX + "a\\..\\x.jpg",
    PREFIX + "a\\x.jpg",
    PREFIX + "%2e%2e/x.jpg",
])
def test_traversal_rejected(src):
    r = requests.get(f"{BASE_URL}/api/img", params={"src": src, "w": 800}, timeout=30)
    print(src, r.status_code)
    if "%2e" in src:
        assert r.status_code in (400, 404)
    else:
        assert r.status_code == 400


# Concurrent first requests for same uncached image all 200
def test_concurrent_cold_requests(images):
    shutil.rmtree("/tmp/ynnck-img", ignore_errors=True)
    os.makedirs("/tmp/ynnck-img", exist_ok=True)
    params = {"src": images[0], "w": 1600}
    with cf.ThreadPoolExecutor(6) as ex:
        res = list(ex.map(lambda _: requests.get(f"{BASE_URL}/api/img", params=params, timeout=120), range(6)))
    codes = [r.status_code for r in res]
    print("codes", codes)
    assert all(c == 200 for c in codes)
    for r in res:
        assert r.content[8:12] == b"WEBP"
    leftovers = [f for f in os.listdir("/tmp/ynnck-img") if f.endswith(".tmp")]
    assert leftovers == []


# render_webp raises UnidentifiedImageError on non-image bytes (caught -> 502)
def test_render_webp_non_image(tmp_path):
    from PIL import UnidentifiedImageError
    import server
    with pytest.raises((UnidentifiedImageError, OSError)):
        server.render_webp(b"<html>not an image</html>", 800, tmp_path / "x.webp")


def test_img_endpoint_non_image_502(monkeypatch):
    import server
    from fastapi.testclient import TestClient

    async def fake_get(self, url, *a, **k):
        return httpx.Response(200, content=b"<html>nope</html>", request=httpx.Request("GET", url))
    monkeypatch.setattr(httpx.AsyncClient, "get", fake_get)
    c = TestClient(server.app)
    r = c.get("/api/img", params={"src": PREFIX + "TEST_nonimage_xyz.jpg", "w": 480})
    assert r.status_code == 502


def test_fetch_news_retries(monkeypatch):
    import server
    calls = []

    async def fake_get(self, url, *a, **k):
        calls.append(url)
        code = 503 if len(calls) < 3 else 200
        return httpx.Response(code, json={"items": []}, request=httpx.Request("GET", url))
    monkeypatch.setattr(httpx.AsyncClient, "get", fake_get)
    data = asyncio.run(server.fetch_news("/x"))
    assert data == {"items": []}
    assert len(calls) == 3


def test_fetch_news_gives_up_502(monkeypatch):
    import server
    from fastapi import HTTPException
    calls = []

    async def fake_get(self, url, *a, **k):
        calls.append(url)
        return httpx.Response(429, request=httpx.Request("GET", url))
    monkeypatch.setattr(httpx.AsyncClient, "get", fake_get)
    with pytest.raises(HTTPException) as e:
        asyncio.run(server.fetch_news("/x"))
    assert e.value.status_code == 502
    assert len(calls) == 3
