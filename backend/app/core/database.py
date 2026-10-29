from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from pathlib import Path
from app.core.config import settings

# Ensure sqlite directory exists
if settings.DATABASE_URL.startswith("sqlite"):
    db_file = settings.DATABASE_URL.replace("sqlite:///", "")
    db_path = Path(db_file).resolve().parent
    db_path.mkdir(parents=True, exist_ok=True)
    connect_args = {"check_same_thread": False}
else:
    connect_args = {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
