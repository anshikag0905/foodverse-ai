import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from app.core.database import Base

class CookingSession(Base):
    __tablename__ = "cooking_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    session_title = Column(String(255), default="Cooking Chat")
    messages_json = Column(Text, default="[]") # [{sender, text, timestamp, timerMinutes}]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
