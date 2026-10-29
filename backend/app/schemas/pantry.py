import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

class PantryItemBase(BaseModel):
    name: str = Field(..., description="Food or ingredient name")
    category: str = Field(default="General", description="Category e.g. Dairy, Produce, Bakery, Spices")
    quantity: float = Field(default=1.0, ge=0.01)
    unit: str = Field(default="pcs")
    storage_location: str = Field(default="fridge", description="fridge, freezer, or shelf")
    food_id: Optional[str] = Field(default=None, description="Linked food database ID")

class PantryItemCreate(PantryItemBase):
    purchase_date: Optional[datetime.datetime] = None
    expiry_date: Optional[datetime.datetime] = None
    days_shelf_life: Optional[int] = Field(default=7, description="Used to estimate expiry if expiry_date not provided")

class PantryItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    expiry_date: Optional[datetime.datetime] = None
    storage_location: Optional[str] = None
    status: Optional[str] = None
    used_this_month: Optional[bool] = None
    wasted: Optional[bool] = None

class PantryItemResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    food_id: Optional[str] = None
    name: str
    category: str
    quantity: float
    unit: str
    purchase_date: datetime.datetime
    expiry_date: datetime.datetime
    storage_location: str
    status: str
    days_remaining: int
    used_this_month: bool
    wasted: bool
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

class PantryWasteSummary(BaseModel):
    total_tracked: int
    active_count: int
    used_count: int
    wasted_count: int
    expiring_soon_count: int
    expired_count: int
    waste_percentage: float
    message: str

class GroceryItemCreate(BaseModel):
    name: str
    quantity: float = 1.0
    unit: str = "pcs"
    category: str = "Pantry Missing"

class GroceryItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    checked: Optional[bool] = None

class GroceryItemResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    name: str
    quantity: float
    unit: str
    category: str
    checked: bool
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
