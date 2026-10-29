from app.core.config import settings
from app.ai.base import AIProvider
from app.ai.mock_provider import MockAIProvider
from app.ai.gemini_provider import GeminiProvider

def get_ai_provider() -> AIProvider:
    """Returns configured AI provider (MockAIProvider in DEMO_MODE or when credentials omitted)."""
    if settings.DEMO_MODE or settings.AI_PROVIDER == "mock":
        return MockAIProvider()
    elif settings.AI_PROVIDER == "gemini":
        return GeminiProvider(api_key=settings.GEMINI_API_KEY)
    return MockAIProvider()
