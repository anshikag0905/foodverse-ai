import pytest
import datetime
from app.services.fact_service import FactService
from app.services.gym_service import GymService
from app.schemas.gym import GymProfileCreateUpdate, GymLogCreate, ProgressEntryCreate

def test_fact_service(db_session):
    fact_service = FactService(db_session)
    user_id = int(datetime.datetime.utcnow().timestamp() * 1000) % 1000000 + 300

    # 1. Random fact
    random_fact = fact_service.get_random_fact(user_id=user_id)
    assert random_fact is not None
    assert len(random_fact.fact) > 10
    assert random_fact.is_favorite is False

    # 2. Toggle favorite
    toggle1 = fact_service.toggle_favorite(fact_id=random_fact.id, user_id=user_id)
    assert toggle1["success"] is True
    assert toggle1["is_favorite"] is True

    # 3. Check listed with favorites_only
    favs = fact_service.list_facts(user_id=user_id, favorites_only=True)
    assert len(favs) == 1
    assert favs[0].id == random_fact.id
    assert favs[0].is_favorite is True

    # 4. Untoggle favorite
    toggle2 = fact_service.toggle_favorite(fact_id=random_fact.id, user_id=user_id)
    assert toggle2["is_favorite"] is False

    # 5. List categories
    cats = fact_service.get_categories()
    assert len(cats) >= 3

def test_gym_metrics_and_safety_floor(db_session):
    gym_service = GymService(db_session)

    # 1. Standard calculation (Male, 75kg, 180cm, 25yo, moderate)
    male_data = GymProfileCreateUpdate(
        age=25,
        sex="male",
        height_cm=180.0,
        weight_kg=75.0,
        activity_level="moderate",
        goal="maintain"
    )
    m_calc = gym_service.calculate_metrics(male_data)
    # BMR: 10*75 + 6.25*180 - 5*25 + 5 = 750 + 1125 - 125 + 5 = 1755
    assert m_calc["bmr"] == 1755.0
    # TDEE: 1755 * 1.55 = 2720.25 -> 2720.2
    assert m_calc["tdee"] > 2700.0
    assert m_calc["target_protein_g"] == 150.0 # 75 * 2
    assert m_calc["safety_warning"] is None

    # 2. Female severe cut triggering safety floor (Female, 45kg, 150cm, 35yo, sedentary, cut)
    female_data = GymProfileCreateUpdate(
        age=35,
        sex="female",
        height_cm=150.0,
        weight_kg=45.0,
        activity_level="sedentary",
        goal="cut"
    )
    f_calc = gym_service.calculate_metrics(female_data)
    # BMR: 10*45 + 6.25*150 - 5*35 - 161 = 450 + 937.5 - 175 - 161 = 1051.5
    # TDEE: 1051.5 * 1.2 = 1261.8
    # Cut -500 = 761.8 -> clamped to min floor 1200!
    assert f_calc["target_calories"] == 1200.0
    assert f_calc["safety_warning"] is not None
    assert "Calorie safety floor activated" in f_calc["safety_warning"]

def test_gym_profile_and_daily_adherence(db_session):
    gym_service = GymService(db_session)
    user_id = int(datetime.datetime.utcnow().timestamp() * 1000) % 1000000 + 400
    today_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")

    # 1. Update Profile
    update_data = GymProfileCreateUpdate(
        age=28,
        sex="male",
        height_cm=175.0,
        weight_kg=70.0,
        activity_level="active",
        goal="bulk"
    )
    profile = gym_service.update_profile(update_data, user_id=user_id)
    assert profile.goal == "bulk"
    assert profile.target_protein_g == 140.0

    # 2. Add food and water logs
    log1 = gym_service.add_log(GymLogCreate(
        log_date=today_str,
        meal_type="lunch",
        meal_name="Grilled Salmon & Quinoa",
        calories=600.0,
        protein_g=45.0,
        carbs_g=50.0,
        fat_g=20.0,
        water_ml=0.0
    ), user_id=user_id)
    assert log1.id is not None

    log2 = gym_service.add_log(GymLogCreate(
        log_date=today_str,
        meal_type="water",
        meal_name="Electrolyte Water Bottle",
        calories=0.0,
        protein_g=0.0,
        carbs_g=0.0,
        fat_g=0.0,
        water_ml=750.0
    ), user_id=user_id)

    # 3. Adherence Check
    adh = gym_service.get_daily_adherence(today_str, user_id=user_id)
    assert adh.actual_calories >= 600.0
    assert adh.actual_protein >= 45.0
    assert adh.actual_water >= 750.0
    assert len(adh.logs) >= 2

    # 4. Progress Entry
    prog = gym_service.add_progress_entry(ProgressEntryCreate(
        entry_date=today_str,
        weight_kg=70.2,
        waist_cm=80.5,
        notes="Week 1 weigh-in"
    ), user_id=user_id)
    assert prog.weight_kg == 70.2

    history = gym_service.get_progress_history(user_id=user_id)
    assert len(history) >= 1

    # 5. Clean up log
    deleted = gym_service.delete_log(log1.id, user_id=user_id)
    assert deleted is True

def test_high_protein_foods_query(db_session):
    gym_service = GymService(db_session)
    foods = gym_service.get_high_protein_foods(limit=10)
    assert len(foods) > 0
    # Top item should have substantial protein
    assert foods[0].protein_per_100g >= 8.0
    assert foods[0].protein_per_calorie > 0
