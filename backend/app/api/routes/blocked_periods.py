"""Blocked periods API routes."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.api.deps import CurrentPhotographer, get_session
from app.models.photographer import BlockedPeriod
from app.models.schemas import BlockedPeriodCreate, BlockedPeriodResponse

router = APIRouter()


@router.get("", response_model=list[BlockedPeriodResponse])
def list_blocked_periods(
    session: Session = Depends(get_session),
    current_photographer: CurrentPhotographer = None,
) -> list[BlockedPeriod]:
    """Get all blocked periods for the authenticated photographer."""
    periods = session.exec(
        select(BlockedPeriod)
        .where(
            BlockedPeriod.photographer_id
            == current_photographer.photographer_profile.id
        )
        .order_by(BlockedPeriod.start_datetime)
    ).all()
    return list(periods)


@router.post(
    "", response_model=BlockedPeriodResponse, status_code=status.HTTP_201_CREATED
)
def create_blocked_period(
    period_data: BlockedPeriodCreate,
    session: Session = Depends(get_session),
    current_photographer: CurrentPhotographer = None,
) -> BlockedPeriod:
    """Create a blocked period."""
    photographer_id = current_photographer.photographer_profile.id

    new_period = BlockedPeriod(
        photographer_id=photographer_id,
        start_datetime=period_data.start_datetime,
        end_datetime=period_data.end_datetime,
        reason=period_data.reason,
    )

    session.add(new_period)
    session.commit()
    session.refresh(new_period)
    return new_period


@router.delete("/{period_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blocked_period(
    period_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_photographer: CurrentPhotographer = None,
) -> None:
    """Delete a blocked period."""
    photographer_id = current_photographer.photographer_profile.id

    period = session.exec(
        select(BlockedPeriod)
        .where(BlockedPeriod.id == period_id)
        .where(BlockedPeriod.photographer_id == photographer_id)
    ).first()

    if not period:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blocked period not found or not owned by this photographer",
        )

    session.delete(period)
    session.commit()
