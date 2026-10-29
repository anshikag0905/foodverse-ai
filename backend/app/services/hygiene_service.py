import json
import uuid
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.ai.factory import get_ai_provider
from app.storage.local_storage import get_storage
from app.models.hygiene import HygieneReport
from app.core.config import settings

class HygieneService:
    def __init__(self):
        self.ai = get_ai_provider()
        self.storage = get_storage()

    async def initiate_video_analysis(
        self,
        db: Session,
        user_id: int,
        video_bytes: bytes,
        filename: str,
        lang: str = "en"
    ) -> str:
        job_id = f"job_{uuid.uuid4().hex[:12]}"
        relative_path = await self.storage.save_file(video_bytes, filename, subfolder="videos")

        report_entry = HygieneReport(
            user_id=user_id,
            job_id=job_id,
            video_path=relative_path,
            status="processing"
        )
        db.add(report_entry)
        db.commit()

        # Execute analysis logic
        # In real or mock provider, process video keyframes
        ai_res = await self.ai.analyze_kitchen_video(video_path=relative_path, job_id=job_id, lang=lang)

        report_payload = {
            "job_id": job_id,
            "overall_score": ai_res.overall_score,
            "compliance_status": ai_res.compliance_status,
            "indicators": ai_res.indicators,
            "flagged_incidents": [inc.model_dump() for inc in ai_res.flagged_incidents],
            "summary_report": ai_res.summary_report,
            "recommendations": ai_res.recommendations,
            "video_url": f"/static/uploads/{relative_path}",
            "disclaimer": ai_res.disclaimer
        }

        report_entry.status = "completed"
        report_entry.overall_score = float(ai_res.overall_score)
        report_entry.compliance_status = ai_res.compliance_status
        report_entry.report_json = json.dumps(report_payload)
        db.commit()

        return job_id

    def get_job_status(self, db: Session, job_id: str) -> Optional[Dict[str, Any]]:
        report = db.query(HygieneReport).filter(HygieneReport.job_id == job_id).first()
        if not report:
            return None

        if report.status == "completed" and report.report_json:
            data = json.loads(report.report_json)
            data["id"] = report.id
            data["status"] = "completed"
            data["created_at"] = str(report.created_at)
            return data

        return {
            "job_id": job_id,
            "status": report.status,
            "overall_score": None
        }

    def generate_downloadable_report(self, db: Session, report_id: int) -> Optional[Dict[str, Any]]:
        report = db.query(HygieneReport).filter(HygieneReport.id == report_id).first()
        if not report or not report.report_json:
            return None
        return json.loads(report.report_json)
