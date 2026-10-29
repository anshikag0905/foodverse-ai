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

class FoodBox(BaseModel):
    ymin: float = Field(..., ge=0.0, le=1.0, description="Top normalized coordinate [0, 1]")
    xmin: float = Field(..., ge=0.0, le=1.0, description="Left normalized coordinate [0, 1]")
    ymax: float = Field(..., ge=0.0, le=1.0, description="Bottom normalized coordinate [0, 1]")
    xmax: float = Field(..., ge=0.0, le=1.0, description="Right normalized coordinate [0, 1]")

class DetectedFoodItem(BaseModel):
    id: str = Field(..., description="Unique item identifier")
    name: str = Field(..., description="Detected food item name in English")
    name_hi: Optional[str] = Field(None, description="Food item name in Hindi")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Detection confidence")
    box: Optional[FoodBox] = Field(None, description="Normalized bounding box coordinates")
    estimated_grams: float = Field(default=100.0, description="Estimated portion weight in grams")
    category: str = Field(default="Dish", description="Food category")
    cuisine: Optional[str] = Field(None, description="Culinary origin")
    calories: float = Field(..., description="Calories in kcal scaled to portion grams")
    protein: float = Field(..., description="Protein in grams scaled to portion grams")
    carbs: float = Field(..., description="Carbohydrates in grams scaled to portion grams")
    fat: float = Field(..., description="Fats in grams scaled to portion grams")
    fiber: float = Field(default=0.0, description="Dietary fiber in grams")
    sodium_mg: float = Field(default=0.0, description="Sodium in mg")
    allergens: List[str] = Field(default_factory=list, description="Allergens contained")
    diet_tags: List[str] = Field(default_factory=list, description="Diet flags")
    matched_food_id: Optional[int] = Field(None, description="ID of matched database entry")
    data_source: str = Field(default="database", description="'database' or 'ai_estimate'")

class MultiFoodDetectionResult(BaseModel):
    items: List[DetectedFoodItem] = Field(default_factory=list, description="Detected items on plate")
    total_calories: float = 0.0
    total_protein: float = 0.0
    total_carbs: float = 0.0
    total_fat: float = 0.0
    total_fiber: float = 0.0
    total_weight_grams: float = 0.0
    health_score: int = Field(default=85, ge=0, le=100)
    health_explanation: str = Field(default="Balanced macronutrient distribution.")
    allergen_conflicts: List[str] = Field(default_factory=list)
    diet_conflicts: List[str] = Field(default_factory=list)
    cues_detected: List[str] = Field(default_factory=list)
    model_provider: str = "mock"
    requires_api_key: bool = False
    error_message: Optional[str] = None
    disclaimer: str = Field(default="Nutritional values are calculated estimates based on portion models and verified database entries.")

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

class SpoilageSign(BaseModel):
    sign: str
    detected: bool = False
    severity: str = "none" # "none", "minor", "moderate", "severe"
    confidence: float = 0.9
    location: Optional[str] = None
    box: Optional[FoodBox] = None

class FreshnessAnalysisResult(BaseModel):
    item_name: str
    category: str = "Produce"
    status: str = Field(..., description="'fresh', 'moderately_fresh', or 'spoiled'")
    confidence: float = Field(..., ge=0.0, le=1.0)
    freshness_score: int = Field(..., ge=0, le=100)
    visual_indicators: List[str] = Field(default_factory=list, description="Discoloration, mold, texture")
    spoilage_signs: List[SpoilageSign] = Field(default_factory=list)
    shelf_life_range: str = Field(default="3 to 5 days", description="Estimated remaining days range")
    is_packaged: bool = False
    printed_expiry_date: Optional[str] = None
    expiry_comparison_note: Optional[str] = None
    storage_advice: str = Field(..., description="Preservation recommendations")
    consumption_verdict: str = Field(..., description="Safe to eat, cook soon, or discard immediately")
    freezing_guidance: Optional[str] = None
    disclaimer: str = Field(default="Visual analysis only. Does not replace olfactory or laboratory microbial testing.")

class FlaggedIncident(BaseModel):
    timestamp: str = Field(..., description="Timestamp in MM:SSs format")
    indicator: str = Field(..., description="e.g. Glove Usage, Hair-Cap, Cross-Contamination")
    status: str = Field(..., description="'pass' or 'fail'")
    description: str
    severity: str = Field(default="medium", description="'low', 'medium', 'high', 'critical'")
    thumbnail_path: Optional[str] = None
    box: Optional[FoodBox] = None

class RubricScoreItem(BaseModel):
    criterion: str
    weight: int
    score_awarded: float
    status: str # "pass", "minor_violation", "critical_violation"
    compliance_pct: int = 100
    notes: str = ""

class HygieneAnalysisResult(BaseModel):
    job_id: str
    overall_score: int = Field(default=0, ge=0, le=100)
    hygiene_grade: Optional[str] = Field(default="Grade A (Excellent)", description="Sanitary inspection grade")
    compliance_status: str = Field(default="pass", description="'pass', 'warning', or 'fail'")
    audit_type: str = Field(default="photo", description="'photo' or 'video'")
    image_url: Optional[str] = None
    rubric_breakdown: List[RubricScoreItem] = Field(default_factory=list)
    critical_violations: List[str] = Field(default_factory=list)
    indicators: Dict[str, bool] = Field(default_factory=dict, description="Per-indicator pass/fail mapping")
    flagged_incidents: List[FlaggedIncident] = Field(default_factory=list)
    summary_report: str = ""
    recommendations: List[str] = Field(default_factory=list)
    file_name: Optional[str] = Field(None, description="Uploaded file name")
    file_hash: Optional[str] = Field(None, description="SHA-256 hash of the uploaded file")
    file_hash_short: Optional[str] = Field(None, description="First 8 characters of file hash")
    duration_sec: float = Field(default=0.0, description="Video duration in seconds")
    frames_analyzed: int = Field(default=0, description="Count of key frames analyzed by OpenCV/Vision")
    frames_skipped_info: Optional[str] = None
    is_sample_demo: bool = Field(default=False, description="Whether this is a bundled sample demonstration")
    requires_api_key: bool = Field(default=False, description="True if real upload needs GEMINI_API_KEY")
    error_message: Optional[str] = None
    disclaimer: str = Field(default="AI decision support based on visible footage only. Not an official municipal health certification.")

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

class AskAIRequest(BaseModel):
    question: str
    context_type: Optional[str] = "general" # "food_recognition", "freshness", "hygiene", "gym", "cooking", "general"
    context_data: Optional[Dict[str, Any]] = None
    lang: str = "en"

class AskAIResponse(BaseModel):
    answer: str
    suggestions: List[str] = Field(default_factory=list)
    model_provider: str = "gemini"

