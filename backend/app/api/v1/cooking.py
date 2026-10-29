from fastapi import APIRouter, Depends, Form
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.services.cooking_service import CookingService
from app.api.v1.privacy import get_current_user_id

router = APIRouter(prefix="/cooking", tags=["Smart Cooking Assistant"])
cooking_service = CookingService()

class CookingChatRequest(BaseModel):
    query: str
    session_id: Optional[int] = None
    use_pantry: Optional[bool] = False
    lang: Optional[str] = "en"

@router.post("/chat")
async def chat_cooking(
    req: CookingChatRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Conversational recipe guidance, timers, ingredient substitutions, and pantry prioritization."""
    result = await cooking_service.handle_chat(
        db=db,
        user_id=user_id,
        query=req.query,
        session_id=req.session_id,
        use_pantry=req.use_pantry,
        lang=req.lang
    )
    return result

@router.get("/sessions")
def get_user_cooking_sessions(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Returns past cooking consultation sessions."""
    return cooking_service.get_user_sessions(db=db, user_id=user_id)
