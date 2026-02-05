"""
Configuration for validation and testing utilities
"""
import os
from pydantic_settings import BaseSettings


class ValidationSettings(BaseSettings):
    """Settings for validation utilities."""

    # API endpoints for validation
    API_BASE_URL: str = os.getenv("API_BASE_URL", "http://localhost:8000")
    API_TIMEOUT: int = int(os.getenv("API_TIMEOUT", "30"))

    # Test user credentials
    TEST_USER_EMAIL: str = os.getenv("TEST_USER_EMAIL", "test@example.com")
    TEST_USER_PASSWORD: str = os.getenv("TEST_USER_PASSWORD", "testpassword123")

    # Database validation settings
    VALIDATE_DATABASE_CONNECTION: bool = os.getenv("VALIDATE_DATABASE_CONNECTION", "true").lower() == "true"

    # Security validation settings
    VALIDATE_JWT_EXPIRATION: bool = os.getenv("VALIDATE_JWT_EXPIRATION", "true").lower() == "true"
    VALIDATE_CROSS_USER_ACCESS: bool = os.getenv("VALIDATE_CROSS_USER_ACCESS", "true").lower() == "true"

    # Performance validation settings
    PERFORMANCE_THRESHOLD_MS: int = int(os.getenv("PERFORMANCE_THRESHOLD_MS", "500"))

    class Config:
        env_file = ".env"


# Create a singleton instance
settings = ValidationSettings()