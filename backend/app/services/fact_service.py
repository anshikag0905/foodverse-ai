from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.fact import Fact, FactFavorite
from app.schemas.facts import FactResponse

class FactService:
    def __init__(self, db: Session):
        self.db = db

    def _enrich_is_favorite(self, fact: Fact, user_id: Optional[int]) -> FactResponse:
        is_fav = False
        if user_id:
            fav = self.db.query(FactFavorite).filter(
                FactFavorite.fact_id == fact.id,
                FactFavorite.user_id == user_id
            ).first()
            is_fav = bool(fav)

        return FactResponse(
            id=fact.id,
            fact=fact.fact,
            category=fact.category,
            related_food_id=fact.related_food_id,
            source_name=fact.source_name,
            verified=fact.verified,
            is_favorite=is_fav,
            created_at=fact.created_at
        )

    def get_random_fact(self, user_id: Optional[int] = None) -> Optional[FactResponse]:
        fact = self.db.query(Fact).order_by(func.random()).first()
        if not fact:
            return None
        return self._enrich_is_favorite(fact, user_id)

    def list_facts(
        self,
        category: Optional[str] = None,
        search: Optional[str] = None,
        user_id: Optional[int] = None,
        favorites_only: bool = False,
        limit: int = 50,
        offset: int = 0
    ) -> List[FactResponse]:
        query = self.db.query(Fact)

        if favorites_only and user_id:
            query = query.join(FactFavorite, FactFavorite.fact_id == Fact.id).filter(
                FactFavorite.user_id == user_id
            )

        if category and category.lower() != "all":
            query = query.filter(Fact.category.ilike(category))

        if search and search.strip():
            query = query.filter(Fact.fact.ilike(f"%{search.strip()}%"))

        facts = query.limit(limit).offset(offset).all()
        return [self._enrich_is_favorite(f, user_id) for f in facts]

    def toggle_favorite(self, fact_id: int, user_id: int) -> Dict[str, Any]:
        fact = self.db.query(Fact).filter(Fact.id == fact_id).first()
        if not fact:
            return {"success": False, "is_favorite": False, "message": "Fact not found"}

        existing = self.db.query(FactFavorite).filter(
            FactFavorite.fact_id == fact_id,
            FactFavorite.user_id == user_id
        ).first()

        if existing:
            self.db.delete(existing)
            self.db.commit()
            return {"success": True, "is_favorite": False, "message": "Removed from favorites"}
        else:
            fav = FactFavorite(user_id=user_id, fact_id=fact_id)
            self.db.add(fav)
            self.db.commit()
            return {"success": True, "is_favorite": True, "message": "Added to favorites"}

    def get_categories(self) -> List[str]:
        rows = self.db.query(Fact.category).distinct().all()
        return sorted([r[0] for r in rows if r[0]])
