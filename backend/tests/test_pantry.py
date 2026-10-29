import pytest
import datetime
from app.services.pantry_service import PantryService
from app.schemas.pantry import PantryItemCreate, PantryItemUpdate, GroceryItemCreate, GroceryItemUpdate
from tests.conftest import run_sync

def test_pantry_crud_and_status(db_session):
    service = PantryService(db_session)
    now = datetime.datetime.utcnow()
    test_user_id = int(datetime.datetime.utcnow().timestamp() * 1000) % 1000000 + 200

    # 1. Create fresh item (shelf life 10 days)
    item_create = PantryItemCreate(
        name="Test Fresh Apples",
        category="Produce",
        quantity=5.0,
        unit="pcs",
        storage_location="fridge",
        days_shelf_life=10
    )
    item = service.create_item(item_create, user_id=test_user_id)
    assert item.name == "Test Fresh Apples"
    assert item.status == "fresh"
    assert item.days_remaining >= 9

    # 2. Create item expiring soon (shelf life 2 days)
    urgent_create = PantryItemCreate(
        name="Test Organic Milk",
        category="Dairy",
        quantity=1.0,
        unit="liter",
        storage_location="fridge",
        days_shelf_life=2
    )
    urgent_item = service.create_item(urgent_create, user_id=test_user_id)
    assert urgent_item.status == "use_soon"

    # 3. Create expired item (expiry in the past)
    expired_create = PantryItemCreate(
        name="Test Old Bread",
        category="Bakery",
        quantity=1.0,
        unit="loaf",
        storage_location="shelf",
        expiry_date=now - datetime.timedelta(days=1)
    )
    expired_item = service.create_item(expired_create, user_id=test_user_id)
    assert expired_item.status == "expired"

    # 4. Expiring items query
    expiring = service.get_expiring_items(user_id=test_user_id)
    assert len(expiring) >= 2
    assert any(it.name == "Test Old Bread" for it in expiring)

    # 5. Mark as used
    used = service.mark_used(urgent_item.id, user_id=test_user_id)
    assert used.used_this_month is True
    assert used.status == "used"

    # 6. Mark as wasted
    wasted = service.mark_wasted(expired_item.id, user_id=test_user_id)
    assert wasted.wasted is True
    assert wasted.status == "wasted"

    # 7. Waste summary
    summary = service.get_waste_summary(user_id=test_user_id)
    assert summary.used_count >= 1
    assert summary.wasted_count >= 1
    assert summary.waste_percentage > 0

    # 8. Delete
    deleted = service.delete_item(item.id, user_id=test_user_id)
    assert deleted is True
    assert service.get_item(item.id, user_id=test_user_id) is None

def test_pantry_recipe_suggestions(db_session):
    service = PantryService(db_session)
    # Seed demo pantry
    service.seed_demo_pantry()
    items = service.list_items()
    assert len(items) >= 5

    res = run_sync(service.suggest_recipes_from_expiring())
    assert "recipes" in res
    assert len(res["recipes"]) > 0
    recipe = res["recipes"][0]
    assert "title" in recipe
    assert "pantry_ingredients_used" in recipe
    assert "missing_ingredients" in recipe

def test_grocery_workflow(db_session):
    service = PantryService(db_session)
    user_id = int(datetime.datetime.utcnow().timestamp() * 1000) % 1000000 + 100

    # 1. Create grocery item
    g_create = GroceryItemCreate(name="Almond Milk", quantity=2.0, unit="cartons", category="Dairy")
    g_item = service.create_grocery(g_create, user_id=user_id)
    assert g_item.name == "Almond Milk"
    assert g_item.checked is False

    # 2. Add missing ingredients from recipe
    missing = service.add_missing_ingredients(["Olive Oil", "Coriander", "Almond Milk"], user_id=user_id) # Almond Milk already there
    # Only Olive Oil and Coriander should be newly added
    assert len(missing) == 2

    # 3. Mark checked
    service.update_grocery(g_item.id, GroceryItemUpdate(checked=True), user_id=user_id)
    groceries = service.list_groceries(user_id=user_id)
    checked_items = [it for it in groceries if it.checked]
    assert len(checked_items) >= 1

    # 4. Clear checked
    cleared = service.clear_checked_groceries(user_id=user_id)
    assert cleared >= 1
