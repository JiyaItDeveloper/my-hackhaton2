"""Script to initialize the database and create tables."""
from .database import create_db_and_tables


def create_tables():
    """Create all database tables."""
    print("Creating database tables...")
    create_db_and_tables()
    print("Database tables created successfully!")


if __name__ == "__main__":
    create_tables()