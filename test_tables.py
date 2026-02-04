import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys

# Connection parameters extracted from your database URL
HOST = 'ep-icy-cloud-ahq27lp3-pooler.c-3.us-east-1.aws.neon.tech'
DATABASE = 'neondb'
USER = 'neondb_owner'
PASSWORD = 'npg_xK7Hbe6WctGz'
PORT = 5432

print("Attempting to connect to your Neon database...")
print(f"Host: {HOST}")
print(f"Database: {DATABASE}")
print(f"User: {USER}")

try:
    # Connect to Neon database
    conn = psycopg2.connect(
        host=HOST,
        database=DATABASE,
        user=USER,
        password=PASSWORD,
        port=PORT,
        sslmode='require'
    )

    print("✅ Successfully connected to the database!")

    # Set autocommit to handle DDL statements
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()

    # Check existing tables
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)

    existing_tables = cur.fetchall()
    print(f"📋 Existing tables in public schema: {[table[0] for table in existing_tables]}")

    # Create the user table if it doesn't exist
    print("\n📝 Attempting to create 'user' table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS "user" (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255),
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    print("✅ User table created or already exists!")

    # Create the todo table if it doesn't exist
    print("\n📝 Attempting to create 'todo' table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS todo (
            id SERIAL PRIMARY KEY,
            description TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    print("✅ Todo table created or already exists!")

    # Check tables again after creation
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN ('user', 'todo')
        ORDER BY table_name;
    """)

    created_tables = cur.fetchall()
    print(f"\n🎯 Tables in public schema after creation: {[table[0] for table in created_tables]}")

    if len(created_tables) >= 2:
        print("\n🎉 SUCCESS: Both 'user' and 'todo' tables have been created!")
        print("✅ Your database is ready for the Todo Web Application")
    elif 'user' in [table[0] for table in created_tables]:
        print("\n✅ User table was created successfully")
    elif 'todo' in [table[0] for table in created_tables]:
        print("\n✅ Todo table was created successfully")
    else:
        print("\n❌ No expected tables were created")

    # Show table details
    if created_tables:
        print("\n📋 Table details:")
        for table_name in [table[0] for table in created_tables]:
            cur.execute(f"""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = '{table_name}'
                ORDER BY ordinal_position;
            """)
            columns = cur.fetchall()
            print(f"\nTable '{table_name}' columns:")
            for col in columns:
                print(f"  - {col[0]} ({col[1]}, nullable: {col[2]})")

    # Close connections
    cur.close()
    conn.close()

    print("\n✅ Test completed successfully!")

except psycopg2.Error as e:
    print(f"❌ Database Error: {e}")
    print("\nPossible causes:")
    print("1. Database project is paused in Neon dashboard")
    print("2. Incorrect credentials")
    print("3. Network connectivity issues")
    print("4. SSL/TLS configuration issues")

    # Provide specific troubleshooting
    if "does not exist" in str(e):
        print("💡 The database might not exist or be paused")
    elif "authentication failed" in str(e).lower():
        print("💡 Authentication credentials might be incorrect")
    elif "connection refused" in str(e).lower():
        print("💡 Unable to connect to the database server")
    elif "timeout" in str(e).lower():
        print("💡 Connection timed out - check your network")

except Exception as e:
    print(f"❌ Unexpected Error: {e}")
    import traceback
    traceback.print_exc()