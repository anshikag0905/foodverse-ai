import os
import time
import uuid
from pathlib import Path
from typing import Optional
from app.core.config import settings
from app.storage.base import StorageProvider

class LocalStorageProvider(StorageProvider):
    def __init__(self, base_dir: Optional[str] = None):
        self.base_dir = Path(base_dir or settings.UPLOAD_DIR).resolve()
        self.base_dir.mkdir(parents=True, exist_ok=True)

    async def save_file(self, content: bytes, filename: str, subfolder: str = "general") -> str:
        target_dir = self.base_dir / subfolder
        target_dir.mkdir(parents=True, exist_ok=True)

        ext = Path(filename).suffix or ".bin"
        unique_name = f"{int(time.time())}_{uuid.uuid4().hex[:8]}{ext}"
        destination = target_dir / unique_name

        with open(destination, "wb") as f:
            f.write(content)

        # Return standardized relative path
        return f"{subfolder}/{unique_name}"

    def get_full_path(self, relative_path: str) -> Path:
        return self.base_dir / relative_path

    async def delete_file(self, relative_path: str) -> bool:
        try:
            full_path = self.get_full_path(relative_path)
            if full_path.exists() and full_path.is_file():
                full_path.unlink()
                return True
        except Exception as e:
            print(f"Error deleting file {relative_path}: {e}")
        return False

    async def cleanup_expired_videos(self, max_age_hours: int = 24) -> int:
        videos_dir = self.base_dir / "videos"
        if not videos_dir.exists():
            return 0

        cutoff = time.time() - (max_age_hours * 3600)
        deleted_count = 0

        for item in videos_dir.iterdir():
            if item.is_file() and item.stat().st_mtime < cutoff:
                try:
                    item.unlink()
                    deleted_count += 1
                except Exception:
                    pass
        return deleted_count

def get_storage() -> StorageProvider:
    return LocalStorageProvider()
