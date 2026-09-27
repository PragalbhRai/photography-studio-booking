# Photography Studio Project Rules

## Project Context

This is a **2-day hackathon project** for a Photography Studio Booking Platform.

## Critical Directory Rules

### Reference Repository
- `full-stack-fastapi-template-master/` is **REFERENCE ONLY**
- **NEVER modify** files in this directory
- Use it only for understanding patterns and approaches
- The actual application is in the sibling directories

### Application Structure
- Backend: `backend/`
- Frontend: `frontend/`
- Documentation: `docs/`

## Frozen Specifications

The following are **FROZEN** and must not be changed without explicit user approval:

1. **Domain Model** (see `docs/domain.md`)
   - User, PhotographerProfile, PortfolioImage
   - Package, PhotographerPackage
   - WorkingHours, BlockedPeriod
   - Booking with tstzrange

2. **Scheduling Rules** (see `docs/scheduling.md`)
   - 15-minute booking grid
   - 5-minute post-appointment buffer
   - 2-hour cancellation cutoff
   - UTC storage, Asia/Kolkata display
   - PostgreSQL exclusion constraints for double-booking prevention

3. **Architecture** (see `docs/architecture.md`)
   - Modular monolith (not microservices)
   - FastAPI + SQLModel + PostgreSQL
   - React + TanStack Router/Query + Tailwind
   - No Redis, Kafka, Celery, S3, K8s, WebSockets

## Development Guidelines

### Backend
- Use SQLModel for all models
- Keep business logic in `services/`
- Use FastAPI dependency injection
- All timestamps in UTC
- PostgreSQL is the final authority for double-booking

### Frontend
- File-based routing with TanStack Router
- TanStack Query for server state
- Tailwind CSS for styling
- Keep components small and focused
- Design with future 3D/animation enhancement in mind (but don't implement yet)

### Database
- UUID primary keys
- Use tstzrange for booking overlaps
- Exclusion constraints for data integrity
- Alembic for migrations

### Code Quality
- Type hints in Python
- TypeScript strict mode
- Descriptive variable names
- Keep functions focused

## What NOT to Do

- Don't add technologies not in the frozen architecture
- Don't modify the reference repository
- Don't implement features not explicitly requested
- Don't add 3D libraries yet (planned for later phase)
- Don't create microservices or complex infrastructure

## Testing Approach

- Focus on core booking logic
- Test double-booking prevention
- Test schedule calculations
- Manual testing via API docs is acceptable for hackathon pace

## Hackathon Mindset

- Prioritize working features over perfect code
- Use reference template patterns where they fit
- Keep it simple and functional
- Document decisions briefly
- Fast iteration over extensive planning
