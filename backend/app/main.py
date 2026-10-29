import os
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    description="Multimodal Food Intelligence Agent API – Vision, Audio, Text, Video & Barcode Analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload and storage directory exists
upload_path = Path(settings.UPLOAD_DIR)
upload_path.mkdir(parents=True, exist_ok=True)
demo_assets_path = Path(__file__).resolve().parent.parent.parent / "demo-assets"
demo_assets_path.mkdir(parents=True, exist_ok=True)

# Mount static files for uploaded previews & demo assets
app.mount("/static/uploads", StaticFiles(directory=str(upload_path)), name="uploads")
if demo_assets_path.exists():
    app.mount("/static/demo-assets", StaticFiles(directory=str(demo_assets_path)), name="demo-assets")

# Request performance timing & centralized logging middleware
# @app.middleware("http")
# async def add_process_time_header(request: Request, call_next):
#     start_time = time.time()
#     response = await call_next(request)
#     process_time = time.time() - start_time
#     response.headers["X-Process-Time"] = f"{process_time:.4f}s"
#     return response

# Root & Healthcheck endpoints
@app.get("/")
def read_root():
    return {
        "app": settings.APP_NAME,
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs",
        "demo_mode": settings.DEMO_MODE,
        "ai_provider": settings.AI_PROVIDER,
    }

@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "environment": settings.ENVIRONMENT,
        "demo_mode": settings.DEMO_MODE,
        "ai_provider": settings.AI_PROVIDER,
        "storage": settings.STORAGE_TYPE,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.BACKEND_HOST, port=settings.BACKEND_PORT, reload=settings.DEBUG)
