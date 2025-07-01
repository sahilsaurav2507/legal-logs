# Credit System Documentation

## Overview

The Credit System is a monetization feature for the LawFort platform that allows editors to earn money (credits) when users interact with their content. Currently, editors earn **10 rupees for each like** their content receives.

## Features

- **Automatic Credit Awards**: Editors earn 10 rupees when their content gets liked
- **Credit Deductions**: Credits are deducted when likes are removed
- **Transaction Tracking**: All credit transactions are logged with detailed information
- **Balance Management**: Real-time credit balance tracking for each user
- **Role-Based**: Only editors (Role_ID = 2) can earn credits
- **Self-Like Prevention**: Users cannot earn credits from liking their own content
- **Future-Ready**: Designed to support additional monetization features like ads and engagement bonuses

## Database Schema

### New Tables Added

#### 1. Content_Likes
```sql
CREATE TABLE Content_Likes (
    Like_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Content_ID INT NOT NULL,
    Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID),
    FOREIGN KEY (Content_ID) REFERENCES Content(Content_ID),
    UNIQUE KEY unique_user_content_like (User_ID, Content_ID)
);
```

#### 2. User_Credits
```sql
CREATE TABLE User_Credits (
    Credit_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Credit_Balance DECIMAL(10,2) DEFAULT 0.00,
    Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
    Last_Updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID),
    UNIQUE KEY unique_user_credit (User_ID)
);
```

#### 3. Credit_Transactions
```sql
CREATE TABLE Credit_Transactions (
    Transaction_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Transaction_Type ENUM('LIKE_RECEIVED', 'LIKE_REMOVED', 'AD_REVENUE', 'ENGAGEMENT_BONUS', 'MANUAL_ADJUSTMENT'),
    Description TEXT,
    Related_Content_ID INT NULL,
    Related_User_ID INT NULL,
    Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID),
    FOREIGN KEY (Related_Content_ID) REFERENCES Content(Content_ID),
    FOREIGN KEY (Related_User_ID) REFERENCES Users(User_ID)
);
```

## Installation & Setup

### 1. Run the Migration

```bash
# Run the database migration
python run_credit_migration.py
```

This will:
- Create the necessary database tables
- Add stored procedures and views
- Set up indexes for performance
- Initialize credit records for existing editors

### 2. Test the System

```bash
# Test the credit system functionality
python test_credit_system.py
```

## API Endpoints

### 1. Get Credit Balance
```
GET /api/credits/balance
```
Returns the current credit balance for the authenticated user.

**Response:**
```json
{
    "success": true,
    "balance": 150.00,
    "last_updated": "2024-01-15T10:30:00"
}
```

### 2. Get Transaction History
```
GET /api/credits/transactions?limit=50&offset=0
```
Returns the credit transaction history for the authenticated user.

**Response:**
```json
{
    "success": true,
    "transactions": [
        {
            "Transaction_ID": 123,
            "Amount": 10.00,
            "Transaction_Type": "LIKE_RECEIVED",
            "Description": "Credit earned from like on content: Introduction to Contract Law",
            "Created_At": "2024-01-15T10:30:00",
            "content_title": "Introduction to Contract Law",
            "related_user_name": "John Doe"
        }
    ],
    "total_count": 25,
    "limit": 50,
    "offset": 0
}
```

### 3. Get Credit Statistics
```
GET /api/credits/statistics
```
Returns comprehensive credit statistics for the authenticated user.

**Response:**
```json
{
    "success": true,
    "statistics": {
        "current_balance": 150.00,
        "total_earned": 200.00,
        "total_spent": 50.00,
        "total_transactions": 25,
        "likes_received": 20,
        "likes_removed": 5
    }
}
```

### 4. Enhanced Like Endpoint
The existing like endpoint now includes credit information:

```
POST /api/content/{content_id}/like
```

**Enhanced Response:**
```json
{
    "success": true,
    "action": "liked",
    "is_liked": true,
    "like_count": 15,
    "message": "Content liked successfully",
    "credit_info": {
        "credit_processed": true,
        "credit_message": "Awarded 10 rupees for receiving a like",
        "credit_amount": 10,
        "new_balance": 160.00
    }
}
```

## Credit System Logic

### When a Like is Added:
1. Check if content creator is an editor (Role_ID = 2)
2. Verify the liker is not the content creator (prevent self-likes)
3. Award 10 rupees to the content creator
4. Log the transaction in Credit_Transactions table
5. Update the user's credit balance in User_Credits table

### When a Like is Removed:
1. Check if content creator is an editor
2. Verify the unliker is not the content creator
3. Deduct 10 rupees from the content creator
4. Log the transaction (negative amount)
5. Update the user's credit balance

### Transaction Types:
- **LIKE_RECEIVED**: Credit earned from receiving a like (+10 rupees)
- **LIKE_REMOVED**: Credit deducted from like removal (-10 rupees)
- **AD_REVENUE**: Future feature for advertisement revenue
- **ENGAGEMENT_BONUS**: Future feature for engagement time bonuses
- **MANUAL_ADJUSTMENT**: Admin adjustments

## Usage Examples

### Python Code Example:
```python
from credit_system import CreditSystem
from mysql.connector import pooling

# Initialize credit system
connection_pool = pooling.MySQLConnectionPool(**db_config)
credit_system = CreditSystem(connection_pool)

# Award credit for a like
result = credit_system.award_like_credit(content_id=1, liker_user_id=2)
if result['success']:
    print(f"Awarded {result['credit_awarded']} rupees")

# Get user balance
balance = credit_system.get_user_credit_balance(user_id=1)
print(f"Current balance: {balance['balance']} rupees")
```

## Future Enhancements

The credit system is designed to support additional monetization features:

1. **Advertisement Revenue**: Credits from ad impressions/clicks
2. **Engagement Bonuses**: Credits based on time spent reading content
3. **Premium Content**: Credits from paid content access
4. **Referral Bonuses**: Credits for referring new users
5. **Achievement Rewards**: Credits for platform milestones

## Security Considerations

- **Role Verification**: Only editors can earn credits
- **Self-Like Prevention**: Users cannot earn from their own likes
- **Transaction Logging**: All transactions are logged for audit
- **Balance Validation**: Prevents negative balances (configurable)
- **Database Constraints**: Foreign key constraints ensure data integrity

## Performance Optimizations

- **Database Indexes**: Optimized queries with proper indexing
- **Connection Pooling**: Efficient database connection management
- **Batch Operations**: Support for bulk credit operations
- **Caching Ready**: Designed to work with Redis caching

## Monitoring & Analytics

The system includes views and stored procedures for:
- Top earning editors
- Credit analytics
- Transaction summaries
- Performance metrics

## Troubleshooting

### Common Issues:

1. **Migration Fails**: Check database permissions and connection
2. **Credits Not Awarded**: Verify user is an editor (Role_ID = 2)
3. **Negative Balance**: Check if negative balance prevention is enabled
4. **Missing Transactions**: Verify Content_Likes table exists

### Debug Commands:
```sql
-- Check if tables exist
SHOW TABLES LIKE 'Content_Likes';
SHOW TABLES LIKE 'User_Credits';
SHOW TABLES LIKE 'Credit_Transactions';

-- Check editor credit balances
SELECT * FROM Credit_Analytics;

-- Check recent transactions
SELECT * FROM Credit_Transactions ORDER BY Created_At DESC LIMIT 10;
```

## Support

For issues or questions about the credit system, please check:
1. Database migration logs
2. Application logs for credit system errors
3. Test script output for functionality verification
