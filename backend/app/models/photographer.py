"""Photographer-related models."""

import uuid
from datetime import datetime, time

from sqlalchemy import Column, Text, Time, UniqueConstraint
from sqlalchemy.dialects.postgresql import ARRAY, TIMESTAMP
from sqlmodel import Field, Relationship, SQLModel


class PhotographerProfile(SQLModel, table=True):
    """Photographer profile with extended information."""

    __tablename__ = "photographer_profile"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(
        foreign_key="user.id",
        unique=True,
        nullable=False,
        index=True,
    )
    bio: str | None = Field(default=None, sa_column=Column(Text, nullable=True))
    specialties: list[str] = Field(
        default_factory=list,
        sa_column=Column(ARRAY(Text), nullable=False, server_default="{}"),
    )

    # Relationships
    user: "User" = Relationship(back_populates="photographer_profile")
    portfolio_images: list["PortfolioImage"] = Relationship(
        back_populates="photographer"
    )
    working_hours: list["WorkingHours"] = Relationship(back_populates="photographer")
    blocked_periods: list["BlockedPeriod"] = Relationship(back_populates="photographer")
    photographer_packages: list["PhotographerPackage"] = Relationship(
        back_populates="photographer"
    )
    bookings: list["Booking"] = Relationship(back_populates="photographer")


class PortfolioImage(SQLModel, table=True):
    """Portfolio images for photographers."""

    __tablename__ = "portfolio_image"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    photographer_id: uuid.UUID = Field(
        foreign_key="photographer_profile.id",
        nullable=False,
        index=True,
    )
    image_url: str = Field(nullable=False, max_length=1024)
    caption: str | None = Field(default=None, max_length=500)
    sort_order: int = Field(default=0, nullable=False)

    # Relationships
    photographer: PhotographerProfile = Relationship(back_populates="portfolio_images")


class WorkingHours(SQLModel, table=True):
    """Working hours configuration for photographers."""

    __tablename__ = "working_hours"
    __table_args__ = (
        UniqueConstraint("photographer_id", "day_of_week", name="uq_photographer_day"),
    )

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    photographer_id: uuid.UUID = Field(
        foreign_key="photographer_profile.id",
        nullable=False,
        index=True,
    )
    day_of_week: int = Field(
        nullable=False,
        ge=0,
        le=6,
        description="0=Monday, 6=Sunday",
    )
    start_time: time = Field(
        sa_column=Column(Time, nullable=False),
    )
    end_time: time = Field(
        sa_column=Column(Time, nullable=False),
    )

    # Relationships
    photographer: PhotographerProfile = Relationship(back_populates="working_hours")


class BlockedPeriod(SQLModel, table=True):
    """Blocked time periods for photographers."""

    __tablename__ = "blocked_period"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    photographer_id: uuid.UUID = Field(
        foreign_key="photographer_profile.id",
        nullable=False,
        index=True,
    )
    start_datetime: datetime = Field(
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False),
    )
    end_datetime: datetime = Field(
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False),
    )
    reason: str | None = Field(default=None, max_length=500)

    # Relationships
    photographer: PhotographerProfile = Relationship(back_populates="blocked_periods")
