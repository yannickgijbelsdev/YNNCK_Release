# Unit: /api/img returns 503+Retry-After on wait timeout while shielded task keeps running & caches
import asyncio
import sys
import tempfile
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


def test_timeout_503_and_background_completion(monkeypatch):
    import server
    import httpx
    tmp = Path(tempfile.mkdtemp()) / "c"
    monkeypatch.setattr(server, "IMG_CACHE", tmp)
    calls = {"n": 0}

    async def slow_build(src):
        calls["n"] += 1
        await asyncio.sleep(1.5)
        tmp.mkdir(parents=True, exist_ok=True)
        for w in server.IMG_WIDTHS:
            server.img_path(src, w).write_bytes(b"RIFF0000WEBP")

    monkeypatch.setattr(server, "build_images", slow_build)
    real_wait_for = asyncio.wait_for

    async def short_wait_for(aw, timeout):
        return await real_wait_for(aw, timeout=0.3)

    monkeypatch.setattr(server.asyncio, "wait_for", short_wait_for)
    src = server.IMAGE_ALLOWED_PREFIX + "unit/test.jpg"

    async def run():
        transport = httpx.ASGITransport(app=server.app)
        async with httpx.AsyncClient(transport=transport, base_url="http://t") as c:
            rs = await asyncio.gather(*[c.get("/api/img", params={"src": src, "w": w}) for w in (480, 800, 1600)])
            assert all(r.status_code == 503 for r in rs), [r.status_code for r in rs]
            assert rs[0].headers.get("retry-after") == "10"
            await asyncio.sleep(2)
            assert calls["n"] == 1
            r = await c.get("/api/img", params={"src": src, "w": 800})
            assert r.status_code == 200
            assert not server.IMG_TASKS

    asyncio.run(run())
