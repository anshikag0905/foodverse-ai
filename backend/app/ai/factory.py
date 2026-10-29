from app.core.config import settings
from app.ai.base import AIProvider
from app.ai.mock_provider import MockAIProvider
from app.ai.gemini_provider import GeminiProvider

def get_ai_provider() -> AIProvider:
    """Returns configured AI provider (GeminiProvider when GEMINI_API_KEY is available, else MockAIProvider)."""
    if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip():
        return GeminiProvider(api_key=settings.GEMINI_API_KEY.strip())
    elif settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.strip():
        from app.ai.openai_provider import OpenAIProvider
        return OpenAIProvider(api_key=settings.OPENAI_API_KEY.strip())
    return MockAIProvider()
