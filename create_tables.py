"""
Direct script to create tables in Neon database
"""
import os
import sys
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / "backend"))

# Set up environment if not already set
if not os.getenv("DATABASE_URL"):
    # Use the database URL from your environment
    db_url = "postgresql://neondb_owner:npg_xK7Hbe6WctGz@ep-icy-cloud-ahq27lp3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    os.environ["DATABASE_URL"] = db_url
    print(f"Set DATABASE_URL to: {db_url}")

try:
    # Import required modules
    from sqlmodel import SQLModel, create_engine
    from sqlalchemy import text

    # Get database URL
    database_url = os.getenv("DATABASE_URL")
    print(f"Using database URL: {database_url}")

    # Create engine
    engine = create_engine(database_url, echo=True)

    # Import models to register them
    from backend.models.user import User
    from backend.models.todo import Todo

    print("Creating tables...")

    # Create all tables
    SQLModel.metadata.create_all(bind=engine)

    print("Tables created successfully!")

    # Verify tables exist
    with engine.connect() as conn:
        # Query to list all tables in public schema
        result = conn.execute(text("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
        """))

        tables = [row[0] for row in result.fetchall()]
        print(f"Tables in database: {tables}")

        if tables:
            print("SUCCESS: Tables have been created in your Neon database!")
            for table in tables:
                print(f"  - {table}")
        else:
            print("WARNING: No tables found in the database.")

except Exception as e:
    print(f"ERROR: {str(e)}")
    print("\nPossible issues:")
    print("1. Incorrect database URL or credentials")
    print("2. Network connectivity issues")
    print("3. Missing Python dependencies")
    print("4. SSL connection issues")

    # Try to install dependencies if missing
    try:
        import sqlmodel
        import sqlalchemy
        print("Dependencies are available")
    except ImportError:
        print("ERROR: Required dependencies are missing. Please run: pip install -e .")