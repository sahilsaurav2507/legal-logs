-- Credit System Migration Script (Safe Version)
-- This script adds the necessary tables for the credit system
-- Handles existing objects gracefully

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Create Content_Likes table (missing from original schema)
CREATE TABLE IF NOT EXISTS Content_Likes (
    Like_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Content_ID INT NOT NULL,
    Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Content_ID) REFERENCES Content(Content_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_user_content_like (User_ID, Content_ID)
);

-- Create User_Credits table to track user credit balances
CREATE TABLE IF NOT EXISTS User_Credits (
    Credit_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Credit_Balance DECIMAL(10,2) DEFAULT 0.00,
    Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
    Last_Updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_user_credit (User_ID)
);

-- Create Credit_Transactions table to track all credit transactions
CREATE TABLE IF NOT EXISTS Credit_Transactions (
    Transaction_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Transaction_Type ENUM('LIKE_RECEIVED', 'LIKE_REMOVED', 'AD_REVENUE', 'ENGAGEMENT_BONUS', 'MANUAL_ADJUSTMENT') NOT NULL,
    Description TEXT,
    Related_Content_ID INT NULL,
    Related_User_ID INT NULL,
    Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Related_Content_ID) REFERENCES Content(Content_ID) ON DELETE SET NULL,
    FOREIGN KEY (Related_User_ID) REFERENCES Users(User_ID) ON DELETE SET NULL,
    INDEX idx_user_transactions (User_ID, Created_At),
    INDEX idx_transaction_type (Transaction_Type),
    INDEX idx_related_content (Related_Content_ID)
);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert initial credit records for existing editors (Role_ID = 2)
INSERT IGNORE INTO User_Credits (User_ID, Credit_Balance)
SELECT User_ID, 0.00
FROM Users
WHERE Role_ID = 2;

-- Drop existing stored procedures if they exist
DROP PROCEDURE IF EXISTS GetUserCreditSummary;
DROP PROCEDURE IF EXISTS GetTopEarningEditors;

-- Create a stored procedure to get user credit summary
DELIMITER //

CREATE PROCEDURE GetUserCreditSummary(IN p_user_id INT)
BEGIN
    SELECT 
        uc.Credit_Balance as current_balance,
        uc.Last_Updated as balance_last_updated,
        COUNT(ct.Transaction_ID) as total_transactions,
        SUM(CASE WHEN ct.Amount > 0 THEN ct.Amount ELSE 0 END) as total_earned,
        SUM(CASE WHEN ct.Amount < 0 THEN ABS(ct.Amount) ELSE 0 END) as total_spent,
        COUNT(CASE WHEN ct.Transaction_Type = 'LIKE_RECEIVED' THEN 1 END) as likes_received,
        COUNT(CASE WHEN ct.Transaction_Type = 'LIKE_REMOVED' THEN 1 END) as likes_removed
    FROM User_Credits uc
    LEFT JOIN Credit_Transactions ct ON uc.User_ID = ct.User_ID
    WHERE uc.User_ID = p_user_id
    GROUP BY uc.User_ID, uc.Credit_Balance, uc.Last_Updated;
END //

DELIMITER ;

-- Create a stored procedure to get top earning editors
DELIMITER //

CREATE PROCEDURE GetTopEarningEditors(IN p_limit INT)
BEGIN
    SELECT 
        u.User_ID,
        up.Full_Name,
        uc.Credit_Balance,
        COUNT(ct.Transaction_ID) as total_transactions,
        SUM(CASE WHEN ct.Amount > 0 THEN ct.Amount ELSE 0 END) as total_earned,
        COUNT(CASE WHEN ct.Transaction_Type = 'LIKE_RECEIVED' THEN 1 END) as likes_received
    FROM Users u
    JOIN User_Profile up ON u.User_ID = up.User_ID
    LEFT JOIN User_Credits uc ON u.User_ID = uc.User_ID
    LEFT JOIN Credit_Transactions ct ON u.User_ID = ct.User_ID
    WHERE u.Role_ID = 2  -- Editors only
    GROUP BY u.User_ID, up.Full_Name, uc.Credit_Balance
    ORDER BY uc.Credit_Balance DESC
    LIMIT p_limit;
END //

DELIMITER ;

-- Drop existing view if it exists
DROP VIEW IF EXISTS Credit_Analytics;

-- Create a view for easy credit analytics
CREATE VIEW Credit_Analytics AS
SELECT 
    u.User_ID,
    up.Full_Name,
    r.Role_Name,
    COALESCE(uc.Credit_Balance, 0.00) as Credit_Balance,
    uc.Last_Updated as balance_last_updated,
    COUNT(ct.Transaction_ID) as total_transactions,
    SUM(CASE WHEN ct.Amount > 0 THEN ct.Amount ELSE 0 END) as total_earned,
    SUM(CASE WHEN ct.Amount < 0 THEN ABS(ct.Amount) ELSE 0 END) as total_spent,
    COUNT(CASE WHEN ct.Transaction_Type = 'LIKE_RECEIVED' THEN 1 END) as likes_received,
    COUNT(CASE WHEN ct.Transaction_Type = 'LIKE_REMOVED' THEN 1 END) as likes_removed,
    COUNT(CASE WHEN ct.Transaction_Type = 'AD_REVENUE' THEN 1 END) as ad_revenues,
    COUNT(CASE WHEN ct.Transaction_Type = 'ENGAGEMENT_BONUS' THEN 1 END) as engagement_bonuses
FROM Users u
JOIN User_Profile up ON u.User_ID = up.User_ID
JOIN Roles r ON u.Role_ID = r.Role_ID
LEFT JOIN User_Credits uc ON u.User_ID = uc.User_ID
LEFT JOIN Credit_Transactions ct ON u.User_ID = ct.User_ID
WHERE u.Role_ID = 2  -- Editors only
GROUP BY u.User_ID, up.Full_Name, r.Role_Name, uc.Credit_Balance, uc.Last_Updated;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_content_metrics_on_like;
DROP TRIGGER IF EXISTS update_content_metrics_on_unlike;

DELIMITER //

-- Create trigger to automatically update Content_Metrics when likes are added
CREATE TRIGGER update_content_metrics_on_like
AFTER INSERT ON Content_Likes
FOR EACH ROW
BEGIN
    -- Update or insert content metrics
    INSERT INTO Content_Metrics (Content_ID, Views, Likes, Shares, Comments_Count)
    VALUES (NEW.Content_ID, 0, 1, 0, 0)
    ON DUPLICATE KEY UPDATE
    Likes = (SELECT COUNT(*) FROM Content_Likes WHERE Content_ID = NEW.Content_ID),
    Last_Updated = NOW();
END //

-- Create trigger to automatically update Content_Metrics when likes are removed
CREATE TRIGGER update_content_metrics_on_unlike
AFTER DELETE ON Content_Likes
FOR EACH ROW
BEGIN
    -- Update content metrics
    UPDATE Content_Metrics 
    SET Likes = (SELECT COUNT(*) FROM Content_Likes WHERE Content_ID = OLD.Content_ID),
        Last_Updated = NOW()
    WHERE Content_ID = OLD.Content_ID;
END //

DELIMITER ;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS CalculateEngagementScore;

-- Create a function to calculate engagement score including credits
DELIMITER //

CREATE FUNCTION CalculateEngagementScore(p_content_id INT) 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE engagement_score DECIMAL(10,2) DEFAULT 0.00;
    DECLARE like_count INT DEFAULT 0;
    DECLARE view_count INT DEFAULT 0;
    DECLARE comment_count INT DEFAULT 0;
    DECLARE share_count INT DEFAULT 0;
    
    -- Get metrics
    SELECT 
        COALESCE(Views, 0),
        COALESCE(Likes, 0),
        COALESCE(Shares, 0),
        COALESCE(Comments_Count, 0)
    INTO view_count, like_count, share_count, comment_count
    FROM Content_Metrics
    WHERE Content_ID = p_content_id;
    
    -- Calculate weighted engagement score
    -- Views: 0.4, Likes: 0.3, Shares: 0.2, Comments: 0.1
    SET engagement_score = (view_count * 0.4) + (like_count * 0.3) + (share_count * 0.2) + (comment_count * 0.1);
    
    RETURN engagement_score;
END //

DELIMITER ;

-- Add indexes safely (only if they don't exist)
-- We'll use a procedure to check and create indexes
DELIMITER //

CREATE PROCEDURE CreateIndexIfNotExists(
    IN table_name VARCHAR(64),
    IN index_name VARCHAR(64),
    IN index_definition TEXT
)
BEGIN
    DECLARE index_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO index_exists
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = table_name
    AND INDEX_NAME = index_name;
    
    IF index_exists = 0 THEN
        SET @sql = CONCAT('CREATE INDEX ', index_name, ' ON ', table_name, ' ', index_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END //

DELIMITER ;

-- Create indexes using the safe procedure
CALL CreateIndexIfNotExists('Content_Likes', 'idx_content_likes_content', '(Content_ID)');
CALL CreateIndexIfNotExists('Content_Likes', 'idx_content_likes_user', '(User_ID)');
CALL CreateIndexIfNotExists('User_Credits', 'idx_user_credits_balance', '(Credit_Balance DESC)');
CALL CreateIndexIfNotExists('Credit_Transactions', 'idx_credit_transactions_amount', '(Amount)');
CALL CreateIndexIfNotExists('Credit_Transactions', 'idx_credit_transactions_date', '(Created_At DESC)');

-- Drop the helper procedure
DROP PROCEDURE CreateIndexIfNotExists;

-- Success message
SELECT 'Credit system migration completed successfully!' as message;
