import json
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.ai.factory import get_ai_provider
from app.models.meal_plan import MealPlan
from app.models.user import User
from app.models.pantry import PantryItem, GroceryItem

class MealPlanService:
    def __init__(self):
        self.ai = get_ai_provider()

    async def generate_plan(
        self,
        db: Session,
        user_id: int,
        plan_type: str = "daily",
        target_calories: Optional[float] = None,
        target_macros: Optional[Dict[str, float]] = None,
        lang: str = "en"
    ) -> Dict[str, Any]:
        user = db.query(User).filter(User.id == user_id).first()
        user_profile = {
            "age": user.age or 25,
            "weight_kg": user.weight_kg or 70.0,
            "height_cm": user.height_cm or 175.0,
            "goal": user.goal or "maintain",
            "diet_type": user.diet_type or "omnivore",
            "allergies": json.loads(user.allergies) if user and user.allergies else []
        }

        cal = float(target_calories or 2000.0)
        # Enforce safety minimum calorie floor (no crash diets)
        if cal < 1200.0:
            cal = 1200.0

        macros = target_macros or {
            "protein": round((cal * 0.25) / 4.0),
            "carbs": round((cal * 0.50) / 4.0),
            "fat": round((cal * 0.25) / 9.0)
        }

        pantry_items = db.query(PantryItem).filter(PantryItem.user_id == user_id).all()
        pantry_data = [{"name": p.name, "status": p.status} for p in pantry_items]

        ai_res = await self.ai.generate_meal_plan(
            user_profile=user_profile,
            target_calories=cal,
            target_macros=macros,
            pantry_items=pantry_data,
            plan_type=plan_type,
            lang=lang
        )

        plan_entry = MealPlan(
            user_id=user_id,
            plan_type=plan_type,
            title=ai_res.plan_title,
            target_calories=ai_res.target_calories,
            target_macros_json=json.dumps({
                "protein": ai_res.target_protein,
                "carbs": ai_res.target_carbs,
                "fat": ai_res.target_fat
            }),
            meals_json=json.dumps([d.model_dump() for d in ai_res.days])
        )
        db.add(plan_entry)
        db.commit()
        db.refresh(plan_entry)

        # Sync grocery list
        if ai_res.grocery_list:
            for item_name in ai_res.grocery_list:
                exists = db.query(GroceryItem).filter(GroceryItem.user_id == user_id, GroceryItem.name == item_name).first()
                if not exists:
                    db.add(GroceryItem(user_id=user_id, name=item_name, category="Meal Plan"))
            db.commit()

        return {
            "id": plan_entry.id,
            "title": plan_entry.title,
            "target_calories": plan_entry.target_calories,
            "target_macros": json.loads(plan_entry.target_macros_json),
            "days": json.loads(plan_entry.meals_json),
            "grocery_list": ai_res.grocery_list,
            "allergen_exclusions_applied": ai_res.allergen_exclusions_applied,
            "diet_applied": ai_res.diet_applied,
            "disclaimer": ai_res.disclaimer
        }

    def get_current_plan(self, db: Session, user_id: int) -> Optional[Dict[str, Any]]:
        plan = db.query(MealPlan).filter(MealPlan.user_id == user_id).order_by(MealPlan.created_at.desc()).first()
        if not plan:
            return None
        return {
            "id": plan.id,
            "title": plan.title,
            "target_calories": plan.target_calories,
            "target_macros": json.loads(plan.target_macros_json),
            "days": json.loads(plan.meals_json),
            "created_at": str(plan.created_at)
        }

    def swap_single_meal(
        self,
        db: Session,
        user_id: int,
        plan_id: int,
        day_index: int,
        meal_index: int
    ) -> Dict[str, Any]:
        plan = db.query(MealPlan).filter(MealPlan.id == plan_id, MealPlan.user_id == user_id).first()
        if not plan:
            return {"error": "Meal plan not found"}

        days = json.loads(plan.meals_json)
        target_meal = days[day_index]["meals"][meal_index]

        # Alternative dish replacement pools
        replacements = [
            {"meal_type": target_meal["meal_type"], "dish_name": "Tofu & Steamed Edamame Bowl", "calories": 420.0, "protein": 32.0, "carbs": 35.0, "fat": 14.0, "description": "High-protein plant meal with sesame soy drizzle."},
            {"meal_type": target_meal["meal_type"], "dish_name": "Lentil Pasta with Roasted Tomato Marinara", "calories": 480.0, "protein": 28.0, "carbs": 65.0, "fat": 9.0, "description": "Gluten-free red lentil pasta with fresh basil and garlic."},
            {"meal_type": target_meal["meal_type"], "dish_name": "Grilled Paneer & Spinach Wrap", "calories": 450.0, "protein": 26.0, "carbs": 42.0, "fat": 18.0, "description": "Warm multigrain wrap stuffed with spiced cottage cheese cubes."}
        ]
        new_meal = replacements[meal_index % len(replacements)]
        days[day_index]["meals"][meal_index] = new_meal

        plan.meals_json = json.dumps(days)
        db.commit()

        return {
            "status": "success",
            "updated_meal": new_meal,
            "days": days
        }
