from fastapi import FastAPI, Depends, HTTPException, status # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from sqlmodel import Session, select # type: ignore
from typing import List
from datetime import datetime
import uuid

from .models import User, Todo, UserCreate, TodoCreate, TodoUpdate
from .services.todo_service import TodoService
from .database.database import create_db_and_tables, get_session_dep
from .utils.auth import hash_password, verify_password, create_access_token, get_current_user
from .schemas.auth import UserRegistrationRequest, UserLoginRequest, UserResponse, Token
from .schemas.todo_schemas import TodoResponse, TodoCreateRequest, TodoUpdateRequest

app = FastAPI(title="Todo Web Application API", version="1.0.0")

# Add CORS middleware BEFORE any routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    """Create database tables on startup."""
    create_db_and_tables()


# Authentication endpoints
@app.post("/api/auth/register", response_model=UserResponse)
def register(user_create: UserRegistrationRequest, session: Session = Depends(get_session_dep)):
    """Register a new user."""
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_create.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = hash_password(user_create.password)

    # Create new user
    db_user = User(
        email=user_create.email,
        name=user_create.name,
        password_hash=hashed_password
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        name=db_user.name,
        created_at=db_user.created_at
    )


@app.post("/api/auth/login", response_model=Token)
def login(login_data: UserLoginRequest, session: Session = Depends(get_session_dep)):
    """Login an existing user."""
    # Find user by email
    user = session.exec(select(User).where(User.email == login_data.email)).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access and refresh tokens
    token_data = {"sub": str(user.id), "email": user.email}
    access_token = create_access_token(data=token_data)
    refresh_token = create_access_token(data=token_data)  # In production, use a separate function for refresh tokens

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get the current user's profile."""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        created_at=current_user.created_at
    )


@app.post("/api/auth/logout")
def logout():
    """Logout the current user."""
    # In a real application, you might want to invalidate the token
    # For now, we just return a success message
    return {"message": "Logged out successfully"}


# Todo endpoints
@app.get("/api/tasks", response_model=List[TodoResponse])
def get_todos(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Get all todos for the current user."""
    service = TodoService(session)
    return service.get_user_todos(current_user.id)


@app.post("/api/tasks", response_model=TodoResponse)
def create_todo(
    todo_create: TodoCreateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Create a new todo for the current user."""
    service = TodoService(session)
    return service.create_todo(
        todo_create.description,
        todo_create.completed,
        current_user.id
    )


@app.get("/api/tasks/{todo_id}", response_model=TodoResponse)
def get_todo(
    todo_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Get a specific todo by ID."""
    service = TodoService(session)
    result = service.get_todo_by_id(todo_id, current_user.id)

    if not result:
        raise HTTPException(status_code=404, detail="Todo not found")

    return result


@app.put("/api/tasks/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: uuid.UUID,
    todo_update: TodoUpdateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Update a specific todo by ID."""
    service = TodoService(session)
    result = service.update_todo(
        todo_id,
        current_user.id,
        TodoUpdate(
            description=todo_update.description,
            completed=todo_update.completed
        )
    )

    if not result:
        raise HTTPException(status_code=404, detail="Todo not found")

    return result


@app.delete("/api/tasks/{todo_id}")
def delete_todo(
    todo_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Delete a specific todo by ID."""
    service = TodoService(session)
    success = service.delete_todo(todo_id, current_user.id)

    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")

    return {"message": "Todo deleted successfully"}


@app.patch("/api/tasks/{todo_id}/complete", response_model=TodoResponse)
def toggle_todo_completion(
    todo_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Toggle the completion status of a specific todo."""
    service = TodoService(session)
    result = service.toggle_todo_completion(todo_id, current_user.id)

    if not result:
        raise HTTPException(status_code=404, detail="Todo not found")

    return result


@app.get("/")
def read_root():
    """Root endpoint for health check."""
    return {"message": "Todo Web Application API", "status": "healthy"}