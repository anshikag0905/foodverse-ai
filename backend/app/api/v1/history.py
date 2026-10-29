import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.models.analysis import Analysis
from app.models.hygiene import HygieneReport
from app.schemas.dashboard import AnalysisItemResponse

router = APIRouter(prefix="/history", tags=["History & Scan Archive"])

@router.get("", response_model=List[AnalysisItemResponse])
def get_analysis_history(
    analysis_type: Optional[str] = Query(None, description="food_scan, freshness, barcode, or all"),
    user_id: Optional[int] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(Analysis)
    if user_id:
        query = query.filter((Analysis.user_id == user_id) | (Analysis.user_id.is_(None)))
    if analysis_type and analysis_type.lower() != "all":
        query = query.filter(Analysis.analysis_type == analysis_type.lower())

    analyses = query.order_by(desc(Analysis.created_at)).limit(limit).offset(offset).all()
    results = []
    for a in analyses:
        try:
            data = json.loads(a.result_json)
        except Exception:
            data = {}
        results.append(AnalysisItemResponse(
            id=a.id,
            user_id=a.user_id,
            analysis_type=a.analysis_type,
            input_path=a.input_path,
            item_name=a.item_name,
            confidence=a.confidence,
            score=a.score,
            data_source=a.data_source,
            model_provider=a.model_provider,
            result_data=data,
            created_at=a.created_at
        ))
    return results

@router.get("/{analysis_id}", response_model=AnalysisItemResponse)
def get_analysis_detail(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    a = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Analysis record not found")
    try:
        data = json.loads(a.result_json)
    except Exception:
        data = {}
    return AnalysisItemResponse(
        id=a.id,
        user_id=a.user_id,
        analysis_type=a.analysis_type,
        input_path=a.input_path,
        item_name=a.item_name,
        confidence=a.confidence,
        score=a.score,
        data_source=a.data_source,
        model_provider=a.model_provider,
        result_data=data,
        created_at=a.created_at
    )

@router.delete("/{analysis_id}")
def delete_analysis_record(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    a = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Analysis record not found")
    db.delete(a)
    db.commit()
    return {"status": "success", "message": "Record deleted"}
