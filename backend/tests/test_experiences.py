# Experiences proxy API tests (GET /api/experiences, GET /api/experiences/{id})
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


@pytest.fixture(scope="module")
def listing():
    r = requests.get(f"{BASE_URL}/api/experiences", timeout=30)
    assert r.status_code == 200
    return r.json()


# List endpoint
def test_list_has_items(listing):
    assert isinstance(listing.get("items"), list)
    assert len(listing["items"]) == 4


def test_list_ids_and_fields(listing):
    ids = [i["id"] for i in listing["items"]]
    assert set(ids) == set(IDS)
    for it in listing["items"]:
        assert isinstance(it.get("title"), str) and it["title"]
        assert it.get("image_url", "").startswith("http")


# Detail endpoint
@pytest.mark.parametrize("aid", IDS)
def test_detail(aid):
    r = requests.get(f"{BASE_URL}/api/experiences/{aid}", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert d["id"] == aid
    assert d["title"]
    assert isinstance(d["body"], str) and "<" in d["body"]
    assert d["image_url"].startswith("http")


def test_detail_unknown_404():
    r = requests.get(f"{BASE_URL}/api/experiences/foo", timeout=30)
    assert r.status_code == 404


def test_detail_weird_id_not_500():
    r = requests.get(f"{BASE_URL}/api/experiences/..%2F..%2Fx", timeout=30)
    assert r.status_code in (400, 404)
