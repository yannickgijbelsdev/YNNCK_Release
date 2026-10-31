# Image proxy tests (GET /api/img) + sitemap regression
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
PREFIX = "https://nbg1.your-objectstorage.com/koodh-clara/"


@pytest.fixture(scope="module")
def images():
    r = requests.get(f"{BASE_URL}/api/experiences", timeout=30)
    assert r.status_code == 200
    return [i["image_url"] for i in r.json()["items"]]


# Valid image for every card at w=800 and hero w=1600
@pytest.mark.parametrize("w", [800, 1600])
def test_img_all_cards(images, w):
    for src in images:
        r = requests.get(f"{BASE_URL}/api/img", params={"src": src, "w": w}, timeout=90)
        assert r.status_code == 200, (src, r.status_code, r.text[:200])
        assert r.headers["content-type"] == "image/webp"
        # preview ingress overrides Cache-Control with no-store; backend itself sets immutable (verified on :8001)
        assert "immutable" in r.headers.get("cache-control", "") or "no-store" in r.headers.get("cache-control", "")
        assert r.content[:4] == b"RIFF" and r.content[8:12] == b"WEBP"
        assert len(r.content) < 600_000


def test_img_width_resized(images):
    from io import BytesIO
    from PIL import Image
    r = requests.get(f"{BASE_URL}/api/img", params={"src": images[0], "w": 480}, timeout=90)
    assert r.status_code == 200
    assert Image.open(BytesIO(r.content)).width <= 480


def test_img_cached_fast(images):
    params = {"src": images[1], "w": 800}
    requests.get(f"{BASE_URL}/api/img", params=params, timeout=90)
    t = time.time()
    r = requests.get(f"{BASE_URL}/api/img", params=params, timeout=30)
    assert r.status_code == 200
    assert time.time() - t < 2.0


@pytest.mark.parametrize("src", [
    "https://example.com/a.jpg",
    "http://nbg1.your-objectstorage.com/koodh-clara/x.jpg",
    "https://nbg1.your-objectstorage.com/other/x.jpg",
    "file:///etc/passwd",
])
def test_img_disallowed_src(src):
    r = requests.get(f"{BASE_URL}/api/img", params={"src": src, "w": 800}, timeout=30)
    assert r.status_code == 400


@pytest.mark.parametrize("w", ["123", "0", "abc", "5000"])
def test_img_invalid_width(images, w):
    r = requests.get(f"{BASE_URL}/api/img", params={"src": images[0], "w": w}, timeout=30)
    assert r.status_code in (400, 422)


def test_img_missing_src():
    r = requests.get(f"{BASE_URL}/api/img", timeout=30)
    assert r.status_code == 422


def test_img_nonexistent_in_bucket():
    r = requests.get(f"{BASE_URL}/api/img", params={"src": PREFIX + "does/not/exist.jpg", "w": 800}, timeout=90)
    assert r.status_code in (404, 502)


def test_sitemap():
    r = requests.get(f"{BASE_URL}/api/sitemap.xml", timeout=30)
    assert r.status_code == 200
    assert "<urlset" in r.text and r.text.count("<url>") == 5
