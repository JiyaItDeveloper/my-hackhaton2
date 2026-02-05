# Todo Web Application

A modern multi-user todo web application with authentication and persistent storage.

## Tech Stack

- **Frontend**: Next.js 16+ (App Router)
- **Backend**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT plugin

## Prerequisites

- Node.js 18+ for frontend
- Python 3.8+ for backend
- UV package manager (recommended)
- Neon Serverless PostgreSQL database

## Setup Instructions

### 1. Database Setup

1. Create a Neon Serverless PostgreSQL account at [neon.tech](https://neon.tech)
2. Create a new project in Neon
3. Copy the connection string from the Neon dashboard
4. Set the connection string as the `DATABASE_URL` environment variable

### 2. Backend Setup

1. Navigate to the project directory:
   ```bash
   cd todo-web-app
   ```

2. Install dependencies using UV (recommended):
   ```bash
   uv sync
   ```

   Or using pip:
   ```bash
   pip install -e .
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your DATABASE_URL and SECRET_KEY
   ```

4. Initialize the database:
   ```bash
   python -m backend.init_db
   ```

5. Start the backend server:
   ```bash
   uv run uvicorn backend.main:app --reload --port 8000
   ```

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and set NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for the interactive API documentation.

## Environment Variables

### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Secret key for JWT token signing
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time (default: 30)
- `BETTER_AUTH_SECRET`: Shared secret for Better Auth JWT plugin

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000/api)

## Features

- User registration and authentication with Better Auth
- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- User-specific todo lists with data isolation
- Responsive design for all device sizes
- JWT-based authentication and authorization

## Project Structure

```
todo-web-app/
├── backend/
│   ├── models/          # Database models
│   │   ├── __init__.py
│   │   ├── user.py      # User data model
│   │   └── todo.py      # Todo Item data model
│   ├── services/        # Business logic
│   │   ├── __init__.py
│   │   ├── todo_service.py
│   │   └── auth_service.py
│   ├── middleware/      # Request processing
│   │   ├── __init__.py
│   │   └── auth.py      # Authentication middleware
│   ├── utils/           # Utility functions
│   │   ├── __init__.py
│   │   └── auth.py      # JWT utilities
│   ├── database/        # Database configuration
│   │   ├── __init__.py
│   │   └── database.py  # Database session management
│   ├── migrations/      # Database migration utilities
│   ├── schemas/         # API response models
│   ├── main.py          # FastAPI application
│   └── init_db.py       # Database initialization script
├── frontend/
│   ├── app/             # Next.js pages and layouts
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utility functions and API client
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   └── public/          # Static assets
├── specs/               # Project specifications
│   ├── todo-web-app/
│   │   ├── spec.md      # Feature specification
│   │   ├── plan.md      # Architecture plan
│   │   └── tasks.md     # Implementation tasks
├── pyproject.toml       # Python dependencies
└── README.md
```

## Development

### Running Tests

Backend tests:
```bash
pytest
```

### Database Migrations

Database migrations are handled via the init_db.py script for initial setup. For production deployments, consider implementing Alembic for advanced migration scenarios.

## Deployment

### Backend
The backend can be deployed to any platform that supports Python applications (Railway, Heroku, etc.).

### Frontend
The frontend can be deployed to Vercel, Netlify, or any static hosting platform.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request