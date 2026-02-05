import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Database connection parameters
HOST = 'ep-icy-cloud-ahq27lp3-pooler.c-3.us-east-1.aws.neon.tech'
DATABASE = 'neondb'
USER = 'neondb_owner'
PASSWORD = 'npg_xK7Hbe6WctGz'
PORT = 5432

print("Attempting to create 'user' and 'todo' tables in your Neon database...")

try:
    # Connect to the database
    conn = psycopg2.connect(
        host=HOST,
        database=DATABASE,
        user=USER,
        password=PASSWORD,
        port=PORT,
        sslmode='require'
    )

    print("✅ Successfully connected to the database!")

    # Set autocommit for DDL statements
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()

    # Create the 'user' table
    print("\n📝 Creating 'user' table...")
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
    print("✅ 'user' table created successfully!")

    # Create the 'todo' table
    print("\n📝 Creating 'todo' table...")
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
    print("✅ 'todo' table created successfully!")

    # Verify that the tables exist
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN ('user', 'todo')
        ORDER BY table_name;
    """)

    created_tables = cur.fetchall()
    table_names = [table[0] for table in created_tables]

    print(f"\n🎯 Verification: Tables created: {table_names}")

    if 'user' in table_names and 'todo' in table_names:
        print("\n🎉 SUCCESS: Both 'user' and 'todo' tables have been created!")
        print("✅ Your database is now ready for the Todo Web Application")

        # Show table structure
        print("\n📋 Table structure details:")

        # Check 'user' table structure
        if 'user' in table_names:
            cur.execute("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'user'
                ORDER BY ordinal_position;
            """)
            user_columns = cur.fetchall()
            print("\n'user' table columns:")
            for col in user_columns:
                print(f"  - {col[0]} ({col[1]}, nullable: {col[2]})")

        # Check 'todo' table structure
        if 'todo' in table_names:
            cur.execute("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'todo'
                ORDER BY ordinal_position;
            """)
            todo_columns = cur.fetchall()
            print("\n'todo' table columns:")
            for col in todo_columns:
                print(f"  - {col[0]} ({col[1]}, nullable: {col[2]})")

    elif 'user' in table_names:
        print("\n✅ Only 'user' table was created")
    elif 'todo' in table_names:
        print("\n✅ Only 'todo' table was created")
    else:
        print("\n❌ No expected tables were created")

    # Close connections
    cur.close()
    conn.close()

    print("\n✨ Process completed!")

except psycopg2.Error as e:
    print(f"❌ Database Error: {e}")
    print("\nThis error typically means:")
    print("- Database project is paused in Neon dashboard")
    print("- Incorrect credentials")
    print("- Network connectivity issues")
    print("- SSL/TLS configuration issues")

except Exception as e:
    print(f"❌ Unexpected Error: {e}")
    import traceback
    traceback.print_exc()