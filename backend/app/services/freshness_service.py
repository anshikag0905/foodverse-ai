import json
import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.ai.factory import get_ai_provider
from app.storage.local_storage import get_storage
from app.models.analysis import Analysis
from app.models.pantry import PantryItem
from app.core.config import settings

class FreshnessService:
    def __init__(self):
        self.storage = get_storage()

    @property
    def ai(self):
        return get_ai_provider()

    async def analyze_freshness(
        self,
        db: Session,
        user_id: int,
        image_bytes: Optional[bytes] = None,
        filename: Optional[str] = None,
        food_hint: Optional[str] = None,
        pantry_item_id: Optional[int] = None,
        lang: str = "en"
    ) -> Dict[str, Any]:
        relative_path = None
        if image_bytes and filename:
            relative_path = await self.storage.save_file(image_bytes, filename, subfolder="freshness_scans")

        ai_res = await self.ai.analyze_freshness(
            image_bytes=image_bytes,
            image_path=relative_path,
            food_hint=food_hint,
            lang=lang
        )

        # Suggested use-by adjustment
        now = datetime.datetime.utcnow()
        if ai_res.status == "fresh":
            suggested_expiry = now + datetime.timedelta(days=7)
        elif ai_res.status == "moderately_fresh":
            suggested_expiry = now + datetime.timedelta(days=2)
        else:
            suggested_expiry = now # Expired / Discard

        result_payload = {
            "item_name": ai_res.item_name,
            "status": ai_res.status, # "fresh", "moderately_fresh", "spoiled"
            "confidence": ai_res.confidence,
            "freshness_score": ai_res.freshness_score,
            "visual_indicators": ai_res.visual_indicators,
            "storage_advice": ai_res.storage_advice,
            "consumption_verdict": ai_res.consumption_verdict,
            "suggested_expiry_date": suggested_expiry.strftime("%Y-%m-%d"),
            "image_url": f"/static/uploads/{relative_path}" if relative_path else None,
            "data_source": "ai_estimate",
            "model_provider": settings.AI_PROVIDER,
            "disclaimer": ai_res.disclaimer
        }

        # If linked to a pantry item, update its status in real-time
        if pantry_item_id:
            p_item = db.query(PantryItem).filter(PantryItem.id == pantry_item_id, PantryItem.user_id == user_id).first()
            if p_item:
                p_item.status = "fresh" if ai_res.status == "fresh" else ("use_soon" if ai_res.status == "moderately_fresh" else "expired")
                p_item.expiry_date = suggested_expiry
                db.commit()
                result_payload["updated_pantry_item_id"] = p_item.id

        # Save analysis
        analysis_record = Analysis(
            user_id=user_id,
            analysis_type="freshness",
            input_path=relative_path,
            item_name=ai_res.item_name,
            confidence=ai_res.confidence,
            score=float(ai_res.freshness_score),
            data_source="ai_estimate",
            model_provider=settings.AI_PROVIDER,
            result_json=json.dumps(result_payload)
        )
        db.add(analysis_record)
        db.commit()
        db.refresh(analysis_record)

        result_payload["id"] = analysis_record.id
        result_payload["timestamp"] = str(analysis_record.created_at)
        return result_payload
