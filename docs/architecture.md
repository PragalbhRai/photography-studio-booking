# Architecture

FROZEN architecture for the Photography Studio Booking Platform.

## Overview

The system is a **modular monolith** designed for rapid development and deployment.

```
┌─────────────────┐
│   React SPA     │  Frontend (Vite + TanStack)
└────────┬────────┘
         │ HTTP/JSON
┌────────▼────────┐
│   FastAPI       │  API Layer
└────────┬────────┘
         │
┌────────▼────────┐
│   Services      │  Business Logic
└────────┬────────┘
         │
┌────────▼────────┐
│  PostgreSQL     │  Data Layer
└─────────────────┘
```

## Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLModel** - ORM (SQLAlchemy + Pydantic integration)
- **Alembic** - Database migrations
- **PostgreSQL 17** - Database with advanced features
- **pydantic-settings** - Configuration management
- **pwdlib** - Password hashing (Argon2)
- **PyJWT** - JWT authentication

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TanStack Router** - File-based routing
- **TanStack Query** - Server state management
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client

### Infrastructure
- **Docker Compose** - Local development environment
- **Adminer** - Database management UI

## Backend Architecture

### Layer Structure

```
app/
├── core/           # Configuration, database, security
├── models/         # Domain models (SQLModel)
├── services/       # Business logic
├── api/            # HTTP routes and dependencies
└── alembic/        # Database migrations
```

### Design Patterns

1. **Dependency Injection**
   - FastAPI's `Depends()` for session and auth
   - Type-annotated dependencies for clarity

2. **Service Layer**
   - Business logic isolated from HTTP layer
   - Reusable across different routes
   - Easy to test

3. **Repository Pattern** (optional)
   - Can be added if CRUD operations become complex
   - Currently using direct SQLModel queries

4. **Configuration Management**
   - Environment-based settings via Pydantic
   - Type-safe configuration
   - Validation at startup

### Authentication Flow

```
1. User submits credentials
2. Backend validates and creates JWT
3. Frontend stores token
4. Subsequent requests include token in Authorization header
5. Backend validates token and extracts user identity
```

## Frontend Architecture

### Structure

```
src/
├── routes/         # File-based routes (TanStack Router)
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── lib/            # Utilities, API client
└── client/         # Generated from OpenAPI (auto-gen)
```

### Design Patterns

1. **File-Based Routing**
   - Routes defined by file structure
   - Type-safe navigation
   - Automatic code splitting

2. **Server State Management**
   - TanStack Query for data fetching
   - Automatic caching and revalidation
   - Optimistic updates for bookings

3. **Component Composition**
   - Small, focused components
   - Composition over inheritance
   - Tailwind for styling

### Future 3D/Animation Integration

The architecture supports future enhancements:

- **Component-based**: Easy to wrap components with 3D/animation layers
- **Route-based transitions**: Router supports transition animations
- **Modular**: 3D libraries can be code-split and lazy-loaded
- **No restructuring needed**: Additions won't require refactoring

Potential libraries (NOT included yet):
- Three.js / React Three Fiber for 3D
- Framer Motion for advanced animations
- GSAP for timeline-based effects

## Database Architecture

### PostgreSQL Features Used

1. **UUID Primary Keys**
   - Distributed-friendly
   - No sequential ID leakage

2. **tstzrange Type**
   - Native timestamp range support
   - Used for booking time ranges

3. **GiST Index with btree_gist**
   - Enables exclusion constraints on ranges
   - Efficient overlap detection

4. **Exclusion Constraints**
   - Prevents double-booking at database level
   - Guarantees data integrity

### Schema Example

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE booking (
    id UUID PRIMARY KEY,
    photographer_id UUID NOT NULL,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    time_range TSTZRANGE NOT NULL,
    status VARCHAR(20) NOT NULL,
    -- other fields...
    EXCLUDE USING gist (
        photographer_id WITH =,
        time_range WITH &&
    ) WHERE (status = 'confirmed')
);
```

## API Design

### REST Conventions

- **GET** - Read resources
- **POST** - Create resources
- **PUT** - Full update
- **PATCH** - Partial update
- **DELETE** - Remove resources

### Response Format

Success:
```json
{
  "data": { ... }
}
```

Error:
```json
{
  "detail": "Error message"
}
```

List with pagination:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "size": 20
}
```

### API Versioning

- Base path: `/api/v1`
- Future versions: `/api/v2`, etc.
- Allows breaking changes without affecting v1 clients

## What We DON'T Use

To keep the stack minimal for a 2-day hackathon:

❌ Microservices  
❌ Message queues (Kafka, RabbitMQ)  
❌ Caching layer (Redis)  
❌ Task queues (Celery)  
❌ Object storage (S3)  
❌ Container orchestration (Kubernetes)  
❌ GraphQL  
❌ WebSockets (unless explicitly needed)  

## Deployment Considerations

For production (future):

1. **Database**
   - Managed PostgreSQL (AWS RDS, DigitalOcean, etc.)
   - Connection pooling
   - Regular backups

2. **Backend**
   - Containerized FastAPI
   - Gunicorn/Uvicorn workers
   - Environment-based config

3. **Frontend**
   - Static build deployed to CDN
   - Environment variables at build time

4. **Security**
   - HTTPS everywhere
   - CORS properly configured
   - Rate limiting
   - Input validation

## Testing Strategy

### Backend
- Unit tests for services
- Integration tests for API endpoints
- Database tests with test fixtures
- pytest for all testing

### Frontend
- Component tests with React Testing Library
- E2E tests with Playwright
- API mocking for isolated testing

## Development Workflow

1. **Database First**
   - Define models
   - Create migrations
   - Apply to database

2. **Backend Development**
   - Implement services
   - Create API routes
   - Test with OpenAPI docs

3. **Generate Client**
   - Run OpenAPI client generator
   - Frontend gets typed API client

4. **Frontend Development**
   - Create routes/pages
   - Integrate API client
   - Style with Tailwind

5. **Integration Testing**
   - Test full flows
   - Fix issues
   - Iterate
