"""Application configuration."""

from typing import Any

from pydantic import (
    PostgresDsn,
    ValidationInfo,
    field_validator,
)
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )

    # Project
    PROJECT_NAME: str = "Photography Studio"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    # Database
    DATABASE_URL: PostgresDsn

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def build_db_connection(cls, v: str | None, info: ValidationInfo) -> str:
        """Build database URL if needed."""
        if isinstance(v, str):
            return v
        raise ValueError("DATABASE_URL must be provided")

    # Timezone
    STUDIO_TIMEZONE: str = "Asia/Kolkata"

    # Business Rules
    BOOKING_GRID_MINUTES: int = 15
    POST_APPOINTMENT_BUFFER_MINUTES: int = 5
    CANCELLATION_CUTOFF_HOURS: int = 2

    # First superuser
    FIRST_SUPERUSER: str
    FIRST_SUPERUSER_PASSWORD: str

    # Email (optional)
    SMTP_HOST: str | None = None
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    EMAILS_FROM_EMAIL: str | None = None

    def emails_enabled(self) -> bool:
        """Check if email is configured."""
        return bool(self.SMTP_HOST and self.EMAILS_FROM_EMAIL)

    # Sentry (optional)
    SENTRY_DSN: str | None = None


settings = Settings()  # type: ignore
