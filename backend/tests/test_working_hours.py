"""Tests for working hours API."""


from fastapi.testclient import TestClient
from sqlmodel import Session

from app.models.user import User


def test_list_working_hours_empty(
    client: TestClient,
    photographer_token: str,
) -> None:
    """Test listing working hours when none are set."""
    response = client.get(
        "/api/v1/working-hours",
        headers={"Authorization": f"Bearer {photographer_token}"},
    )
    assert response.status_code == 200
    assert response.json() == []


def test_create_working_hours(
    client: TestClient,
    session: Session,
    photographer_token: str,
    photographer_user: User,
) -> None:
    """Test creating working hours."""
    response = client.post(
        "/api/v1/working-hours",
        headers={"Authorization": f"Bearer {photographer_token}"},
        json={
            "day_of_week": 1,  # Tuesday
            "start_time": "09:00:00",
            "end_time": "17:00:00",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["day_of_week"] == 1
    assert data["start_time"] == "09:00:00"
    assert data["end_time"] == "17:00:00"
    assert "id" in data


def test_update_existing_working_hours(
    client: TestClient,
    session: Session,
    photographer_token: str,
    photographer_user: User,
) -> None:
    """Test updating existing working hours."""
    # Create initial hours
    response1 = client.post(
        "/api/v1/working-hours",
        headers={"Authorization": f"Bearer {photographer_token}"},
        json={
            "day_of_week": 0,  # Monday
            "start_time": "09:00:00",
            "end_time": "17:00:00",
        },
    )
    assert response1.status_code == 201
    initial_id = response1.json()["id"]

    # Update same day
    response2 = client.post(
        "/api/v1/working-hours",
        headers={"Authorization": f"Bearer {photographer_token}"},
        json={
            "day_of_week": 0,  # Monday
            "start_time": "10:00:00",
            "end_time": "18:00:00",
        },
    )
    assert response2.status_code == 201
    data = response2.json()
    assert data["id"] == initial_id  # Same ID
    assert data["start_time"] == "10:00:00"
    assert data["end_time"] == "18:00:00"


def test_create_working_hours_invalid_times(
    client: TestClient,
    photographer_token: str,
) -> None:
    """Test creating working hours with end_time before start_time."""
    response = client.post(
        "/api/v1/working-hours",
        headers={"Authorization": f"Bearer {photographer_token}"},
        json={
            "day_of_week": 0,
            "start_time": "17:00:00",
            "end_time": "09:00:00",  # Before start
        },
    )
    assert response.status_code == 422


def test_delete_working_hours(
    client: TestClient,
    session: Session,
    photographer_token: str,
    photographer_user: User,
) -> None:
    """Test deleting working hours."""
    # Create hours
    client.post(
        "/api/v1/working-hours",
        headers={"Authorization": f"Bearer {photographer_token}"},
        json={
            "day_of_week": 2,  # Wednesday
            "start_time": "09:00:00",
            "end_time": "17:00:00",
        },
    )

    # Delete
    response = client.delete(
        "/api/v1/working-hours/2",
        headers={"Authorization": f"Bearer {photographer_token}"},
    )
    assert response.status_code == 204

    # Verify deleted
    list_response = client.get(
        "/api/v1/working-hours",
        headers={"Authorization": f"Bearer {photographer_token}"},
    )
    assert list_response.json() == []


def test_delete_nonexistent_working_hours(
    client: TestClient,
    photographer_token: str,
) -> None:
    """Test deleting working hours that don't exist."""
    response = client.delete(
        "/api/v1/working-hours/5",
        headers={"Authorization": f"Bearer {photographer_token}"},
    )
    assert response.status_code == 404


def test_working_hours_requires_photographer_role(
    client: TestClient,
    customer_token: str,
) -> None:
    """Test that working hours endpoints require photographer role."""
    # Try to create as customer
    response = client.post(
        "/api/v1/working-hours",
        headers={"Authorization": f"Bearer {customer_token}"},
        json={
            "day_of_week": 0,
            "start_time": "09:00:00",
            "end_time": "17:00:00",
        },
    )
    assert response.status_code == 403


def test_list_working_hours_multiple_days(
    client: TestClient,
    photographer_token: str,
) -> None:
    """Test listing working hours across multiple days."""
    # Create hours for multiple days
    days = [
        (0, "09:00:00", "17:00:00"),  # Monday
        (2, "10:00:00", "18:00:00"),  # Wednesday
        (4, "09:00:00", "15:00:00"),  # Friday
    ]

    for day, start, end in days:
        client.post(
            "/api/v1/working-hours",
            headers={"Authorization": f"Bearer {photographer_token}"},
            json={
                "day_of_week": day,
                "start_time": start,
                "end_time": end,
            },
        )

    # List all
    response = client.get(
        "/api/v1/working-hours",
        headers={"Authorization": f"Bearer {photographer_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    # Should be sorted by day_of_week
    assert [item["day_of_week"] for item in data] == [0, 2, 4]
