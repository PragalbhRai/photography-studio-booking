"""API dependencies for authentication and database sessions."""

import uuid
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from sqlmodel import Session, select

from app.core.config import settings
from app.core.db import get_session
from app.models.user import User, UserRole

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

# Type aliases for dependency injection
SessionDep = Annotated[Session, Depends(get_session)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]


def get_current_user(session: SessionDep, token: TokenDep) -> User:
    """
    Get current authenticated user from JWT token.
    
    Raises:
        HTTPException: If token is invalid or user not found.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        user_id_str: str | None = payload.get("sub")
        if user_id_str is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user_id = uuid.UUID(user_id_str)
    except (InvalidTokenError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_current_customer(current_user: CurrentUser) -> User:
    """
    Verify current user has customer role.
    
    Raises:
        HTTPException: If user is not a customer.
    """
    if current_user.role != UserRole.CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access required"
        )
    return current_user


CurrentCustomer = Annotated[User, Depends(get_current_customer)]


def get_current_photographer(current_user: CurrentUser) -> User:
    """
    Verify current user has photographer role.
    
    Raises:
        HTTPException: If user is not a photographer.
    """
    if current_user.role != UserRole.PHOTOGRAPHER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Photographer access required"
        )
    return current_user


CurrentPhotographer = Annotated[User, Depends(get_current_photographer)]


def get_current_admin(current_user: CurrentUser) -> User:
    """
    Verify current user has admin role.
    
    Raises:
        HTTPException: If user is not an admin.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


CurrentAdmin = Annotated[User, Depends(get_current_admin)]

