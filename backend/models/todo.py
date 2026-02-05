from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING, Optional
from datetime import datetime
import uuid

if TYPE_CHECKING:
    from .user import User


class TodoBase(SQLModel):
    description: str
    completed: bool = Field(default=False)
    user_id: uuid.UUID = Field(foreign_key="user.id")


class Todo(TodoBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to user
    user: "User" = Relationship(back_populates="todos")


class TodoCreate(TodoBase):
    pass


class TodoRead(TodoBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class TodoUpdate(SQLModel):
    description: Optional[str] = None
    completed: Optional[bool] = None