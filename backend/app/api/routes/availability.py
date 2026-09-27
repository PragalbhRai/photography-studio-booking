"""Availability API routes."""

import uuid
from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select

from app.api.deps import get_session
from app.models.booking import Booking, BookingStatus
from app.models.package import Package
from app.models.photographer import BlockedPeriod, PhotographerProfile, WorkingHours
from app.models.schemas import AvailabilityResponse, AvailabilitySlot

router = APIRouter()

STUDIO_TIMEZONE = ZoneInfo("Asia/Kolkata")
SLOT_INTERVAL_MINUTES = 15
POST_BOOKING_BUFFER_MINUTES = 5


@router.get("", response_model=AvailabilityResponse)
def get_availability(
    photographer_id: uuid.UUID = Query(...),
    package_id: uuid.UUID = Query(...),
    date_param: date = Query(..., alias="date"),
    session: Session = Depends(get_session),
) -> AvailabilityResponse:
    """
    Get available time slots for a photographer and package on a specific date.

    Returns 15-minute grid start times in UTC and local time (Asia/Kolkata).
    Takes into account working hours, existing bookings, and blocked periods.
    """
    # Verify photographer exists
    photographer = session.get(PhotographerProfile, photographer_id)
    if not photographer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photographer not found",
        )

    # Verify package exists
    package = session.get(Package, package_id)
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found",
        )

    if not package.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Package is not active",
        )

    # Get day of week (0=Monday, 6=Sunday)
    day_of_week = date_param.weekday()

    # Get working hours for this day
    working_hours = session.exec(
        select(WorkingHours)
        .where(WorkingHours.photographer_id == photographer_id)
        .where(WorkingHours.day_of_week == day_of_week)
    ).first()

    if not working_hours:
        # No working hours set for this day
        return AvailabilityResponse(
            date=date_param.isoformat(),
            photographer_id=photographer_id,
            package_id=package_id,
            package_duration_minutes=package.duration_minutes,
            available_slots=[],
        )

    # Get all confirmed bookings for this photographer on this date
    start_of_day = datetime.combine(date_param, time.min, tzinfo=STUDIO_TIMEZONE)
    end_of_day = datetime.combine(date_param, time.max, tzinfo=STUDIO_TIMEZONE)

    bookings = session.exec(
        select(Booking)
        .where(Booking.photographer_id == photographer_id)
        .where(Booking.status == BookingStatus.CONFIRMED)
        .where(Booking.start_datetime <= end_of_day)
        .where(Booking.buffered_end_datetime >= start_of_day)
    ).all()

    # Get blocked periods that overlap with this date
    blocked_periods = session.exec(
        select(BlockedPeriod)
        .where(BlockedPeriod.photographer_id == photographer_id)
        .where(BlockedPeriod.start_datetime <= end_of_day)
        .where(BlockedPeriod.end_datetime >= start_of_day)
    ).all()

    # Calculate available slots
    available_slots = _calculate_available_slots(
        date_param,
        working_hours,
        package.duration_minutes,
        bookings,
        blocked_periods,
    )

    return AvailabilityResponse(
        date=date_param.isoformat(),
        photographer_id=photographer_id,
        package_id=package_id,
        package_duration_minutes=package.duration_minutes,
        available_slots=available_slots,
    )


def _calculate_available_slots(
    target_date: date,
    working_hours: WorkingHours,
    package_duration_minutes: int,
    bookings: list[Booking],
    blocked_periods: list[BlockedPeriod],
) -> list[AvailabilitySlot]:
    """Calculate available time slots based on working hours and constraints."""
    slots: list[AvailabilitySlot] = []

    # Convert working hours to datetime in local timezone
    work_start = datetime.combine(
        target_date, working_hours.start_time, tzinfo=STUDIO_TIMEZONE
    )
    work_end = datetime.combine(
        target_date, working_hours.end_time, tzinfo=STUDIO_TIMEZONE
    )

    # Generate candidate slots at 15-minute intervals
    current_slot = work_start
    while current_slot < work_end:
        # Calculate when this appointment would end (including buffer)
        appointment_end = current_slot + timedelta(minutes=package_duration_minutes)
        buffered_end = appointment_end + timedelta(minutes=POST_BOOKING_BUFFER_MINUTES)

        # Check if appointment + buffer fits within working hours
        if buffered_end > work_end:
            break

        # Check if this slot is available
        if _is_slot_available(
            current_slot, appointment_end, buffered_end, bookings, blocked_periods
        ):
            # Convert to UTC for API response
            slot_utc = current_slot.astimezone(ZoneInfo("UTC"))

            slots.append(
                AvailabilitySlot(
                    start_datetime=slot_utc,
                    start_datetime_utc=slot_utc,
                    start_datetime_local=current_slot.isoformat(),
                    display_time=current_slot.strftime("%I:%M %p"),
                )
            )

        # Move to next slot
        current_slot += timedelta(minutes=SLOT_INTERVAL_MINUTES)

    return slots


def _is_slot_available(
    slot_start: datetime,
    appointment_end: datetime,
    buffered_end: datetime,
    bookings: list[Booking],
    blocked_periods: list[BlockedPeriod],
) -> bool:
    """Check if a time slot is available."""
    # Check against existing bookings (including their buffers)
    for booking in bookings:
        # Booking blocks from its start to its buffered_end
        if not (
            buffered_end <= booking.start_datetime
            or slot_start >= booking.buffered_end_datetime
        ):
            return False

    # Check against blocked periods
    # The appointment (without buffer) must not overlap with blocked period
    for period in blocked_periods:
        # Check if appointment overlaps with blocked period
        if not (
            appointment_end <= period.start_datetime
            or slot_start >= period.end_datetime
        ):
            return False

    return True
