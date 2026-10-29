from fastapi import APIRouter
from app.api.v1.privacy import router as privacy_router
from app.api.v1.demo import router as demo_router
from app.api.v1.foods import router as foods_router

api_v1_router = APIRouter()
api_v1_router.include_router(privacy_router)
api_v1_router.include_router(demo_router)
api_v1_router.include_router(foods_router)
