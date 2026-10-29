import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from app.core.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    analysis_type = Column(String(50), nullable=False, index=True) # "food_scan", "freshness", "barcode"
    input_path = Column(String(500), nullable=True) # Image or barcode or voice path
    item_name = Column(String(255), nullable=True, index=True)
    confidence = Column(Float, default=1.0)
    score = Column(Float, nullable=True) # Health score or freshness score
    data_source = Column(String(50), default="database") # "database" vs "ai_estimate"
    model_provider = Column(String(50), default="mock")
    result_json = Column(Text, nullable=False) # Full structured result (macros, cues, etc.)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

class FoodCorrection(Base):
    __tablename__ = "food_corrections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    original_name = Column(String(255), nullable=False)
    corrected_name = Column(String(255), nullable=False)
    input_path = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
