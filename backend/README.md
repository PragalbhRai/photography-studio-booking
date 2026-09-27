# Photography Studio Backend

FastAPI backend for the Photography Studio Booking Platform.

## Setup

### Using uv (recommended)

```bash
# Install uv if you haven't
pip install uv

# Install dependencies
uv sync

# Run development server
uv run fastapi dev
```

### Using pip

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e ".[dev]"

# Run development server
fastapi dev
```

## Database Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

## Testing

```bash
pytest
```

## Code Quality

```bash
# Format and lint
ruff check --fix .
ruff format .

# Type checking
mypy app
```

## API Documentation

When running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json
