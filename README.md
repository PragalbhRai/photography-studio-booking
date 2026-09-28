# Photography Studio Booking Platform

A 2-day hackathon project implementing a **Service Booking & Slot Manager** for photography studios.

**Live Demo:** https://photography-studio-booking-fixed.vercel.app/

## Project Overview

This platform allows:
- **Customers**: Browse packages, view photographer portfolios, book appointments
- **Photographers**: Manage schedules, view bookings, control availability
- **Admins**: Manage photographers, packages, and view global dashboard

## Architecture

- **Backend**: FastAPI + SQLModel + PostgreSQL
- **Frontend**: React + TanStack Router/Query + Tailwind CSS
- **Infrastructure**: Docker Compose for local development

## Key Features

- Variable-duration photography packages
- 15-minute booking grid with automatic scheduling
- PostgreSQL exclusion constraints prevent double-booking
- UTC storage with Asia/Kolkata timezone display
- 2-hour cancellation policy
- Portfolio management for photographers

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for frontend development)
- Python 3.14+ (for backend development)

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration.

### Running with Docker

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Database UI (Adminer): http://localhost:8080

### Development Mode

**Backend:**
```bash
cd backend
uv sync
uv run fastapi dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
photography_studio/
â”œâ”€â”€ backend/          # FastAPI application
â”œâ”€â”€ frontend/         # React SPA
â”œâ”€â”€ docs/             # Architecture documentation
â”œâ”€â”€ .kiro/            # Kiro IDE configuration
â””â”€â”€ compose.yml       # Docker Compose configuration
```

## Documentation

- [Domain Model](./docs/domain.md)
- [Scheduling Rules](./docs/scheduling.md)
- [Architecture](./docs/architecture.md)

## Reference

The `full-stack-fastapi-template-master/` directory contains the official FastAPI template for reference only. Do not modify it.

## License

MIT


