from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.pantry import (
    PantryItemCreate, PantryItemUpdate, PantryItemResponse, PantryWasteSummary
)
from app.services.pantry_service import PantryService

router = APIRouter(prefix="/pantry", tags=["Pantry & Expiry Tracker"])

@router.get("", response_model=List[PantryItemResponse])
def get_pantry_items(
    storage_location: Optional[str] = Query(None, description="fridge, freezer, shelf, or all"),
    status: Optional[str] = Query(None, description="fresh, use_soon, expired, or all"),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    return service.list_items(user_id=user_id, storage_location=storage_location, status=status)

@router.post("", response_model=PantryItemResponse)
def add_pantry_item(
    payload: PantryItemCreate,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    return service.create_item(payload, user_id=user_id)

@router.get("/expiring", response_model=List[PantryItemResponse])
def get_expiring_pantry_items(
    days: int = Query(3, ge=1, le=14),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    return service.get_expiring_items(user_id=user_id, days=days)

@router.get("/suggest-recipes")
async def suggest_recipes_from_pantry(
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    return await service.suggest_recipes_from_expiring(user_id=user_id)

@router.get("/waste-summary", response_model=PantryWasteSummary)
def get_waste_summary(
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    return service.get_waste_summary(user_id=user_id)

@router.post("/seed-demo", response_model=List[PantryItemResponse])
def seed_demo_pantry(
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    return service.seed_demo_pantry(user_id=user_id)

@router.get("/{item_id}", response_model=PantryItemResponse)
def get_pantry_item(
    item_id: int,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    item = service.get_item(item_id, user_id=user_id)
    if not item:
        raise HTTPException(status_code=404, detail="Pantry item not found")
    return item

@router.put("/{item_id}", response_model=PantryItemResponse)
def update_pantry_item(
    item_id: int,
    payload: PantryItemUpdate,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    updated = service.update_item(item_id, payload, user_id=user_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Pantry item not found")
    return updated

@router.delete("/{item_id}")
def delete_pantry_item(
    item_id: int,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    success = service.delete_item(item_id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Pantry item not found")
    return {"status": "success", "message": "Pantry item deleted"}

@router.post("/{item_id}/use", response_model=PantryItemResponse)
def mark_pantry_item_used(
    item_id: int,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    item = service.mark_used(item_id, user_id=user_id)
    if not item:
        raise HTTPException(status_code=404, detail="Pantry item not found")
    return item

@router.post("/{item_id}/waste", response_model=PantryItemResponse)
def mark_pantry_item_wasted(
    item_id: int,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    item = service.mark_wasted(item_id, user_id=user_id)
    if not item:
        raise HTTPException(status_code=404, detail="Pantry item not found")
    return item
