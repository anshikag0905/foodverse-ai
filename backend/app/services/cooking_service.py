import json
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.ai.factory import get_ai_provider
from app.models.cooking import CookingSession
from app.models.pantry import PantryItem, GroceryItem

class CookingService:
    def __init__(self):
        self.ai = get_ai_provider()

    async def handle_chat(
        self,
        db: Session,
        user_id: int,
        query: str,
        session_id: Optional[int] = None,
        use_pantry: bool = False,
        lang: str = "en"
    ) -> Dict[str, Any]:
        # Fetch or create session
        session = None
        if session_id:
            session = db.query(CookingSession).filter(CookingSession.id == session_id, CookingSession.user_id == user_id).first()

        if not session:
            session = CookingSession(
                user_id=user_id,
                session_title=f"Recipe: {query[:30]}",
                messages_json="[]"
            )
            db.add(session)
            db.commit()
            db.refresh(session)

        history = json.loads(session.messages_json) if session.messages_json else []

        # If pantry prioritization requested, gather current pantry items
        pantry_data = []
        if use_pantry:
            items = db.query(PantryItem).filter(PantryItem.user_id == user_id).all()
            pantry_data = [
                {"name": i.name, "category": i.category, "status": i.status}
                for i in items
            ]

        # Call AI provider
        ai_res = await self.ai.chat_cooking(
            query=query,
            history=history,
            pantry_items=pantry_data,
            lang=lang
        )

        # Append messages to session
        history.append({"sender": "user", "text": query})
        history.append({
            "sender": "assistant",
            "text": ai_res.reply,
            "recipe_title": ai_res.suggested_recipe_title,
            "ingredients": ai_res.ingredients,
            "instructions": ai_res.instructions,
            "timerMinutes": ai_res.timer_minutes,
            "substitutions": ai_res.substitutions,
            "missing_pantry_items": ai_res.missing_pantry_items
        })

        session.messages_json = json.dumps(history)
        db.commit()

        # If missing pantry items found, optionally offer to add them to grocery list
        if ai_res.missing_pantry_items:
            for missing_ing in ai_res.missing_pantry_items:
                exists = db.query(GroceryItem).filter(GroceryItem.user_id == user_id, GroceryItem.name == missing_ing).first()
                if not exists:
                    db.add(GroceryItem(user_id=user_id, name=missing_ing, category="Recipe Missing"))
            db.commit()

        return {
            "session_id": session.id,
            "reply": ai_res.reply,
            "suggested_recipe_title": ai_res.suggested_recipe_title,
            "ingredients": ai_res.ingredients,
            "instructions": ai_res.instructions,
            "timer_minutes": ai_res.timer_minutes,
            "substitutions": ai_res.substitutions,
            "missing_pantry_items": ai_res.missing_pantry_items,
            "messages": history
        }

    def get_user_sessions(self, db: Session, user_id: int) -> List[Dict[str, Any]]:
        sessions = db.query(CookingSession).filter(CookingSession.user_id == user_id).order_by(CookingSession.updated_at.desc()).all()
        return [
            {
                "id": s.id,
                "title": s.session_title,
                "created_at": str(s.created_at),
                "messages_count": len(json.loads(s.messages_json)) if s.messages_json else 0
            }
            for s in sessions
        ]
