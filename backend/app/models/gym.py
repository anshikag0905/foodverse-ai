import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from app.core.database import Base

class GymProfile(Base):
    __tablename__ = "gym_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True)
    age = Column(Integer, default=25)
    sex = Column(String(10), default="male") # "male", "female"
    height_cm = Column(Float, default=175.0)
    weight_kg = Column(Float, default=70.0)
    activity_level = Column(String(50), default="moderate") # "sedentary", "light", "moderate", "active", "very_active"
    training_days_per_week = Column(Integer, default=4)
    goal = Column(String(50), default="maintain") # "cut", "bulk", "maintain", "recomp"
    diet_type = Column(String(50), default="omnivore")
    allergies = Column(Text, default="[]")
    
    # Calculated / Configured Metrics
    bmr = Column(Float, default=1650.0)
    tdee = Column(Float, default=2300.0)
    target_calories = Column(Float, default=2300.0)
    target_protein_g = Column(Float, default=140.0)
    target_carbs_g = Column(Float, default=260.0)
    target_fat_g = Column(Float, default=75.0)
    target_water_ml = Column(Float, default=3000.0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class GymLog(Base):
    __tablename__ = "gym_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    log_date = Column(String(20), nullable=False, index=True) # "YYYY-MM-DD"
    meal_type = Column(String(50), default="lunch") # "breakfast", "lunch", "dinner", "snack", "pre_workout", "post_workout"
    meal_name = Column(String(255), nullable=False)
    calories = Column(Float, default=0.0)
    protein_g = Column(Float, default=0.0)
    carbs_g = Column(Float, default=0.0)
    fat_g = Column(Float, default=0.0)
    water_ml = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ProgressEntry(Base):
    __tablename__ = "progress_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    entry_date = Column(String(20), nullable=False, index=True) # "YYYY-MM-DD"
    weight_kg = Column(Float, nullable=False)
    waist_cm = Column(Float, nullable=True)
    chest_cm = Column(Float, nullable=True)
    arms_cm = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
