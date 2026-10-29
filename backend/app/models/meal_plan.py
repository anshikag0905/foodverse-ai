import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from app.core.database import Base

class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    plan_type = Column(String(50), default="daily") # "daily" or "weekly"
    title = Column(String(255), default="Personalized Plan")
    target_calories = Column(Float, nullable=False)
    target_macros_json = Column(Text, nullable=False) # e.g. {"protein": 120, "carbs": 200, "fat": 60}
    meals_json = Column(Text, nullable=False) # Daily or weekly meal objects
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
