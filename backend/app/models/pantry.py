import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from app.core.database import Base

class PantryItem(Base):
    __tablename__ = "pantry_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    food_id = Column(String(100), nullable=True) # Linked food database ID
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(100), default="General")
    quantity = Column(Float, default=1.0)
    unit = Column(String(50), default="pcs")
    purchase_date = Column(DateTime, default=datetime.datetime.utcnow)
    expiry_date = Column(DateTime, nullable=False, index=True)
    storage_location = Column(String(50), default="fridge") # "fridge", "freezer", "shelf"
    status = Column(String(50), default="fresh") # "fresh", "use_soon", "expired"
    used_this_month = Column(Boolean, default=False)
    wasted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class GroceryItem(Base):
    __tablename__ = "grocery_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    name = Column(String(255), nullable=False)
    quantity = Column(Float, default=1.0)
    unit = Column(String(50), default="pcs")
    category = Column(String(100), default="Pantry Missing")
    checked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
