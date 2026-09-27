"""Booking API routes."""

import uuid
from datetime import UTC, datetime, timedelta
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from app.api.deps import (
    CurrentCustomer,
    CurrentPhotographer,
    CurrentUser,
    get_session,
)
from app.models.booking import Booking, BookingStatus
from app.models.package import Package
from app.models.photographer import BlockedPeriod, PhotographerProfile, WorkingHours
from app.models.schemas import BookingCreate, BookingResponse, CancellationResponse
from app.models.user import User

router = APIRouter()

STUDIO_TIMEZONE = ZoneInfo("Asia/Kolkata")
POST_BOOKING_BUFFER_MINUTES = 5
CANCELLATION_CUTOFF_HOURS = 2


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_data: BookingCreate,
    session: Session = Depends(get_session),
    current_customer: CurrentCustomer = None,
) -> BookingResponse:
    """
    Create a new booking.

    Validates working hours, blocked periods, and booking conflicts.
    Relies on PostgreSQL exclusion constraint as final concurrency authority.
    """
    # Get package to determine duration
    package = session.get(Package, booking_data.package_id)
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

    # Verify photographer exists
    photographer = session.get(PhotographerProfile, booking_data.photographer_id)
    if not photographer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photographer not found",
        )

    # Calculate end times
    start_datetime = booking_data.start_datetime
    end_datetime = start_datetime + timedelta(minutes=package.duration_minutes)
    buffered_end_datetime = end_datetime + timedelta(
        minutes=POST_BOOKING_BUFFER_MINUTES
    )

    # Convert to local timezone for validation
    start_local = start_datetime.astimezone(STUDIO_TIMEZONE)
    buffered_end_local = buffered_end_datetime.astimezone(STUDIO_TIMEZONE)

    # Validate working hours
    day_of_week = start_local.date().weekday()
    working_hours = session.exec(
        select(WorkingHours)
        .where(WorkingHours.photographer_id == booking_data.photographer_id)
        .where(WorkingHours.day_of_week == day_of_week)
    ).first()

    if not working_hours:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Photographer does not work on this day",
        )

    # Check if appointment (including buffer) fits within working hours
    work_start = datetime.combine(
        start_local.date(), working_hours.start_time, tzinfo=STUDIO_TIMEZONE
    )
    work_end = datetime.combine(
        start_local.date(), working_hours.end_time, tzinfo=STUDIO_TIMEZONE
    )

    if start_local < work_start or buffered_end_local > work_end:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment (including buffer) does not fit within working hours",
        )

    # Validate not in blocked period
    blocked_periods = session.exec(
        select(BlockedPeriod)
        .where(BlockedPeriod.photographer_id == booking_data.photographer_id)
        .where(BlockedPeriod.start_datetime <= end_datetime)
        .where(BlockedPeriod.end_datetime >= start_datetime)
    ).all()

    if blocked_periods:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Selected time overlaps with photographer's blocked period",
        )

    # Create booking
    new_booking = Booking(
        customer_id=current_customer.id,
        photographer_id=booking_data.photographer_id,
        package_id=booking_data.package_id,
        start_datetime=start_datetime,
        end_datetime=end_datetime,
        buffered_end_datetime=buffered_end_datetime,
        status=BookingStatus.CONFIRMED,
    )

    try:
        session.add(new_booking)
        session.commit()
        session.refresh(new_booking)
    except IntegrityError as e:
        session.rollback()
        # Check if it's the exclusion constraint
        if "exclude_booking_overlap" in str(e.orig):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Selected time slot is no longer available (booking conflict)",
            ) from e
        raise

    # Load related data
    customer = session.get(User, new_booking.customer_id)
    photographer_user = session.get(User, photographer.user_id)

    return BookingResponse(
        id=new_booking.id,
        customer_id=new_booking.customer_id,
        photographer_id=new_booking.photographer_id,
        package_id=new_booking.package_id,
        start_datetime=new_booking.start_datetime,
        end_datetime=new_booking.end_datetime,
        status=new_booking.status,
        created_at=new_booking.created_at,
        customer_name=customer.full_name if customer else None,
        photographer_name=photographer_user.full_name if photographer_user else None,
        package_name=package.name,
    )


@router.get("/me", response_model=list[BookingResponse])
def list_my_bookings(
    session: Session = Depends(get_session),
    current_customer: CurrentCustomer = None,
) -> list[BookingResponse]:
    """Get all bookings for the authenticated customer."""
    bookings = session.exec(
        select(Booking)
        .where(Booking.customer_id == current_customer.id)
        .order_by(Booking.start_datetime.desc())
    ).all()

    results = []
    for booking in bookings:
        # Load related data
        photographer = session.get(PhotographerProfile, booking.photographer_id)
        photographer_user = (
            session.get(User, photographer.user_id) if photographer else None
        )
        package = session.get(Package, booking.package_id)

        results.append(
            BookingResponse(
                id=booking.id,
                customer_id=booking.customer_id,
                photographer_id=booking.photographer_id,
                package_id=booking.package_id,
                start_datetime=booking.start_datetime,
                end_datetime=booking.end_datetime,
                status=booking.status,
                created_at=booking.created_at,
                customer_name=current_customer.full_name,
                photographer_name=photographer_user.full_name
                if photographer_user
                else None,
                package_name=package.name if package else None,
            )
        )

    return results


@router.get("/photographer/me", response_model=list[BookingResponse])
def list_photographer_bookings(
    session: Session = Depends(get_session),
    current_photographer: CurrentPhotographer = None,
) -> list[BookingResponse]:
    """Get all bookings for the authenticated photographer."""
    profile = session.exec(
        select(PhotographerProfile).where(
            PhotographerProfile.user_id == current_photographer.id
        )
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photographer profile not found",
        )

    bookings = session.exec(
        select(Booking)
        .where(Booking.photographer_id == profile.id)
        .order_by(Booking.start_datetime.desc())
    ).all()

    results = []
    for booking in bookings:
        customer = session.get(User, booking.customer_id)
        package = session.get(Package, booking.package_id)

        results.append(
            BookingResponse(
                id=booking.id,
                customer_id=booking.customer_id,
                photographer_id=booking.photographer_id,
                package_id=booking.package_id,
                start_datetime=booking.start_datetime,
                end_datetime=booking.end_datetime,
                status=booking.status,
                created_at=booking.created_at,
                customer_name=customer.full_name if customer else None,
                photographer_name=current_photographer.full_name,
                package_name=package.name if package else None,
            )
        )

    return results


@router.post("/{booking_id}/cancel", response_model=CancellationResponse)
def cancel_booking(
    booking_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: CurrentUser = None,
) -> CancellationResponse:
    """
    Cancel a booking.

    - Customer can cancel their own booking if >= 2 hours remain
    - Photographer can cancel bookings assigned to them
    - Admin can cancel any booking
    """
    # Get booking
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    # Check if already cancelled or completed
    if booking.status != BookingStatus.CONFIRMED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel booking with status: {booking.status}",
        )

    # Determine cancellation status based on user role
    from app.models.user import UserRole

    cancelled_at = datetime.now(UTC)
    new_status: BookingStatus

    if current_user.role == UserRole.ADMIN:
        new_status = BookingStatus.CANCELLED_BY_ADMIN
    elif current_user.role == UserRole.PHOTOGRAPHER:
        # Verify photographer owns this booking
        photographer_profile = session.exec(
            select(PhotographerProfile).where(
                PhotographerProfile.user_id == current_user.id
            )
        ).first()

        if (
            not photographer_profile
            or booking.photographer_id != photographer_profile.id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only cancel bookings assigned to you",
            )
        new_status = BookingStatus.CANCELLED_BY_PHOTOGRAPHER
    elif current_user.role == UserRole.CUSTOMER:
        # Verify customer owns this booking
        if booking.customer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only cancel your own bookings",
            )

        # Check 2-hour cutoff
        time_until_booking = booking.start_datetime - datetime.now(UTC)
        if time_until_booking.total_seconds() < CANCELLATION_CUTOFF_HOURS * 3600:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Bookings can only be cancelled at least {CANCELLATION_CUTOFF_HOURS} hours in advance",
            )
        new_status = BookingStatus.CANCELLED_BY_CUSTOMER
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to cancel bookings",
        )

    # Update booking status
    booking.status = new_status
    session.add(booking)
    session.commit()

    return CancellationResponse(
        booking_id=booking.id,
        status=new_status,
        cancelled_at=cancelled_at,
    )
