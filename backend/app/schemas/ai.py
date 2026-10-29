from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class MacroNutrients(BaseModel):
    calories: float = Field(..., description="Estimated total calories in kcal")
    protein: float = Field(..., description="Protein in grams")
    carbs: float = Field(..., description="Carbohydrates in grams")
    fat: float = Field(..., description="Fats in grams")
    fiber: float = Field(default=0.0, description="Dietary fiber in grams")
    sugar: float = Field(default=0.0, description="Sugar in grams")
    sodium_mg: float = Field(default=0.0, description="Sodium in mg")
    servingSize: str = Field(default="1 serving", description="Reference serving size")

class FoodItemDetection(BaseModel):
    name: str = Field(..., description="Recognized food name in English")
    name_hi: Optional[str] = Field(None, description="Recognized food name in Hindi")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Detection confidence")
    category: str = Field(default="Prepared Dish", description="Food category")
    cuisine: Optional[str] = Field(None, description="Culinary origin/cuisine")
    macros: MacroNutrients
    health_score: int = Field(..., ge=0, le=100, description="Health rating (0-100)")
    health_explanation: str = Field(..., description="Brief health score justification")
    allergens: List[str] = Field(default_factory=list, description="Allergens contained")
    diet_tags: List[str] = Field(default_factory=list, description="e.g. Vegetarian, Vegan, Halal")
    cues_detected: List[str] = Field(default_factory=list, description="Visual features identified")
    data_source: str = Field(default="database", description="'database' or 'ai_estimate'")
    disclaimer: str = Field(default="Nutritional values are calculated estimates based on portion models.")

class FreshnessAnalysisResult(BaseModel):
    item_name: str
    status: str = Field(..., description="'fresh', 'moderately_fresh', or 'spoiled'")
    confidence: float = Field(..., ge=0.0, le=1.0)
    freshness_score: int = Field(..., ge=0, le=100)
    visual_indicators: List[str] = Field(default_factory=list, description="Discoloration, mold, texture")
    storage_advice: str = Field(..., description="Preservation recommendations")
    consumption_verdict: str = Field(..., description="Safe to eat, cook soon, or discard immediately")
    disclaimer: str = Field(default="Visual analysis only. Does not replace laboratory microbial testing.")

class FlaggedIncident(BaseModel):
    timestamp: str = Field(..., description="Timestamp in MM:SSs format")
    indicator: str = Field(..., description="e.g. Glove Usage, Hair-Cap, Cross-Contamination")
    status: str = Field(..., description="'pass' or 'fail'")
    description: str
    severity: str = Field(default="medium", description="'low', 'medium', 'high'")
    thumbnail_path: Optional[str] = None

class HygieneAnalysisResult(BaseModel):
    job_id: str
    overall_score: int = Field(..., ge=0, le=100)
    compliance_status: str = Field(..., description="'pass', 'warning', or 'fail'")
    indicators: Dict[str, bool] = Field(..., description="Per-indicator pass/fail mapping")
    flagged_incidents: List[FlaggedIncident] = Field(default_factory=list)
    summary_report: str
    recommendations: List[str]
    disclaimer: str = Field(default="Decision support only. Not an official municipal health inspection.")

class CookingChatResult(BaseModel):
    reply: str
    suggested_recipe_title: Optional[str] = None
    ingredients: List[str] = Field(default_factory=list)
    instructions: List[str] = Field(default_factory=list)
    timer_minutes: Optional[int] = None
    substitutions: Dict[str, str] = Field(default_factory=dict)
    missing_pantry_items: List[str] = Field(default_factory=list)

class MealEntry(BaseModel):
    meal_type: str # "Breakfast", "Lunch", "Dinner", "Snack"
    dish_name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    description: str

class DailyMealPlan(BaseModel):
    day: str # "Monday", "Training Day", "Rest Day", etc.
    target_calories: float
    meals: List[MealEntry]

class MealPlanResult(BaseModel):
    plan_title: str
    target_calories: float
    target_protein: float
    target_carbs: float
    target_fat: float
    days: List[DailyMealPlan]
    grocery_list: List[str] = Field(default_factory=list)
    allergen_exclusions_applied: List[str] = Field(default_factory=list)
    diet_applied: str = "Omnivore"
    disclaimer: str = Field(default="General educational guidance. Consult a healthcare provider for medical conditions.")
