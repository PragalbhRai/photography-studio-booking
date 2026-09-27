"""Database connection and session management."""

from collections.abc import Generator

from sqlmodel import Session, create_engine

from app.core.config import settings

# Create engine
engine = create_engine(str(settings.DATABASE_URL), echo=False)


def get_session() -> Generator[Session, None, None]:
    """Get database session."""
    with Session(engine) as session:
        yield session
