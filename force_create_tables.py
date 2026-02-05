"""
Force create tables in Neon database
"""
import os
import sys
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Set your Neon database URL
NEON_DB_URL = "postgresql://neondb_owner:npg_xK7Hbe6WctGz@ep-icy-cloud-ahq27lp3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Set the environment variable
os.environ["DATABASE_URL"] = NEON_DB_URL

print("Attempting to create tables in Neon database...")
print(f"Using database URL: {NEON_DB_URL}")

try:
    # Import the database module directly
    from backend.database.database import create_db_and_tables

    print("Calling create_db_and_tables()...")
    create_db_and_tables()

    print("SUCCESS: Tables have been created in the Neon database!")
    print("- User table created")
    print("- Todo table created")

    # Verify the tables exist by importing the models
    from backend.models import User, Todo
    print(f"User model imported: {User.__tablename__ if hasattr(User, '__tablename__') else 'No __tablename__'}")
    print(f"Todo model imported: {Todo.__tablename__ if hasattr(Todo, '__tablename__') else 'No __tablename__'}")

except Exception as e:
    print(f"ERROR: {str(e)}")
    import traceback
    traceback.print_exc()

    # Try alternative approach
    try:
        print("\nTrying alternative approach...")
        from sqlmodel import SQLModel, create_engine
        from sqlalchemy import inspect

        engine = create_engine(NEON_DB_URL, echo=True)

        # Import models to register them with SQLModel
        from backend.models import User, Todo

        print("Creating all tables...")
        SQLModel.metadata.create_all(bind=engine)

        # Check what tables were created
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Tables in database after creation: {tables}")

        if tables:
            print("SUCCESS: Tables were created!")
            for table in tables:
                print(f"  - {table}")
        else:
            print("No tables were found after creation attempt.")

    except Exception as e2:
        print(f"ALTERNATIVE APPROACH FAILED: {str(e2)}")
        print("\nTroubleshooting suggestions:")
        print("1. Check if your Neon database credentials are correct")
        print("2. Verify your network connection allows connections to Neon")
        print("3. Make sure you have installed all dependencies: pip install -e .")
        print("4. Check if SSL settings are properly configured")
        print("5. Verify that your Neon database is active and not paused")