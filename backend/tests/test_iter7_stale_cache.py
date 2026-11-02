# Iteration 7: backend CMS stale-cache fallback (fetch_news) tests.
# Run with STALE_MODE=1 while NEWS_API_BASE points to an unreachable host.
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
IDS = [
    "4e152384-4841-41dc-ba47-4040ba12627f",
    "dcb6fd81-49b2-4ff3-9cd1-1aecf64dd756",
    "d965477d-b5f7-4d8e-bc22-d493a7173d4b",
    "3f4564a9-01b1-41db-80d0-30a99b8cd676",
]
STALE = os.environ.get("STALE_MODE") == "1"


# Experiences list (live or cached)
def test_list_200_with_items():
    r = requests.get(f"{BASE_URL}/api/experiences", timeout=60)
    assert r.status_code == 200
    items = r.json()["items"]
    assert {a["id"] for a in items} >= set(IDS)


# Each experience detail (live or cached)
@pytest.mark.parametrize("aid", IDS)
def test_detail_200(aid):
    r = requests.get(f"{BASE_URL}/api/experiences/{aid}", timeout=60)
    assert r.status_code == 200
    d = r.json()
    assert d["id"] == aid and d.get("title")


# Unknown id: 404 when CMS live, 502 when CMS down and nothing cached
def test_unknown_id():
    r = requests.get(f"{BASE_URL}/api/experiences/TEST_nonexistent-id-xyz", timeout=60)
    assert r.status_code == (502 if STALE else 404)


# Sitemap also served from cache
def test_sitemap():
    r = requests.get(f"{BASE_URL}/api/sitemap.xml", timeout=60)
    assert r.status_code == 200
    assert all(i in r.text for i in IDS)


# Images still served from disk cache
def test_img_cached():
    items = requests.get(f"{BASE_URL}/api/experiences", timeout=60).json()["items"]
    src = items[0]["image_url"]
    r = requests.get(f"{BASE_URL}/api/img", params={"src": src, "w": 800}, timeout=60)
    assert r.status_code == 200 and r.headers["content-type"] == "image/webp"
