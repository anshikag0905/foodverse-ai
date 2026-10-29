from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from app.schemas.ai import (
    FoodItemDetection,
    MultiFoodDetectionResult,
    FreshnessAnalysisResult,
    HygieneAnalysisResult,
    MealPlanResult
)

class AIProvider(ABC):
    @abstractmethod
    async def analyze_food(
        self,
        image_bytes: Optional[bytes] = None,
        image_path: Optional[str] = None,
        query: Optional[str] = None,
        user_diet: Optional[str] = None,
        user_allergies: Optional[List[str]] = None,
        lang: str = "en"
    ) -> FoodItemDetection:
        """Analyzes an image or query to identify dishes, nutrition, and health scores."""
        pass

    @abstractmethod
    async def analyze_food_multi(
        self,
        image_bytes: Optional[bytes] = None,
        image_path: Optional[str] = None,
        query: Optional[str] = None,
        user_diet: Optional[str] = None,
        user_allergies: Optional[List[str]] = None,
        lang: str = "en"
    ) -> MultiFoodDetectionResult:
        """Detects multiple food items on a plate with bounding boxes, portion grams, and macros."""
        pass

    @abstractmethod
    async def analyze_freshness(
        self,
        image_bytes: Optional[bytes] = None,
        image_path: Optional[str] = None,
        food_hint: Optional[str] = None,
        lang: str = "en"
    ) -> FreshnessAnalysisResult:
        """Classifies visual freshness into Fresh, Moderately Fresh, or Spoiled."""
        pass

    @abstractmethod
    async def analyze_kitchen_photo(
        self,
        image_bytes: Optional[bytes] = None,
        image_path: Optional[str] = None,
        filename: Optional[str] = None,
        lang: str = "en"
    ) -> HygieneAnalysisResult:
        """Inspects a single kitchen/prep photo for cleanliness, cross-contamination, and sanitation."""
        pass

    @abstractmethod
    async def analyze_kitchen_video(
        self,
        video_path: str,
        job_id: str,
        file_hash: Optional[str] = None,
        filename: Optional[str] = None,
        extracted_frames: Optional[List[Dict[str, Any]]] = None,
        duration_sec: float = 0.0,
        lang: str = "en",
        progress_callback: Optional[Any] = None
    ) -> HygieneAnalysisResult:
        """Samples keyframes from kitchen video and evaluates hygiene compliance."""
        pass

    @abstractmethod
    async def generate_meal_plan(
        self,
        user_profile: Dict[str, Any],
        target_calories: float,
        target_macros: Dict[str, float],
        pantry_items: Optional[List[Dict[str, Any]]] = None,
        plan_type: str = "daily",
        lang: str = "en"
    ) -> MealPlanResult:
        """Generates an adaptive macro-aligned daily or weekly meal plan."""
        pass
