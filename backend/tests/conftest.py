"""Pytest configuration and fixtures."""

import os

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.core.db import get_session
from app.core.security import get_password_hash
from app.main import app
from app.models.user import User, UserRole


# Check if we should use PostgreSQL (for tests that require array types, etc.)
def use_postgres():
    """Check if tests should use PostgreSQL."""
    return os.getenv("USE_POSTGRES_TESTS", "false").lower() == "true"


@pytest.fixture(name="session")
def session_fixture():
    """Create a test database session."""
    if use_postgres():
        # Use real PostgreSQL database for tests that need ARRAY types
        from app.core.config import settings

        engine = create_engine(str(settings.DATABASE_URL))

        # Import all models so they're registered
        from app.models.booking import Booking  # noqa: F401
        from app.models.package import Package  # noqa: F401
        from app.models.photographer import (  # noqa: F401
            PhotographerProfile,
            PortfolioImage,
        )
        from app.models.user import User  # noqa: F401

        # Create all tables
        SQLModel.metadata.create_all(engine)

        with Session(engine) as session:
            yield session

        # Clean up: drop all tables after tests
        SQLModel.metadata.drop_all(engine)
    else:
        # Use SQLite for simple auth tests
        engine = create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )

        # Only import User for SQLite compatibility
        from app.models.user import User  # noqa: F401

        # Create tables (only User will work with SQLite)
        SQLModel.metadata.create_all(engine)

        with Session(engine) as session:
            yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    """Create a test client with dependency override."""

    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="customer_user")
def customer_user_fixture(session: Session) -> User:
    """Create a test customer user."""
    user = User(
        email="customer@example.com",
        password_hash=get_password_hash("customer123"),
        full_name="Test Customer",
        role=UserRole.CUSTOMER,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture(name="photographer_user")
def photographer_user_fixture(session: Session) -> User:
    """Create a test photographer user with profile."""
    from app.models.photographer import PhotographerProfile

    user = User(
        email="photographer@example.com",
        password_hash=get_password_hash("photographer123"),
        full_name="Test Photographer",
        role=UserRole.PHOTOGRAPHER,
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    # Create photographer profile
    profile = PhotographerProfile(
        user_id=user.id,
        bio="Test photographer bio",
        specialties=["portrait", "wedding"],
    )
    session.add(profile)
    session.commit()
    session.refresh(user)

    return user


@pytest.fixture(name="admin_user")
def admin_user_fixture(session: Session) -> User:
    """Create a test admin user."""
    user = User(
        email="admin@example.com",
        password_hash=get_password_hash("admin123"),
        full_name="Test Admin",
        role=UserRole.ADMIN,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture(name="customer_token")
def customer_token_fixture(client: TestClient, customer_user: User) -> str:
    """Get JWT token for customer user."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "customer@example.com", "password": "customer123"},
    )
    return response.json()["access_token"]


@pytest.fixture(name="photographer_token")
def photographer_token_fixture(client: TestClient, photographer_user: User) -> str:
    """Get JWT token for photographer user."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "photographer@example.com", "password": "photographer123"},
    )
    return response.json()["access_token"]


@pytest.fixture(name="admin_token")
def admin_token_fixture(client: TestClient, admin_user: User) -> str:
    """Get JWT token for admin user."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "admin123"},
    )
    return response.json()["access_token"]
