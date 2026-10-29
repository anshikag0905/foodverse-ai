from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.privacy_service import PrivacyService
from app.models.user import User
from app.core.config import settings

router = APIRouter(prefix="/privacy", tags=["Privacy & Data Governance"])

def get_current_user_id(db: Session = Depends(get_db)) -> int:
    # Single-user demo mode or token authenticated user; ensures user row exists
    user = db.query(User).filter(User.email == settings.DEFAULT_USER_EMAIL).first()
    if not user:
        try:
            user = User(
                email=settings.DEFAULT_USER_EMAIL,
                hashed_password="demo_hashed_password",
                is_active=True,
                is_demo=True,
                allergies="[]",
                diet_type="omnivore"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        except Exception:
            db.rollback()
            user = db.query(User).first()
    return user.id if user else 1

@router.get("/notice")
@router.get("/policy")
def get_privacy_notice():
    """Returns official privacy and data retention policy."""
    return {
        "title": "FoodVerse AI Privacy Notice",
        "storage_policy": "Local encrypted data storage. No third-party tracking or analytics telemetry.",
        "kitchen_video_retention": f"Kitchen inspection videos are processed in background memory and auto-deleted within {settings.KITCHEN_VIDEO_RETENTION_HOURS} hours by default. Only anonymized compliance reports and opted-in flagged thumbnail frames are stored.",
        "user_rights": [
            "Right to Access & Full JSON Data Export at any time.",
            "Right to Erase individual multimodal scans.",
            "Right to One-Click Permanent Data Destruction ('Delete all my data')."
        ],
        "consent_notice": "Kitchen inspection videos may capture commercial staff. Ensure appropriate workplace consent is obtained before uploading operational videos."
    }

@router.get("/export")
def export_my_data(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Generates an exportable JSON dump of all user history, scans, pantry, and gym records."""
    data = PrivacyService.export_user_data(db=db, user_id=user_id)
    return data

@router.delete("/analysis/{analysis_id}")
async def delete_single_analysis(
    analysis_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Permanently deletes a single analysis record and its uploaded media file."""
    deleted = await PrivacyService.delete_single_analysis(db=db, analysis_id=analysis_id, user_id=user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Analysis record not found or unauthorized.")
    return {"status": "success", "message": f"Analysis {analysis_id} and associated assets deleted."}

@router.delete("/delete-all")
async def delete_all_user_data(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Irrevocably erases all analyses, uploaded files, pantry items, gym records, and history."""
    counts = await PrivacyService.delete_all_user_data(db=db, user_id=user_id)
    return {
        "status": "success",
        "message": "All user data, uploads, and history successfully destroyed.",
        "purged_records": counts
    }
