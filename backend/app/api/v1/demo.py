from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.core.demo_seed import seed_demo_data_if_needed
from app.models.pantry import PantryItem
from app.models.gym import GymLog
from app.models.fact import Fact

router = APIRouter(prefix="/demo", tags=["Demo Mode & Seeding"])

@router.get("/status")
def get_demo_status(db: Session = Depends(get_db)):
    """Returns current environment mode, demo status, and pre-seeded record counts."""
    pantry_count = db.query(PantryItem).count()
    facts_count = db.query(Fact).count()
    gym_logs_count = db.query(GymLog).count()

    return {
        "demo_mode": settings.DEMO_MODE,
        "ai_provider": settings.AI_PROVIDER,
        "pre_seeded_records": {
            "pantry_items": pantry_count,
            "facts": facts_count,
            "gym_logs": gym_logs_count
        },
        "sample_assets": [
            {"label": "Fresh Apple", "filename": "apple_fresh.jpg", "category": "Fresh Fruit"},
            {"label": "Ripe Banana", "filename": "banana_ripe.jpg", "category": "Fruit / Moderately Fresh"},
            {"label": "Spoiled Bread", "filename": "bread_moldy.jpg", "category": "Spoilage / Mold"},
            {"label": "Paneer Tikka", "filename": "paneer_tikka.jpg", "category": "Indian Cuisine / Dairy"},
            {"label": "Kitchen Video", "filename": "kitchen_prep.mp4", "category": "Hygiene Video"}
        ]
    }

@router.post("/reset")
def reset_demo_state(db: Session = Depends(get_db)):
    """Re-seeds demo records to guarantee consistent demonstrations."""
    seed_demo_data_if_needed(db)
    return {"status": "success", "message": "Demo database refreshed."}
