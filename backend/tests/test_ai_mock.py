import pytest
from app.ai.mock_provider import MockAIProvider
from tests.conftest import run_sync

def test_mock_food_recognition():
    provider = MockAIProvider()

    # Apple test
    apple_res = run_sync(provider.analyze_food(query="apple"))
    assert "Apple" in apple_res.name
    assert apple_res.macros.calories > 50
    assert apple_res.health_score >= 80

    # Paneer Tikka test (Allergen check)
    paneer_res = run_sync(provider.analyze_food(query="paneer tikka"))
    assert "Paneer" in paneer_res.name
    assert "dairy" in paneer_res.allergens
    assert paneer_res.macros.protein >= 15.0

def test_mock_freshness_classification():
    provider = MockAIProvider()

    # Moldy bread should be spoiled
    mold_res = run_sync(provider.analyze_freshness(food_hint="bread_moldy.jpg"))
    assert mold_res.status == "spoiled"
    assert mold_res.freshness_score < 40

    # Fresh apple should be fresh
    fresh_res = run_sync(provider.analyze_freshness(food_hint="apple_fresh.jpg"))
    assert fresh_res.status == "fresh"
    assert fresh_res.freshness_score >= 85

def test_mock_cooking_and_meal_plan():
    provider = MockAIProvider()

    # Cooking chat with expiring pantry
    cooking_res = run_sync(provider.chat_cooking(
        query="What can I make for lunch?",
        history=[],
        pantry_items=[{"name": "Ripe Tomatoes", "status": "use_soon"}]
    ))
    assert len(cooking_res.ingredients) > 0
    assert cooking_res.timer_minutes is not None

    # Meal plan generation
    plan_res = run_sync(provider.generate_meal_plan(
        user_profile={"diet_type": "vegetarian", "allergies": ["peanuts"]},
        target_calories=2000.0,
        target_macros={"protein": 120.0, "carbs": 220.0, "fat": 60.0}
    ))
    assert plan_res.target_calories >= 1200.0
    assert len(plan_res.days) > 0
    assert "peanuts" in plan_res.allergen_exclusions_applied
