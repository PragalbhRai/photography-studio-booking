# Domain Model

This document describes the frozen domain model for the Photography Studio Booking Platform.

## Entities

### User
- `id` (UUID) - Primary key
- `email` (string, unique) - User email
- `password_hash` (string) - Hashed password
- `full_name` (string) - Full name
- `role` (enum) - customer / photographer / admin
- `created_at` (datetime) - Account creation timestamp

### PhotographerProfile
- `id` (UUID) - Primary key
- `user_id` (UUID, FK) - Reference to User
- `bio` (text) - Photographer biography
- `specialties` (string[]) - List of specializations

### PortfolioImage
- `id` (UUID) - Primary key
- `photographer_id` (UUID, FK) - Reference to PhotographerProfile
- `image_url` (string) - Image URL
- `caption` (text) - Image caption
- `sort_order` (int) - Display order

### Package
- `id` (UUID) - Primary key
- `name` (string) - Package name
- `description` (text) - Package description
- `price` (decimal) - Price
- `duration_minutes` (int) - Session duration
- `category` (string) - Package category
- `image_url` (string) - Package image
- `is_active` (bool) - Active status

### PhotographerPackage
- `photographer_id` (UUID, FK) - Reference to PhotographerProfile
- `package_id` (UUID, FK) - Reference to Package

### WorkingHours
- `id` (UUID) - Primary key
- `photographer_id` (UUID, FK) - Reference to PhotographerProfile
- `day_of_week` (int) - 0=Monday, 6=Sunday
- `start_time` (time) - Working day start
- `end_time` (time) - Working day end

### BlockedPeriod
- `id` (UUID) - Primary key
- `photographer_id` (UUID, FK) - Reference to PhotographerProfile
- `start_datetime` (datetime) - Block start
- `end_datetime` (datetime) - Block end
- `reason` (string) - Block reason

### Booking
- `id` (UUID) - Primary key
- `customer_id` (UUID, FK) - Reference to User
- `photographer_id` (UUID, FK) - Reference to PhotographerProfile
- `package_id` (UUID, FK) - Reference to Package
- `start_datetime` (datetime) - Booking start
- `end_datetime` (datetime) - Booking end
- `status` (enum) - confirmed / cancelled / completed
- `created_at` (datetime) - Creation timestamp
- `time_range` (tstzrange) - PostgreSQL range for overlap detection

## Relationships

- User → PhotographerProfile (1:1)
- PhotographerProfile → PortfolioImage (1:N)
- PhotographerProfile → WorkingHours (1:N)
- PhotographerProfile → BlockedPeriod (1:N)
- Package ↔ PhotographerProfile (M:N via PhotographerPackage)
- User → Booking (1:N as customer)
- PhotographerProfile → Booking (1:N)
- Package → Booking (1:N)
