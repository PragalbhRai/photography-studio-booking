"""Package models."""

import uuid

from sqlalchemy import Column, Numeric
from sqlmodel import Field, Relationship, SQLModel


class Package(SQLModel, table=True):
    """Photography package/service."""

    __tablename__ = "package"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(nullable=False, max_length=255)
    description: str | None = Field(default=None, max_length=2000)
    price: float = Field(
        ge=0,
        sa_column=Column(Numeric(10, 2), nullable=False),
    )
    duration_minutes: int = Field(nullable=False, gt=0)
    category: str = Field(nullable=False, max_length=100)
    image_url: str = Field(nullable=False, max_length=1024)
    is_active: bool = Field(default=True, nullable=False)

    # Relationships
    photographer_packages: list["PhotographerPackage"] = Relationship(
        back_populates="package"
    )
    bookings: list["Booking"] = Relationship(back_populates="package")


class PhotographerPackage(SQLModel, table=True):
    """Many-to-many relationship between photographers and packages."""

    __tablename__ = "photographer_package"

    photographer_id: uuid.UUID = Field(
        foreign_key="photographer_profile.id",
        primary_key=True,
    )
    package_id: uuid.UUID = Field(
        foreign_key="package.id",
        primary_key=True,
    )

    # Relationships
    photographer: "PhotographerProfile" = Relationship(
        back_populates="photographer_packages"
    )
    package: Package = Relationship(back_populates="photographer_packages")
