import sys
from pathlib import Path

# Ensure backend root is first in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) != sys.path[0]:
    sys.path.insert(0, str(backend_dir))

import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client
