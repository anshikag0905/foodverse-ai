from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.services.freshness_service import FreshnessService
from app.api.v1.privacy import get_current_user_id

router = APIRouter(prefix="/freshness", tags=["Food Freshness & Spoilage Detection"])
freshness_service = FreshnessService()

@router.post("/analyze")
async def analyze_freshness(
    image: Optional[UploadFile] = File(None),
    food_hint: Optional[str] = Form(None),
    pantry_item_id: Optional[int] = Form(None),
    lang: str = Form("en"),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Evaluates surface discoloration, mold, and texture to classify Fresh, Moderately Fresh, or Spoiled."""
    image_bytes = None
    filename = None
    if image:
        image_bytes = await image.read()
        filename = image.filename

    result = await freshness_service.analyze_freshness(
        db=db,
        user_id=user_id,
        image_bytes=image_bytes,
        filename=filename,
        food_hint=food_hint,
        pantry_item_id=pantry_item_id,
        lang=lang
    )
    return result
