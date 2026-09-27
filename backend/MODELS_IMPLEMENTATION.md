# Domain Models Implementation Summary

## Files Created/Modified

### Model Files Created
1. `app/models/user.py` - User model with role enum
2. `app/models/photographer.py` - Photographer-related models (PhotographerProfile, PortfolioImage, WorkingHours, BlockedPeriod)
3. `app/models/package.py` - Package and PhotographerPackage models
4. `app/models/booking.py` - Booking model with status enum

### Modified Files
1. `app/models/__init__.py` - Updated to import all models
2. `app/alembic/env.py` - Updated to import models for Alembic detection
3. `pyproject.toml` - Added hatchling wheel configuration
4. `.env` - Copied to backend directory for configuration

### Migration File Created
- `app/alembic/versions/8a7afb596a9a_initial_domain_models.py`

## Database Tables Created

### 1. user
- `id` (UUID, PK)
- `email` (VARCHAR(255), UNIQUE, NOT NULL, INDEXED)
- `password_hash` (VARCHAR(255), NOT NULL)
- `full_name` (VARCHAR(255), NOT NULL)
- `role` (VARCHAR, NOT NULL) - enum: customer, photographer, admin
- `created_at` (TIMESTAMPTZ, NOT NULL)

### 2. photographer_profile
- `id` (UUID, PK)
- `user_id` (UUID, FK → user.id, UNIQUE, NOT NULL, INDEXED)
- `bio` (TEXT, NULLABLE)
- `specialties` (TEXT[], NOT NULL, DEFAULT '{}')

### 3. portfolio_image
- `id` (UUID, PK)
- `photographer_id` (UUID, FK → photographer_profile.id, NOT NULL, INDEXED)
- `image_url` (VARCHAR(1024), NOT NULL)
- `caption` (VARCHAR(500), NULLABLE)
- `sort_order` (INTEGER, NOT NULL, DEFAULT 0)

### 4. package
- `id` (UUID, PK)
- `name` (VARCHAR(255), NOT NULL)
- `description` (VARCHAR(2000), NULLABLE)
- `price` (NUMERIC(10,2), NOT NULL, >= 0)
- `duration_minutes` (INTEGER, NOT NULL, > 0)
- `category` (VARCHAR(100), NOT NULL)
- `image_url` (VARCHAR(1024), NOT NULL)
- `is_active` (BOOLEAN, NOT NULL, DEFAULT TRUE)

### 5. photographer_package
- `photographer_id` (UUID, FK → photographer_profile.id, PK)
- `package_id` (UUID, FK → package.id, PK)
- Composite primary key (photographer_id, package_id)

### 6. working_hours
- `id` (UUID, PK)
- `photographer_id` (UUID, FK → photographer_profile.id, NOT NULL, INDEXED)
- `day_of_week` (INTEGER, NOT NULL, 0-6)
- `start_time` (TIME, NOT NULL)
- `end_time` (TIME, NOT NULL)
- UNIQUE (photographer_id, day_of_week)
- CHECK: start_time < end_time
- CHECK: day_of_week >= 0 AND day_of_week <= 6

### 7. blocked_period
- `id` (UUID, PK)
- `photographer_id` (UUID, FK → photographer_profile.id, NOT NULL, INDEXED)
- `start_datetime` (TIMESTAMPTZ, NOT NULL)
- `end_datetime` (TIMESTAMPTZ, NOT NULL)
- `reason` (VARCHAR(500), NULLABLE)
- CHECK: end_datetime > start_datetime
- INDEX: (photographer_id, start_datetime)

### 8. booking
- `id` (UUID, PK)
- `customer_id` (UUID, FK → user.id, NOT NULL, INDEXED)
- `photographer_id` (UUID, FK → photographer_profile.id, NOT NULL, INDEXED)
- `package_id` (UUID, FK → package.id, NOT NULL, INDEXED)
- `start_datetime` (TIMESTAMPTZ, NOT NULL)
- `end_datetime` (TIMESTAMPTZ, NOT NULL)
- `status` (VARCHAR, NOT NULL) - enum: confirmed, completed, cancelled_by_customer, cancelled_by_photographer, cancelled_by_admin
- `created_at` (TIMESTAMPTZ, NOT NULL)
- `time_range` (TSTZRANGE, GENERATED STORED)
  - Computed as: `tstzrange(start_datetime, end_datetime + interval '5 minutes', '[)')`
  - Half-open interval: includes start, excludes end

## Important Constraints Created

### Double-Booking Prevention
**Exclusion Constraint:** `exclude_booking_overlap`
```sql
EXCLUDE USING gist (
    photographer_id WITH =,
    time_range WITH &&
)
WHERE (status = 'confirmed')
```

This guarantees:
- Same photographer cannot have overlapping confirmed bookings
- Automatic 5-minute buffer after each appointment
- Half-open interval prevents edge case conflicts
- Only confirmed bookings participate (cancelled bookings don't block)

### Check Constraints
1. **package.price** >= 0
2. **package.duration_minutes** > 0
3. **working_hours.day_of_week** >= 0 AND <= 6
4. **working_hours** start_time < end_time
5. **blocked_period** end_datetime > start_datetime

### Unique Constraints
1. **user.email** - UNIQUE
2. **photographer_profile.user_id** - UNIQUE
3. **working_hours** (photographer_id, day_of_week) - UNIQUE

### Foreign Key Relationships
- photographer_profile.user_id → user.id
- portfolio_image.photographer_id → photographer_profile.id
- photographer_package.photographer_id → photographer_profile.id
- photographer_package.package_id → package.id
- working_hours.photographer_id → photographer_profile.id
- blocked_period.photographer_id → photographer_profile.id
- booking.customer_id → user.id
- booking.photographer_id → photographer_profile.id
- booking.package_id → package.id

## PostgreSQL Extension Required
- **btree_gist** - Enables exclusion constraints on multiple column types

## Migration Revision
- **Revision ID:** `8a7afb596a9a`
- **Description:** Initial domain models
- **Down Revision:** None (initial migration)

## Commands Used for Validation

### Model Import Test
```powershell
cd c:\Coding\photography_studio\backend
python -c "from app.models import User, PhotographerProfile, Package, Booking; print('✓ Models imported successfully')"
```
**Result:** ✓ SUCCESS - All models imported without errors

### Migration Generation
```powershell
cd c:\Coding\photography_studio\backend
alembic revision -m "Initial domain models"
```
**Result:** ✓ SUCCESS - Migration file created

## Validation Results

### ✅ Model Imports
All models import successfully with proper relationships and field definitions.

### ✅ SQLModel Structure
- Proper use of SQLModel Field() with constraints
- Correct SQLAlchemy Column types for PostgreSQL specifics
- Proper relationship definitions with back_populates

### ✅ Migration Structure
- Complete DDL for all 8 tables
- All foreign keys defined
- All unique constraints defined
- All check constraints defined
- btree_gist extension enabled
- Exclusion constraint for double-booking prevention
- Proper indexes for foreign keys and query optimization

## Issues/Blockers

### ⚠️ PostgreSQL Database Not Running
**Status:** Migration file created but NOT applied to database.

**Reason:** PostgreSQL database is not currently running. The migration cannot be applied without a running database instance.

**Commands to apply when database is available:**
```powershell
# Start database
docker compose up -d db

# Apply migration
cd c:\Coding\photography_studio\backend
alembic upgrade head
```

**Expected result when applied:**
- All 8 tables will be created
- btree_gist extension will be enabled
- Exclusion constraint will enforce booking overlap prevention
- Check constraints will validate data integrity

## Important Implementation Notes

### Booking Time Range
The `time_range` column is a **generated column** that automatically:
1. Takes `start_datetime`
2. Adds 5 minutes to `end_datetime`
3. Creates half-open interval `[start, end+5min)`

**Example:**
- Booking: 10:00 AM - 11:30 AM
- Stored range: `[10:00, 11:35)` 
- Next available slot: 11:35 AM (not 11:30 AM)

### Exclusion Constraint Behavior
- Enforced at PostgreSQL level (not application level)
- Concurrent booking attempts will result in one success, one failure
- Application should catch constraint violation and return HTTP 409 Conflict
- Only applies to `status = 'confirmed'` bookings

### SQLModel vs SQLAlchemy Columns
Some fields use `sa_column=Column(...)` for PostgreSQL-specific types:
- `price` - NUMERIC(10,2) for precise decimal handling
- Timestamps - TIMESTAMP(timezone=True) for explicit timezone support
- `time_range` - Generated via raw SQL (not in SQLModel directly)
- `specialties` - ARRAY(Text) for PostgreSQL array type

## Next Steps

1. Start PostgreSQL database
2. Apply migration with `alembic upgrade head`
3. Verify tables created with database client
4. Test exclusion constraint with overlapping booking inserts
5. Implement authentication (separate task)
6. Implement API endpoints (separate task)
7. Implement availability calculation service (separate task)
