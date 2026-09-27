"""Pydantic schemas for API requests and responses."""

import uuid
from datetime import datetime, time

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.booking import BookingStatus
from app.models.user import UserRole


# Authentication schemas
class UserRegister(BaseModel):
    """Customer registration schema."""

    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=255)


class UserLogin(BaseModel):
    """User login schema."""

    email: EmailStr
    password: str


class Token(BaseModel):
    """JWT token response schema."""

    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """User response schema."""

    id: uuid.UUID
    email: str
    full_name: str
    role: UserRole


# Photographer creation schema
class PhotographerCreate(BaseModel):
    """Photographer account creation schema (admin only)."""

    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=255)
    bio: str | None = None
    specialties: list[str] = Field(default_factory=list)


class PhotographerResponse(BaseModel):
    """Photographer creation response."""

    user: UserResponse
    photographer_profile_id: uuid.UUID


# Package schemas
class PackageResponse(BaseModel):
    """Package response schema."""

    id: uuid.UUID
    name: str
    description: str | None
    price: float
    duration_minutes: int
    category: str
    image_url: str
    is_active: bool

    class Config:
        from_attributes = True


class PackageCreate(BaseModel):
    """Package creation schema (admin only)."""

    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    price: float = Field(gt=0)
    duration_minutes: int = Field(gt=0)
    category: str = Field(min_length=1, max_length=100)
    image_url: str = Field(min_length=1)
    photographer_ids: list[uuid.UUID] = Field(default_factory=list)


class PackageAssignmentCreate(BaseModel):
    """Assign package to photographer."""

    photographer_id: uuid.UUID



# Portfolio image schema
class PortfolioImageResponse(BaseModel):
    """Portfolio image response schema."""

    id: uuid.UUID
    image_url: str
    caption: str | None
    sort_order: int

    class Config:
        from_attributes = True


# Photographer list response
class PhotographerListResponse(BaseModel):
    """Photographer list item response."""

    id: uuid.UUID
    full_name: str
    bio: str | None
    specialties: list[str]


# Photographer detail response
class PhotographerDetailResponse(BaseModel):
    """Photographer detail response with portfolio and packages."""

    id: uuid.UUID
    full_name: str
    email: str
    bio: str | None
    specialties: list[str]
    portfolio_images: list[PortfolioImageResponse]
    packages: list[PackageResponse]


# Working hours schemas
class WorkingHoursCreate(BaseModel):
    """Create or update working hours for a day."""

    day_of_week: int = Field(ge=0, le=6, description="0=Monday, 6=Sunday")
    start_time: time
    end_time: time

    @field_validator("end_time")
    @classmethod
    def validate_end_after_start(cls, v: time, info) -> time:
        """Validate end_time is after start_time."""
        if "start_time" in info.data and v <= info.data["start_time"]:
            raise ValueError("end_time must be after start_time")
        return v


class WorkingHoursResponse(BaseModel):
    """Working hours response."""

    id: uuid.UUID
    photographer_id: uuid.UUID
    day_of_week: int
    start_time: time
    end_time: time

    class Config:
        from_attributes = True


# Blocked period schemas
class BlockedPeriodCreate(BaseModel):
    """Create a blocked period."""

    start_datetime: datetime
    end_datetime: datetime
    reason: str | None = Field(None, max_length=500)

    @field_validator("end_datetime")
    @classmethod
    def validate_end_after_start(cls, v: datetime, info) -> datetime:
        """Validate end_datetime is after start_datetime."""
        if "start_datetime" in info.data and v <= info.data["start_datetime"]:
            raise ValueError("end_datetime must be after start_datetime")
        return v


class BlockedPeriodResponse(BaseModel):
    """Blocked period response."""

    id: uuid.UUID
    photographer_id: uuid.UUID
    start_datetime: datetime
    end_datetime: datetime
    reason: str | None

    class Config:
        from_attributes = True


# Availability schemas
class AvailabilitySlot(BaseModel):
    """Available time slot."""

    start_datetime: datetime
    start_datetime_utc: datetime
    start_datetime_local: str  # ISO format string in Asia/Kolkata
    display_time: str  # Human-readable format like "09:00 AM"


class AvailabilityResponse(BaseModel):
    """Availability response."""

    date: str  # YYYY-MM-DD
    photographer_id: uuid.UUID
    package_id: uuid.UUID
    package_duration_minutes: int
    timezone: str = "Asia/Kolkata"
    available_slots: list[AvailabilitySlot]


# Booking schemas
class BookingCreate(BaseModel):
    """Create a booking."""

    photographer_id: uuid.UUID
    package_id: uuid.UUID
    start_datetime: datetime


class BookingResponse(BaseModel):
    """Booking response."""

    id: uuid.UUID
    customer_id: uuid.UUID
    photographer_id: uuid.UUID
    package_id: uuid.UUID
    start_datetime: datetime
    end_datetime: datetime
    status: BookingStatus
    created_at: datetime
    # Include related data for convenience
    customer_name: str | None = None
    photographer_name: str | None = None
    package_name: str | None = None

    class Config:
        from_attributes = True


class CancellationResponse(BaseModel):
    """Cancellation response."""

    booking_id: uuid.UUID
    status: BookingStatus
    cancelled_at: datetime
