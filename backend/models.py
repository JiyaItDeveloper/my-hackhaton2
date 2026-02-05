from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
import uuid


class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: Optional[str] = Field(default=None)


class User(UserBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to todos
    todos: List["Todo"] = Relationship(back_populates="user")


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: uuid.UUID
    created_at: datetime


class TodoBase(SQLModel):
    description: str
    completed: bool = Field(default=False)
    user_id: uuid.UUID = Field(foreign_key="User.id")


class Todo(TodoBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to user
    user: User = Relationship(back_populates="todos")


class TodoCreate(TodoBase):
    pass


class TodoRead(TodoBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class TodoUpdate(SQLModel):
    description: Optional[str] = None
    completed: Optional[bool] = None