"""Photographer management and browsing routes."""

import uuid

from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from app.api.deps import CurrentAdmin, SessionDep
from app.core.security import get_password_hash
from app.models.package import Package
from app.models.photographer import PhotographerProfile, PortfolioImage
from app.models.schemas import (
    PackageResponse,
    PhotographerCreate,
    PhotographerDetailResponse,
    PhotographerListResponse,
    PhotographerResponse,
    PortfolioImageResponse,
    UserResponse,
)
from app.models.user import User, UserRole

router = APIRouter()


@router.post(
    "", response_model=PhotographerResponse, status_code=status.HTTP_201_CREATED
)
def create_photographer(
    photographer_in: PhotographerCreate,
    session: SessionDep,
    current_admin: CurrentAdmin,
) -> PhotographerResponse:
    """
    Create a photographer account with profile.

    Admin only. Creates both User and PhotographerProfile.
    The user will always have role 'photographer'.
    """
    # Check if user already exists
    existing_user = session.exec(
        select(User).where(User.email == photographer_in.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create photographer user
    user = User(
        email=photographer_in.email,
        password_hash=get_password_hash(photographer_in.password),
        full_name=photographer_in.full_name,
        role=UserRole.PHOTOGRAPHER,  # Always photographer
    )

    session.add(user)
    session.flush()  # Flush to get user.id

    # Create photographer profile
    profile = PhotographerProfile(
        user_id=user.id,
        bio=photographer_in.bio,
        specialties=photographer_in.specialties,
    )

    session.add(profile)
    session.commit()
    session.refresh(user)
    session.refresh(profile)

    return PhotographerResponse(
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
        ),
        photographer_profile_id=profile.id,
    )


@router.get("", response_model=list[PhotographerListResponse])
def list_photographers(session: SessionDep) -> list[PhotographerListResponse]:
    """
    List all photographers.

    Public endpoint - no authentication required.
    Returns basic photographer information.
    """
    # Get all photographer profiles with their users
    profiles = session.exec(
        select(PhotographerProfile).join(User).order_by(User.full_name)
    ).all()

    result = []
    for profile in profiles:
        result.append(
            PhotographerListResponse(
                id=profile.id,
                full_name=profile.user.full_name,
                bio=profile.bio,
                specialties=profile.specialties,
            )
        )

    return result


@router.get("/{photographer_id}", response_model=PhotographerDetailResponse)
def get_photographer(
    photographer_id: uuid.UUID,
    session: SessionDep,
) -> PhotographerDetailResponse:
    """
    Get photographer detail with portfolio and packages.

    Public endpoint - no authentication required.
    """
    profile = session.get(PhotographerProfile, photographer_id)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Photographer not found"
        )

    # Get portfolio images ordered by sort_order
    portfolio_images = session.exec(
        select(PortfolioImage)
        .where(PortfolioImage.photographer_id == photographer_id)
        .order_by(PortfolioImage.sort_order)
    ).all()

    # Get packages associated with this photographer
    # Via photographer_package junction table
    from app.models.package import PhotographerPackage

    photographer_packages = session.exec(
        select(Package)
        .join(PhotographerPackage, Package.id == PhotographerPackage.package_id)
        .where(PhotographerPackage.photographer_id == photographer_id)
        .where(Package.is_active)
        .order_by(Package.name)
    ).all()

    return PhotographerDetailResponse(
        id=profile.id,
        full_name=profile.user.full_name,
        email=profile.user.email,
        bio=profile.bio,
        specialties=profile.specialties,
        portfolio_images=[
            PortfolioImageResponse(
                id=img.id,
                image_url=img.image_url,
                caption=img.caption,
                sort_order=img.sort_order,
            )
            for img in portfolio_images
        ],
        packages=[
            PackageResponse(
                id=pkg.id,
                name=pkg.name,
                description=pkg.description,
                price=float(pkg.price),
                duration_minutes=pkg.duration_minutes,
                category=pkg.category,
                image_url=pkg.image_url,
                is_active=pkg.is_active,
            )
            for pkg in photographer_packages
        ],
    )
