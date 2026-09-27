"""Tests for availability API."""

from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.models.booking import Booking, BookingStatus
from app.models.package import Package
from app.models.photographer import BlockedPeriod, WorkingHours
from app.models.user import User

STUDIO_TZ = ZoneInfo("Asia/Kolkata")


@pytest.fixture(name="sample_package")
def sample_package_fixture(session: Session) -> Package:
    """Create a sample package."""
    package = Package(
        name="Portrait Session",
        description="1-hour portrait photography",
        price=5000.0,
        duration_minutes=60,
        category="portrait",
        image_url="https://example.com/portrait.jpg",
        is_active=True,
    )
    session.add(package)
    session.commit()
    session.refresh(package)
    return package


def test_availability_no_working_hours(
    client: TestClient,
    session: Session,
    photographer_user: User,
    sample_package: Package,
) -> None:
    """Test availability when photographer has no working hours set."""
    photographer_id = photographer_user.photographer_profile.id
    tomorrow = date.today() + timedelta(days=1)

    response = client.get(
        f"/api/v1/availability?photographer_id={photographer_id}&package_id={sample_package.id}&date={tomorrow.isoformat()}"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["available_slots"] == []


def test_availability_with_working_hours(
    client: TestClient,
    session: Session,
    photographer_user: User,
    sample_package: Package,
) -> None:
    """Test availability calculation with working hours."""
    photographer_id = photographer_user.photographer_profile.id

    # Set working hours for Monday (0)
    working_hours = WorkingHours(
        photographer_id=photographer_id,
        day_of_week=0,  # Monday
        start_time=time(9, 0),
        end_time=time(12, 0),  # 3 hours
    )
    session.add(working_hours)
    session.commit()

    # Find next Monday
    today = date.today()
    days_ahead = 0 - today.weekday()
    if days_ahead <= 0:
        days_ahead += 7
    next_monday = today + timedelta(days=days_ahead)

    response = client.get(
        f"/api/v1/availability?photographer_id={photographer_id}&package_id={sample_package.id}&date={next_monday.isoformat()}"
    )
    assert response.status_code == 200
    data = response.json()

    # With 3-hour window and 60-min package + 5-min buffer, should have slots
    # 9:00-10:05 (fits), 9:15-10:20 (fits), 9:30-10:35 (fits), ...
    # Last slot that fits: 10:55-11:60 = 10:55-12:00 with buffer at 12:05 (doesn't fit)
    # So 10:45-11:50 with buffer at 11:55 should be last one
    assert len(data["available_slots"]) > 0
    assert data["package_duration_minutes"] == 60


def test_availability_blocked_by_booking(
    client: TestClient,
    session: Session,
    photographer_user: User,
    customer_user: User,
    sample_package: Package,
) -> None:
    """Test that existing bookings block availability."""
    photographer_id = photographer_user.photographer_profile.id

    # Set working hours for Tuesday
    working_hours = WorkingHours(
        photographer_id=photographer_id,
        day_of_week=1,  # Tuesday
        start_time=time(9, 0),
        end_time=time(17, 0),
    )
    session.add(working_hours)
    session.commit()

    # Find next Tuesday
    today = date.today()
    days_ahead = 1 - today.weekday()
    if days_ahead <= 0:
        days_ahead += 7
    next_tuesday = today + timedelta(days=days_ahead)

    # Create a booking from 10:00-11:00 (11:05 with buffer)
    booking_start = datetime.combine(next_tuesday, time(10, 0), tzinfo=STUDIO_TZ)
    booking_end = booking_start + timedelta(minutes=60)
    booking_buffered_end = booking_end + timedelta(minutes=5)

    booking = Booking(
        customer_id=customer_user.id,
        photographer_id=photographer_id,
        package_id=sample_package.id,
        start_datetime=booking_start,
        end_datetime=booking_end,
        buffered_end_datetime=booking_buffered_end,
        status=BookingStatus.CONFIRMED,
    )
    session.add(booking)
    session.commit()

    # Get availability
    response = client.get(
        f"/api/v1/availability?photographer_id={photographer_id}&package_id={sample_package.id}&date={next_tuesday.isoformat()}"
    )
    assert response.status_code == 200
    data = response.json()

    # Check that 10:00 slot is not available
    slot_times = [slot["display_time"] for slot in data["available_slots"]]
    assert "10:00 AM" not in slot_times
    # 9:45 would end at 10:45 + 5min buffer = 10:50, overlaps with booking at 10:00
    assert "09:45 AM" not in slot_times


def test_availability_blocked_by_period(
    client: TestClient,
    session: Session,
    photographer_user: User,
    sample_package: Package,
) -> None:
    """Test that blocked periods block availability."""
    photographer_id = photographer_user.photographer_profile.id

    # Set working hours for Wednesday
    working_hours = WorkingHours(
        photographer_id=photographer_id,
        day_of_week=2,  # Wednesday
        start_time=time(9, 0),
        end_time=time(17, 0),
    )
    session.add(working_hours)
    session.commit()

    # Find next Wednesday
    today = date.today()
    days_ahead = 2 - today.weekday()
    if days_ahead <= 0:
        days_ahead += 7
    next_wednesday = today + timedelta(days=days_ahead)

    # Create blocked period from 14:00-15:00
    blocked_start = datetime.combine(next_wednesday, time(14, 0), tzinfo=STUDIO_TZ)
    blocked_end = datetime.combine(next_wednesday, time(15, 0), tzinfo=STUDIO_TZ)

    blocked_period = BlockedPeriod(
        photographer_id=photographer_id,
        start_datetime=blocked_start,
        end_datetime=blocked_end,
        reason="Lunch break",
    )
    session.add(blocked_period)
    session.commit()

    # Get availability
    response = client.get(
        f"/api/v1/availability?photographer_id={photographer_id}&package_id={sample_package.id}&date={next_wednesday.isoformat()}"
    )
    assert response.status_code == 200
    data = response.json()

    # Check that 14:00 slot is not available
    slot_times = [slot["display_time"] for slot in data["available_slots"]]
    assert "02:00 PM" not in slot_times
    # 13:45 would end at 14:45, which overlaps with blocked period (14:00-15:00)
    assert "01:45 PM" not in slot_times
    # 13:00 ends at 14:00, right when blocked period starts - should be available
    assert "01:00 PM" in slot_times


def test_availability_invalid_photographer(
    client: TestClient,
    sample_package: Package,
) -> None:
    """Test availability with non-existent photographer."""
    fake_id = "00000000-0000-0000-0000-000000000000"
    tomorrow = date.today() + timedelta(days=1)

    response = client.get(
        f"/api/v1/availability?photographer_id={fake_id}&package_id={sample_package.id}&date={tomorrow.isoformat()}"
    )
    assert response.status_code == 404


def test_availability_invalid_package(
    client: TestClient,
    photographer_user: User,
) -> None:
    """Test availability with non-existent package."""
    photographer_id = photographer_user.photographer_profile.id
    fake_id = "00000000-0000-0000-0000-000000000000"
    tomorrow = date.today() + timedelta(days=1)

    response = client.get(
        f"/api/v1/availability?photographer_id={photographer_id}&package_id={fake_id}&date={tomorrow.isoformat()}"
    )
    assert response.status_code == 404


def test_availability_inactive_package(
    client: TestClient,
    session: Session,
    photographer_user: User,
) -> None:
    """Test availability with inactive package."""
    photographer_id = photographer_user.photographer_profile.id

    # Create inactive package
    package = Package(
        name="Inactive Package",
        description="Test",
        price=1000.0,
        duration_minutes=30,
        category="test",
        image_url="https://example.com/test.jpg",
        is_active=False,
    )
    session.add(package)
    session.commit()
    session.refresh(package)

    tomorrow = date.today() + timedelta(days=1)

    response = client.get(
        f"/api/v1/availability?photographer_id={photographer_id}&package_id={package.id}&date={tomorrow.isoformat()}"
    )
    assert response.status_code == 400
    assert "not active" in response.json()["detail"]


def test_availability_slot_format(
    client: TestClient,
    session: Session,
    photographer_user: User,
    sample_package: Package,
) -> None:
    """Test that availability slots have correct format."""
    photographer_id = photographer_user.photographer_profile.id

    # Set working hours for Thursday
    working_hours = WorkingHours(
        photographer_id=photographer_id,
        day_of_week=3,  # Thursday
        start_time=time(10, 0),
        end_time=time(11, 30),
    )
    session.add(working_hours)
    session.commit()

    # Find next Thursday
    today = date.today()
    days_ahead = 3 - today.weekday()
    if days_ahead <= 0:
        days_ahead += 7
    next_thursday = today + timedelta(days=days_ahead)

    response = client.get(
        f"/api/v1/availability?photographer_id={photographer_id}&package_id={sample_package.id}&date={next_thursday.isoformat()}"
    )
    assert response.status_code == 200
    data = response.json()

    if data["available_slots"]:
        slot = data["available_slots"][0]
        # Check all required fields
        assert "start_datetime" in slot
        assert "start_datetime_utc" in slot
        assert "start_datetime_local" in slot
        assert "display_time" in slot
        # Verify display_time format
        assert ":" in slot["display_time"]
        assert "AM" in slot["display_time"] or "PM" in slot["display_time"]
