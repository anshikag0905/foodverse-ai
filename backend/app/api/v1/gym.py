import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.gym import (
    GymProfileCreateUpdate, GymProfileResponse,
    GymLogCreate, GymLogResponse, DailyAdherenceResponse,
    ProgressEntryCreate, ProgressEntryResponse,
    ProteinFoodItem
)
from app.services.gym_service import GymService

router = APIRouter(prefix="/gym", tags=["Gym Mode - Athletic Nutrition & Bodybuilding"])

@router.get("/profile", response_model=GymProfileResponse)
def get_gym_profile(
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = GymService(db)
    return service.get_or_create_profile(user_id=user_id)

@router.put("/profile", response_model=GymProfileResponse)
def update_gym_profile(
    payload: GymProfileCreateUpdate,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = GymService(db)
    return service.update_profile(payload, user_id=user_id)

@router.post("/log", response_model=GymLogResponse)
def add_gym_log(
    payload: GymLogCreate,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = GymService(db)
    return service.add_log(payload, user_id=user_id)

@router.delete("/log/{log_id}")
def delete_gym_log(
    log_id: int,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = GymService(db)
    success = service.delete_log(log_id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Log entry not found")
    return {"status": "success", "message": "Log entry deleted"}

@router.get("/adherence", response_model=DailyAdherenceResponse)
def get_daily_adherence(
    date: Optional[str] = Query(None, description="Date in YYYY-MM-DD format"),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    target_date = date or datetime.datetime.utcnow().strftime("%Y-%m-%d")
    service = GymService(db)
    return service.get_daily_adherence(target_date, user_id=user_id)

@router.post("/progress", response_model=ProgressEntryResponse)
def add_progress_entry(
    payload: ProgressEntryCreate,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = GymService(db)
    return service.add_progress_entry(payload, user_id=user_id)

@router.get("/progress", response_model=List[ProgressEntryResponse])
def get_progress_history(
    limit: int = Query(30, ge=1, le=100),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = GymService(db)
    return service.get_progress_history(user_id=user_id, limit=limit)

@router.get("/protein-foods", response_model=List[ProteinFoodItem])
def get_high_protein_foods(
    diet_type: Optional[str] = Query(None, description="veg, vegan, or all"),
    sort_by: str = Query("protein_per_100g", description="'protein_per_100g' or 'efficiency'"),
    limit: int = Query(40, ge=5, le=100),
    db: Session = Depends(get_db)
):
    service = GymService(db)
    return service.get_high_protein_foods(diet_type=diet_type, sort_by=sort_by, limit=limit)

@router.post("/seed-demo")
def seed_demo_gym(
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = GymService(db)
    service.seed_demo_gym_data(user_id=user_id)
    return {"status": "success", "message": "Seeded demo gym progress and logs."}
