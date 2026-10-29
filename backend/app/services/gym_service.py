import datetime
import json
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from app.models.gym import GymProfile, GymLog, ProgressEntry
from app.schemas.gym import (
    GymProfileCreateUpdate, GymProfileResponse,
    GymLogCreate, GymLogResponse, DailyAdherenceResponse,
    ProgressEntryCreate, ProgressEntryResponse,
    ProteinFoodItem
)
from app.services.food_service import FoodService

class GymService:
    def __init__(self, db: Session):
        self.db = db
        self.food_service = FoodService()

    def calculate_metrics(self, data: GymProfileCreateUpdate) -> Dict[str, Any]:
        # Mifflin-St Jeor Equation
        if data.sex.lower() == "female":
            bmr = round(10 * data.weight_kg + 6.25 * data.height_cm - 5 * data.age - 161, 1)
            min_floor = 1200.0
        else:
            bmr = round(10 * data.weight_kg + 6.25 * data.height_cm - 5 * data.age + 5, 1)
            min_floor = 1500.0

        activity_multipliers = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "active": 1.725,
            "very_active": 1.9
        }
        mult = activity_multipliers.get(data.activity_level.lower(), 1.55)
        tdee = round(bmr * mult, 1)

        goal = data.goal.lower()
        if goal == "cut":
            raw_calories = tdee - 500
        elif goal == "bulk":
            raw_calories = tdee + 350
        elif goal == "recomp":
            raw_calories = tdee - 200
        else: # maintain
            raw_calories = tdee

        safety_warning = None
        if raw_calories < min_floor:
            safety_warning = (
                f"Calorie safety floor activated: Derived target ({raw_calories:.0f} kcal) was below the "
                f"medically recommended metabolic minimum ({min_floor:.0f} kcal/day for {data.sex}). Clamped to {min_floor:.0f} kcal."
            )
            target_calories = min_floor
        else:
            target_calories = round(raw_calories, 0)

        # Protein target: 2.0g per kg for strength/bodybuilding
        target_protein = round(data.weight_kg * 2.0, 1)
        # Fat target: 25% of calories (9 kcal/g)
        target_fat = round((target_calories * 0.25) / 9.0, 1)
        # Carbs: Remainder of calories (4 kcal/g)
        carb_calories = max(0.0, target_calories - (target_protein * 4.0) - (target_fat * 9.0))
        target_carbs = round(carb_calories / 4.0, 1)

        # Water target: 40 ml per kg
        target_water = round(data.weight_kg * 40.0, 0)

        formula_explanation = (
            f"BMR ({bmr:.0f} kcal) calculated via Mifflin-St Jeor equation. "
            f"TDEE ({tdee:.0f} kcal) adjusted with {data.activity_level} activity multiplier (×{mult}). "
            f"Target calories ({target_calories:.0f} kcal) tailored for {goal.upper()} goal. "
            f"Protein targeted at 2.0 g/kg ({target_protein:.0f}g)."
        )

        return {
            "bmr": bmr,
            "tdee": tdee,
            "target_calories": target_calories,
            "target_protein_g": target_protein,
            "target_carbs_g": target_carbs,
            "target_fat_g": target_fat,
            "target_water_ml": target_water,
            "formula_explanation": formula_explanation,
            "safety_warning": safety_warning,
        }

    def get_or_create_profile(self, user_id: Optional[int] = None) -> GymProfileResponse:
        profile = None
        if user_id:
            profile = self.db.query(GymProfile).filter(GymProfile.user_id == user_id).first()
        else:
            profile = self.db.query(GymProfile).first()

        if not profile:
            # Create default profile
            default_data = GymProfileCreateUpdate()
            metrics = self.calculate_metrics(default_data)
            profile = GymProfile(
                user_id=user_id,
                age=default_data.age,
                sex=default_data.sex,
                height_cm=default_data.height_cm,
                weight_kg=default_data.weight_kg,
                activity_level=default_data.activity_level,
                training_days_per_week=default_data.training_days_per_week,
                goal=default_data.goal,
                diet_type=default_data.diet_type,
                allergies=json.dumps(default_data.allergies),
                bmr=metrics["bmr"],
                tdee=metrics["tdee"],
                target_calories=metrics["target_calories"],
                target_protein_g=metrics["target_protein_g"],
                target_carbs_g=metrics["target_carbs_g"],
                target_fat_g=metrics["target_fat_g"],
                target_water_ml=metrics["target_water_ml"],
            )
            self.db.add(profile)
            self.db.commit()
            self.db.refresh(profile)

        allergies = []
        try:
            allergies = json.loads(profile.allergies or "[]")
        except Exception:
            allergies = []

        calc = self.calculate_metrics(GymProfileCreateUpdate(
            age=profile.age,
            sex=profile.sex,
            height_cm=profile.height_cm,
            weight_kg=profile.weight_kg,
            activity_level=profile.activity_level,
            training_days_per_week=profile.training_days_per_week,
            goal=profile.goal,
            diet_type=profile.diet_type,
            allergies=allergies
        ))

        return GymProfileResponse(
            id=profile.id,
            user_id=profile.user_id,
            age=profile.age,
            sex=profile.sex,
            height_cm=profile.height_cm,
            weight_kg=profile.weight_kg,
            activity_level=profile.activity_level,
            training_days_per_week=profile.training_days_per_week,
            goal=profile.goal,
            diet_type=profile.diet_type,
            allergies=allergies,
            bmr=profile.bmr,
            tdee=profile.tdee,
            target_calories=profile.target_calories,
            target_protein_g=profile.target_protein_g,
            target_carbs_g=profile.target_carbs_g,
            target_fat_g=profile.target_fat_g,
            target_water_ml=profile.target_water_ml,
            formula_explanation=calc["formula_explanation"],
            safety_warning=calc["safety_warning"],
            updated_at=profile.updated_at
        )

    def update_profile(self, data: GymProfileCreateUpdate, user_id: Optional[int] = None) -> GymProfileResponse:
        metrics = self.calculate_metrics(data)
        profile = None
        if user_id:
            profile = self.db.query(GymProfile).filter(GymProfile.user_id == user_id).first()
        else:
            profile = self.db.query(GymProfile).first()

        if not profile:
            profile = GymProfile(user_id=user_id)
            self.db.add(profile)

        profile.age = data.age
        profile.sex = data.sex
        profile.height_cm = data.height_cm
        profile.weight_kg = data.weight_kg
        profile.activity_level = data.activity_level
        profile.training_days_per_week = data.training_days_per_week
        profile.goal = data.goal
        profile.diet_type = data.diet_type
        profile.allergies = json.dumps(data.allergies)
        profile.bmr = metrics["bmr"]
        profile.tdee = metrics["tdee"]
        profile.target_calories = metrics["target_calories"]
        profile.target_protein_g = metrics["target_protein_g"]
        profile.target_carbs_g = metrics["target_carbs_g"]
        profile.target_fat_g = metrics["target_fat_g"]
        profile.target_water_ml = metrics["target_water_ml"]
        profile.updated_at = datetime.datetime.utcnow()

        self.db.commit()
        self.db.refresh(profile)

        return GymProfileResponse(
            id=profile.id,
            user_id=profile.user_id,
            age=profile.age,
            sex=profile.sex,
            height_cm=profile.height_cm,
            weight_kg=profile.weight_kg,
            activity_level=profile.activity_level,
            training_days_per_week=profile.training_days_per_week,
            goal=profile.goal,
            diet_type=profile.diet_type,
            allergies=data.allergies,
            bmr=profile.bmr,
            tdee=profile.tdee,
            target_calories=profile.target_calories,
            target_protein_g=profile.target_protein_g,
            target_carbs_g=profile.target_carbs_g,
            target_fat_g=profile.target_fat_g,
            target_water_ml=profile.target_water_ml,
            formula_explanation=metrics["formula_explanation"],
            safety_warning=metrics["safety_warning"],
            updated_at=profile.updated_at
        )

    # LOGGING
    def add_log(self, data: GymLogCreate, user_id: Optional[int] = None) -> GymLogResponse:
        log = GymLog(
            user_id=user_id,
            log_date=data.log_date,
            meal_type=data.meal_type,
            meal_name=data.meal_name.strip(),
            calories=data.calories,
            protein_g=data.protein_g,
            carbs_g=data.carbs_g,
            fat_g=data.fat_g,
            water_ml=data.water_ml
        )
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return GymLogResponse.model_validate(log)

    def delete_log(self, log_id: int, user_id: Optional[int] = None) -> bool:
        query = self.db.query(GymLog).filter(GymLog.id == log_id)
        if user_id:
            query = query.filter(GymLog.user_id == user_id)
        log = query.first()
        if not log:
            return False
        self.db.delete(log)
        self.db.commit()
        return True

    def get_daily_adherence(self, date_str: str, user_id: Optional[int] = None) -> DailyAdherenceResponse:
        profile = self.get_or_create_profile(user_id=user_id)

        query = self.db.query(GymLog).filter(GymLog.log_date == date_str)
        if user_id:
            query = query.filter((GymLog.user_id == user_id) | (GymLog.user_id.is_(None)))
        logs = query.all()

        act_cal = sum(l.calories for l in logs)
        act_prot = sum(l.protein_g for l in logs)
        act_carb = sum(l.carbs_g for l in logs)
        act_fat = sum(l.fat_g for l in logs)
        act_water = sum(l.water_ml for l in logs)

        cal_pct = round((act_cal / profile.target_calories * 100), 1) if profile.target_calories > 0 else 0.0
        prot_pct = round((act_prot / profile.target_protein_g * 100), 1) if profile.target_protein_g > 0 else 0.0
        water_pct = round((act_water / profile.target_water_ml * 100), 1) if profile.target_water_ml > 0 else 0.0

        return DailyAdherenceResponse(
            date=date_str,
            target_calories=profile.target_calories,
            actual_calories=round(act_cal, 1),
            target_protein=profile.target_protein_g,
            actual_protein=round(act_prot, 1),
            target_carbs=profile.target_carbs_g,
            actual_carbs=round(act_carb, 1),
            target_fat=profile.target_fat_g,
            actual_fat=round(act_fat, 1),
            target_water=profile.target_water_ml,
            actual_water=round(act_water, 0),
            calorie_adherence_pct=cal_pct,
            protein_adherence_pct=prot_pct,
            water_adherence_pct=water_pct,
            logs=[GymLogResponse.model_validate(l) for l in logs]
        )

    # PROGRESS
    def add_progress_entry(self, data: ProgressEntryCreate, user_id: Optional[int] = None) -> ProgressEntryResponse:
        entry = ProgressEntry(
            user_id=user_id,
            entry_date=data.entry_date,
            weight_kg=data.weight_kg,
            waist_cm=data.waist_cm,
            chest_cm=data.chest_cm,
            arms_cm=data.arms_cm,
            notes=data.notes
        )
        self.db.add(entry)
        self.db.commit()
        self.db.refresh(entry)
        return ProgressEntryResponse.model_validate(entry)

    def get_progress_history(self, user_id: Optional[int] = None, limit: int = 30) -> List[ProgressEntryResponse]:
        query = self.db.query(ProgressEntry)
        if user_id:
            query = query.filter((ProgressEntry.user_id == user_id) | (ProgressEntry.user_id.is_(None)))
        entries = query.order_by(asc(ProgressEntry.entry_date)).limit(limit).all()
        return [ProgressEntryResponse.model_validate(e) for e in entries]

    # HIGH-PROTEIN FOODS DIRECTORY
    def get_high_protein_foods(self, diet_type: Optional[str] = None, sort_by: str = "protein_per_100g", limit: int = 40) -> List[ProteinFoodItem]:
        conn = self.food_service._get_connection()
        cur = conn.cursor()

        sql = "SELECT id, name, category, serving_size, calories, protein, diet_tags FROM foods WHERE protein >= 8.0"
        cur.execute(sql)
        rows = cur.fetchall()

        items = []
        for r in rows:
            cal = float(r["calories"] or 1.0)
            prot = float(r["protein"] or 0.0)
            tags = []
            try:
                tags = json.loads(r["diet_tags"] or "[]")
            except Exception:
                tags = []

            if diet_type and diet_type.lower() != "all":
                if diet_type.lower() not in [t.lower() for t in tags]:
                    continue

            # Protein efficiency ratio: protein grams per 100 calories
            prot_per_cal = round((prot / cal) * 100.0, 2) if cal > 0 else 0.0

            items.append(ProteinFoodItem(
                id=str(r["id"]),
                name=r["name"],
                category=r["category"] or "High Protein",
                serving_size=r["serving_size"] or "100g",
                protein_per_100g=prot,
                calories_per_100g=cal,
                protein_per_calorie=prot_per_cal,
                diet_tags=tags
            ))

        if sort_by == "efficiency":
            items.sort(key=lambda x: x.protein_per_calorie, reverse=True)
        else:
            items.sort(key=lambda x: x.protein_per_100g, reverse=True)

        return items[:limit]

    # SEED DEMO GYM PROGRESS IF EMPTY
    def seed_demo_gym_data(self, user_id: Optional[int] = None):
        today = datetime.datetime.utcnow()
        # Seed progress weight
        if self.db.query(ProgressEntry).count() == 0:
            weights = [73.5, 73.0, 72.8, 72.2, 71.8, 71.5, 71.0]
            for i, w in enumerate(weights):
                date_val = (today - datetime.timedelta(days=(len(weights) - 1 - i) * 3)).strftime("%Y-%m-%d")
                self.db.add(ProgressEntry(
                    user_id=user_id,
                    entry_date=date_val,
                    weight_kg=w,
                    waist_cm=84.0 - (i * 0.4),
                    notes="Consistent training & high-protein diet"
                ))

        # Seed today's gym logs
        today_str = today.strftime("%Y-%m-%d")
        existing_logs = self.db.query(GymLog).filter(GymLog.log_date == today_str).count()
        if existing_logs == 0:
            sample_logs = [
                ("breakfast", "Rolled Oats with Whey Protein & Berries", 420.0, 32.0, 52.0, 8.0, 0.0),
                ("lunch", "Grilled Chicken Breast with Brown Rice & Broccoli", 550.0, 48.0, 55.0, 10.0, 0.0),
                ("water", "Morning Hydration (Filtered Water)", 0.0, 0.0, 0.0, 0.0, 1000.0),
                ("snack", "Greek Yogurt with Almonds", 210.0, 18.0, 12.0, 9.0, 0.0),
                ("water", "Midday Hydration", 0.0, 0.0, 0.0, 0.0, 750.0),
            ]
            for m_type, name, cal, prot, carb, fat, water in sample_logs:
                self.db.add(GymLog(
                    user_id=user_id,
                    log_date=today_str,
                    meal_type=m_type,
                    meal_name=name,
                    calories=cal,
                    protein_g=prot,
                    carbs_g=carb,
                    fat_g=fat,
                    water_ml=water
                ))
        self.db.commit()
