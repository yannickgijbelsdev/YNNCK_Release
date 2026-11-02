# Iteration 6: health endpoint + removed Mongo status endpoints + core regression
import os
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")


def test_health_ok():
    r = requests.get(f"{BASE_URL}/api/health", timeout=15)
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_status_removed():
    assert requests.get(f"{BASE_URL}/api/status", timeout=15).status_code in (404, 405)


def test_experiences_and_detail():
    r = requests.get(f"{BASE_URL}/api/experiences", timeout=30)
    assert r.status_code == 200
    items = r.json()["items"]
    assert len(items) >= 1
    for a in items:
        d = requests.get(f"{BASE_URL}/api/experiences/{a['id']}", timeout=30)
        assert d.status_code == 200
        assert d.json()["id"] == a["id"]


def test_sitemap():
    r = requests.get(f"{BASE_URL}/api/sitemap.xml", timeout=30)
    assert r.status_code == 200
    assert "<urlset" in r.text


def test_img_hero():
    items = requests.get(f"{BASE_URL}/api/experiences", timeout=30).json()["items"]
    src = next(a["image_url"] for a in items if a.get("image_url"))
    r = requests.get(f"{BASE_URL}/api/img", params={"src": src, "w": 800}, timeout=60)
    assert r.status_code == 200
    assert r.headers["content-type"] == "image/webp"
