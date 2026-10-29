from typing import Optional
from pydantic import BaseModel, ConfigDict
import datetime

class FactResponse(BaseModel):
    id: int
    fact: str
    category: str
    related_food_id: Optional[str] = None
    source_name: str
    verified: bool
    is_favorite: bool = False
    created_at: Optional[datetime.datetime] = None

    model_config = ConfigDict(from_attributes=True)
