import json
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.ai.factory import get_ai_provider
from app.storage.local_storage import get_storage
from app.services.food_service import FoodService
from app.models.analysis import Analysis, FoodCorrection
from app.models.user import User
from app.core.config import settings

class RecognitionService:
    def __init__(self):
        self.ai = get_ai_provider()
        self.storage = get_storage()
        self.food_db = FoodService()

    async def analyze_food(
        self,
        db: Session,
        user_id: int,
        image_bytes: Optional[bytes] = None,
        filename: Optional[str] = None,
        query: Optional[str] = None,
        lang: str = "en"
    ) -> Dict[str, Any]:
        # Fetch user preferences & allergies
        user = db.query(User).filter(User.id == user_id).first()
        user_allergies = json.loads(user.allergies) if user and user.allergies else []
        user_diet = user.diet_type if user else "omnivore"

        relative_path = None
        if image_bytes and filename:
            relative_path = await self.storage.save_file(image_bytes, filename, subfolder="food_scans")

        # Call AI provider
        ai_res = await self.ai.analyze_food(
            image_bytes=image_bytes,
            image_path=relative_path,
            query=query,
            user_diet=user_diet,
            user_allergies=user_allergies,
            lang=lang
        )

        # Match against SQLite FTS5 database to prefer verified data
        db_match = None
        search_hits = self.food_db.search_foods(query=ai_res.name, limit=1)
        if search_hits["items"]:
            top_hit = search_hits["items"][0]
            # If hit name is very similar
            if ai_res.name.lower() in top_hit["name"].lower() or top_hit["name"].lower() in ai_res.name.lower():
                db_match = top_hit

        # If database hit found, merge authoritative values
        final_data_source = "database" if db_match else ai_res.data_source
        calories = db_match["calories"] if db_match else ai_res.macros.calories
        protein = db_match["protein"] if db_match else ai_res.macros.protein
        carbs = db_match["carbs"] if db_match else ai_res.macros.carbs
        fat = db_match["fat"] if db_match else ai_res.macros.fat
        fiber = db_match.get("fiber", ai_res.macros.fiber) if db_match else ai_res.macros.fiber
        allergens = db_match["allergens"] if db_match and db_match.get("allergens") else ai_res.allergens
        diet_tags = db_match["diet_tags"] if db_match and db_match.get("diet_tags") else ai_res.diet_tags

        # Screen against user allergies
        allergen_conflicts = []
        for a in allergens:
            if any(ua.lower() in a.lower() or a.lower() in ua.lower() for ua in user_allergies):
                allergen_conflicts.append(a)

        # Screen against user diet
        diet_conflicts = []
        if user_diet.lower() in ["veg", "vegetarian", "jain", "vegan"]:
            if any(non_veg in [t.lower() for t in diet_tags] + [ai_res.name.lower()] for non_veg in ["chicken", "meat", "pork", "beef", "fish", "shrimp"]):
                diet_conflicts.append("Non-Vegetarian Item")

        result_payload = {
            "name": ai_res.name,
            "name_hi": ai_res.name_hi or (db_match.get("name_hi") if db_match else None),
            "confidence": ai_res.confidence,
            "category": db_match["category"] if db_match else ai_res.category,
            "cuisine": db_match["cuisine"] if db_match else ai_res.cuisine,
            "health_score": ai_res.health_score,
            "health_explanation": ai_res.health_explanation,
            "nutrition": {
                "calories": calories,
                "protein": protein,
                "carbs": carbs,
                "fat": fat,
                "fiber": fiber,
                "servingSize": db_match["serving_size"] if db_match else ai_res.macros.servingSize
            },
            "allergens": allergens,
            "allergen_conflicts": allergen_conflicts,
            "diet_conflicts": diet_conflicts,
            "uncertain_alerts": ["Manufactured in a facility that also processes tree nuts and seeds."] if allergens else [],
            "cues": ai_res.cues_detected,
            "data_source": final_data_source,
            "model_provider": settings.AI_PROVIDER,
            "image_url": f"/static/uploads/{relative_path}" if relative_path else None,
            "disclaimer": ai_res.disclaimer
        }

        # Save analysis record to DB
        analysis_record = Analysis(
            user_id=user_id,
            analysis_type="food_scan",
            input_path=relative_path,
            item_name=ai_res.name,
            confidence=ai_res.confidence,
            score=float(ai_res.health_score),
            data_source=final_data_source,
            model_provider=settings.AI_PROVIDER,
            result_json=json.dumps(result_payload)
        )
        db.add(analysis_record)
        db.commit()
        db.refresh(analysis_record)

        result_payload["id"] = analysis_record.id
        result_payload["timestamp"] = str(analysis_record.created_at)
        return result_payload

    def save_correction(
        self,
        db: Session,
        user_id: int,
        original_name: str,
        corrected_name: str,
        input_path: Optional[str] = None
    ) -> Dict[str, Any]:
        correction = FoodCorrection(
            user_id=user_id,
            original_name=original_name,
            corrected_name=corrected_name,
            input_path=input_path
        )
        db.add(correction)
        db.commit()
        return {"status": "success", "message": f"Saved correction: '{original_name}' -> '{corrected_name}'"}
