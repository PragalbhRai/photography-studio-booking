"""Booking model."""

import uuid
from datetime import UTC, datetime
from enum import Enum

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import TIMESTAMP
from sqlmodel import Field, Relationship, SQLModel


class BookingStatus(str, Enum):
    """Booking status enumeration."""

    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED_BY_CUSTOMER = "cancelled_by_customer"
    CANCELLED_BY_PHOTOGRAPHER = "cancelled_by_photographer"
    CANCELLED_BY_ADMIN = "cancelled_by_admin"


class Booking(SQLModel, table=True):
    """Booking/appointment model."""

    __tablename__ = "booking"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    customer_id: uuid.UUID = Field(
        foreign_key="user.id",
        nullable=False,
        index=True,
    )
    photographer_id: uuid.UUID = Field(
        foreign_key="photographer_profile.id",
        nullable=False,
        index=True,
    )
    package_id: uuid.UUID = Field(
        foreign_key="package.id",
        nullable=False,
        index=True,
    )
    start_datetime: datetime = Field(
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False),
    )
    end_datetime: datetime = Field(
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False),
    )
    buffered_end_datetime: datetime = Field(
        sa_column=Column(
            TIMESTAMP(timezone=True),
            nullable=False,
            # Automatically populated by database trigger
            # Represents end_datetime + 5 minutes for overlap detection
        ),
    )
    status: BookingStatus = Field(nullable=False, default=BookingStatus.CONFIRMED)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
    )

    # Relationships
    customer: "User" = Relationship(
        back_populates="bookings_as_customer",
        sa_relationship_kwargs={"foreign_keys": "[Booking.customer_id]"},
    )
    photographer: "PhotographerProfile" = Relationship(back_populates="bookings")
    package: "Package" = Relationship(back_populates="bookings")
