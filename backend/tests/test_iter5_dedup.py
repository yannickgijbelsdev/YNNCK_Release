# Iteration 5: /api/img in-flight dedup, render-all widths, lazy cache dir, validation, regression
import os
import re
import shutil
import concurrent.futures as cf
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
LOG = "/var/log/supervisor/backend.err.log"
CACHE = "/tmp/ynnck-img"
WIDTHS = [480, 800, 1200, 1600]


@pytest.fixture(scope="module")
def items():
    r = requests.get(f"{BASE_URL}/api/experiences", timeout=30)
    assert r.status_code == 200
    return r.json()["items"]


def _upstream_gets(src):
    with open(LOG, errors="ignore") as f:
        return sum(1 for line in f if "HTTP Request: GET" in line and src in line)


def _get(src, w):
    return requests.get(f"{BASE_URL}/api/img", params={"src": src, "w": w}, timeout=90)


# Dedup: cold cache (dir removed entirely), 6 parallel requests, different widths -> single upstream 200
def test_dedup_parallel_cold(items):
    src = items[0]["image_url"]  # 4e152384 jpg (fast-ish)
    shutil.rmtree(CACHE, ignore_errors=True)  # also tests lazy mkdir
    before = _upstream_gets(src)
    ws = [480, 800, 1200, 1600, 800, 1600]
    with cf.ThreadPoolExecutor(6) as ex:
        res = list(ex.map(lambda w: _get(src, w), ws))
    for w, r in zip(ws, res):
        assert r.status_code == 200, (w, r.status_code, r.text[:200])
        assert r.content[:4] == b"RIFF" and r.content[8:12] == b"WEBP"
    after = _upstream_gets(src)
    with open(LOG, errors="ignore") as f:
        lines = [l for l in f if "HTTP Request: GET" in l and src in l][before:]
    ok = [l for l in lines if '200 OK' in l]
    print("upstream lines:", lines)
    assert len(ok) == 1, lines
    assert after - before <= 5  # retries on 503 allowed, but one successful download
    # all 4 widths rendered in one go
    files = [f for f in os.listdir(CACHE) if f.endswith(".webp")]
    assert len(files) >= 4
    assert not [f for f in os.listdir(CACHE) if f.endswith(".tmp")]


def test_widths_correct(items):
    from io import BytesIO
    from PIL import Image
    src = items[0]["image_url"]
    for w in WIDTHS:
        r = _get(src, w)
        assert r.status_code == 200
        assert Image.open(BytesIO(r.content)).width <= w


@pytest.mark.parametrize("params", [
    {"src": "https://evil.com/x.jpg", "w": 800},
    {"src": "https://nbg1.your-objectstorage.com/koodh-clara/../x.jpg", "w": 800},
    {"src": "https://nbg1.your-objectstorage.com/koodh-clara/a\\b.jpg", "w": 800},
    {"src": "https://nbg1.your-objectstorage.com/koodh-clara/x.jpg", "w": 801},
    {"src": "https://nbg1.your-objectstorage.com/koodh-clara/x.jpg", "w": "abc"},
])
def test_img_invalid(params):
    r = requests.get(f"{BASE_URL}/api/img", params=params, timeout=30)
    assert r.status_code in (400, 422), (params, r.status_code)
    if params["w"] != "abc":
        assert r.status_code == 400


def test_img_missing_upstream_404():
    r = _get("https://nbg1.your-objectstorage.com/koodh-clara/content/doesnotexist_123.jpg", 800)
    assert r.status_code == 404, r.status_code


# Warm all article images (also ensures post-test cache state)
@pytest.mark.parametrize("w", [800, 1600])
def test_all_images(items, w):
    for it in items:
        r = _get(it["image_url"], w)
        assert r.status_code == 200, (it["id"], r.status_code)
        assert r.content[8:12] == b"WEBP"


def test_regression_endpoints(items):
    assert len(items) == 4
    for it in items:
        r = requests.get(f"{BASE_URL}/api/experiences/{it['id']}", timeout=30)
        assert r.status_code == 200 and r.json()["id"] == it["id"]
    r = requests.get(f"{BASE_URL}/api/sitemap.xml", timeout=30)
    assert r.status_code == 200 and "<urlset" in r.text
    assert len(re.findall("<loc>", r.text)) == 5
    assert requests.get(f"{BASE_URL}/api/experiences/nonexistent-xyz", timeout=30).status_code == 404
