"""Tests for blocked periods API."""

from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient


def test_list_blocked_periods_empty(
    client: TestClient,
    photographer_token: str,
) -> None:
    """Test listing blocked periods when none exist."""
    response = client.get(
        "/api/v1/blocked-periods",
        headers={"Authorization": f"Bearer {photographer_token}"},
    )
    assert response.status_code == 200
    assert response.json() == []


def test_create_blocked_period(
    client: TestClient,
    photographer_token: str,
) -> None:
    """Test creating a blocked period."""
    start = datetime.now(UTC) + timedelta(days=7)
    end = start + timedelta(hours=4)

    response = client.post(
        "/api/v1/blocked-periods",
        headers={"Authorization": f"Bearer {photographer_token}"},
        json={
            "start_datetime": start.isoformat(),
            "end_datetime": end.isoformat(),
            "reason": "Personal appointment",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["reason"] == "Personal appointment"


def test_create_blocked_period_invalid_times(
    client: TestClient,
    photographer_token: str,
) -> None:
    """Test creating blocked period with end before start."""
    start = datetime.now(UTC) + timedelta(days=7)
    end = start - timedelta(hours=1)  # Before start

    response = client.post(
        "/api/v1/blocked-periods",
        headers={"Authorization": f"Bearer {photographer_token}"},
        json={
            "start_datetime": start.isoformat(),
            "end_datetime": end.isoformat(),
        },
    )
    assert response.status_code == 422


def test_delete_blocked_period(
    client: TestClient,
    photographer_token: str,
) -> None:
    """Test deleting a blocked period."""
    # Create period
    start = datetime.now(UTC) + timedelta(days=7)
    end = start + timedelta(hours=2)

    create_response = client.post(
        "/api/v1/blocked-periods",
        headers={"Authorization": f"Bearer {photographer_token}"},
        json={
            "start_datetime": start.isoformat(),
            "end_datetime": end.isoformat(),
            "reason": "Vacation",
        },
    )
    period_id = create_response.json()["id"]

    # Delete
    response = client.delete(
        f"/api/v1/blocked-periods/{period_id}",
        headers={"Authorization": f"Bearer {photographer_token}"},
    )
    assert response.status_code == 204

    # Verify deleted
    list_response = client.get(
        "/api/v1/blocked-periods",
        headers={"Authorization": f"Bearer {photographer_token}"},
    )
    assert list_response.json() == []


def test_delete_nonexistent_blocked_period(
    client: TestClient,
    photographer_token: str,
) -> None:
    """Test deleting a blocked period that doesn't exist."""
    fake_id = "00000000-0000-0000-0000-000000000000"
    response = client.delete(
        f"/api/v1/blocked-periods/{fake_id}",
        headers={"Authorization": f"Bearer {photographer_token}"},
    )
    assert response.status_code == 404


def test_blocked_periods_require_photographer_role(
    client: TestClient,
    customer_token: str,
) -> None:
    """Test that blocked period endpoints require photographer role."""
    start = datetime.now(UTC) + timedelta(days=7)
    end = start + timedelta(hours=2)

    response = client.post(
        "/api/v1/blocked-periods",
        headers={"Authorization": f"Bearer {customer_token}"},
        json={
            "start_datetime": start.isoformat(),
            "end_datetime": end.isoformat(),
        },
    )
    assert response.status_code == 403


def test_list_multiple_blocked_periods(
    client: TestClient,
    photographer_token: str,
) -> None:
    """Test listing multiple blocked periods."""
    base_time = datetime.now(UTC) + timedelta(days=7)

    # Create multiple periods
    periods = [
        (base_time, base_time + timedelta(hours=2), "Meeting"),
        (
            base_time + timedelta(days=1),
            base_time + timedelta(days=1, hours=3),
            "Lunch",
        ),
        (
            base_time + timedelta(days=2),
            base_time + timedelta(days=2, hours=1),
            "Break",
        ),
    ]

    for start, end, reason in periods:
        client.post(
            "/api/v1/blocked-periods",
            headers={"Authorization": f"Bearer {photographer_token}"},
            json={
                "start_datetime": start.isoformat(),
                "end_datetime": end.isoformat(),
                "reason": reason,
            },
        )

    # List all
    response = client.get(
        "/api/v1/blocked-periods",
        headers={"Authorization": f"Bearer {photographer_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    # Should be sorted by start_datetime
    assert data[0]["reason"] == "Meeting"
    assert data[1]["reason"] == "Lunch"
    assert data[2]["reason"] == "Break"


def test_create_blocked_period_without_reason(
    client: TestClient,
    photographer_token: str,
) -> None:
    """Test creating blocked period without optional reason."""
    start = datetime.now(UTC) + timedelta(days=7)
    end = start + timedelta(hours=2)

    response = client.post(
        "/api/v1/blocked-periods",
        headers={"Authorization": f"Bearer {photographer_token}"},
        json={
            "start_datetime": start.isoformat(),
            "end_datetime": end.isoformat(),
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["reason"] is None
