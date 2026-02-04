---
id: 1
title: Update Constitution for Todo Web Application
stage: constitution
date: 2026-01-22
surface: agent
model: Claude Sonnet 4.5
feature: todo-web-app
branch: 001-console-todo-app
user: UNI-TECH
command: sp.constitution
labels: ["constitution", "todo-app", "spec-driven"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests: []
---

# Update Constitution for Todo Web Application

## Context
Updating the project constitution to reflect the requirements for transforming a console-based Todo application into a modern, multi-user, full-stack web application using an agentic, spec-driven development workflow.

## Changes Made
- Created a comprehensive constitution document that defines the core principles for the spec-driven development of the Todo web application
- Defined technology constraints for frontend (Next.js 16+, Better Auth), backend (Python FastAPI, SQLModel), and database (Neon Serverless PostgreSQL)
- Specified API standards with required endpoints and quality requirements
- Established governance rules for the project

## Constitutional Principles Established
1. Spec-First, Agentic Development
2. Correctness Over Speed
3. Security by Design
4. Clear Separation of Concerns
5. Deterministic, Reproducible Builds
6. Explicit Traceability

## Governance Structure
- Version: 1.0.0
- Ratified: 2026-01-22
- All development activities must comply with these principles

## Outcome
The constitution now serves as the foundational governance document for the spec-driven development of the Todo web application, ensuring all implementation follows the required technology stack and security practices.

## PROMPT_TEXT
```
/sp.constitution

Project: Spec-Driven Full-Stack Todo Web Application with Authentication

Objective:
Transform a console-based Todo application into a modern, multi-user, full-stack web application using an agentic, spec-driven development workflow powered by Claude Code and Spec-Kit Plus. The project must demonstrate correctness, security, persistence, and clear traceability across specs, plans, and implementations.

Development Philosophy:
- Spec-first, agentic development only
- No manual coding at any stage
- All implementation must be generated from approved specs and plans
- Each phase must be auditable and reviewable for hackathon evaluation

Core Principles:
- Correctness over speed
- Clear separation of concerns (frontend, backend, auth, data)
- Security by design
- Deterministic, reproducible builds
- Explicit traceability: Spec → Plan → Tasks → Code

Key Standards:
- All functionality must map directly to a defined spec requirement
- Every API endpoint must have a clear contract and behavior
- Authentication and authorization must be enforced consistently
- User data isolation is mandatory
- Environment configuration must be explicit and documented
- No hidden logic or undocumented behavior

Technology Constraints:
Frontend:
- Next.js 16+ with App Router
- Responsive UI
- Uses Better Auth for authentication
- Attaches JWT tokens to all API requests

Backend:
- Python FastAPI
- SQLModel ORM
- Stateless JWT-based authentication
- Middleware-based auth verification

Database:
- Neon Serverless PostgreSQL
- Persistent storage for users and tasks
- All task queries must be user-scoped

Authentication:
- Better Auth with JWT plugin enabled
- Shared secret via environment variable (BETTER_AUTH_SECRET)
- JWT verification handled entirely by backend
- Tokens required for all protected endpoints

API Standards:
- RESTful design
- All endpoints require valid JWT after authentication is enabled
- Unauthorized requests return HTTP 401
- Forbidden cross-user access is strictly prevented
- Task ownership enforced on every operation

Required API Endpoints:
- GET    /api/{user_id}/tasks
- POST   /api/{user_id}/tasks
- GET    /api/{user_id}/tasks/{id}
- PUT    /api/{user_id}/tasks/{id}
- DELETE /api/{user_id}/tasks/{id}
- PATCH  /api/{user_id}/tasks/{id}/complete

Spec Coverage:
- Spec 1: Core Todo Web Application (CRUD + Persistence)
- Spec 2: Authentication & User Isolation (Better Auth + JWT)
- Spec 3: Production Readiness & Hackathon Review Compliance

Constraints:
- No features outside defined specs
- No manual code edits
- No direct database access from frontend
- No shared session state between frontend and backend
- JWT expiration must be respected
- Environment variables must be used for all secrets

Quality Requirements:
- Clear error handling and status codes
- Predictable API behavior
- Secure handling of authentication tokens
- Consistent data models across backend and database
- Clean separation between authenticated and unauthenticated flows

Success Criteria:
- All three specs fully implemented and
```

## RESPONSE_TEXT
Updated the constitution file to reflect all specified requirements for the Todo Web Application project, establishing core principles, technology constraints, API standards, and governance structure.