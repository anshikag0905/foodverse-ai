import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from app.models.pantry import PantryItem, GroceryItem
from app.schemas.pantry import (
    PantryItemCreate, PantryItemUpdate, PantryItemResponse,
    PantryWasteSummary, GroceryItemCreate, GroceryItemUpdate, GroceryItemResponse
)
from app.services.food_service import FoodService
from app.ai.factory import get_ai_provider

class PantryService:
    def __init__(self, db: Session):
        self.db = db
        self.food_service = FoodService()
        self.ai = get_ai_provider()

    def _calculate_status_and_days(self, item: PantryItem) -> tuple[str, int]:
        now = datetime.datetime.utcnow()
        diff = item.expiry_date - now
        days_remaining = int(diff.total_seconds() // 86400)
        
        if item.wasted:
            return "wasted", days_remaining
        if item.used_this_month:
            return "used", days_remaining

        if diff.total_seconds() < 0:
            status = "expired"
        elif days_remaining <= 3:
            status = "use_soon"
        else:
            status = "fresh"
        return status, days_remaining

    def _to_response(self, item: PantryItem) -> PantryItemResponse:
        status, days_remaining = self._calculate_status_and_days(item)
        return PantryItemResponse(
            id=item.id,
            user_id=item.user_id,
            food_id=item.food_id,
            name=item.name,
            category=item.category or "General",
            quantity=item.quantity,
            unit=item.unit,
            purchase_date=item.purchase_date or datetime.datetime.utcnow(),
            expiry_date=item.expiry_date,
            storage_location=item.storage_location,
            status=status,
            days_remaining=days_remaining,
            used_this_month=item.used_this_month,
            wasted=item.wasted,
            created_at=item.created_at or datetime.datetime.utcnow(),
        )

    def list_items(
        self,
        user_id: Optional[int] = None,
        storage_location: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[PantryItemResponse]:
        query = self.db.query(PantryItem)
        if user_id:
            query = query.filter((PantryItem.user_id == user_id) | (PantryItem.user_id.is_(None)))
        if storage_location and storage_location.lower() != "all":
            query = query.filter(PantryItem.storage_location == storage_location.lower())

        items = query.order_by(asc(PantryItem.expiry_date)).all()
        responses = [self._to_response(it) for it in items]

        if status and status.lower() != "all":
            responses = [r for r in responses if r.status == status.lower()]

        return responses

    def get_expiring_items(self, user_id: Optional[int] = None, days: int = 3) -> List[PantryItemResponse]:
        items = self.list_items(user_id=user_id)
        # Filter items that are expiring soon or expired, but not used or wasted
        expiring = [
            it for it in items
            if it.status in ["use_soon", "expired"] and not it.used_this_month and not it.wasted
        ]
        # Sort so most urgent (lowest days_remaining) is first
        expiring.sort(key=lambda x: x.days_remaining)
        return expiring

    def get_item(self, item_id: int, user_id: Optional[int] = None) -> Optional[PantryItemResponse]:
        item = self.db.query(PantryItem).filter(PantryItem.id == item_id).first()
        if not item:
            return None
        return self._to_response(item)

    def create_item(self, item_data: PantryItemCreate, user_id: Optional[int] = None) -> PantryItemResponse:
        purchase_date = item_data.purchase_date or datetime.datetime.utcnow()
        if item_data.expiry_date:
            expiry_date = item_data.expiry_date
        else:
            days = item_data.days_shelf_life or 7
            # If food_id or name exists in food DB, check for shelf life hints
            if item_data.name:
                res = self.food_service.search_foods(item_data.name, limit=1)
                matches = res.get("items", []) if isinstance(res, dict) else []
                if matches and matches[0].get("typical_shelf_life"):
                    hint = str(matches[0]["typical_shelf_life"]).lower()
                    if "day" in hint:
                        for word in hint.split():
                            if word.isdigit():
                                days = int(word)
                                break
            expiry_date = purchase_date + datetime.timedelta(days=days)

        item = PantryItem(
            user_id=user_id,
            food_id=item_data.food_id,
            name=item_data.name.strip(),
            category=item_data.category or "General",
            quantity=item_data.quantity,
            unit=item_data.unit,
            purchase_date=purchase_date,
            expiry_date=expiry_date,
            storage_location=item_data.storage_location.lower(),
            status="fresh",
            used_this_month=False,
            wasted=False,
        )
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return self._to_response(item)

    def update_item(self, item_id: int, item_data: PantryItemUpdate, user_id: Optional[int] = None) -> Optional[PantryItemResponse]:
        item = self.db.query(PantryItem).filter(PantryItem.id == item_id).first()
        if not item:
            return None

        update_dict = item_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            if hasattr(item, key):
                setattr(item, key, value)

        self.db.commit()
        self.db.refresh(item)
        return self._to_response(item)

    def delete_item(self, item_id: int, user_id: Optional[int] = None) -> bool:
        item = self.db.query(PantryItem).filter(PantryItem.id == item_id).first()
        if not item:
            return False
        self.db.delete(item)
        self.db.commit()
        return True

    def mark_used(self, item_id: int, user_id: Optional[int] = None) -> Optional[PantryItemResponse]:
        item = self.db.query(PantryItem).filter(PantryItem.id == item_id).first()
        if not item:
            return None
        item.used_this_month = True
        item.wasted = False
        item.status = "used"
        self.db.commit()
        self.db.refresh(item)
        return self._to_response(item)

    def mark_wasted(self, item_id: int, user_id: Optional[int] = None) -> Optional[PantryItemResponse]:
        item = self.db.query(PantryItem).filter(PantryItem.id == item_id).first()
        if not item:
            return None
        item.wasted = True
        item.used_this_month = False
        item.status = "wasted"
        self.db.commit()
        self.db.refresh(item)
        return self._to_response(item)

    def get_waste_summary(self, user_id: Optional[int] = None) -> PantryWasteSummary:
        items = self.list_items(user_id=user_id)
        total = len(items)
        used = sum(1 for it in items if it.used_this_month)
        wasted = sum(1 for it in items if it.wasted)
        expiring_soon = sum(1 for it in items if it.status == "use_soon" and not it.used_this_month and not it.wasted)
        expired = sum(1 for it in items if it.status == "expired" and not it.used_this_month and not it.wasted)
        active = sum(1 for it in items if not it.used_this_month and not it.wasted)

        closed = used + wasted
        waste_percentage = round((wasted / closed * 100), 1) if closed > 0 else 0.0

        if waste_percentage == 0 and used > 0:
            msg = "Flawless zero-waste kitchen! All used items consumed responsibly."
        elif waste_percentage < 15:
            msg = f"Great sustainability habits! Low waste rate ({waste_percentage}%)."
        elif waste_percentage < 30:
            msg = f"Moderate waste ({waste_percentage}%). Try 'Cook from my Pantry' recipes to use items earlier."
        else:
            msg = f"Higher food waste detected ({waste_percentage}%). Review expiring alerts daily to minimize spoilage."

        return PantryWasteSummary(
            total_tracked=total,
            active_count=active,
            used_count=used,
            wasted_count=wasted,
            expiring_soon_count=expiring_soon,
            expired_count=expired,
            waste_percentage=waste_percentage,
            message=msg
        )

    async def suggest_recipes_from_expiring(self, user_id: Optional[int] = None) -> Dict[str, Any]:
        expiring = self.get_expiring_items(user_id=user_id)
        all_active = [it for it in self.list_items(user_id=user_id) if not it.used_this_month and not it.wasted]

        expiring_names = [it.name for it in expiring]
        all_names = [it.name for it in all_active]

        if not expiring_names and all_names:
            target_ingredients = all_names[:5]
        elif expiring_names:
            target_ingredients = expiring_names
        else:
            target_ingredients = ["Tomatoes", "Eggs", "Spinach", "Paneer"]

        prompt = (
            f"The user has the following food items in their pantry:\n"
            f"Expiring urgently: {', '.join(expiring_names) if expiring_names else 'None'}\n"
            f"All available pantry items: {', '.join(all_names)}\n"
            f"Generate 2 to 3 creative, practical recipes that prioritize using the expiring items.\n"
            f"Format as structured JSON with fields: recipes: list of object {{"
            f"title, prep_time, cook_time, servings, pantry_ingredients_used: list of string, "
            f"missing_ingredients: list of string, steps: list of string, explanation: string}}"
        )

        try:
            res = await self.ai.generate_meal_plan(prompt, user_profile={"diet": "balanced"})
            # Fallback structure if LLM mock returned generic meal plan
            recipes = []
            if isinstance(res, dict) and "recipes" in res:
                recipes = res["recipes"]
            else:
                recipes = [
                    {
                        "title": f"Quick Pantry Skillet with {target_ingredients[0]}",
                        "prep_time": "10 min",
                        "cook_time": "15 min",
                        "servings": 2,
                        "pantry_ingredients_used": target_ingredients[:3],
                        "missing_ingredients": ["Olive Oil", "Black Pepper", "Garlic"],
                        "steps": [
                            f"Wash and dice {target_ingredients[0]}.",
                            "Heat oil in a skillet, sauté garlic until golden.",
                            f"Add {', '.join(target_ingredients[:2])} and cook for 8-10 minutes.",
                            "Season to taste and serve warm."
                        ],
                        "explanation": f"Specially designed to utilize {target_ingredients[0]} before its expiration date."
                    },
                    {
                        "title": f"Harvest Sauté & Rice Bowl",
                        "prep_time": "15 min",
                        "cook_time": "20 min",
                        "servings": 2,
                        "pantry_ingredients_used": target_ingredients[1:3] if len(target_ingredients) > 1 else target_ingredients,
                        "missing_ingredients": ["Cooked Rice", "Soy Sauce"],
                        "steps": [
                            "Chop all vegetables into uniform bite-sized pieces.",
                            "Stir fry on medium-high heat with soy sauce.",
                            "Layer over warm rice and garnish."
                        ],
                        "explanation": "Clears pantry vegetables efficiently with high nutritional retention."
                    }
                ]
            return {
                "expiring_items": [it.name for it in expiring],
                "recipes": recipes,
                "message": f"Generated {len(recipes)} recipes prioritizing {len(expiring)} expiring item(s)."
            }
        except Exception:
            return {
                "expiring_items": [it.name for it in expiring],
                "recipes": [
                    {
                        "title": f"Quick Pantry Stir-Fry",
                        "prep_time": "10 min",
                        "cook_time": "12 min",
                        "servings": 2,
                        "pantry_ingredients_used": target_ingredients[:2],
                        "missing_ingredients": ["Salt", "Oil"],
                        "steps": ["Chop ingredients", "Sauté in pan", "Serve warm"],
                        "explanation": "Quick and zero-waste."
                    }
                ],
                "message": "Fallback recipe generated."
            }

    # GROCERY LIST METHODS
    def list_groceries(self, user_id: Optional[int] = None) -> List[GroceryItemResponse]:
        query = self.db.query(GroceryItem)
        if user_id:
            query = query.filter((GroceryItem.user_id == user_id) | (GroceryItem.user_id.is_(None)))
        items = query.order_by(asc(GroceryItem.checked), desc(GroceryItem.id)).all()
        return [GroceryItemResponse.model_validate(it) for it in items]

    def create_grocery(self, item_data: GroceryItemCreate, user_id: Optional[int] = None) -> GroceryItemResponse:
        item = GroceryItem(
            user_id=user_id,
            name=item_data.name.strip(),
            quantity=item_data.quantity,
            unit=item_data.unit,
            category=item_data.category or "Pantry Missing",
            checked=False
        )
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return GroceryItemResponse.model_validate(item)

    def update_grocery(self, grocery_id: int, item_data: GroceryItemUpdate, user_id: Optional[int] = None) -> Optional[GroceryItemResponse]:
        item = self.db.query(GroceryItem).filter(GroceryItem.id == grocery_id).first()
        if not item:
            return None
        update_dict = item_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            if hasattr(item, key):
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return GroceryItemResponse.model_validate(item)

    def delete_grocery(self, grocery_id: int, user_id: Optional[int] = None) -> bool:
        item = self.db.query(GroceryItem).filter(GroceryItem.id == grocery_id).first()
        if not item:
            return False
        self.db.delete(item)
        self.db.commit()
        return True

    def clear_checked_groceries(self, user_id: Optional[int] = None) -> int:
        query = self.db.query(GroceryItem).filter(GroceryItem.checked == True)
        if user_id:
            query = query.filter((GroceryItem.user_id == user_id) | (GroceryItem.user_id.is_(None)))
        count = query.delete(synchronize_session=False)
        self.db.commit()
        return count

    def add_missing_ingredients(self, ingredient_names: List[str], user_id: Optional[int] = None) -> List[GroceryItemResponse]:
        created = []
        for name in ingredient_names:
            clean = name.strip()
            if not clean:
                continue
            # Check if already in grocery
            query = self.db.query(GroceryItem).filter(
                GroceryItem.name.ilike(clean),
                GroceryItem.checked == False
            )
            if user_id:
                query = query.filter(GroceryItem.user_id == user_id)
            existing = query.first()
            if not existing:
                item = GroceryItem(
                    user_id=user_id,
                    name=clean,
                    quantity=1.0,
                    unit="pack",
                    category="Recipe Missing",
                    checked=False
                )
                self.db.add(item)
                created.append(item)
        self.db.commit()
        for c in created:
            self.db.refresh(c)
        return [GroceryItemResponse.model_validate(it) for it in created]

    def seed_demo_pantry(self, user_id: Optional[int] = None) -> List[PantryItemResponse]:
        """Seeds realistic pantry items with varying expiry dates for zero-config demo experience."""
        now = datetime.datetime.utcnow()
        sample_items = [
            ("Whole Milk", "Dairy", 1.0, "liter", "fridge", now - datetime.timedelta(days=1), now + datetime.timedelta(days=1)), # expires tomorrow
            ("Fresh Baby Spinach", "Produce", 200.0, "g", "fridge", now - datetime.timedelta(days=2), now + datetime.timedelta(days=2)), # expires in 2 days
            ("Greek Yogurt", "Dairy", 500.0, "g", "fridge", now - datetime.timedelta(days=4), now + datetime.timedelta(days=3)), # expires in 3 days
            ("Brown Bread Loaf", "Bakery", 1.0, "loaf", "shelf", now - datetime.timedelta(days=5), now - datetime.timedelta(days=1)), # expired yesterday
            ("Paneer (Cottage Cheese)", "Dairy", 250.0, "g", "fridge", now - datetime.timedelta(days=1), now + datetime.timedelta(days=5)), # fresh
            ("Roma Tomatoes", "Produce", 6.0, "pcs", "fridge", now - datetime.timedelta(days=2), now + datetime.timedelta(days=6)), # fresh
            ("Frozen Mixed Berries", "Produce", 500.0, "g", "freezer", now - datetime.timedelta(days=10), now + datetime.timedelta(days=90)), # freezer fresh
            ("Chicken Breast Fillets", "Meat & Seafood", 400.0, "g", "freezer", now - datetime.timedelta(days=7), now + datetime.timedelta(days=60)), # freezer
            ("Rolled Oats", "Grains", 1.0, "kg", "shelf", now - datetime.timedelta(days=14), now + datetime.timedelta(days=120)), # shelf
            ("Extra Virgin Olive Oil", "Oils & Condiments", 750.0, "ml", "shelf", now - datetime.timedelta(days=30), now + datetime.timedelta(days=180)), # shelf
        ]

        created = []
        for name, cat, qty, unit, loc, p_date, exp_date in sample_items:
            existing = self.db.query(PantryItem).filter(PantryItem.name == name).first()
            if not existing:
                item = PantryItem(
                    user_id=user_id,
                    name=name,
                    category=cat,
                    quantity=qty,
                    unit=unit,
                    storage_location=loc,
                    purchase_date=p_date,
                    expiry_date=exp_date,
                    status="fresh",
                    used_this_month=False,
                    wasted=False
                )
                self.db.add(item)
                created.append(item)
        self.db.commit()
        return self.list_items(user_id=user_id)
