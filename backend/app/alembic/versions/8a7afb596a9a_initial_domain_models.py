"""Initial domain models

Revision ID: 8a7afb596a9a
Revises: 
Create Date: 2026-09-26 20:16:55.258214

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import sqlmodel


# revision identifiers, used by Alembic.
revision = '8a7afb596a9a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Enable btree_gist extension for exclusion constraints
    op.execute('CREATE EXTENSION IF NOT EXISTS btree_gist')
    
    # Create user table
    op.create_table(
        'user',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('email', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column('password_hash', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column('full_name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column('role', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=False)
    
    # Create photographer_profile table
    op.create_table(
        'photographer_profile',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('specialties', postgresql.ARRAY(sa.Text()), nullable=False, server_default='{}'),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_photographer_profile_user_id'), 'photographer_profile', ['user_id'], unique=False)
    
    # Create package table
    op.create_table(
        'package',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column('description', sqlmodel.sql.sqltypes.AutoString(length=2000), nullable=True),
        sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('duration_minutes', sa.Integer(), nullable=False),
        sa.Column('category', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=False),
        sa.Column('image_url', sqlmodel.sql.sqltypes.AutoString(length=1024), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.CheckConstraint('price >= 0', name='ck_package_price_positive'),
        sa.CheckConstraint('duration_minutes > 0', name='ck_package_duration_positive'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create portfolio_image table
    op.create_table(
        'portfolio_image',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('photographer_id', sa.UUID(), nullable=False),
        sa.Column('image_url', sqlmodel.sql.sqltypes.AutoString(length=1024), nullable=False),
        sa.Column('caption', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
        sa.ForeignKeyConstraint(['photographer_id'], ['photographer_profile.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_portfolio_image_photographer_id'), 'portfolio_image', ['photographer_id'], unique=False)
    
    # Create working_hours table
    op.create_table(
        'working_hours',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('photographer_id', sa.UUID(), nullable=False),
        sa.Column('day_of_week', sa.Integer(), nullable=False),
        sa.Column('start_time', sa.Time(), nullable=False),
        sa.Column('end_time', sa.Time(), nullable=False),
        sa.CheckConstraint('day_of_week >= 0 AND day_of_week <= 6', name='ck_working_hours_valid_day'),
        sa.CheckConstraint('start_time < end_time', name='ck_working_hours_valid_times'),
        sa.ForeignKeyConstraint(['photographer_id'], ['photographer_profile.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('photographer_id', 'day_of_week', name='uq_photographer_day')
    )
    op.create_index(op.f('ix_working_hours_photographer_id'), 'working_hours', ['photographer_id'], unique=False)
    
    # Create blocked_period table
    op.create_table(
        'blocked_period',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('photographer_id', sa.UUID(), nullable=False),
        sa.Column('start_datetime', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('end_datetime', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('reason', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
        sa.CheckConstraint('end_datetime > start_datetime', name='ck_blocked_period_valid_times'),
        sa.ForeignKeyConstraint(['photographer_id'], ['photographer_profile.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_blocked_period_photographer_id'), 'blocked_period', ['photographer_id'], unique=False)
    op.create_index('ix_blocked_period_photographer_start', 'blocked_period', ['photographer_id', 'start_datetime'], unique=False)
    
    # Create photographer_package junction table
    op.create_table(
        'photographer_package',
        sa.Column('photographer_id', sa.UUID(), nullable=False),
        sa.Column('package_id', sa.UUID(), nullable=False),
        sa.ForeignKeyConstraint(['package_id'], ['package.id'], ),
        sa.ForeignKeyConstraint(['photographer_id'], ['photographer_profile.id'], ),
        sa.PrimaryKeyConstraint('photographer_id', 'package_id')
    )
    
    # Create booking table with buffered_end_datetime column
    op.create_table(
        'booking',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('customer_id', sa.UUID(), nullable=False),
        sa.Column('photographer_id', sa.UUID(), nullable=False),
        sa.Column('package_id', sa.UUID(), nullable=False),
        sa.Column('start_datetime', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('end_datetime', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('buffered_end_datetime', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['user.id'], ),
        sa.ForeignKeyConstraint(['package_id'], ['package.id'], ),
        sa.ForeignKeyConstraint(['photographer_id'], ['photographer_profile.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_booking_customer_id'), 'booking', ['customer_id'], unique=False)
    op.create_index(op.f('ix_booking_photographer_id'), 'booking', ['photographer_id'], unique=False)
    op.create_index(op.f('ix_booking_package_id'), 'booking', ['package_id'], unique=False)
    
    # Create trigger function to automatically calculate buffered_end_datetime
    op.execute("""
        CREATE OR REPLACE FUNCTION update_booking_buffered_end()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.buffered_end_datetime := NEW.end_datetime + interval '5 minutes';
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    """)
    
    # Create trigger to execute before INSERT or UPDATE
    op.execute("""
        CREATE TRIGGER set_booking_buffered_end
        BEFORE INSERT OR UPDATE OF start_datetime, end_datetime
        ON booking
        FOR EACH ROW
        EXECUTE FUNCTION update_booking_buffered_end();
    """)
    
    # Add exclusion constraint to prevent double-booking
    # Uses the buffered_end_datetime in the range calculation
    # Only confirmed bookings participate in the constraint
    op.execute("""
        ALTER TABLE booking
        ADD CONSTRAINT exclude_booking_overlap
        EXCLUDE USING gist (
            photographer_id WITH =,
            tstzrange(start_datetime, buffered_end_datetime, '[)') WITH &&
        )
        WHERE (status = 'confirmed')
    """)


def downgrade() -> None:
    # Drop exclusion constraint first
    op.execute('ALTER TABLE booking DROP CONSTRAINT IF EXISTS exclude_booking_overlap')
    
    # Drop trigger
    op.execute('DROP TRIGGER IF EXISTS set_booking_buffered_end ON booking')
    
    # Drop trigger function
    op.execute('DROP FUNCTION IF EXISTS update_booking_buffered_end()')
    
    # Drop tables in reverse order
    op.drop_table('booking')
    op.drop_table('photographer_package')
    op.drop_table('blocked_period')
    op.drop_table('working_hours')
    op.drop_table('portfolio_image')
    op.drop_table('package')
    op.drop_table('photographer_profile')
    op.drop_table('user')
    
    # Note: We don't drop the btree_gist extension as it might be used by other tables
