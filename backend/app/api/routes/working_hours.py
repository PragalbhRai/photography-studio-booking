"""Working hours API routes."""


from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.api.deps import CurrentPhotographer, get_session
from app.models.photographer import WorkingHours
from app.models.schemas import WorkingHoursCreate, WorkingHoursResponse

router = APIRouter()


@router.get("", response_model=list[WorkingHoursResponse])
def list_working_hours(
    session: Session = Depends(get_session),
    current_photographer: CurrentPhotographer = None,
) -> list[WorkingHours]:
    """Get all working hours for the authenticated photographer."""
    hours = session.exec(
        select(WorkingHours)
        .where(
            WorkingHours.photographer_id == current_photographer.photographer_profile.id
        )
        .order_by(WorkingHours.day_of_week)
    ).all()
    return list(hours)


@router.post(
    "", response_model=WorkingHoursResponse, status_code=status.HTTP_201_CREATED
)
def create_or_update_working_hours(
    hours_data: WorkingHoursCreate,
    session: Session = Depends(get_session),
    current_photographer: CurrentPhotographer = None,
) -> WorkingHours:
    """Create or update working hours for a specific day."""
    photographer_id = current_photographer.photographer_profile.id

    # Check if working hours already exist for this day
    existing = session.exec(
        select(WorkingHours)
        .where(WorkingHours.photographer_id == photographer_id)
        .where(WorkingHours.day_of_week == hours_data.day_of_week)
    ).first()

    if existing:
        # Update existing
        existing.start_time = hours_data.start_time
        existing.end_time = hours_data.end_time
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing
    else:
        # Create new
        new_hours = WorkingHours(
            photographer_id=photographer_id,
            day_of_week=hours_data.day_of_week,
            start_time=hours_data.start_time,
            end_time=hours_data.end_time,
        )
        session.add(new_hours)
        session.commit()
        session.refresh(new_hours)
        return new_hours


@router.delete("/{day_of_week}", status_code=status.HTTP_204_NO_CONTENT)
def delete_working_hours(
    day_of_week: int,
    session: Session = Depends(get_session),
    current_photographer: CurrentPhotographer = None,
) -> None:
    """Delete working hours for a specific day."""
    if day_of_week < 0 or day_of_week > 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="day_of_week must be between 0 (Monday) and 6 (Sunday)",
        )

    photographer_id = current_photographer.photographer_profile.id

    hours = session.exec(
        select(WorkingHours)
        .where(WorkingHours.photographer_id == photographer_id)
        .where(WorkingHours.day_of_week == day_of_week)
    ).first()

    if not hours:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Working hours not found for day {day_of_week}",
        )

    session.delete(hours)
    session.commit()
