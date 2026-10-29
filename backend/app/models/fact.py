import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from app.core.database import Base

class Fact(Base):
    __tablename__ = "facts"

    id = Column(Integer, primary_key=True, index=True)
    fact = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, index=True) # "Nutrition", "Freshness & Storage", "Food Safety", "Cooking Science", "Culture & History", "Fitness"
    related_food_id = Column(String(100), nullable=True, index=True)
    source_name = Column(String(255), nullable=False)
    verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class FactFavorite(Base):
    __tablename__ = "fact_favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    fact_id = Column(Integer, ForeignKey("facts.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
