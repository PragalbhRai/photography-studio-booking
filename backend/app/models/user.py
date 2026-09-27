"""User model and related schemas."""

import uuid
from datetime import UTC, datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.booking import Booking
    from app.models.photographer import PhotographerProfile


class UserRole(str, Enum):
    """User role enumeration."""

    CUSTOMER = "customer"
    PHOTOGRAPHER = "photographer"
    ADMIN = "admin"


class User(SQLModel, table=True):
    """User model for authentication and authorization."""

    __tablename__ = "user"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, nullable=False, index=True, max_length=255)
    password_hash: str = Field(nullable=False, max_length=255)
    full_name: str = Field(nullable=False, max_length=255)
    role: UserRole = Field(nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
    )

    # Relationships
    photographer_profile: Optional["PhotographerProfile"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"uselist": False},
    )
    bookings_as_customer: list["Booking"] = Relationship(
        back_populates="customer",
        sa_relationship_kwargs={"foreign_keys": "Booking.customer_id"},
    )

