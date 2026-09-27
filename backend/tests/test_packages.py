"""Tests for package API endpoints."""

import uuid

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.models.package import Package


@pytest.fixture(name="test_packages")
def test_packages_fixture(session: Session) -> list[Package]:
    """Create test packages."""
    packages = [
        Package(
            name="Portrait Session",
            description="Professional portrait photography",
            price=150.00,
            duration_minutes=60,
            category="portrait",
            image_url="https://example.com/portrait.jpg",
            is_active=True,
        ),
        Package(
            name="Wedding Package",
            description="Full day wedding coverage",
            price=2500.00,
            duration_minutes=480,
            category="wedding",
            image_url="https://example.com/wedding.jpg",
            is_active=True,
        ),
        Package(
            name="Inactive Package",
            description="This should not appear",
            price=100.00,
            duration_minutes=30,
            category="other",
            image_url="https://example.com/inactive.jpg",
            is_active=False,
        ),
    ]

    for pkg in packages:
        session.add(pkg)
    session.commit()

    for pkg in packages:
        session.refresh(pkg)

    return packages


def test_list_packages_returns_only_active(
    client: TestClient, test_packages: list[Package]
):
    """Test that list packages only returns active packages."""
    response = client.get("/api/v1/packages")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2  # Only active packages

    names = [pkg["name"] for pkg in data]
    assert "Portrait Session" in names
    assert "Wedding Package" in names
    assert "Inactive Package" not in names


def test_list_packages_includes_all_fields(
    client: TestClient, test_packages: list[Package]
):
    """Test that packages include all required fields."""
    response = client.get("/api/v1/packages")

    assert response.status_code == 200
    data = response.json()

    package = data[0]
    assert "id" in package
    assert "name" in package
    assert "description" in package
    assert "price" in package
    assert "duration_minutes" in package
    assert "category" in package
    assert "image_url" in package
    assert "is_active" in package


def test_get_package_by_id(client: TestClient, test_packages: list[Package]):
    """Test getting a specific package by ID."""
    package_id = test_packages[0].id

    response = client.get(f"/api/v1/packages/{package_id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == str(package_id)
    assert data["name"] == "Portrait Session"
    assert data["price"] == 150.00
    assert data["duration_minutes"] == 60


def test_get_package_not_found(client: TestClient):
    """Test that getting non-existent package returns 404."""
    fake_id = uuid.uuid4()

    response = client.get(f"/api/v1/packages/{fake_id}")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_inactive_package_returns_404(
    client: TestClient, test_packages: list[Package]
):
    """Test that getting inactive package returns 404."""
    inactive_package = test_packages[2]
    assert not inactive_package.is_active

    response = client.get(f"/api/v1/packages/{inactive_package.id}")

    assert response.status_code == 404


def test_list_packages_no_authentication_required(client: TestClient):
    """Test that listing packages doesn't require authentication."""
    response = client.get("/api/v1/packages")

    # Should succeed without authentication
    assert response.status_code == 200


def test_get_package_no_authentication_required(
    client: TestClient, test_packages: list[Package]
):
    """Test that getting a package doesn't require authentication."""
    package_id = test_packages[0].id

    response = client.get(f"/api/v1/packages/{package_id}")

    # Should succeed without authentication
    assert response.status_code == 200
