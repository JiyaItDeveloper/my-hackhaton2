"""
Simple script to create tables in Neon database with minimal dependencies
"""
import os
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError, ProgrammingError

# Use your Neon database URL
DATABASE_URL = "postgresql://neondb_owner:npg_xK7Hbe6WctGz@ep-icy-cloud-ahq27lp3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

print("Attempting to connect to Neon database...")
print(f"Database URL: {DATABASE_URL}")

try:
    # Create a basic SQLAlchemy engine
    engine = create_engine(DATABASE_URL, echo=True)

    print("Testing connection...")
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✓ Connection successful!")

    print("\nCreating tables directly with SQL...")

    # Create User table
    user_table_sql = """
    CREATE TABLE IF NOT EXISTS "user" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """

    # Create Todo table
    todo_table_sql = """
    CREATE TABLE IF NOT EXISTS todo (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        description TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """

    with engine.connect() as conn:
        # Execute the table creation statements
        conn.execute(text(user_table_sql))
        conn.execute(text(todo_table_sql))
        conn.commit()

    print("✓ Tables created successfully!")

    # Verify tables exist
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name IN ('user', 'todo')
            ORDER BY table_name;
        """))

        existing_tables = [row[0] for row in result.fetchall()]
        print(f"\nTables found in database: {existing_tables}")

        if 'user' in existing_tables and 'todo' in existing_tables:
            print("🎉 SUCCESS: Both user and todo tables have been created!")
        elif 'user' in existing_tables:
            print("⚠️  Only user table was created")
        elif 'todo' in existing_tables:
            print("⚠️  Only todo table was created")
        else:
            print("❌ No expected tables were found")

except OperationalError as e:
    print(f"❌ Connection Error: {e}")
    print("\nThis error typically means:")
    print("- Database URL is incorrect")
    print("- Network connectivity issues")
    print("- Firewall blocking the connection")
    print("- Database credentials are wrong")

except ProgrammingError as e:
    print(f"❌ Programming Error: {e}")
    print("\nThis error typically means:")
    print("- SQL syntax error")
    print("- Insufficient permissions")

except Exception as e:
    print(f"❌ Unexpected Error: {e}")
    import traceback
    traceback.print_exc()

print("\nIf tables were not created, please check:")
print("1. Your Neon database is active and not paused")
print("2. The connection string is correct")
print("3. You have internet connectivity")
print("4. The database credentials are valid")
print("5. SSL settings are properly configured")