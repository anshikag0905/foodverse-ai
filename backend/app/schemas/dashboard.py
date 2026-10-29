from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
import datetime

class DashboardAlert(BaseModel):
    id: str
    severity: str # "warning", "danger", "info", "success"
    title: str
    message: str
    link: Optional[str] = None
    created_at: str

class NutritionTrendPoint(BaseModel):
    date: str
    calories: float
    protein: float
    carbs: float
    fat: float

class AnalysisItemResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    analysis_type: str
    input_path: Optional[str] = None
    item_name: Optional[str] = None
    confidence: float
    score: Optional[float] = None
    data_source: str
    model_provider: str
    result_data: Dict[str, Any]
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

class DashboardSummaryResponse(BaseModel):
    stats: Dict[str, Any]
    alerts: List[DashboardAlert]
    expiring_items: List[Dict[str, Any]]
    recent_analyses: List[AnalysisItemResponse]
    nutrition_trends: List[NutritionTrendPoint]
    featured_fact: Optional[Dict[str, Any]] = None
