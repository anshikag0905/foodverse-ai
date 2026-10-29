import sqlite3
import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from app.core.config import settings

class FoodService:
    def __init__(self, db_path: Optional[str] = None):
        if db_path:
            self.db_path = Path(db_path).resolve()
        else:
            configured = Path(settings.FOOD_DATABASE_PATH)
            if configured.exists() and configured.stat().st_size > 0:
                self.db_path = configured.resolve()
            else:
                # Check backend/data relative to this file
                backend_db = Path(__file__).resolve().parent.parent.parent / "data" / "food_database.sqlite"
                if backend_db.exists() and backend_db.stat().st_size > 0:
                    self.db_path = backend_db.resolve()
                else:
                    self.db_path = configured.resolve()

    def _get_connection(self):
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        return conn

    def search_foods(
        self,
        query: str,
        category: Optional[str] = None,
        cuisine: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> Dict[str, Any]:
        """Search foods using FTS5 full-text search with fuzzy prefix matching."""
        if not self.db_path.exists():
            return {"items": [], "total": 0, "query": query}

        conn = self._get_connection()
        cur = conn.cursor()

        clean_q = query.strip().replace("'", "").replace('"', '').replace("*", "")
        items = []

        if clean_q:
            # FTS5 search with prefix matching on tokens
            tokens = [f"{t}*" for t in clean_q.split() if t]
            fts_query = " ".join(tokens)

            sql = """
            SELECT f.*, rank
            FROM foods_fts fts
            JOIN foods f ON f.id = fts.food_id
            WHERE foods_fts MATCH ?
            """
            params = [fts_query]

            if category and category != "All":
                sql += " AND f.category = ?"
                params.append(category)
            if cuisine and cuisine != "All":
                sql += " AND f.cuisine = ?"
                params.append(cuisine)

            sql += " ORDER BY rank LIMIT ? OFFSET ?;"
            params.extend([limit, offset])

            try:
                cur.execute(sql, params)
                rows = cur.fetchall()
            except sqlite3.OperationalError:
                rows = []

            if not rows:
                # Fallback to standard LIKE if FTS produced 0 results (e.g. compound words like 'burger' in 'Cheeseburger')
                sql_like = "SELECT * FROM foods WHERE (name LIKE ? OR aliases LIKE ? OR name_hi LIKE ?)"
                params_like = [f"%{clean_q}%", f"%{clean_q}%", f"%{clean_q}%"]
                if category and category != "All":
                    sql_like += " AND category = ?"
                    params_like.append(category)
                if cuisine and cuisine != "All":
                    sql_like += " AND cuisine = ?"
                    params_like.append(cuisine)
                sql_like += " LIMIT ? OFFSET ?;"
                params_like.extend([limit, offset])
                cur.execute(sql_like, params_like)
                rows = cur.fetchall()
        else:
            # Browse all foods with optional filters
            sql = "SELECT * FROM foods WHERE 1=1"
            params = []
            if category and category != "All":
                sql += " AND category = ?"
                params.append(category)
            if cuisine and cuisine != "All":
                sql += " AND cuisine = ?"
                params.append(cuisine)
            sql += " ORDER BY calories DESC LIMIT ? OFFSET ?;"
            params.extend([limit, offset])
            cur.execute(sql, params)
            rows = cur.fetchall()

        for row in rows:
            items.append(self._format_food_row(row))

        # Get total estimate
        conn.close()
        return {
            "items": items,
            "count": len(items),
            "limit": limit,
            "offset": offset,
            "query": query
        }

    def get_food_by_id(self, food_id: int) -> Optional[Dict[str, Any]]:
        conn = self._get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM foods WHERE id = ?;", (food_id,))
        row = cur.fetchone()
        conn.close()
        return self._format_food_row(row) if row else None

    def get_food_by_barcode(self, barcode: str) -> Optional[Dict[str, Any]]:
        conn = self._get_connection()
        cur = conn.cursor()
        clean_code = barcode.strip()
        cur.execute("SELECT * FROM foods WHERE barcode = ?;", (clean_code,))
        row = cur.fetchone()
        conn.close()
        return self._format_food_row(row) if row else None

    def get_categories(self) -> List[str]:
        conn = self._get_connection()
        cur = conn.cursor()
        cur.execute("SELECT DISTINCT category FROM foods WHERE category IS NOT NULL ORDER BY category ASC;")
        categories = [r[0] for r in cur.fetchall() if r[0]]
        conn.close()
        return categories

    def get_cuisines(self) -> List[str]:
        conn = self._get_connection()
        cur = conn.cursor()
        cur.execute("SELECT DISTINCT cuisine FROM foods WHERE cuisine IS NOT NULL ORDER BY cuisine ASC;")
        cuisines = [r[0] for r in cur.fetchall() if r[0]]
        conn.close()
        return cuisines

    def add_custom_food(self, food_data: Dict[str, Any]) -> Dict[str, Any]:
        """Allows users to register missing custom foods into the local database."""
        conn = self._get_connection()
        cur = conn.cursor()

        cur.execute("""
        INSERT INTO foods (
            food_code, barcode, name, name_hi, aliases, category, cuisine,
            serving_size, calories, protein, carbs, fat, fiber, sugar, sodium_mg,
            allergens, diet_tags, source, license
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            f"CUSTOM_{int(Path(self.db_path).stat().st_mtime)}",
            food_data.get("barcode"),
            food_data["name"],
            food_data.get("name_hi"),
            food_data.get("aliases", ""),
            food_data.get("category", "Custom Food"),
            food_data.get("cuisine", "Custom"),
            food_data.get("serving_size", "100g"),
            float(food_data.get("calories", 0.0)),
            float(food_data.get("protein", 0.0)),
            float(food_data.get("carbs", 0.0)),
            float(food_data.get("fat", 0.0)),
            float(food_data.get("fiber", 0.0)),
            float(food_data.get("sugar", 0.0)),
            float(food_data.get("sodium_mg", 0.0)),
            json.dumps(food_data.get("allergens", [])),
            json.dumps(food_data.get("diet_tags", [])),
            "User Custom Entry",
            "User Owned"
        ))
        new_id = cur.lastrowid

        # Update FTS
        cur.execute("""
        INSERT INTO foods_fts(food_id, name, name_hi, aliases, category, cuisine)
        VALUES (?, ?, ?, ?, ?, ?);
        """, (
            new_id,
            food_data["name"],
            food_data.get("name_hi"),
            food_data.get("aliases", ""),
            food_data.get("category", "Custom Food"),
            food_data.get("cuisine", "Custom")
        ))
        conn.commit()
        conn.close()
        return self.get_food_by_id(new_id)

    def _format_food_row(self, row) -> Dict[str, Any]:
        return {
            "id": row["id"],
            "food_code": row["food_code"],
            "barcode": row["barcode"],
            "name": row["name"],
            "name_hi": row["name_hi"],
            "aliases": row["aliases"],
            "category": row["category"],
            "cuisine": row["cuisine"],
            "serving_size": row["serving_size"],
            "calories": row["calories"],
            "protein": row["protein"],
            "carbs": row["carbs"],
            "fat": row["fat"],
            "fiber": row["fiber"],
            "sugar": row["sugar"],
            "sodium_mg": row["sodium_mg"],
            "allergens": json.loads(row["allergens"]) if row["allergens"] else [],
            "diet_tags": json.loads(row["diet_tags"]) if row["diet_tags"] else [],
            "shelf_life_days": row["shelf_life_days"],
            "storage_hint": row["storage_hint"],
            "source": row["source"],
            "license": row["license"]
        }
