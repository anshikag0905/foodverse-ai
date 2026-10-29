from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
import datetime

class GymProfileCreateUpdate(BaseModel):
    age: int = Field(default=25, ge=14, le=100)
    sex: str = Field(default="male", description="'male' or 'female'")
    height_cm: float = Field(default=175.0, ge=100.0, le=250.0)
    weight_kg: float = Field(default=70.0, ge=30.0, le=300.0)
    activity_level: str = Field(default="moderate", description="'sedentary', 'light', 'moderate', 'active', 'very_active'")
    training_days_per_week: int = Field(default=4, ge=0, le=7)
    goal: str = Field(default="maintain", description="'cut', 'bulk', 'maintain', 'recomp'")
    diet_type: str = Field(default="omnivore")
    allergies: List[str] = Field(default_factory=list)

class GymProfileResponse(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    age: int
    sex: str
    height_cm: float
    weight_kg: float
    activity_level: str
    training_days_per_week: int
    goal: str
    diet_type: str
    allergies: List[str]
    bmr: float
    tdee: float
    target_calories: float
    target_protein_g: float
    target_carbs_g: float
    target_fat_g: float
    target_water_ml: float
    formula_explanation: str
    safety_warning: Optional[str] = None
    updated_at: Optional[datetime.datetime] = None

    model_config = ConfigDict(from_attributes=True)

class GymLogCreate(BaseModel):
    log_date: str = Field(default_factory=lambda: datetime.datetime.utcnow().strftime("%Y-%m-%d"))
    meal_type: str = Field(default="lunch", description="'breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout', 'water'")
    meal_name: str
    calories: float = Field(default=0.0, ge=0.0)
    protein_g: float = Field(default=0.0, ge=0.0)
    carbs_g: float = Field(default=0.0, ge=0.0)
    fat_g: float = Field(default=0.0, ge=0.0)
    water_ml: float = Field(default=0.0, ge=0.0)

class GymLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    log_date: str
    meal_type: str
    meal_name: str
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    water_ml: float
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

class DailyAdherenceResponse(BaseModel):
    date: str
    target_calories: float
    actual_calories: float
    target_protein: float
    actual_protein: float
    target_carbs: float
    actual_carbs: float
    target_fat: float
    actual_fat: float
    target_water: float
    actual_water: float
    calorie_adherence_pct: float
    protein_adherence_pct: float
    water_adherence_pct: float
    logs: List[GymLogResponse]

class ProgressEntryCreate(BaseModel):
    entry_date: str = Field(default_factory=lambda: datetime.datetime.utcnow().strftime("%Y-%m-%d"))
    weight_kg: float = Field(..., ge=30.0, le=300.0)
    waist_cm: Optional[float] = None
    chest_cm: Optional[float] = None
    arms_cm: Optional[float] = None
    notes: Optional[str] = None

class ProgressEntryResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    entry_date: str
    weight_kg: float
    waist_cm: Optional[float] = None
    chest_cm: Optional[float] = None
    arms_cm: Optional[float] = None
    notes: Optional[str] = None
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

class ProteinFoodItem(BaseModel):
    id: str
    name: str
    category: str
    serving_size: str
    protein_per_100g: float
    calories_per_100g: float
    protein_per_calorie: float
    diet_tags: List[str] = Field(default_factory=list)
