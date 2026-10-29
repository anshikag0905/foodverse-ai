from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional, Dict
from pydantic import BaseModel
from app.core.database import get_db
from app.services.meal_plan_service import MealPlanService
from app.api.v1.privacy import get_current_user_id

router = APIRouter(prefix="/meal-plans", tags=["Personalized Meal Planning"])
meal_planner_router = APIRouter(prefix="/meal-planner", tags=["Personalized Meal Planning Alias"])
meal_plan_service = MealPlanService()

class MealPlanGenerateRequest(BaseModel):
    plan_type: Optional[str] = "daily"
    target_calories: Optional[float] = None
    target_macros: Optional[Dict[str, float]] = None
    diet_type: Optional[str] = None
    lang: Optional[str] = "en"

class SwapMealRequest(BaseModel):
    plan_id: int
    day_index: int
    meal_index: int

@router.get("/current")
@router.get("/today")
@router.get("")
def get_current_meal_plan(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Retrieves active personalized meal plan with macro and calorie distribution."""
    plan = meal_plan_service.get_current_plan(db=db, user_id=user_id)
    return plan or {}

@meal_planner_router.get("/current")
@meal_planner_router.get("/today")
@meal_planner_router.get("")
def get_current_meal_planner_alias(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    plan = meal_plan_service.get_current_plan(db=db, user_id=user_id)
    return plan or {}

@meal_planner_router.post("/generate")
async def generate_meal_planner_alias(
    req: MealPlanGenerateRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    return await meal_plan_service.generate_plan(
        db=db,
        user_id=user_id,
        plan_type=req.plan_type,
        target_calories=req.target_calories,
        target_macros=req.target_macros,
        lang=req.lang
    )

@router.post("/generate")
async def generate_meal_plan(
    req: MealPlanGenerateRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Generates an adaptive macro-aligned daily/weekly meal plan enforcing allergy and diet rules."""
    return await meal_plan_service.generate_plan(
        db=db,
        user_id=user_id,
        plan_type=req.plan_type,
        target_calories=req.target_calories,
        target_macros=req.target_macros,
        lang=req.lang
    )

@router.post("/swap")
def swap_single_meal(
    req: SwapMealRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Dynamically replaces an individual meal entry while maintaining dietary safety."""
    return meal_plan_service.swap_single_meal(
        db=db,
        user_id=user_id,
        plan_id=req.plan_id,
        day_index=req.day_index,
        meal_index=req.meal_index
    )
