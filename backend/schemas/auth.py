from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: str
    email: str


class UserRegistrationRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    name: Optional[str] = None
    created_at: datetime


class UserRegistrationResponse(BaseModel):
    id: uuid.UUID
    email: str
    name: Optional[str] = None
    created_at: datetime