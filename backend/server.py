from fastapi import FastAPI, APIRouter, HTTPException, Response
from fastapi.responses import FileResponse
from PIL import Image, ImageOps
import asyncio
import hashlib
import io
import tempfile
from xml.sax.saxutils import escape as xml_escape
from urllib.parse import quote
import httpx
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
NEWS_API_BASE = os.environ['NEWS_API_BASE']
NEWS_SITE_PATH = os.environ['NEWS_SITE_PATH']
SITE_URL = os.environ['SITE_URL']
IMAGE_ALLOWED_PREFIX = os.environ['IMAGE_ALLOWED_PREFIX']
IMG_WIDTHS = {480, 800, 1200, 1600}
IMG_CACHE = Path(tempfile.gettempdir()) / "ynnck-img"
IMG_CACHE.mkdir(exist_ok=True)


async def fetch_news(path: str):
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as c:
            r = await c.get(f"{NEWS_API_BASE}{path}")
        if r.status_code == 404:
            raise HTTPException(404, "Not found")
        if r.status_code != 200:
            raise HTTPException(502, "News service unavailable")
        return r.json()
    except (httpx.HTTPError, ValueError):
        raise HTTPException(502, "News service unavailable")


@api_router.get("/experiences")
async def list_experiences():
    return await fetch_news(NEWS_SITE_PATH)


@api_router.get("/experiences/{article_id}")
async def get_experience(article_id: str):
    return await fetch_news(f"/articles/{quote(article_id, safe='')}")


@api_router.get("/img")
async def image(src: str, w: int = 1200):
    if not src.startswith(IMAGE_ALLOWED_PREFIX) or w not in IMG_WIDTHS:
        raise HTTPException(400, "Invalid image")
    key = hashlib.sha256(f"{src}|{w}".encode()).hexdigest()
    path = IMG_CACHE / f"{key}.webp"
    if not path.exists():
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
                await asyncio.sleep(0.4 * (2 ** attempt))
        if data is None:
            raise HTTPException(502, "Image unavailable")
        im = Image.open(io.BytesIO(data))
        im = ImageOps.exif_transpose(im)
        im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
        if im.width > w:
            im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        tmp = path.with_suffix(".tmp")
        im.save(tmp, "WEBP", quality=80, method=4)
        tmp.replace(path)
    return FileResponse(path, media_type="image/webp", headers={"Cache-Control": "public, max-age=31536000, immutable"})


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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()