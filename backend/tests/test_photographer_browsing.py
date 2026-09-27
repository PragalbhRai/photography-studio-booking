"""Tests for photographer browsing API endpoints."""

import uuid

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.security import get_password_hash
from app.models.package import Package, PhotographerPackage
from app.models.photographer import PhotographerProfile, PortfolioImage
from app.models.user import User, UserRole


@pytest.fixture(name="photographer_with_portfolio")
def photographer_with_portfolio_fixture(
    session: Session,
) -> tuple[User, PhotographerProfile]:
    """Create a photographer with portfolio images."""
    # Create user
    user = User(
        email="photographer_browse@example.com",
        password_hash=get_password_hash("password123"),
        full_name="Jane Photographer",
        role=UserRole.PHOTOGRAPHER,
    )
    session.add(user)
    session.flush()

    # Create profile
    profile = PhotographerProfile(
        user_id=user.id,
        bio="Professional wedding and portrait photographer",
        specialties=["wedding", "portrait", "family"],
    )
    session.add(profile)
    session.flush()

    # Create portfolio images with sort order
    images = [
        PortfolioImage(
            photographer_id=profile.id,
            image_url="https://example.com/photo1.jpg",
            caption="Beautiful sunset wedding",
            sort_order=2,
        ),
        PortfolioImage(
            photographer_id=profile.id,
            image_url="https://example.com/photo2.jpg",
            caption="Family portrait session",
            sort_order=1,
        ),
        PortfolioImage(
            photographer_id=profile.id,
            image_url="https://example.com/photo3.jpg",
            caption=None,
            sort_order=3,
        ),
    ]

    for img in images:
        session.add(img)

    session.commit()
    session.refresh(user)
    session.refresh(profile)

    return user, profile


@pytest.fixture(name="photographer_with_packages")
def photographer_with_packages_fixture(
    session: Session, photographer_with_portfolio: tuple[User, PhotographerProfile]
) -> tuple[User, PhotographerProfile, list[Package]]:
    """Create a photographer with associated packages."""
    user, profile = photographer_with_portfolio

    # Create packages
    packages = [
        Package(
            name="Wedding Full Day",
            description="Complete wedding day coverage",
            price=3000.00,
            duration_minutes=480,
            category="wedding",
            image_url="https://example.com/wedding_pkg.jpg",
            is_active=True,
        ),
        Package(
            name="Portrait Session",
            description="1 hour portrait session",
            price=200.00,
            duration_minutes=60,
            category="portrait",
            image_url="https://example.com/portrait_pkg.jpg",
            is_active=True,
        ),
    ]

    for pkg in packages:
        session.add(pkg)
    session.flush()

    # Associate packages with photographer
    for pkg in packages:
        assoc = PhotographerPackage(
            photographer_id=profile.id,
            package_id=pkg.id,
        )
        session.add(assoc)

    session.commit()

    for pkg in packages:
        session.refresh(pkg)

    return user, profile, packages


def test_list_photographers(
    client: TestClient, photographer_with_portfolio: tuple[User, PhotographerProfile]
):
    """Test listing all photographers."""
    user, profile = photographer_with_portfolio

    response = client.get("/api/v1/photographers")

    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1

    # Find our photographer
    photographer = next((p for p in data if p["id"] == str(profile.id)), None)
    assert photographer is not None
    assert photographer["full_name"] == "Jane Photographer"
    assert photographer["bio"] == "Professional wedding and portrait photographer"
    assert "wedding" in photographer["specialties"]
    assert "portrait" in photographer["specialties"]


def test_get_photographer_detail(
    client: TestClient,
    photographer_with_packages: tuple[User, PhotographerProfile, list[Package]],
):
    """Test getting photographer detail with portfolio and packages."""
    user, profile, packages = photographer_with_packages

    response = client.get(f"/api/v1/photographers/{profile.id}")

    assert response.status_code == 200
    data = response.json()

    assert data["id"] == str(profile.id)
    assert data["full_name"] == "Jane Photographer"
    assert data["email"] == "photographer_browse@example.com"
    assert data["bio"] == "Professional wedding and portrait photographer"
    assert len(data["specialties"]) == 3

    # Check portfolio images are included and sorted
    assert len(data["portfolio_images"]) == 3
    images = data["portfolio_images"]
    # Should be sorted by sort_order (1, 2, 3)
    assert images[0]["caption"] == "Family portrait session"  # sort_order 1
    assert images[1]["caption"] == "Beautiful sunset wedding"  # sort_order 2
    assert images[2]["caption"] is None  # sort_order 3

    # Check packages are included
    assert len(data["packages"]) == 2
    package_names = [pkg["name"] for pkg in data["packages"]]
    assert "Wedding Full Day" in package_names
    assert "Portrait Session" in package_names


def test_get_photographer_not_found(client: TestClient):
    """Test that getting non-existent photographer returns 404."""
    fake_id = uuid.uuid4()

    response = client.get(f"/api/v1/photographers/{fake_id}")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_photographer_detail_includes_all_fields(
    client: TestClient,
    photographer_with_packages: tuple[User, PhotographerProfile, list[Package]],
):
    """Test that photographer detail includes all required fields."""
    user, profile, packages = photographer_with_packages

    response = client.get(f"/api/v1/photographers/{profile.id}")

    assert response.status_code == 200
    data = response.json()

    # Check photographer fields
    assert "id" in data
    assert "full_name" in data
    assert "email" in data
    assert "bio" in data
    assert "specialties" in data
    assert "portfolio_images" in data
    assert "packages" in data

    # Check portfolio image fields
    if data["portfolio_images"]:
        img = data["portfolio_images"][0]
        assert "id" in img
        assert "image_url" in img
        assert "caption" in img
        assert "sort_order" in img

    # Check package fields
    if data["packages"]:
        pkg = data["packages"][0]
        assert "id" in pkg
        assert "name" in pkg
        assert "price" in pkg
        assert "duration_minutes" in pkg


def test_photographer_packages_only_active(
    client: TestClient,
    photographer_with_packages: tuple[User, PhotographerProfile, list[Package]],
    session: Session,
):
    """Test that photographer detail only shows active packages."""
    user, profile, packages = photographer_with_packages

    # Mark one package as inactive
    packages[0].is_active = False
    session.add(packages[0])
    session.commit()

    response = client.get(f"/api/v1/photographers/{profile.id}")

    assert response.status_code == 200
    data = response.json()

    # Should only have 1 active package
    assert len(data["packages"]) == 1
    assert data["packages"][0]["name"] == "Portrait Session"


def test_list_photographers_no_authentication_required(client: TestClient):
    """Test that listing photographers doesn't require authentication."""
    response = client.get("/api/v1/photographers")

    # Should succeed without authentication
    assert response.status_code == 200


def test_get_photographer_no_authentication_required(
    client: TestClient, photographer_with_portfolio: tuple[User, PhotographerProfile]
):
    """Test that getting photographer detail doesn't require authentication."""
    user, profile = photographer_with_portfolio

    response = client.get(f"/api/v1/photographers/{profile.id}")

    # Should succeed without authentication
    assert response.status_code == 200


def test_portfolio_images_sorted_by_sort_order(
    client: TestClient, photographer_with_portfolio: tuple[User, PhotographerProfile]
):
    """Test that portfolio images are sorted by sort_order."""
    user, profile = photographer_with_portfolio

    response = client.get(f"/api/v1/photographers/{profile.id}")

    assert response.status_code == 200
    data = response.json()

    images = data["portfolio_images"]
    sort_orders = [img["sort_order"] for img in images]

    # Should be in ascending order
    assert sort_orders == sorted(sort_orders)
    assert sort_orders == [1, 2, 3]
