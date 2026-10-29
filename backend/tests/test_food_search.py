import pytest
from app.services.food_service import FoodService

@pytest.fixture(scope="module")
def food_service():
    return FoodService()

def test_30_sample_search_queries(food_service):
    sample_queries = [
        # Indian Staples & Regional Dishes
        ("paneer", "Paneer"),
        ("dosa", "Dosa"),
        ("dal", "Dal"),
        ("palak", "Palak"),
        ("biryani", "Biryani"),
        ("rajma", "Rajma"),
        ("chole", "Chole"),
        ("idli", "Idli"),
        ("khichdi", "Khichdi"),
        ("roti", "Roti"),
        ("poha", "Poha"),
        ("gulab jamun", "Gulab Jamun"),

        # USDA Fruits, Vegetables, Grains & Meats
        ("apple", "Apple"),
        ("banana", "Banana"),
        ("spinach", "Spinach"),
        ("broccoli", "Broccoli"),
        ("avocado", "Avocado"),
        ("chicken", "Chicken"),
        ("salmon", "Salmon"),
        ("oats", "Oats"),
        ("yogurt", "Yogurt"),
        ("almonds", "Almond"),

        # Global Regional Foods (Middle Eastern, East Asian, Latin, Mediterranean)
        ("hummus", "Hummus"),
        ("falafel", "Falafel"),
        ("kimchi", "Kimchi"),
        ("tofu", "Tofu"),
        ("guacamole", "Guacamole"),
        ("pizza", "Pizza"),
        ("shakshuka", "Shakshuka"),

        # Hindi Alias / Prefix Search
        ("सेब", "Apple"),
    ]

    for query, expected_keyword in sample_queries:
        res = food_service.search_foods(query=query, limit=5)
        assert len(res["items"]) > 0, f"Query '{query}' yielded zero results!"
        # Check that top result or aliases contains expected keyword
        found = any(expected_keyword.lower() in (item["name"].lower() + item.get("aliases", "").lower() + (item.get("name_hi") or "").lower()) for item in res["items"])
        assert found, f"Query '{query}' did not match expected keyword '{expected_keyword}' in results: {[i['name'] for i in res['items']]}"

def test_barcode_lookup(food_service):
    # Test Paneer Tikka barcode
    item = food_service.get_food_by_barcode("8901030383748")
    assert item is not None
    assert "Paneer" in item["name"]
    assert "dairy" in item["allergens"]

    # Test Coca-Cola barcode
    coke = food_service.get_food_by_barcode("5449000000996")
    assert coke is not None
    assert "Coca-Cola" in coke["name"]

def test_custom_food_registration(food_service):
    custom_data = {
        "name": "Superfood Chia Pudding",
        "name_hi": "चिया पुडिंग",
        "category": "Dessert",
        "cuisine": "Healthy Fusion",
        "calories": 210.0,
        "protein": 7.0,
        "carbs": 18.0,
        "fat": 12.0,
        "fiber": 8.0,
        "allergens": ["dairy"],
        "diet_tags": ["Vegetarian", "Gluten-Free"]
    }
    created = food_service.add_custom_food(custom_data)
    assert created["id"] is not None
    assert created["name"] == "Superfood Chia Pudding"

    # Verify searchable via FTS5
    search_res = food_service.search_foods(query="Chia Pudding")
    assert any(i["name"] == "Superfood Chia Pudding" for i in search_res["items"])
