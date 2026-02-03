from pydantic import BaseModel
from typing import Optional


class UserRegistrationRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: str
    password: str