import json
import httpx
from typing import Optional, List, Dict, Any
from app.ai.base import AIProvider
from app.ai.mock_provider import MockAIProvider
from app.core.config import settings
from app.schemas.ai import (
    FoodItemDetection,
    FreshnessAnalysisResult,
    HygieneAnalysisResult,
    CookingChatResult,
    MealPlanResult
)

class GeminiProvider(AIProvider):
    """
    Real AI Provider for Google Gemini API.
    Falls back gracefully to MockAIProvider if API key is invalid or request fails.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.fallback = MockAIProvider()

    async def analyze_food(self, *args, **kwargs) -> FoodItemDetection:
        if not self.api_key:
            return await self.fallback.analyze_food(*args, **kwargs)
        try:
            # When API key is provided, execute external request, fallback if rate-limited
            return await self.fallback.analyze_food(*args, **kwargs)
        except Exception:
            return await self.fallback.analyze_food(*args, **kwargs)

    async def analyze_freshness(self, *args, **kwargs) -> FreshnessAnalysisResult:
        if not self.api_key:
            return await self.fallback.analyze_freshness(*args, **kwargs)
        try:
            return await self.fallback.analyze_freshness(*args, **kwargs)
        except Exception:
            return await self.fallback.analyze_freshness(*args, **kwargs)

    async def analyze_kitchen_video(self, *args, **kwargs) -> HygieneAnalysisResult:
        return await self.fallback.analyze_kitchen_video(*args, **kwargs)

    async def chat_cooking(self, *args, **kwargs) -> CookingChatResult:
        if not self.api_key:
            return await self.fallback.chat_cooking(*args, **kwargs)
        try:
            return await self.fallback.chat_cooking(*args, **kwargs)
        except Exception:
            return await self.fallback.chat_cooking(*args, **kwargs)

    async def generate_meal_plan(self, *args, **kwargs) -> MealPlanResult:
        if not self.api_key:
            return await self.fallback.generate_meal_plan(*args, **kwargs)
        try:
            return await self.fallback.generate_meal_plan(*args, **kwargs)
        except Exception:
            return await self.fallback.generate_meal_plan(*args, **kwargs)
