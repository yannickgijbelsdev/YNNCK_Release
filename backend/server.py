from fastapi import FastAPI, APIRouter, HTTPException, Response
from fastapi.responses import FileResponse
from PIL import Image, ImageOps, UnidentifiedImageError
import asyncio
import hashlib
import io
import json
import re
import tempfile
from xml.sax.saxutils import escape as xml_escape
from urllib.parse import quote
import httpx
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
import uuid


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


@api_router.get("/health")
async def health():
    return {"status": "ok"}


# Include the router in the main app
NEWS_API_BASE = os.environ['NEWS_API_BASE']
NEWS_SITE_PATH = os.environ['NEWS_SITE_PATH']
SITE_URL = os.environ['SITE_URL']
IMAGE_ALLOWED_PREFIX = os.environ['IMAGE_ALLOWED_PREFIX']
IMG_WIDTHS = {480, 800, 1200, 1600}
IMG_CACHE = Path(tempfile.gettempdir()) / "ynnck-img"
IMG_CACHE.mkdir(exist_ok=True)


NEWS_CACHE = Path(tempfile.gettempdir()) / "ynnck-news"
NEWS_CACHE.mkdir(exist_ok=True)


def news_cache_file(path: str) -> Path:
    return NEWS_CACHE / f"{hashlib.sha256(path.encode()).hexdigest()}.json"


async def fetch_news(path: str):
    r = None
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as c:
            for attempt in range(3):
                try:
                    r = await c.get(f"{NEWS_API_BASE}{path}")
                    if r.status_code not in (429, 500, 502, 503, 504):
                        break
                except httpx.HTTPError:
                    r = None
                if attempt < 2:
                    await asyncio.sleep(0.4 * (2 ** attempt))
        if r is not None and r.status_code == 404:
            raise HTTPException(404, "Not found")
        if r is not None and r.status_code == 200:
            data = r.json()
            news_cache_file(path).write_text(json.dumps(data))
            return data
    except ValueError:
        pass
    cached = news_cache_file(path)
    if cached.exists():
        logger.warning("CMS unavailable, serving cached copy for %s", path)
        return json.loads(cached.read_text())
    raise HTTPException(502, "News service unavailable")


@api_router.get("/experiences")
async def list_experiences():
    return await fetch_news(NEWS_SITE_PATH)


@api_router.get("/experiences/{article_id}")
async def get_experience(article_id: str):
    return await fetch_news(f"/articles/{quote(article_id, safe='')}")


IMG_TASKS: dict = {}


def img_path(src: str, w: int) -> Path:
    return IMG_CACHE / f"{hashlib.sha256(f'{src}|{w}'.encode()).hexdigest()}.webp"


async def build_images(src: str):
    data = None
    async with httpx.AsyncClient(timeout=30, follow_redirects=True) as c:
        for attempt in range(5):
            try:
                r = await c.get(src)
                if r.status_code == 200:
                    data = r.content
                    break
                if r.status_code not in (429, 500, 502, 503, 504):
                    raise HTTPException(404, "Image not found")
            except httpx.HTTPError:
                pass
            if attempt < 4:
                await asyncio.sleep(0.4 * (2 ** attempt))
    if data is None:
        raise HTTPException(502, "Image unavailable")
    try:
        await asyncio.to_thread(render_all, data, src)
    except (UnidentifiedImageError, OSError):
        raise HTTPException(502, "Image unavailable")


def ensure_images(src: str) -> asyncio.Task:
    task = IMG_TASKS.get(src)
    if task is None:
        task = asyncio.create_task(build_images(src))
        IMG_TASKS[src] = task
        task.add_done_callback(lambda t: (IMG_TASKS.pop(src, None), t.cancelled() or t.exception()))
    return task


@api_router.get("/img")
async def image(src: str, w: int = 1200):
    if not src.startswith(IMAGE_ALLOWED_PREFIX) or ".." in src or "\\" in src or w not in IMG_WIDTHS:
        raise HTTPException(400, "Invalid image")
    path = img_path(src, w)
    if not path.exists():
        try:
            await asyncio.wait_for(asyncio.shield(ensure_images(src)), timeout=45)
        except asyncio.TimeoutError:
            raise HTTPException(503, "Image is being prepared", headers={"Retry-After": "10"})
    return FileResponse(path, media_type="image/webp", headers={"Cache-Control": "public, max-age=31536000, immutable"})


def render_all(data: bytes, src: str):
    IMG_CACHE.mkdir(parents=True, exist_ok=True)
    base = ImageOps.exif_transpose(Image.open(io.BytesIO(data)))
    base = base.convert("RGBA" if base.mode in ("RGBA", "LA", "P") else "RGB")
    for w in sorted(IMG_WIDTHS, reverse=True):
        im = base.resize((w, round(base.height * w / base.width)), Image.LANCZOS) if base.width > w else base
        path = img_path(src, w)
        tmp = path.with_name(f"{path.stem}.{uuid.uuid4().hex}.tmp")
        im.save(tmp, "WEBP", quality=80, method=4)
        tmp.replace(path)


async def warm_images():
    try:
        data = await fetch_news(NEWS_SITE_PATH)
        srcs = []
        for a in data.get("items", []):
            srcs.append(a.get("image_url") or "")
            try:
                art = await fetch_news(f"/articles/{quote(a['id'], safe='')}")
                srcs += re.findall(r'<img[^>]+src="([^"]+)"', art.get("body") or "")
            except HTTPException:
                pass
        for src in dict.fromkeys(srcs):
            if src.startswith(IMAGE_ALLOWED_PREFIX) and not img_path(src, 800).exists():
                try:
                    await ensure_images(src)
                except HTTPException:
                    logger.warning("Could not warm image %s", src)
    except HTTPException:
        logger.warning("Could not warm images")


@api_router.get("/sitemap.xml")
async def sitemap():
    data = await fetch_news(NEWS_SITE_PATH)
    urls = [(f"{SITE_URL}/", None)] + [
        (f"{SITE_URL}/work/{xml_escape(a['id'])}", (a.get("published_at") or "")[:10] or None)
        for a in data.get("items", [])
    ]
    body = "".join(
        f"<url><loc>{u}</loc>{f'<lastmod>{d}</lastmod>' if d else ''}</url>" for u, d in urls
    )
    xml = f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{body}</urlset>'
    return Response(xml, media_type="application/xml")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def start_warm_images():
    app.state.warm_task = asyncio.create_task(warm_images())
