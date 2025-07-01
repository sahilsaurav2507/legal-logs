import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection
connection = mysql.connector.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    user=os.getenv('DB_USER', 'root'),
    password=os.getenv('DB_PASSWORD', 'pabbo@123'),
    database=os.getenv('DB_NAME', 'LawFort')
)

cursor = connection.cursor(dictionary=True)

try:
    print("Starting blog post duplication fix...")
    
    # Step 1: Fix conflicting triggers
    print("\n1. Fixing conflicting triggers...")
    cursor.execute("DROP TRIGGER IF EXISTS update_likes_on_insert")
    print("   - Removed conflicting trigger: update_likes_on_insert")
    
    # Step 2: Identify duplicates
    print("\n2. Identifying duplicate blog posts...")
    cursor.execute("""
        SELECT 
            c1.Content_ID as keep_id,
            c2.Content_ID as duplicate_id,
            c1.Title,
            c1.User_ID
        FROM Content c1
        JOIN Content c2 ON c1.Title = c2.Title 
            AND c1.User_ID = c2.User_ID 
            AND c1.Content_Type = 'Blog_Post' 
            AND c2.Content_Type = 'Blog_Post'
            AND c1.Content_ID < c2.Content_ID
        WHERE c1.Status != 'Deleted' AND c2.Status != 'Deleted'
    """)
    
    duplicates = cursor.fetchall()
    print(f"   - Found {len(duplicates)} duplicate blog posts")
    
    if duplicates:
        print("   - Duplicates to be removed:")
        for dup in duplicates:
            print(f"     Title: '{dup['Title']}' - Keeping ID {dup['keep_id']}, Removing ID {dup['duplicate_id']}")
        
        # Step 3: Remove duplicates
        print("\n3. Removing duplicate entries...")
        
        duplicate_ids = [str(dup['duplicate_id']) for dup in duplicates]
        duplicate_ids_str = ','.join(duplicate_ids)
        
        # Delete from child tables first
        cursor.execute(f"DELETE FROM Blog_Posts WHERE Content_ID IN ({duplicate_ids_str})")
        print(f"   - Removed {cursor.rowcount} entries from Blog_Posts")
        
        cursor.execute(f"DELETE FROM Content_Metrics WHERE Content_ID IN ({duplicate_ids_str})")
        print(f"   - Removed {cursor.rowcount} entries from Content_Metrics")
        
        cursor.execute(f"DELETE FROM Content_Comments WHERE Content_ID IN ({duplicate_ids_str})")
        print(f"   - Removed {cursor.rowcount} entries from Content_Comments")
        
        cursor.execute(f"DELETE FROM Content_Likes WHERE Content_ID IN ({duplicate_ids_str})")
        print(f"   - Removed {cursor.rowcount} entries from Content_Likes")
        
        # Delete from parent table last
        cursor.execute(f"DELETE FROM Content WHERE Content_ID IN ({duplicate_ids_str})")
        print(f"   - Removed {cursor.rowcount} entries from Content")
    
    # Step 4: Verify cleanup
    print("\n4. Verifying cleanup...")
    cursor.execute("""
        SELECT COUNT(*) as count
        FROM Content 
        WHERE Content_Type = 'Blog_Post' AND Status != 'Deleted'
    """)
    total_posts = cursor.fetchone()['count']
    print(f"   - Total blog posts remaining: {total_posts}")
    
    # Check for remaining duplicates
    cursor.execute("""
        SELECT Title, User_ID, COUNT(*) as count
        FROM Content
        WHERE Content_Type = 'Blog_Post' AND Status != 'Deleted'
        GROUP BY Title, User_ID
        HAVING COUNT(*) > 1
    """)
    remaining_duplicates = cursor.fetchall()
    
    if remaining_duplicates:
        print(f"   - WARNING: {len(remaining_duplicates)} duplicate titles still exist:")
        for dup in remaining_duplicates:
            print(f"     Title: '{dup['Title']}' - Count: {dup['count']}")
    else:
        print("   - No duplicate titles found!")
    
    # Step 5: Show current triggers
    print("\n5. Current triggers on content_likes table:")
    cursor.execute("SHOW TRIGGERS LIKE '%content_likes%'")
    triggers = cursor.fetchall()
    for trigger in triggers:
        print(f"   - {trigger['Trigger']} ({trigger['Event']} {trigger['Timing']})")
    
    # Commit all changes
    connection.commit()
    print("\n✅ Blog post duplication fix completed successfully!")
    
except Exception as e:
    print(f"\n❌ Error during fix: {e}")
    connection.rollback()
    
finally:
    cursor.close()
    connection.close()
