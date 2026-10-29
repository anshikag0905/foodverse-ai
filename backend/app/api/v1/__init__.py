from fastapi import APIRouter
from app.api.v1.privacy import router as privacy_router
from app.api.v1.demo import router as demo_router
from app.api.v1.foods import router as foods_router
from app.api.v1.food_analysis import router as food_analysis_router
from app.api.v1.freshness import router as freshness_router
from app.api.v1.hygiene import router as hygiene_router
from app.api.v1.meal_plans import router as meal_plans_router, meal_planner_router
from app.api.v1.pantry import router as pantry_router
from app.api.v1.grocery import router as grocery_router
from app.api.v1.facts import router as facts_router
from app.api.v1.gym import router as gym_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.history import router as history_router
from app.api.v1.ai import router as ai_router

api_v1_router = APIRouter()
api_v1_router.include_router(privacy_router)
api_v1_router.include_router(demo_router)
api_v1_router.include_router(foods_router)
api_v1_router.include_router(food_analysis_router)
api_v1_router.include_router(freshness_router)
api_v1_router.include_router(hygiene_router)
api_v1_router.include_router(meal_plans_router)
api_v1_router.include_router(meal_planner_router)
api_v1_router.include_router(pantry_router)
api_v1_router.include_router(grocery_router)
api_v1_router.include_router(facts_router)
api_v1_router.include_router(gym_router)
api_v1_router.include_router(dashboard_router)
api_v1_router.include_router(history_router)
api_v1_router.include_router(ai_router)

