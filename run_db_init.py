"""
Simple script to run the database initialization.
This ensures tables are created in your Neon database.
"""
import os
import sys
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Import and run the database initialization
try:
    from backend.init_db import create_tables
    print("Starting database initialization...")
    create_tables()
    print("Database initialization completed successfully!")
except ImportError as e:
    print(f"Import error: {e}")
    print("Trying alternative initialization method...")

    # Alternative method
    try:
        from sqlmodel import SQLModel, create_engine
        from backend.models import User, Todo
        import os

        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            print("Error: DATABASE_URL environment variable not set")
            sys.exit(1)

        engine = create_engine(database_url, echo=True)

        # Create all tables
        SQLModel.metadata.create_all(bind=engine)
        print("Tables created successfully!")

    except Exception as e:
        print(f"Error during database initialization: {e}")
        print("Please ensure all dependencies are installed and the database URL is correct.")