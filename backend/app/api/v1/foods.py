from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.services.food_service import FoodService

router = APIRouter(prefix="/foods", tags=["Food Database & Barcode Lookup"])
food_service = FoodService()

class CustomFoodCreate(BaseModel):
    name: str
    name_hi: Optional[str] = None
    barcode: Optional[str] = None
    aliases: Optional[str] = ""
    category: Optional[str] = "Custom Dish"
    cuisine: Optional[str] = "Custom"
    serving_size: Optional[str] = "1 serving (100g)"
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: Optional[float] = 0.0
    sugar: Optional[float] = 0.0
    sodium_mg: Optional[float] = 0.0
    allergens: Optional[List[str]] = []
    diet_tags: Optional[List[str]] = ["Vegetarian"]

@router.get("/search")
def search_foods(
    q: str = Query("", description="Search term, food name, or alias"),
    category: Optional[str] = Query(None, description="Filter by category"),
    cuisine: Optional[str] = Query(None, description="Filter by cuisine/region"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """FTS5 Full-Text fuzzy search across 20,000+ foods with nutritional breakdowns."""
    return food_service.search_foods(
        query=q,
        category=category,
        cuisine=cuisine,
        limit=limit,
        offset=offset
    )

@router.get("/categories")
def get_food_categories():
    """Returns unique list of food categories in the database."""
    return food_service.get_categories()

@router.get("/cuisines")
def get_food_cuisines():
    """Returns unique list of regional cuisines."""
    return food_service.get_cuisines()

@router.get("/barcode/{code}")
def get_food_by_barcode(code: str):
    """Instant product lookup by UPC / EAN barcode with allergen and macro fields."""
    item = food_service.get_food_by_barcode(code)
    if not item:
        raise HTTPException(
            status_code=404,
            detail=f"Product with barcode '{code}' was not found in the database. You can register it as a custom food."
        )
    return item

@router.get("/{food_id}")
def get_food_by_id(food_id: int):
    """Retrieve nutritional detail card for a specific food item ID."""
    item = food_service.get_food_by_id(food_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Food item #{food_id} not found.")
    return item

@router.post("/custom", status_code=status.HTTP_201_CREATED)
def add_custom_food(food_data: CustomFoodCreate):
    """Registers user-submitted custom food into the local database and updates FTS5 index."""
    created = food_service.add_custom_food(food_data.model_dump())
    return created
