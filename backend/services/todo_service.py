from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
import uuid
from backend.models import Todo, TodoCreate, TodoUpdate
from backend.schemas.todo_schemas import TodoResponse


class TodoService:
    def __init__(self, session: Session):
        self.session = session

    def create_todo(self, description: str, completed: bool, user_id: uuid.UUID) -> TodoResponse:
        """Create a new todo for a user."""
        # Create the Todo object directly with the user_id
        db_todo = Todo(
            description=description,
            completed=completed,
            user_id=user_id
        )
        self.session.add(db_todo)
        self.session.commit()
        self.session.refresh(db_todo)

        return TodoResponse(
            id=db_todo.id,
            description=db_todo.description,
            completed=db_todo.completed,
            user_id=db_todo.user_id,
            created_at=db_todo.created_at,
            updated_at=db_todo.updated_at
        )

    def get_todo_by_id(self, todo_id: uuid.UUID, user_id: uuid.UUID) -> Optional[TodoResponse]:
        """Get a specific todo by ID for a user."""
        todo = self.session.exec(
            select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
        ).first()

        if not todo:
            return None

        return TodoResponse(
            id=todo.id,
            description=todo.description,
            completed=todo.completed,
            user_id=todo.user_id,
            created_at=todo.created_at,
            updated_at=todo.updated_at
        )

    def get_user_todos(self, user_id: uuid.UUID) -> List[TodoResponse]:
        """Get all todos for a user."""
        todos = self.session.exec(
            select(Todo).where(Todo.user_id == user_id)
        ).all()

        return [TodoResponse(
            id=todo.id,
            description=todo.description,
            completed=todo.completed,
            user_id=todo.user_id,
            created_at=todo.created_at,
            updated_at=todo.updated_at
        ) for todo in todos]

    def update_todo(self, todo_id: uuid.UUID, user_id: uuid.UUID, todo_data: TodoUpdate) -> Optional[TodoResponse]:
        """Update a specific todo for a user."""
        todo = self.session.exec(
            select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
        ).first()

        if not todo:
            return None

        # Update the todo with the provided fields
        update_data = todo_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(todo, field, value)

        todo.updated_at = datetime.utcnow()
        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)

        return TodoResponse(
            id=todo.id,
            description=todo.description,
            completed=todo.completed,
            user_id=todo.user_id,
            created_at=todo.created_at,
            updated_at=todo.updated_at
        )

    def delete_todo(self, todo_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """Delete a specific todo for a user."""
        todo = self.session.exec(
            select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
        ).first()

        if not todo:
            return False

        self.session.delete(todo)
        self.session.commit()
        return True

    def toggle_todo_completion(self, todo_id: uuid.UUID, user_id: uuid.UUID) -> Optional[TodoResponse]:
        """Toggle the completion status of a specific todo for a user."""
        todo = self.session.exec(
            select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
        ).first()

        if not todo:
            return None

        todo.completed = not todo.completed
        todo.updated_at = datetime.utcnow()
        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)

        return TodoResponse(
            id=todo.id,
            description=todo.description,
            completed=todo.completed,
            user_id=todo.user_id,
            created_at=todo.created_at,
            updated_at=todo.updated_at
        )