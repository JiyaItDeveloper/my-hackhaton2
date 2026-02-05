from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class TodoResponse(BaseModel):
    id: uuid.UUID
    description: str
    completed: bool
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class TodoCreateRequest(BaseModel):
    description: str
    completed: bool = False


class TodoUpdateRequest(BaseModel):
    description: Optional[str] = None
    completed: Optional[bool] = None