from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.services.recognition_service import RecognitionService
from app.api.v1.privacy import get_current_user_id

router = APIRouter(prefix="/food", tags=["Food Recognition & Nutrition Analysis"])
rec_service = RecognitionService()

class FoodCorrectionRequest(BaseModel):
    original_name: str
    corrected_name: str
    input_path: Optional[str] = None

@router.post("/analyze")
async def analyze_food(
    image: Optional[UploadFile] = File(None),
    query: Optional[str] = Form(None),
    lang: str = Form("en"),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Analyzes a food photo or query: estimates calories, macros, health score, and allergen conflicts."""
    image_bytes = None
    filename = None
    if image:
        image_bytes = await image.read()
        filename = image.filename

    result = await rec_service.analyze_food(
        db=db,
        user_id=user_id,
        image_bytes=image_bytes,
        filename=filename,
        query=query,
        lang=lang
    )
    return result

@router.post("/correct")
def submit_food_correction(
    correction: FoodCorrectionRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Allows user to correct low-confidence AI predictions; saved for feedback loops."""
    return rec_service.save_correction(
        db=db,
        user_id=user_id,
        original_name=correction.original_name,
        corrected_name=correction.corrected_name,
        input_path=correction.input_path
    )
