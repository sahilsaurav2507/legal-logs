#!/usr/bin/env python3
"""
Credit System Migration Runner

This script runs the credit system migration to add the necessary tables
and stored procedures to the database.
"""

import os
import mysql.connector
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def run_migration():
    """Run the credit system migration"""
    
    # Database configuration
    db_config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'user': os.getenv('DB_USER', 'root'),
        'password': os.getenv('DB_PASSWORD', 'pabbo@123'),
        'database': os.getenv('DB_NAME', 'lawfort'),
        'autocommit': True
    }
    
    try:
        print("Connecting to database...")
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        
        print("Reading migration file...")
        # Try the safe migration file first, fallback to original
        migration_file = 'credit_system_migration_safe.sql'
        if not os.path.exists(migration_file):
            migration_file = 'credit_system_migration.sql'

        with open(migration_file, 'r', encoding='utf-8') as file:
            migration_sql = file.read()

        print(f"Using migration file: {migration_file}")
        
        print("Executing migration...")
        
        # Split the SQL file into individual statements
        statements = migration_sql.split(';')
        
        for i, statement in enumerate(statements):
            statement = statement.strip()
            if statement and not statement.startswith('--'):
                try:
                    cursor.execute(statement)
                    print(f"Executed statement {i+1}/{len(statements)}")
                except mysql.connector.Error as e:
                    if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                        print(f"Statement {i+1} skipped (already exists): {str(e)}")
                    else:
                        print(f"Error in statement {i+1}: {str(e)}")
                        print(f"Statement: {statement[:100]}...")
        
        print("Migration completed successfully!")
        
        # Verify tables were created
        print("\nVerifying tables...")
        cursor.execute("SHOW TABLES LIKE 'Content_Likes'")
        if cursor.fetchone():
            print("✓ Content_Likes table created")
        else:
            print("✗ Content_Likes table not found")
            
        cursor.execute("SHOW TABLES LIKE 'User_Credits'")
        if cursor.fetchone():
            print("✓ User_Credits table created")
        else:
            print("✗ User_Credits table not found")
            
        cursor.execute("SHOW TABLES LIKE 'Credit_Transactions'")
        if cursor.fetchone():
            print("✓ Credit_Transactions table created")
        else:
            print("✗ Credit_Transactions table not found")
        
        # Check if any editors exist and have credit records
        cursor.execute("""
            SELECT COUNT(*) as editor_count 
            FROM Users u 
            JOIN User_Credits uc ON u.User_ID = uc.User_ID 
            WHERE u.Role_ID = 2
        """)
        result = cursor.fetchone()
        editor_count = result[0] if result else 0
        print(f"✓ {editor_count} editors have credit records")
        
    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return False
    except FileNotFoundError:
        print("Migration file 'credit_system_migration.sql' not found!")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()
    
    return True

def test_credit_system():
    """Test the credit system functionality"""
    try:
        from credit_system import CreditSystem
        from mysql.connector import pooling
        
        # Database configuration for connection pool
        db_config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'user': os.getenv('DB_USER', 'root'),
            'password': os.getenv('DB_PASSWORD', 'pabbo@123'),
            'database': os.getenv('DB_NAME', 'lawfort'),
            'pool_name': 'test_pool',
            'pool_size': 5
        }
        
        print("\nTesting credit system...")
        
        # Create connection pool
        connection_pool = pooling.MySQLConnectionPool(**db_config)
        
        # Initialize credit system
        credit_system = CreditSystem(connection_pool)
        
        # Test getting balance for user ID 1 (admin)
        result = credit_system.get_user_credit_balance(1)
        if result['success']:
            print(f"✓ Credit balance test passed. Balance: {result['balance']}")
        else:
            print(f"✗ Credit balance test failed: {result['message']}")
        
        # Test getting statistics
        stats_result = credit_system.get_credit_statistics(1)
        if stats_result['success']:
            print("✓ Credit statistics test passed")
        else:
            print(f"✗ Credit statistics test failed: {stats_result['message']}")
        
        print("Credit system tests completed!")
        
    except ImportError as e:
        print(f"Import error: {e}")
        print("Make sure credit_system.py is in the same directory")
    except Exception as e:
        print(f"Test error: {e}")

if __name__ == "__main__":
    print("=" * 50)
    print("Credit System Migration Runner")
    print("=" * 50)
    
    if run_migration():
        test_credit_system()
        print("\n" + "=" * 50)
        print("Migration and testing completed!")
        print("You can now start using the credit system.")
        print("=" * 50)
    else:
        print("\n" + "=" * 50)
        print("Migration failed! Please check the errors above.")
        print("=" * 50)
