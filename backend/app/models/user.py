import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Dietary & Allergy Preferences (JSON-encoded text)
    allergies = Column(Text, default="[]")  # e.g. ["peanuts", "dairy", "gluten"]
    diet_type = Column(String(50), default="omnivore")  # "veg", "vegan", "halal", "jain", "gluten_free", "omnivore"
    age = Column(Integer, nullable=True)
    weight_kg = Column(Float, nullable=True)
    height_cm = Column(Float, nullable=True)
    goal = Column(String(50), default="maintain")  # "cut", "bulk", "maintain", "recomp"
    language = Column(String(10), default="en")
    theme = Column(String(10), default="system")
