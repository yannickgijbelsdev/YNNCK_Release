# Self-hosting ynnck.dev

The site has two parts:
- **frontend**: static files from `yarn build`, served by nginx
- **backend**: a small FastAPI service, which must run for `/api/*`. It handles the experiences from Clara, images, and the sitemap.

If nginx returns `502` on `https://ynnck.dev/api/experiences`, the backend is not running or cannot be reached.

## 1. Backend

```bash
cd backend
python3 -m venv .venv && . .venv/bin/activate
pip install fastapi "uvicorn[standard]" httpx pillow python-dotenv
```

`backend/.env`:

```
NEWS_API_BASE="https://clr.koodh.com/api/news"
NEWS_SITE_PATH="/ynnck/homepagina"
SITE_URL="https://ynnck.dev"
IMAGE_ALLOWED_PREFIX="https://nbg1.your-objectstorage.com/koodh-clara/"
CORS_ORIGINS="https://ynnck.dev"
```

Test it:

```bash
uvicorn server:app --host 127.0.0.1 --port 8001
curl http://127.0.0.1:8001/api/health        # {"status":"ok"}
curl http://127.0.0.1:8001/api/experiences   # JSON with items
```

systemd service at `/etc/systemd/system/ynnck-api.service`:

```
[Unit]
Description=YNNCK API
After=network.target

[Service]
WorkingDirectory=/var/www/ynnck/backend
ExecStart=/var/www/ynnck/backend/.venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now ynnck-api
journalctl -u ynnck-api -f
```

## 2. Frontend

`frontend/.env` for the production build:

```
REACT_APP_BACKEND_URL=https://ynnck.dev
REACT_APP_SITE_URL=https://ynnck.dev
REACT_APP_NEWS_API_BASE=https://clr.koodh.com/api/news
REACT_APP_NEWS_SITE_PATH=/ynnck/homepagina
```

If the backend cannot be reached, the frontend reads Clara directly. For that, Clara must allow the origin `https://ynnck.dev` (CORS: `Access-Control-Allow-Origin`). The backend also keeps the last good Clara response and serves it when Clara is briefly down.

```bash
cd frontend && yarn install && yarn build   # upload build/ to the web root
```

## 3. nginx

```nginx
server {
    server_name ynnck.dev;
    root /var/www/ynnck/frontend/build;

    location /api/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    location / {
        try_files $uri /index.html;
    }
}
```

`try_files ... /index.html` is required, so that `/work/{id}` still works when the page is refreshed.
