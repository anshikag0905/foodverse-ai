import pytest
import datetime
import json
from app.services.dashboard_service import DashboardService
from app.models.analysis import Analysis

def test_dashboard_summary(db_session):
    dash_service = DashboardService(db_session)
    summary = dash_service.get_summary()

    assert summary.stats is not None
    assert "total_scans" in summary.stats
    assert "today_scans" in summary.stats
    assert "active_pantry_items" in summary.stats

    # Nutrition trends: 7 days
    assert len(summary.nutrition_trends) == 7
    trend_point = summary.nutrition_trends[0]
    assert trend_point.calories > 0
    assert trend_point.protein > 0

def test_history_records(db_session):
    # 1. Insert an analysis record
    sample_analysis = Analysis(
        analysis_type="food_scan",
        item_name="Steamed Edamame",
        confidence=0.96,
        score=92.0,
        data_source="database",
        model_provider="mock",
        result_json=json.dumps({"calories": 120, "protein_g": 11, "carbs_g": 9, "fat_g": 5})
    )
    db_session.add(sample_analysis)
    db_session.commit()
    db_session.refresh(sample_analysis)

    # 2. Check query
    rec = db_session.query(Analysis).filter(Analysis.id == sample_analysis.id).first()
    assert rec is not None
    assert rec.item_name == "Steamed Edamame"
    assert rec.score == 92.0

    # 3. Clean up
    db_session.delete(rec)
    db_session.commit()
