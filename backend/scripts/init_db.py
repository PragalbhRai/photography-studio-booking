"""Initialize database with first superuser."""

from sqlmodel import Session, select

from app.core.config import settings
from app.core.db import engine
from app.core.security import get_password_hash
from app.models.user import User, UserRole


def init_db() -> None:
    """Initialize database with first admin user if not exists."""
    print("Initializing database...")
    
    with Session(engine) as session:
        # Check if admin user exists
        admin_user = session.exec(
            select(User).where(User.email == settings.FIRST_SUPERUSER)
        ).first()
        
        if not admin_user:
            admin_user = User(
                email=settings.FIRST_SUPERUSER,
                password_hash=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                full_name="Admin User",
                role=UserRole.ADMIN,
            )
            session.add(admin_user)
            session.commit()
            print(f"✓ Admin user created: {settings.FIRST_SUPERUSER}")
        else:
            print(f"✓ Admin user already exists: {settings.FIRST_SUPERUSER}")
    
    print("Database initialization complete")


if __name__ == "__main__":
    init_db()
