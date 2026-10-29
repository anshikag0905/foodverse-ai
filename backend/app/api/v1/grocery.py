from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.schemas.pantry import (
    GroceryItemCreate, GroceryItemUpdate, GroceryItemResponse
)
from app.services.pantry_service import PantryService

router = APIRouter(prefix="/grocery", tags=["Grocery List"])

class MissingIngredientsPayload(BaseModel):
    ingredients: List[str]

@router.get("", response_model=List[GroceryItemResponse])
def get_grocery_items(
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    return service.list_groceries(user_id=user_id)

@router.post("", response_model=GroceryItemResponse)
def add_grocery_item(
    payload: GroceryItemCreate,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    return service.create_grocery(payload, user_id=user_id)

@router.put("/{grocery_id}", response_model=GroceryItemResponse)
def update_grocery_item(
    grocery_id: int,
    payload: GroceryItemUpdate,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    item = service.update_grocery(grocery_id, payload, user_id=user_id)
    if not item:
        raise HTTPException(status_code=404, detail="Grocery item not found")
    return item

@router.delete("/{grocery_id}")
def delete_grocery_item(
    grocery_id: int,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    success = service.delete_grocery(grocery_id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Grocery item not found")
    return {"status": "success", "message": "Grocery item deleted"}

@router.post("/clear-checked")
def clear_checked_groceries(
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    count = service.clear_checked_groceries(user_id=user_id)
    return {"status": "success", "cleared_count": count}

@router.post("/add-missing", response_model=List[GroceryItemResponse])
def add_missing_ingredients(
    payload: MissingIngredientsPayload,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = PantryService(db)
    return service.add_missing_ingredients(payload.ingredients, user_id=user_id)
