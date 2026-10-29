import json
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.analysis import Analysis, FoodCorrection
from app.models.hygiene import HygieneReport
from app.models.pantry import PantryItem, GroceryItem
from app.models.meal_plan import MealPlan
from app.models.cooking import CookingSession
from app.models.gym import GymProfile, GymLog, ProgressEntry
from app.storage.local_storage import get_storage

class PrivacyService:
    @staticmethod
    def export_user_data(db: Session, user_id: int) -> Dict[str, Any]:
        user = db.query(User).filter(User.id == user_id).first()
        analyses = db.query(Analysis).filter(Analysis.user_id == user_id).all()
        hygiene_reports = db.query(HygieneReport).filter(HygieneReport.user_id == user_id).all()
        pantry_items = db.query(PantryItem).filter(PantryItem.user_id == user_id).all()
        grocery_items = db.query(GroceryItem).filter(GroceryItem.user_id == user_id).all()
        meal_plans = db.query(MealPlan).filter(MealPlan.user_id == user_id).all()
        cooking_sessions = db.query(CookingSession).filter(CookingSession.user_id == user_id).all()
        gym_profile = db.query(GymProfile).filter(GymProfile.user_id == user_id).first()
        gym_logs = db.query(GymLog).filter(GymLog.user_id == user_id).all()
        progress_entries = db.query(ProgressEntry).filter(ProgressEntry.user_id == user_id).all()

        return {
            "user_profile": {
                "id": user.id if user else user_id,
                "email": user.email if user else None,
                "diet_type": user.diet_type if user else None,
                "allergies": json.loads(user.allergies) if user and user.allergies else [],
                "created_at": str(user.created_at) if user else None,
            },
            "analyses": [
                {
                    "id": a.id,
                    "type": a.analysis_type,
                    "item_name": a.item_name,
                    "confidence": a.confidence,
                    "score": a.score,
                    "data_source": a.data_source,
                    "created_at": str(a.created_at),
                    "result": json.loads(a.result_json) if a.result_json else {}
                }
                for a in analyses
            ],
            "hygiene_reports": [
                {
                    "id": h.id,
                    "job_id": h.job_id,
                    "overall_score": h.overall_score,
                    "status": h.status,
                    "created_at": str(h.created_at)
                }
                for h in hygiene_reports
            ],
            "pantry_items": [
                {
                    "id": p.id,
                    "name": p.name,
                    "quantity": p.quantity,
                    "unit": p.unit,
                    "status": p.status,
                    "expiry_date": str(p.expiry_date)
                }
                for p in pantry_items
            ],
            "grocery_items": [
                {"id": g.id, "name": g.name, "checked": g.checked} for g in grocery_items
            ],
            "meal_plans": [
                {"id": m.id, "title": m.title, "calories": m.target_calories, "created_at": str(m.created_at)}
                for m in meal_plans
            ],
            "gym": {
                "profile": {
                    "goal": gym_profile.goal if gym_profile else None,
                    "target_calories": gym_profile.target_calories if gym_profile else None,
                    "target_protein": gym_profile.target_protein_g if gym_profile else None,
                },
                "logs_count": len(gym_logs),
                "progress_entries_count": len(progress_entries)
            }
        }

    @staticmethod
    async def delete_single_analysis(db: Session, analysis_id: int, user_id: int) -> bool:
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == user_id).first()
        if not analysis:
            return False

        # If file was stored locally, delete it
        if analysis.input_path:
            storage = get_storage()
            await storage.delete_file(analysis.input_path)

        db.delete(analysis)
        db.commit()
        return True

    @staticmethod
    async def delete_all_user_data(db: Session, user_id: int) -> Dict[str, int]:
        storage = get_storage()

        # Delete input files from analysis
        analyses = db.query(Analysis).filter(Analysis.user_id == user_id).all()
        for a in analyses:
            if a.input_path:
                await storage.delete_file(a.input_path)

        # Delete videos from hygiene reports
        hygiene_reports = db.query(HygieneReport).filter(HygieneReport.user_id == user_id).all()
        for h in hygiene_reports:
            if h.video_path:
                await storage.delete_file(h.video_path)

        counts = {
            "analyses": db.query(Analysis).filter(Analysis.user_id == user_id).delete(),
            "hygiene_reports": db.query(HygieneReport).filter(HygieneReport.user_id == user_id).delete(),
            "pantry_items": db.query(PantryItem).filter(PantryItem.user_id == user_id).delete(),
            "grocery_items": db.query(GroceryItem).filter(GroceryItem.user_id == user_id).delete(),
            "meal_plans": db.query(MealPlan).filter(MealPlan.user_id == user_id).delete(),
            "cooking_sessions": db.query(CookingSession).filter(CookingSession.user_id == user_id).delete(),
            "gym_logs": db.query(GymLog).filter(GymLog.user_id == user_id).delete(),
            "progress_entries": db.query(ProgressEntry).filter(ProgressEntry.user_id == user_id).delete(),
            "corrections": db.query(FoodCorrection).filter(FoodCorrection.user_id == user_id).delete(),
        }

        db.commit()
        return counts
