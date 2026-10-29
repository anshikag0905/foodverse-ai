from abc import ABC, abstractmethod
from pathlib import Path
from typing import Optional, List

class StorageProvider(ABC):
    @abstractmethod
    async def save_file(self, content: bytes, filename: str, subfolder: str = "general") -> str:
        """Saves file content and returns the relative storage identifier/URL."""
        pass

    @abstractmethod
    def get_full_path(self, relative_path: str) -> Path:
        """Returns the local filesystem Path if applicable."""
        pass

    @abstractmethod
    async def delete_file(self, relative_path: str) -> bool:
        """Deletes a file from storage."""
        pass

    @abstractmethod
    async def cleanup_expired_videos(self, max_age_hours: int) -> int:
        """Purges videos older than retention policy."""
        pass
