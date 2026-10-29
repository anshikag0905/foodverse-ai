import os
from pathlib import Path
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "FoodVerse AI"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str = "foodverse-super-secret-development-key-change-in-production"
    API_V1_STR: str = "/api/v1"

    # Server settings
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:5173"
    ALLOWED_ORIGINS: Union[str, List[str]] = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    @property
    def cors_origins(self) -> List[str]:
        if isinstance(self.ALLOWED_ORIGINS, str):
            return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
        return self.ALLOWED_ORIGINS

    # AI Configuration
    DEMO_MODE: bool = True
    AI_PROVIDER: str = "mock"  # "mock", "gemini", "openai"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # Databases (Absolute paths relative to backend directory)
    DATABASE_URL: str = f"sqlite:///{Path(__file__).resolve().parent.parent.parent / 'data' / 'foodverse.db'}"
    FOOD_DATABASE_PATH: str = str(Path(__file__).resolve().parent.parent.parent / "data" / "food_database.sqlite")

    # Storage
    STORAGE_TYPE: str = "local"
    UPLOAD_DIR: str = str(Path(__file__).resolve().parent.parent.parent / "storage" / "uploads")
    MAX_UPLOAD_SIZE_MB: int = 50
    KITCHEN_VIDEO_RETENTION_HOURS: int = 24

    # Auth
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    SINGLE_USER_MODE: bool = True
    DEFAULT_USER_EMAIL: str = "demo@foodverse.ai"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
