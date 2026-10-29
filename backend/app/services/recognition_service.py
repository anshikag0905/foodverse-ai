import json
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.ai.factory import get_ai_provider
from app.storage.local_storage import get_storage
from app.services.food_service import FoodService
from app.models.analysis import Analysis, FoodCorrection
from app.models.user import User
from app.core.config import settings

import json
import re
import uuid
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.ai.factory import get_ai_provider
from app.storage.local_storage import get_storage
from app.services.food_service import FoodService
from app.models.analysis import Analysis, FoodCorrection
from app.models.user import User
from app.core.config import settings

def parse_serving_grams(serving_str: Optional[str]) -> float:
    if not serving_str:
        return 100.0
    match = re.search(r"(\d+(?:\.\d+)?)\s*g", serving_str.lower())
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            pass
    return 100.0

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

        # Call AI provider multi-item food detection
        multi_res = await self.ai.analyze_food_multi(
            image_bytes=image_bytes,
            image_path=relative_path,
            query=query,
            user_diet=user_diet,
            user_allergies=user_allergies,
            lang=lang
        )

        # If API key is required and no items detected
        if multi_res.requires_api_key or not multi_res.items:
            return {
                "items": [],
                "name": "Custom Uploaded Image",
                "requires_api_key": True,
                "error_message": multi_res.error_message or "AI provider not configured. Add GEMINI_API_KEY (or OPENAI_API_KEY) in the backend environment to analyze custom uploaded images.",
                "total_calories": 0.0,
                "total_protein": 0.0,
                "total_carbs": 0.0,
                "total_fat": 0.0,
                "total_fiber": 0.0,
                "total_weight_grams": 0.0,
                "health_score": 0,
                "health_explanation": "AI provider unconfigured. Please configure an API key or use our 5 verified sample plates / text search.",
                "image_url": f"/static/uploads/{relative_path}" if relative_path else None,
                "model_provider": settings.AI_PROVIDER
            }

        # Process and scale each item against SQLite FTS5 database
        enriched_items = []
        for it in multi_res.items:
            # Search database for genuine matching entry
            db_hit = None
            search_res = self.food_db.search_foods(query=it.name, limit=5)
            if search_res and search_res.get("items"):
                i_words = set(re.findall(r'\w+', it.name.lower()))
                for candidate in search_res["items"]:
                    c_name = candidate["name"].lower()
                    c_words = set(re.findall(r'\w+', c_name))
                    # Check substring or substantial word overlap
                    if it.name.lower() in c_name or c_name in it.name.lower() or len(i_words.intersection(c_words)) >= 1:
                        db_hit = candidate
                        break
            # If no genuine database match was found, do NOT blindly use an unrelated item!
            # Keep the AI's detection and macros instead.

            grams = it.estimated_grams or 100.0
            if db_hit:
                ref_grams = parse_serving_grams(db_hit.get("serving_size")) or 100.0
                scale = grams / ref_grams

                cals = round(db_hit["calories"] * scale, 1)
                p = round(db_hit["protein"] * scale, 1)
                c = round(db_hit["carbs"] * scale, 1)
                f = round(db_hit["fat"] * scale, 1)
                fib = round(db_hit.get("fiber", 0.0) * scale, 1)
                sod = round(db_hit.get("sodium_mg", 0.0) * scale, 1)
                allergens = db_hit.get("allergens") or it.allergens
                diet_tags = db_hit.get("diet_tags") or it.diet_tags
                name_hi = db_hit.get("name_hi") or it.name_hi
                category = db_hit.get("category") or it.category
                cuisine = db_hit.get("cuisine") or it.cuisine
                data_source = "database"
                matched_id = db_hit.get("id")
            else:
                cals = round(it.calories, 1)
                p = round(it.protein, 1)
                c = round(it.carbs, 1)
                f = round(it.fat, 1)
                fib = round(it.fiber, 1)
                sod = round(it.sodium_mg, 1)
                allergens = it.allergens
                diet_tags = it.diet_tags
                name_hi = it.name_hi
                category = it.category
                cuisine = it.cuisine
                data_source = "ai_estimate"
                matched_id = None

            box_dict = it.box.model_dump() if it.box else None

            enriched_items.append({
                "id": it.id or f"item_{uuid.uuid4().hex[:6]}",
                "name": it.name,
                "name_hi": name_hi,
                "confidence": it.confidence,
                "box": box_dict,
                "estimated_grams": round(grams, 1),
                "category": category,
                "cuisine": cuisine,
                "calories": cals,
                "protein": p,
                "carbs": c,
                "fat": f,
                "fiber": fib,
                "sodium_mg": sod,
                "allergens": allergens,
                "diet_tags": diet_tags,
                "matched_food_id": matched_id,
                "data_source": data_source
            })

        # Calculate Plate Totals
        total_calories = round(sum(it["calories"] for it in enriched_items), 1)
        total_protein = round(sum(it["protein"] for it in enriched_items), 1)
        total_carbs = round(sum(it["carbs"] for it in enriched_items), 1)
        total_fat = round(sum(it["fat"] for it in enriched_items), 1)
        total_fiber = round(sum(it["fiber"] for it in enriched_items), 1)
        total_weight_grams = round(sum(it["estimated_grams"] for it in enriched_items), 1)

        # Screen against user allergies
        all_allergens = set()
        for it in enriched_items:
            for a in it.get("allergens", []):
                all_allergens.add(a)

        allergen_conflicts = []
        for a in all_allergens:
            if any(ua.lower() in a.lower() or a.lower() in ua.lower() for ua in user_allergies):
                allergen_conflicts.append(a)

        # Screen against user diet
        diet_conflicts = []
        if user_diet.lower() in ["veg", "vegetarian", "jain", "vegan"]:
            for it in enriched_items:
                tags = [t.lower() for t in it.get("diet_tags", [])] + [it["name"].lower()]
                if any(non_veg in tags for non_veg in ["chicken", "meat", "pork", "beef", "fish", "shrimp", "mutton", "lamb"]):
                    diet_conflicts.append(f"Non-Vegetarian Item: {it['name']}")

        # Primary dish title for backwards-compatible views
        primary_title = " + ".join([it["name"] for it in enriched_items[:2]])
        if len(enriched_items) > 2:
            primary_title += f" & {len(enriched_items)-2} more"

        result_payload = {
            "name": primary_title,
            "name_hi": enriched_items[0]["name_hi"] if enriched_items else None,
            "items": enriched_items,
            "confidence": enriched_items[0]["confidence"] if enriched_items else 0.95,
            "total_calories": total_calories,
            "total_protein": total_protein,
            "total_carbs": total_carbs,
            "total_fat": total_fat,
            "total_fiber": total_fiber,
            "total_weight_grams": total_weight_grams,
            "health_score": multi_res.health_score,
            "health_explanation": multi_res.health_explanation,
            "nutrition": {
                "calories": total_calories,
                "protein": total_protein,
                "carbs": total_carbs,
                "fat": total_fat,
                "fiber": total_fiber,
                "servingSize": f"1 plate ({int(total_weight_grams)}g)"
            },
            "allergens": list(all_allergens),
            "allergen_conflicts": allergen_conflicts,
            "diet_conflicts": diet_conflicts,
            "cues": multi_res.cues_detected or ["Multimodal bounding box localization", "Portion-scaled FTS5 database enrichment"],
            "data_source": "database" if any(it["data_source"] == "database" for it in enriched_items) else "ai_estimate",
            "model_provider": settings.AI_PROVIDER,
            "image_url": f"/static/uploads/{relative_path}" if relative_path else None,
            "requires_api_key": False,
            "disclaimer": "Nutritional values are calculated estimates based on portion models and verified database entries."
        }

        # Save analysis record to DB
        analysis_record = Analysis(
            user_id=user_id,
            analysis_type="food_scan",
            input_path=relative_path,
            item_name=primary_title,
            confidence=result_payload["confidence"],
            score=float(multi_res.health_score),
            data_source=result_payload["data_source"],
            model_provider=settings.AI_PROVIDER,
            result_json=json.dumps(result_payload)
        )
        db.add(analysis_record)
        db.commit()
        db.refresh(analysis_record)

        result_payload["id"] = analysis_record.id
        result_payload["timestamp"] = str(analysis_record.created_at)
        return result_payload

    def recalculate_plate(self, items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Recalculates plate totals when user modifies portion grams or corrects a food item."""
        enriched = []
        for it in items:
            grams = float(it.get("estimated_grams") or it.get("grams") or 100.0)
            db_id = it.get("matched_food_id") or it.get("food_id")
            db_hit = None
            if db_id:
                db_hit = self.food_db.get_food_by_id(db_id)
            if not db_hit:
                res = self.food_db.search_foods(query=it.get("name", ""), limit=1)
                if res and isinstance(res, list) and len(res) > 0:
                    db_hit = res[0]
                elif res and isinstance(res, dict) and res.get("items"):
                    db_hit = res["items"][0]

            if db_hit:
                ref_grams = parse_serving_grams(db_hit.get("serving_size")) or 100.0
                scale = grams / ref_grams
                cals = round(db_hit["calories"] * scale, 1)
                p = round(db_hit["protein"] * scale, 1)
                c = round(db_hit["carbs"] * scale, 1)
                f = round(db_hit["fat"] * scale, 1)
                fib = round(db_hit.get("fiber", 0.0) * scale, 1)
                name = db_hit["name"]
                name_hi = db_hit.get("name_hi")
                matched_id = db_hit["id"]
            else:
                scale = grams / 100.0
                cals = round(float(it.get("calories", 100.0)) * scale, 1)
                p = round(float(it.get("protein", 5.0)) * scale, 1)
                c = round(float(it.get("carbs", 15.0)) * scale, 1)
                f = round(float(it.get("fat", 2.0)) * scale, 1)
                fib = round(float(it.get("fiber", 1.0)) * scale, 1)
                name = it.get("name", "Food")
                name_hi = it.get("name_hi")
                matched_id = None

            enriched.append({
                **it,
                "name": name,
                "name_hi": name_hi,
                "estimated_grams": grams,
                "calories": cals,
                "protein": p,
                "carbs": c,
                "fat": f,
                "fiber": fib,
                "matched_food_id": matched_id
            })

        total_calories = round(sum(i["calories"] for i in enriched), 1)
        total_protein = round(sum(i["protein"] for i in enriched), 1)
        total_carbs = round(sum(i["carbs"] for i in enriched), 1)
        total_fat = round(sum(i["fat"] for i in enriched), 1)
        total_fiber = round(sum(i["fiber"] for i in enriched), 1)
        total_weight_grams = round(sum(i["estimated_grams"] for i in enriched), 1)

        return {
            "items": enriched,
            "total_calories": total_calories,
            "total_protein": total_protein,
            "total_carbs": total_carbs,
            "total_fat": total_fat,
            "total_fiber": total_fiber,
            "total_weight_grams": total_weight_grams,
            "nutrition": {
                "calories": total_calories,
                "protein": total_protein,
                "carbs": total_carbs,
                "fat": total_fat,
                "fiber": total_fiber,
                "servingSize": f"1 plate ({int(total_weight_grams)}g)"
            }
        }

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
