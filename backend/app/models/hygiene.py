import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from app.core.database import Base

class HygieneReport(Base):
    __tablename__ = "hygiene_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    job_id = Column(String(100), unique=True, index=True, nullable=False)
    file_hash = Column(String(64), index=True, nullable=True) # SHA-256 for exact video caching
    filename = Column(String(255), nullable=True)
    video_path = Column(String(500), nullable=True)
    status = Column(String(50), default="processing") # "processing", "extracting_frames", "analyzing", "completed", "failed", "requires_api_key"
    progress_pct = Column(Integer, default=0)
    progress_message = Column(String(255), nullable=True)
    duration_sec = Column(Float, nullable=True)
    frames_analyzed = Column(Integer, default=0)
    overall_score = Column(Float, nullable=True) # 0-100
    compliance_status = Column(String(50), default="pass") # "pass", "warning", "fail"
    report_json = Column(Text, nullable=True) # Metrics, pass/fail indicators, flagged moments
    flagged_thumbnails_json = Column(Text, nullable=True) # Saved thumbnail paths
    video_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
