import os
import time
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.demo_seed import seed_demo_data_if_needed
from app.api.v1 import api_v1_router

# Lifespan Context Manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize tables
    Base.metadata.create_all(bind=engine)
    if settings.DEMO_MODE:
        with SessionLocal() as db:
            seed_demo_data_if_needed(db)
    yield
    # Shutdown logic (if any)

app = FastAPI(
    title=settings.APP_NAME,
    description="Multimodal Food Intelligence Agent API – Vision, Audio, Text, Video & Barcode Analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file mounts
upload_path = Path(settings.UPLOAD_DIR).resolve()
upload_path.mkdir(parents=True, exist_ok=True)
demo_assets_path = Path(__file__).resolve().parent.parent.parent / "demo-assets"
demo_assets_path.mkdir(parents=True, exist_ok=True)

app.mount("/static/uploads", StaticFiles(directory=str(upload_path)), name="uploads")
if demo_assets_path.exists():
    app.mount("/static/demo-assets", StaticFiles(directory=str(demo_assets_path)), name="demo-assets")

# Include v1 Router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)

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
