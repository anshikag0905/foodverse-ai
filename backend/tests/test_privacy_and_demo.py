import pytest
from app.core.database import SessionLocal, Base, engine
from app.core.demo_seed import seed_demo_data_if_needed
from app.services.privacy_service import PrivacyService
from app.api.v1.privacy import get_privacy_notice
from app.api.v1.demo import get_demo_status
from app.models.user import User

def setup_module():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_demo_data_if_needed(db)

def test_demo_seeding_and_export():
    with SessionLocal() as db:
        user = db.query(User).first()
        assert user is not None
        assert "peanuts" in user.allergies

        # Test export
        export_data = PrivacyService.export_user_data(db=db, user_id=user.id)
        assert "user_profile" in export_data
        assert "pantry_items" in export_data
        assert len(export_data["pantry_items"]) > 0

def test_privacy_notice_and_demo_status():
    notice = get_privacy_notice()
    assert "Privacy Notice" in notice["title"]
    assert len(notice["user_rights"]) == 3

    with SessionLocal() as db:
        status_data = get_demo_status(db=db)
        assert status_data["demo_mode"] is True
        assert status_data["pre_seeded_records"]["facts"] >= 50
        assert len(status_data["sample_assets"]) >= 5
