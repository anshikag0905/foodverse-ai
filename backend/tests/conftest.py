import sys
from pathlib import Path

# Ensure backend root is first in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) != sys.path[0]:
    sys.path.insert(0, str(backend_dir))

import pytest
from app.core.database import Base, engine, SessionLocal
from app.core.demo_seed import seed_demo_data_if_needed

def run_sync(coro):
    """Executes a coroutine synchronously without spawning loopback network sockets."""
    try:
        coro.send(None)
    except StopIteration as e:
        return e.value

@pytest.fixture(scope="session", autouse=True)
def init_db():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_demo_data_if_needed(db)
    yield

@pytest.fixture
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
