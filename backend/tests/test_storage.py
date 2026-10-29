import pytest
from app.storage.local_storage import LocalStorageProvider
from tests.conftest import run_sync

def test_local_storage_lifecycle(tmp_path):
    storage = LocalStorageProvider(base_dir=str(tmp_path))
    test_content = b"Mock image payload for testing"

    # Save file
    rel_path = run_sync(storage.save_file(test_content, "sample_apple.jpg", subfolder="test"))
    assert rel_path.startswith("test/")

    # Verify exists
    full_path = storage.get_full_path(rel_path)
    assert full_path.exists()
    assert full_path.read_bytes() == test_content

    # Delete file
    deleted = run_sync(storage.delete_file(rel_path))
    assert deleted is True
    assert not full_path.exists()
