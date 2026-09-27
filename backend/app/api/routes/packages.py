"""Package browsing routes."""

import uuid

from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from app.api.deps import CurrentAdmin, SessionDep
from app.models.package import Package, PhotographerPackage
from app.models.photographer import PhotographerProfile
from app.models.schemas import (
    PackageAssignmentCreate,
    PackageCreate,
    PackageResponse,
)

router = APIRouter()


@router.get("", response_model=list[PackageResponse])
def list_packages(session: SessionDep) -> list[Package]:
    """
    List all active packages.

    Public endpoint - no authentication required.
    """
    packages = session.exec(
        select(Package).where(Package.is_active).order_by(Package.name)
    ).all()

    return list(packages)


@router.post("", response_model=PackageResponse, status_code=status.HTTP_201_CREATED)
def create_package(
    package_in: PackageCreate,
    session: SessionDep,
    current_admin: CurrentAdmin,
) -> Package:
    """
    Create a new package and optionally assign to photographers.

    Admin only.
    """
    package = Package(
        name=package_in.name,
        description=package_in.description,
        price=package_in.price,
        duration_minutes=package_in.duration_minutes,
        category=package_in.category,
        image_url=package_in.image_url,
        is_active=True,
    )
    session.add(package)
    session.flush()

    for photog_id in package_in.photographer_ids:
        photog = session.get(PhotographerProfile, photog_id)
        if photog:
            assignment = PhotographerPackage(
                photographer_id=photog_id,
                package_id=package.id,
            )
            session.add(assignment)

    session.commit()
    session.refresh(package)
    return package


@router.get("/{package_id}", response_model=PackageResponse)
def get_package(package_id: uuid.UUID, session: SessionDep) -> Package:
    """
    Get a single active package by ID.

    Public endpoint - no authentication required.
    """
    package = session.get(Package, package_id)

    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Package not found"
        )

    if not package.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Package not found"
        )

    return package


@router.post(
    "/{package_id}/photographers",
    status_code=status.HTTP_201_CREATED,
)
def assign_package_to_photographer(
    package_id: uuid.UUID,
    assignment_in: PackageAssignmentCreate,
    session: SessionDep,
    current_admin: CurrentAdmin,
) -> dict[str, str]:
    """Assign a package to a photographer (admin only)."""
    package = session.get(Package, package_id)
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Package not found"
        )

    photographer = session.get(PhotographerProfile, assignment_in.photographer_id)
    if not photographer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Photographer not found"
        )

    existing = session.exec(
        select(PhotographerPackage)
        .where(PhotographerPackage.package_id == package_id)
        .where(PhotographerPackage.photographer_id == assignment_in.photographer_id)
    ).first()

    if not existing:
        link = PhotographerPackage(
            package_id=package_id,
            photographer_id=assignment_in.photographer_id,
        )
        session.add(link)
        session.commit()

    return {"message": "Package assigned successfully"}


@router.delete(
    "/{package_id}/photographers/{photographer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def unassign_package_from_photographer(
    package_id: uuid.UUID,
    photographer_id: uuid.UUID,
    session: SessionDep,
    current_admin: CurrentAdmin,
) -> None:
    """Remove a package assignment from a photographer (admin only)."""
    existing = session.exec(
        select(PhotographerPackage)
        .where(PhotographerPackage.package_id == package_id)
        .where(PhotographerPackage.photographer_id == photographer_id)
    ).first()

    if existing:
        session.delete(existing)
        session.commit()

