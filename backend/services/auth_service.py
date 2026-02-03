from sqlmodel import Session, select
from typing import Optional
from datetime import timedelta
from backend.models import User, UserCreate
from backend.utils.auth import hash_password, verify_password, create_access_token
from passlib.context import CryptContext


class AuthService:
    def __init__(self, session: Session):
        self.session = session

    def register_user(self, user_data: UserCreate) -> User:
        """Register a new user."""
        # Check if user already exists
        existing_user = self.session.exec(
            select(User).where(User.email == user_data.email)
        ).first()

        if existing_user:
            raise ValueError("Email already registered")

        # Hash the password
        hashed_password = hash_password(user_data.password)

        # Create new user
        db_user = User(
            email=user_data.email,
            name=user_data.name,
            password_hash=hashed_password
        )
        self.session.add(db_user)
        self.session.commit()
        self.session.refresh(db_user)

        return db_user

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user with email and password."""
        user = self.session.exec(
            select(User).where(User.email == email)
        ).first()

        if not user or not verify_password(password, user.password_hash):
            return None

        return user

    def create_access_token_for_user(self, user: User) -> str:
        """Create an access token for a user."""
        data = {"sub": str(user.id), "email": user.email}
        token = create_access_token(data=data)
        return token