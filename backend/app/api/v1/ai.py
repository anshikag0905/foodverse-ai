from fastapi import APIRouter, Depends, UploadFile, File, Form
from typing import Optional, Dict, Any
from app.schemas.ai import AskAIRequest, AskAIResponse
from app.ai.factory import get_ai_provider
from app.api.v1.privacy import get_current_user_id

router = APIRouter(prefix="/ai", tags=["FoodVerse Intelligent AI Assistant"])

@router.post("/ask", response_model=AskAIResponse)
async def ask_foodverse_ai(
    req: AskAIRequest,
    user_id: int = Depends(get_current_user_id)
):
    """Answers nutritional, culinary recipe, storage, and food science questions using Gemini."""
    provider = get_ai_provider()
    res = await provider.ask_ai(
        question=req.question,
        context_type=req.context_type or "general",
        context_data=req.context_data,
        lang=req.lang or "en"
    )
    return AskAIResponse(
        answer=res["answer"],
        suggestions=res.get("suggestions", []),
        model_provider=res.get("model_provider", "gemini")
    )

@router.post("/ask-multimodal", response_model=AskAIResponse)
async def ask_foodverse_ai_multimodal(
    question: str = Form(...),
    context_type: str = Form("general"),
    image: Optional[UploadFile] = File(None),
    lang: str = Form("en"),
    user_id: int = Depends(get_current_user_id)
):
    """Answers questions about a live camera snapshot or food photo using Gemini Multimodal Vision."""
    image_bytes = None
    if image:
        image_bytes = await image.read()

    provider = get_ai_provider()
    res = await provider.ask_ai(
        question=question,
        context_type=context_type,
        image_bytes=image_bytes,
        lang=lang
    )
    return AskAIResponse(
        answer=res["answer"],
        suggestions=res.get("suggestions", []),
        model_provider=res.get("model_provider", "gemini")
    )
