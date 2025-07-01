#!/usr/bin/env python3
"""
Script to run the sentiment analysis database migration.
"""

import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def run_migration():
    """Run the sentiment analysis migration."""
    try:
        # Try to get password from environment, otherwise use empty string
        db_password = os.getenv('DB_PASSWORD', 'pabbo@123')
        if not db_password or db_password == 'pabbo@123':
            db_password = ''  # Use empty string for no password
        
        # Connect to database
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=db_password,
            database=os.getenv('DB_NAME', 'lawfort')
        )
        
        cursor = connection.cursor()
        
        print("Connected to database successfully!")
        
        # Read and execute migration SQL
        with open('sentiment_migration.sql', 'r') as file:
            sql_content = file.read()
        
        # Split SQL commands and execute them one by one
        sql_commands = [cmd.strip() for cmd in sql_content.split(';') if cmd.strip() and not cmd.strip().startswith('--')]
        
        for i, command in enumerate(sql_commands):
            if command.upper().startswith('USE'):
                continue  # Skip USE command as we're already connected to the database
            
            try:
                print(f"Executing command {i+1}/{len(sql_commands)}: {command[:50]}...")
                cursor.execute(command)
                
                # If it's a SELECT command, fetch and display results
                if command.upper().strip().startswith('SELECT'):
                    results = cursor.fetchall()
                    print(f"Results: {results}")
                elif command.upper().strip().startswith('DESCRIBE'):
                    results = cursor.fetchall()
                    print("Table structure:")
                    for row in results:
                        print(f"  {row}")
                
            except mysql.connector.Error as e:
                if "Duplicate column name" in str(e):
                    print(f"  Column already exists, skipping: {e}")
                elif "Duplicate key name" in str(e):
                    print(f"  Index already exists, skipping: {e}")
                else:
                    print(f"  Error executing command: {e}")
        
        connection.commit()
        cursor.close()
        connection.close()
        
        print("\n✅ Migration completed successfully!")
        print("Sentiment analysis columns have been added to the Content_Metrics table.")
        
    except mysql.connector.Error as e:
        print(f"❌ Database error: {e}")
        print("Please check your database connection settings in the .env file.")
    except FileNotFoundError:
        print("❌ Migration file 'sentiment_migration.sql' not found.")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    print("Sentiment Analysis Database Migration")
    print("=" * 40)
    run_migration()
