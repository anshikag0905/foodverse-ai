from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.dashboard import DashboardSummaryResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard Aggregator"])

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = DashboardService(db)
    return service.get_summary(user_id=user_id)
