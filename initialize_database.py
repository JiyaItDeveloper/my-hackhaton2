"""
Database initialization script for Todo Web Application.
This script creates the necessary tables in the database.
"""
import asyncio
from sqlmodel import SQLModel, create_engine
from backend.models import User, Todo
import os
from urllib.parse import urlparse


def parse_database_url(database_url):
    """Parse the database URL to extract connection parameters."""
    parsed = urlparse(database_url)
    return {
        'host': parsed.hostname,
        'port': parsed.port,
        'database': parsed.path.lstrip('/'),
        'username': parsed.username,
        'password': parsed.password,
        'scheme': parsed.scheme,
    }


def create_tables():
    """Create all database tables."""
    # Get database URL from environment
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        print("ERROR: DATABASE_URL environment variable not set.")
        print("Please set DATABASE_URL to your Neon database connection string.")
        return

    print(f"Connecting to database: {database_url}")

    try:
        # Create engine with connection parameters
        engine = create_engine(
            database_url,
            echo=True,  # Set to True for SQL debugging
            pool_size=5,
            max_overflow=10,
            pool_pre_ping=True
        )

        print("Creating database tables...")

        # Import models to register them with SQLModel
        from backend.models import User, Todo

        # Create all tables
        SQLModel.metadata.create_all(bind=engine)

        print("SUCCESS: Database tables created successfully!")
        print("- User table created")
        print("- Todo table created")

        # Verify tables were created by checking the database
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Tables in database: {tables}")

    except Exception as e:
        print(f"ERROR: Failed to create database tables: {str(e)}")
        print("Please check your database connection string and credentials.")
        return False

    return True


if __name__ == "__main__":
    success = create_tables()
    if success:
        print("\nDatabase initialization completed successfully!")
        print("Your Todo Web Application is now ready to use.")
    else:
        print("\nDatabase initialization failed!")
        print("Please resolve the errors above and try again.")