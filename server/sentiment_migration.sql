-- Migration script to add sentiment analysis columns to Content_Metrics table
-- This script enhances the existing table to support sentiment-based recommendations

USE lawfort;

-- Add sentiment analysis columns to Content_Metrics table
ALTER TABLE Content_Metrics 
ADD COLUMN Sentiment_Score DECIMAL(3,2) DEFAULT 0.00 COMMENT 'Overall sentiment score (-1.00 to 1.00)',
ADD COLUMN Positive_Ratio DECIMAL(3,2) DEFAULT 0.00 COMMENT 'Ratio of positive sentiment (0.00 to 1.00)',
ADD COLUMN Negative_Ratio DECIMAL(3,2) DEFAULT 0.00 COMMENT 'Ratio of negative sentiment (0.00 to 1.00)',
ADD COLUMN Neutral_Ratio DECIMAL(3,2) DEFAULT 1.00 COMMENT 'Ratio of neutral sentiment (0.00 to 1.00)',
ADD COLUMN Sentiment_Confidence DECIMAL(3,2) DEFAULT 0.00 COMMENT 'Confidence in sentiment analysis (0.00 to 1.00)',
ADD COLUMN Overall_Sentiment ENUM('positive', 'negative', 'neutral') DEFAULT 'neutral' COMMENT 'Overall sentiment classification',
ADD COLUMN Sentiment_Last_Updated DATETIME NULL COMMENT 'Last time sentiment was analyzed',
ADD COLUMN Sentiment_Comment_Count INT DEFAULT 0 COMMENT 'Number of comments analyzed for sentiment';

-- Create index for efficient sentiment-based queries
CREATE INDEX idx_content_metrics_sentiment ON Content_Metrics(Overall_Sentiment, Sentiment_Score);
CREATE INDEX idx_content_metrics_sentiment_updated ON Content_Metrics(Sentiment_Last_Updated);

-- Update existing records to have neutral sentiment by default
UPDATE Content_Metrics 
SET 
    Sentiment_Score = 0.00,
    Positive_Ratio = 0.00,
    Negative_Ratio = 0.00,
    Neutral_Ratio = 1.00,
    Sentiment_Confidence = 0.00,
    Overall_Sentiment = 'neutral',
    Sentiment_Last_Updated = NULL,
    Sentiment_Comment_Count = 0
WHERE Sentiment_Score IS NULL;

-- Verify the migration
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN Overall_Sentiment = 'neutral' THEN 1 END) as neutral_records,
    COUNT(CASE WHEN Sentiment_Last_Updated IS NULL THEN 1 END) as unanalyzed_records
FROM Content_Metrics;

-- Show the updated table structure
DESCRIBE Content_Metrics;
