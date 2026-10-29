from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.hygiene_service import HygieneService
from app.api.v1.privacy import get_current_user_id

router = APIRouter(prefix="/hygiene", tags=["Restaurant Kitchen Hygiene & Safety Monitoring"])
hygiene_service = HygieneService()

@router.post("/analyze-photo")
async def analyze_kitchen_photo(
    photo: UploadFile = File(...),
    lang: str = Form("en"),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Audits a commercial or home kitchen/prep area photo for cleanliness, cross-contamination, and food safety."""
    photo_bytes = await photo.read()
    result = await hygiene_service.analyze_kitchen_photo(
        db=db,
        user_id=user_id,
        photo_bytes=photo_bytes,
        filename=photo.filename,
        lang=lang
    )
    return result

@router.post("/analyze-video")
async def analyze_kitchen_video(
    video: UploadFile = File(...),
    lang: str = Form("en"),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Ingests commercial kitchen video and starts background inspection sampling frames."""
    video_bytes = await video.read()
    job_id = await hygiene_service.initiate_video_analysis(
        db=db,
        user_id=user_id,
        video_bytes=video_bytes,
        filename=video.filename,
        lang=lang
    )
    return {"job_id": job_id, "status": "processing", "message": "Kitchen video queued for frame analysis."}

@router.get("/job/{job_id}")
def get_job_status(
    job_id: str,
    db: Session = Depends(get_db)
):
    """Polled by frontend until background video frame processing reaches 'completed'."""
    data = hygiene_service.get_job_status(db=db, job_id=job_id)
    if not data:
        raise HTTPException(status_code=404, detail="Job ID not found.")
    return data

@router.get("/report/{report_id}/download")
def download_hygiene_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    """Generates official compliance report JSON/PDF payload for municipal or internal review."""
    report = hygiene_service.generate_downloadable_report(db=db, report_id=report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    return JSONResponse(
        content=report,
        headers={"Content-Disposition": f"attachment; filename=Hygiene_Report_{report_id}.json"}
    )
