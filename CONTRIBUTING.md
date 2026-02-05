# Contributing to Todo Web Application

Thank you for your interest in contributing to the Todo Web Application! This document outlines the process for contributing to this project.

## Project Overview

This is a full-stack todo web application built with Next.js, FastAPI, SQLModel, and Neon PostgreSQL. The project follows a spec-driven development approach using Claude Code and Spec-Kit Plus.

## Development Workflow

### Prerequisites

- Node.js 18+ for frontend development
- Python 3.8+ for backend development
- UV package manager (recommended)
- Neon Serverless PostgreSQL database

### Setting Up Your Development Environment

1. Fork the repository
2. Clone your forked repository
3. Install dependencies for both frontend and backend
4. Set up your local environment variables
5. Run the application locally to ensure everything works

### Running Locally

#### Backend
```bash
cd todo-web-app
uv sync  # or pip install -e .
python -m backend.init_db
uv run uvicorn backend.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Making Changes

### Branch Naming Convention

Use the format `{issue-number}-{short-description}` or `{feature-number}-{short-description}`:

```
12-add-user-authentication
23-fix-todo-deletion-bug
```

If no issue/feature number exists, use descriptive names:

```
feat-add-dark-mode
fix-mobile-navbar-bug
docs-update-readme
```

### Commit Messages

Follow conventional commits format:

```
feat: add user authentication
fix: resolve todo deletion issue
docs: update API documentation
style: format code according to style guide
refactor: improve service layer architecture
test: add unit tests for user service
chore: update dependencies
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes in the branch
3. Add tests if applicable
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request to `main`
7. Reference any relevant issues in the PR description

## Code Standards

### Backend (Python)
- Follow PEP 8 style guide
- Use type hints for all function parameters and return values
- Write docstrings for all public functions and classes
- Use meaningful variable and function names

### Frontend (JavaScript/TypeScript)
- Follow ESLint and Prettier configurations
- Use TypeScript for type safety
- Write component documentation
- Follow React best practices

### API Design
- Follow RESTful conventions
- Use consistent naming patterns
- Include proper error handling
- Document all endpoints

## Testing

### Backend Tests
```bash
pytest
```

### Frontend Tests
```bash
npm test
```

All new features should include appropriate tests. Bug fixes should include a test that verifies the fix.

## Architecture Guidelines

### Backend Structure
- Models: Define data structures using SQLModel
- Services: Contain business logic
- API Routes: Handle HTTP requests/responses
- Middleware: Handle cross-cutting concerns
- Utils: Common helper functions

### Frontend Structure
- Components: Reusable UI elements
- Pages: Route-specific views
- Lib: Utility functions and API clients
- Types: TypeScript type definitions
- Styles: Global and component-specific styling

## Security Considerations

- Sanitize all user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Validate and sanitize API requests
- Follow security best practices for session management

## Reporting Issues

When reporting issues, please include:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, OS, version)
- Screenshots or logs if applicable

## Getting Help

If you need help with your contribution:
- Check the existing documentation
- Open an issue with your question
- Reference the specification documents in the `specs/` directory

## Recognition

All contributors will be recognized in the project's README. We appreciate your time and effort in improving this application!

## Questions?

If you have any questions about contributing, feel free to open an issue or contact the maintainers.