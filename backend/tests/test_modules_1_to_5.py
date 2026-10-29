import pytest
from app.core.database import SessionLocal, Base, engine
from app.core.demo_seed import seed_demo_data_if_needed
from app.models.user import User
from app.services.recognition_service import RecognitionService
from app.services.freshness_service import FreshnessService
from app.services.hygiene_service import HygieneService
from app.services.cooking_service import CookingService
from app.services.meal_plan_service import MealPlanService
from tests.conftest import run_sync

@pytest.fixture(scope="module")
def setup_db():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_demo_data_if_needed(db)
        user = db.query(User).first()
        yield user.id

# Module 1: Food Recognition & Allergen Checks
def test_module_1_food_recognition(setup_db):
    user_id = setup_db
    rec = RecognitionService()

    with SessionLocal() as db:
        # 1. Analyze paneer tikka query
        res = run_sync(rec.analyze_food(db=db, user_id=user_id, query="paneer tikka"))
        assert "Paneer" in res["name"]
        assert res["health_score"] > 50
        assert "dairy" in res["allergens"]
        assert res["data_source"] == "database" # Successfully enriched from SQLite FTS5 database

        # 2. Food correction
        corr_res = rec.save_correction(db=db, user_id=user_id, original_name="paneer tikka", corrected_name="Paneer Tikka Masala")
        assert corr_res["status"] == "success"

# Module 2: Food Freshness & Spoilage Classification
def test_module_2_freshness_classification(setup_db):
    user_id = setup_db
    service = FreshnessService()

    with SessionLocal() as db:
        # Moldy bread test
        res = run_sync(service.analyze_freshness(db=db, user_id=user_id, food_hint="bread_moldy.jpg"))
        assert res["status"] == "spoiled"
        assert res["freshness_score"] < 40
        assert len(res["visual_indicators"]) > 0
        assert "Discard" in res["consumption_verdict"]

        # Fresh apple test
        apple_res = run_sync(service.analyze_freshness(db=db, user_id=user_id, food_hint="apple_fresh.jpg"))
        assert apple_res["status"] == "fresh"
        assert apple_res["freshness_score"] >= 85

# Module 3: Restaurant Hygiene & Safety Monitoring
def test_module_3_hygiene_video_processing(setup_db):
    user_id = setup_db
    service = HygieneService()

    with SessionLocal() as db:
        mock_video_bytes = b"sample_video_bytes_for_testing"
        job_id = run_sync(service.initiate_video_analysis(
            db=db,
            user_id=user_id,
            video_bytes=mock_video_bytes,
            filename="kitchen_prep.mp4"
        ))
        assert job_id.startswith("job_")

        # Poll status
        status_data = service.get_job_status(db=db, job_id=job_id)
        assert status_data["status"] == "completed"
        assert status_data["overall_score"] > 80
        assert len(status_data["flagged_incidents"]) > 0

        # Download report payload
        report_data = service.generate_downloadable_report(db=db, report_id=status_data["id"])
        assert report_data is not None
        assert report_data["job_id"] == job_id

# Module 4: Smart Cooking Assistant
def test_module_4_cooking_assistant(setup_db):
    user_id = setup_db
    service = CookingService()

    with SessionLocal() as db:
        chat_res = run_sync(service.handle_chat(
            db=db,
            user_id=user_id,
            query="What can I cook with tomatoes and oats?",
            use_pantry=True
        ))
        assert chat_res["suggested_recipe_title"] is not None
        assert len(chat_res["instructions"]) > 0
        assert chat_res["timer_minutes"] is not None
        assert len(chat_res["messages"]) >= 2

# Module 5: Personalized Meal Planning & Safety Floor
def test_module_5_meal_planner(setup_db):
    user_id = setup_db
    service = MealPlanService()

    with SessionLocal() as db:
        # Generate plan
        plan = run_sync(service.generate_plan(
            db=db,
            user_id=user_id,
            plan_type="daily",
            target_calories=2100.0
        ))
        assert plan["target_calories"] >= 1200.0 # Floor enforced
        assert len(plan["days"][0]["meals"]) == 4 # Breakfast, Lunch, Dinner, Snack
        assert "peanuts" in plan["allergen_exclusions_applied"]

        # Swap a meal
        swap_res = service.swap_single_meal(
            db=db,
            user_id=user_id,
            plan_id=plan["id"],
            day_index=0,
            meal_index=1
        )
        assert swap_res["status"] == "success"
        assert swap_res["updated_meal"]["dish_name"] != ""
