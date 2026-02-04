<!-- SYNC IMPACT REPORT:
Version change: N/A → 1.0.0
Added sections: All principles and sections as specified
Removed sections: None
Modified principles: None (all new)
Templates requiring updates: None (new constitution)
Follow-up TODOs: None
-->

# Spec-Driven Full-Stack Todo Web Application Constitution

## Core Principles

### I. Spec-First, Agentic Development
All implementation must be generated from approved specs and plans; No manual coding at any stage; Each phase must be auditable and reviewable for hackathon evaluation.
<!-- Rationale: Ensures traceability and reproducibility of the development process -->

### II. Correctness Over Speed
Correctness is prioritized over development velocity; All functionality must map directly to a defined spec requirement; Every API endpoint must have a clear contract and behavior.
<!-- Rationale: Ensures high-quality, reliable implementation that meets all requirements -->

### III. Security by Design
Authentication and authorization must be enforced consistently; User data isolation is mandatory; Secure handling of authentication tokens; Input validation and SQL injection prevention required.
<!-- Rationale: Critical for multi-user application with persistent data -->

### IV. Clear Separation of Concerns
Distinct separation between frontend, backend, authentication, and data layers; No direct database access from frontend; Clean separation between authenticated and unauthenticated flows.
<!-- Rationale: Maintains architectural integrity and maintainability -->

### V. Deterministic, Reproducible Builds
Environment configuration must be explicit and documented; No hidden logic or undocumented behavior; All dependencies must be explicitly declared.
<!-- Rationale: Ensures consistent deployment across environments -->

### VI. Explicit Traceability
Traceability from Spec → Plan → Tasks → Code must be maintained; All changes must be linked to specific requirements; Implementation artifacts must reference specification items.
<!-- Rationale: Enables auditability and requirement coverage verification -->

## Technology Constraints

### Frontend Requirements
- Next.js 16+ with App Router
- Responsive UI design
- Uses Better Auth for authentication
- Attaches JWT tokens to all API requests

### Backend Requirements
- Python FastAPI framework
- SQLModel ORM for database operations
- Stateless JWT-based authentication
- Middleware-based auth verification

### Database Requirements
- Neon Serverless PostgreSQL for persistent storage
- All task queries must be user-scoped
- Proper indexing and performance optimization

### Authentication Requirements
- Better Auth with JWT plugin enabled
- Shared secret via environment variable (BETTER_AUTH_SECRET)
- JWT verification handled entirely by backend
- Tokens required for all protected endpoints

## API Standards

### Endpoint Requirements
- RESTful design for all API endpoints
- All endpoints require valid JWT after authentication is enabled
- Unauthorized requests return HTTP 401
- Forbidden cross-user access is strictly prevented
- Task ownership enforced on every operation

### Required API Endpoints
- GET    /api/{user_id}/tasks
- POST   /api/{user_id}/tasks
- GET    /api/{user_id}/tasks/{id}
- PUT    /api/{user_id}/tasks/{id}
- DELETE /api/{user_id}/tasks/{id}
- PATCH  /api/{user_id}/tasks/{id}/complete

### Quality Requirements
- Clear error handling and status codes
- Predictable API behavior
- Consistent data models across backend and database
- Proper validation and sanitization of all inputs

## Development Workflow

### Spec Coverage Requirements
- Spec 1: Core Todo Web Application (CRUD + Persistence)
- Spec 2: Authentication & User Isolation (Better Auth + JWT)
- Spec 3: Production Readiness & Hackathon Review Compliance

### Constraints and Limitations
- No features outside defined specs
- No manual code edits outside of agentic development
- JWT expiration must be respected
- Environment variables must be used for all secrets
- No shared session state between frontend and backend

### Quality Gates
- All endpoints must have proper authentication checks
- User data isolation must be validated
- Error handling must be comprehensive
- Performance benchmarks must be met

## Governance

This constitution supersedes all other development practices for this project. All development activities must comply with these principles. Amendments require explicit documentation, approval, and migration plan. All pull requests and reviews must verify constitutional compliance. Code changes must reference specific constitutional requirements.

**Version**: 1.0.0 | **Ratified**: 2026-01-22 | **Last Amended**: 2026-01-22
