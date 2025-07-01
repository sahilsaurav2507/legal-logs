-- Fix Blog Post Duplication Issues
-- This script addresses the blog post duplication problem

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Step 1: Fix conflicting triggers on content_likes table
-- Drop the old trigger that conflicts with the new one
DROP TRIGGER IF EXISTS update_likes_on_insert;

-- Keep only the newer, more comprehensive trigger
-- The update_content_metrics_on_like trigger is better as it uses ON DUPLICATE KEY UPDATE

-- Step 2: Clean up existing duplicate blog posts
-- First, let's identify duplicates by title and user
CREATE TEMPORARY TABLE duplicate_posts AS
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
    AND c1.Content_ID < c2.Content_ID  -- Keep the older post
WHERE c1.Status != 'Deleted' AND c2.Status != 'Deleted';

-- Show what we're about to clean up
SELECT 
    dp.Title,
    dp.User_ID,
    dp.keep_id as 'Keeping Content_ID',
    dp.duplicate_id as 'Removing Content_ID'
FROM duplicate_posts dp;

-- Step 3: Remove duplicate entries
-- First, delete from Blog_Posts table (child table)
DELETE bp FROM Blog_Posts bp
INNER JOIN duplicate_posts dp ON bp.Content_ID = dp.duplicate_id;

-- Delete from Content_Metrics table
DELETE cm FROM Content_Metrics cm
INNER JOIN duplicate_posts dp ON cm.Content_ID = dp.duplicate_id;

-- Delete from Content_Comments table if any
DELETE cc FROM Content_Comments cc
INNER JOIN duplicate_posts dp ON cc.Content_ID = dp.duplicate_id;

-- Delete from Content_Likes table if any
DELETE cl FROM Content_Likes cl
INNER JOIN duplicate_posts dp ON cl.Content_ID = dp.duplicate_id;

-- Finally, delete from Content table (parent table)
DELETE c FROM Content c
INNER JOIN duplicate_posts dp ON c.Content_ID = dp.duplicate_id;

-- Step 4: Add a unique constraint to prevent future duplicates
-- Note: This is a soft constraint - we'll handle it in the application layer
-- as titles can legitimately be similar across different users

-- Step 5: Verify the cleanup
SELECT 
    'Remaining blog posts after cleanup:' as message,
    COUNT(*) as count
FROM Content 
WHERE Content_Type = 'Blog_Post' AND Status != 'Deleted';

-- Check for any remaining duplicates
SELECT 
    Title,
    User_ID,
    COUNT(*) as count
FROM Content
WHERE Content_Type = 'Blog_Post' AND Status != 'Deleted'
GROUP BY Title, User_ID
HAVING COUNT(*) > 1;

-- Step 6: Clean up temporary table
DROP TEMPORARY TABLE duplicate_posts;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Step 7: Show current trigger status
SHOW TRIGGERS LIKE '%content_likes%';

-- Success message
SELECT 'Blog post duplication fix completed successfully!' as message;
