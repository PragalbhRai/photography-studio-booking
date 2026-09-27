# Photography Studio Frontend

React + TypeScript frontend for the Photography Studio Booking Platform.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Router** - File-based routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

## Generating API Client

Once the backend is running:

```bash
npm run generate-client
```

This will generate TypeScript types and API client from the OpenAPI specification.

## Project Structure

```
src/
├── routes/         # TanStack Router pages (file-based routing)
├── components/     # Reusable React components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and configurations
├── client/         # Generated API client (auto-generated)
├── main.tsx        # Application entry point
└── index.css       # Global styles
```

## Future Enhancements

The frontend is designed to support future interactive and 3D enhancements:

- Immersive landing experience
- Animated page transitions
- 3D model integration
- Advanced visual effects

These will be implemented in later phases without requiring major restructuring.
