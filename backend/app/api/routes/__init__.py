"""API routes."""

from fastapi import APIRouter

from app.api.routes import (
    auth,
    availability,
    blocked_periods,
    bookings,
    packages,
    photographers,
    working_hours,
)

api_router = APIRouter()

# Authentication routes
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# Package browsing routes (public)
api_router.include_router(packages.router, prefix="/packages", tags=["packages"])

# Photographer management and browsing routes
api_router.include_router(photographers.router, prefix="/photographers", tags=["photographers"])

# Working hours routes (photographer only)
api_router.include_router(working_hours.router, prefix="/working-hours", tags=["working-hours"])

# Blocked periods routes (photographer only)
api_router.include_router(blocked_periods.router, prefix="/blocked-periods", tags=["blocked-periods"])

# Availability routes (public)
api_router.include_router(availability.router, prefix="/availability", tags=["availability"])

# Booking routes (customer, photographer, admin)
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])

