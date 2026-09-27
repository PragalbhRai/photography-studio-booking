# Getting Started

## Project Foundation Complete ✅

The initial project structure is ready for feature implementation.

## Directory Structure

```
photography_studio/
├── backend/              # FastAPI backend application
│   ├── app/
│   │   ├── core/        # Config, DB, security
│   │   ├── models/      # Domain models
│   │   ├── services/    # Business logic
│   │   ├── api/         # API routes
│   │   └── alembic/     # Database migrations
│   ├── tests/
│   ├── scripts/
│   └── pyproject.toml
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── routes/     # TanStack Router pages
│   │   ├── components/ # React components
│   │   ├── lib/        # Utilities
│   │   └── hooks/      # Custom hooks
│   └── package.json
├── docs/               # Frozen specifications
│   ├── domain.md
│   ├── scheduling.md
│   └── architecture.md
├── .kiro/
│   └── steering/       # Project guidelines for Kiro
└── compose.yml         # Docker Compose configuration
```

## Quick Start

### 1. Start Services with Docker

```bash
docker compose up -d
```

This starts:
- PostgreSQL database (port 5432)
- Backend API (port 8000)
- Frontend dev server (port 5173)
- Adminer database UI (port 8080)

### 2. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API Docs**: http://localhost:8000/docs
- **Database Admin**: http://localhost:8080

### 3. Alternative: Local Development

**Backend:**
```powershell
cd backend
pip install uv
uv sync
uv run fastapi dev
```

**Frontend:**
```powershell
cd frontend
npm install
npm run dev
```

## Next Steps

### Phase 1: Core Models
1. Implement User model with authentication
2. Create PhotographerProfile and Portfolio models
3. Implement Package models
4. Set up Alembic migrations

### Phase 2: Scheduling Core
1. WorkingHours and BlockedPeriod models
2. Booking model with tstzrange
3. PostgreSQL exclusion constraints
4. Availability calculation service

### Phase 3: API Endpoints
1. Authentication endpoints
2. Package browsing
3. Photographer portfolios
4. Booking creation and management

### Phase 4: Frontend Integration
1. Generate API client from OpenAPI
2. Implement customer booking flow
3. Photographer dashboard
4. Admin panel

## Important Notes

### Reference Repository
- `full-stack-fastapi-template-master/` is for **REFERENCE ONLY**
- Do NOT modify or build inside this directory
- Use it to understand patterns

### Frozen Specifications
Review these documents before implementing:
- `docs/domain.md` - Database schema
- `docs/scheduling.md` - Booking rules
- `docs/architecture.md` - Tech stack decisions

### Configuration
- Environment variables in `.env` file
- Default credentials: admin@studio.com / admin123
- Change SECRET_KEY for production!

## Troubleshooting

### Database Connection Issues
```powershell
# Check if database is running
docker compose ps

# View database logs
docker compose logs db

# Restart database
docker compose restart db
```

### Backend Issues
```powershell
# View backend logs
docker compose logs backend

# Or run locally for better debugging
cd backend
uv run fastapi dev
```

### Frontend Issues
```powershell
# Check for Node.js version (needs 20+)
node --version

# Clear node_modules and reinstall
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

## Development Workflow

1. **Read the frozen specs** in `docs/`
2. **Implement models** in `backend/app/models/`
3. **Create migration**: `alembic revision --autogenerate -m "description"`
4. **Apply migration**: `alembic upgrade head`
5. **Implement services** in `backend/app/services/`
6. **Create API routes** in `backend/app/api/routes/`
7. **Generate frontend client**: `npm run generate-client`
8. **Build frontend pages** in `frontend/src/routes/`
9. **Test the flow** end-to-end

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/)

## Ready to Build! 🚀

The foundation is set. Start with implementing the User model and authentication.
