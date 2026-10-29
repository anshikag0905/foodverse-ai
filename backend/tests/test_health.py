from app.main import read_root, health_check

def test_read_root():
    data = read_root()
    assert data["app"] == "FoodVerse AI"
    assert data["status"] == "online"
    assert "demo_mode" in data

def test_health_check():
    data = health_check()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert "ai_provider" in data
