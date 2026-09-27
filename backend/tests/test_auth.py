"""Tests for authentication endpoints."""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.models.user import User


def test_customer_registration_succeeds(client: TestClient):
    """Test that customer registration succeeds with valid data."""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newcustomer@example.com",
            "password": "validpassword123",
            "full_name": "New Customer"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newcustomer@example.com"
    assert data["full_name"] == "New Customer"
    assert data["role"] == "customer"
    assert "id" in data


def test_duplicate_registration_fails(client: TestClient, customer_user: User):
    """Test that duplicate email registration fails."""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "customer@example.com",  # Already exists
            "password": "password123",
            "full_name": "Duplicate User"
        }
    )
    
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


def test_customer_login_succeeds(client: TestClient, customer_user: User):
    """Test that customer login succeeds with correct credentials."""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "customer@example.com",
            "password": "customer123"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_invalid_password_fails(client: TestClient, customer_user: User):
    """Test that login fails with incorrect password."""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "customer@example.com",
            "password": "wrongpassword"
        }
    )
    
    assert response.status_code == 401
    assert "incorrect" in response.json()["detail"].lower()


def test_invalid_email_fails(client: TestClient):
    """Test that login fails with non-existent email."""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "anypassword"
        }
    )
    
    assert response.status_code == 401
    assert "incorrect" in response.json()["detail"].lower()


def test_auth_me_requires_authentication(client: TestClient):
    """Test that /auth/me requires authentication."""
    response = client.get("/api/v1/auth/me")
    
    assert response.status_code == 401


def test_auth_me_returns_correct_role_customer(
    client: TestClient,
    customer_user: User,
    customer_token: str
):
    """Test that /auth/me returns correct customer role."""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {customer_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "customer@example.com"
    assert data["role"] == "customer"
    assert data["full_name"] == "Test Customer"


def test_auth_me_returns_correct_role_photographer(
    client: TestClient,
    photographer_user: User,
    photographer_token: str
):
    """Test that /auth/me returns correct photographer role."""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {photographer_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "photographer@example.com"
    assert data["role"] == "photographer"
    assert data["full_name"] == "Test Photographer"


def test_auth_me_returns_correct_role_admin(
    client: TestClient,
    admin_user: User,
    admin_token: str
):
    """Test that /auth/me returns correct admin role."""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@example.com"
    assert data["role"] == "admin"
    assert data["full_name"] == "Test Admin"


def test_invalid_token_fails(client: TestClient):
    """Test that invalid JWT token fails."""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid_token_here"}
    )
    
    assert response.status_code == 401
