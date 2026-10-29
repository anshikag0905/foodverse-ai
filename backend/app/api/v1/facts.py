from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.facts import FactResponse
from app.services.fact_service import FactService

router = APIRouter(prefix="/facts", tags=["Did You Know - Food Science Facts"])

@router.get("", response_model=List[FactResponse])
def get_facts(
    category: Optional[str] = Query(None, description="Category filter"),
    search: Optional[str] = Query(None, description="Text search"),
    favorites_only: bool = Query(False),
    user_id: Optional[int] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    service = FactService(db)
    return service.list_facts(
        category=category,
        search=search,
        user_id=user_id,
        favorites_only=favorites_only,
        limit=limit,
        offset=offset
    )

@router.get("/random", response_model=FactResponse)
def get_random_fact(
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = FactService(db)
    fact = service.get_random_fact(user_id=user_id)
    if not fact:
        raise HTTPException(status_code=404, detail="No facts found in database")
    return fact

@router.get("/categories", response_model=List[str])
def get_fact_categories(db: Session = Depends(get_db)):
    service = FactService(db)
    return service.get_categories()

@router.post("/{fact_id}/favorite")
def toggle_favorite_fact(
    fact_id: int,
    user_id: int = Query(..., description="User ID"),
    db: Session = Depends(get_db)
):
    service = FactService(db)
    res = service.toggle_favorite(fact_id=fact_id, user_id=user_id)
    if not res.get("success"):
        raise HTTPException(status_code=404, detail=res.get("message"))
    return res
