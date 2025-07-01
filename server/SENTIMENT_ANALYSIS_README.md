# Sentiment Analysis Integration for Blog Post Recommendations

This document describes the sentiment analysis feature that enhances the recommendation system by analyzing comment sentiment and adjusting blog post recommendation scores accordingly.

## Overview

The sentiment analysis system uses the Groq API to analyze comments on blog posts and determine overall sentiment (positive, negative, or neutral). This sentiment data is then used to boost or penalize blog posts in the recommendation algorithm, creating a community-driven quality filter.

## Features

- **Real-time Sentiment Analysis**: Comments are analyzed when added using the Groq API
- **Sentiment-Enhanced Recommendations**: Blog posts with positive sentiment get boosted in recommendations
- **Simple Statistical Methods**: Uses straightforward aggregation methods as per user preference
- **Caching System**: Sentiment scores are cached to avoid repeated API calls
- **Background Processing**: Sentiment analysis runs asynchronously to avoid blocking user interactions

## Architecture

### Components

1. **`sentiment_analysis.py`**: Core sentiment analysis module
2. **Database Schema**: Enhanced `Content_Metrics` table with sentiment columns
3. **API Endpoints**: New routes for sentiment management
4. **Integration Points**: Modified recommendation algorithm in `app.py`

### Database Schema Changes

New columns added to `Content_Metrics` table:
- `Sentiment_Score`: Overall sentiment score (-1.00 to 1.00)
- `Positive_Ratio`: Ratio of positive sentiment (0.00 to 1.00)
- `Negative_Ratio`: Ratio of negative sentiment (0.00 to 1.00)
- `Neutral_Ratio`: Ratio of neutral sentiment (0.00 to 1.00)
- `Sentiment_Confidence`: Confidence in sentiment analysis (0.00 to 1.00)
- `Overall_Sentiment`: Classification (positive/negative/neutral)
- `Sentiment_Last_Updated`: Timestamp of last analysis
- `Sentiment_Comment_Count`: Number of comments analyzed

## Installation & Setup

### 1. Install Dependencies

```bash
cd Backend
pip install groq==0.4.1
```

### 2. Database Migration

Run the sentiment analysis migration:

```bash
mysql -u root -p lawfort < sentiment_migration.sql
```

### 3. Environment Configuration

The Groq API key is already configured in the code:
```
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
```

### 4. Test the Implementation

```bash
python test_sentiment.py
```

## API Endpoints

### Get Content Sentiment
```
GET /api/content/{content_id}/sentiment
```
Returns current sentiment analysis data for a content item.

### Update Content Sentiment
```
POST /api/content/{content_id}/sentiment/update
```
Manually triggers sentiment analysis update for a content item.

### Batch Update Sentiment (Admin Only)
```
POST /api/admin/sentiment/batch-update
```
Updates sentiment analysis for multiple blog posts in batch.

## How It Works

### 1. Comment Analysis
When a comment is added:
1. The comment text is sent to Groq API for sentiment analysis
2. API returns sentiment scores (positive, negative, neutral)
3. Results are cached to avoid repeated API calls

### 2. Blog Post Sentiment Aggregation
For each blog post:
1. All active comments are analyzed
2. Sentiment scores are aggregated using simple statistical methods
3. Overall sentiment and confidence are calculated
4. Results are stored in the database

### 3. Recommendation Enhancement
When sorting by engagement:
1. Base engagement score is calculated (likes + comments)
2. Sentiment weight is applied based on sentiment score and confidence
3. Final score = base_engagement × sentiment_weight
4. Sentiment weight ranges from 0.5 to 1.5

### 4. Sentiment Weight Calculation
```python
# Positive sentiment boosts score, negative reduces it
sentiment_adjustment = sentiment_score × confidence × 0.5
weight = 1.0 + sentiment_adjustment
weight = clamp(weight, 0.5, 1.5)  # Limit impact
```

## Configuration

### Rate Limiting
- Minimum 1 second between API requests
- Automatic retry logic for failed requests

### Caching
- Sentiment results cached for 24 hours
- Cache invalidated when comment count changes

### Confidence Thresholds
- Minimum 2 comments required for sentiment weighting
- Minimum 0.1 confidence required for sentiment consideration

## Monitoring & Maintenance

### Logs
Sentiment analysis activities are logged with INFO level:
```
Updated sentiment for content 123: positive (score: 0.75)
```

### Error Handling
- API failures fall back to neutral sentiment
- Database errors are logged but don't break functionality
- Invalid responses are handled gracefully

### Performance Considerations
- Sentiment analysis runs asynchronously
- Database queries are optimized with indexes
- API calls are rate-limited to avoid quota issues

## Testing

### Manual Testing
```bash
# Test individual components
python test_sentiment.py

# Test API endpoints
curl -X GET "http://localhost:5000/api/content/1/sentiment"
curl -X POST "http://localhost:5000/api/content/1/sentiment/update"
```

### Integration Testing
1. Create a blog post with comments
2. Add positive and negative comments
3. Check sentiment analysis results
4. Verify recommendation ranking changes

## Troubleshooting

### Common Issues

1. **Groq API Errors**
   - Check API key validity
   - Verify network connectivity
   - Check rate limiting

2. **Database Errors**
   - Ensure migration was run successfully
   - Check database permissions
   - Verify table structure

3. **Sentiment Not Updating**
   - Check if comments exist and are active
   - Verify sentiment update triggers
   - Check logs for errors

### Debug Commands
```bash
# Check database schema
mysql -u root -p lawfort -e "DESCRIBE Content_Metrics;"

# Check sentiment data
mysql -u root -p lawfort -e "SELECT Content_ID, Overall_Sentiment, Sentiment_Score FROM Content_Metrics WHERE Sentiment_Last_Updated IS NOT NULL;"

# Test API connectivity
python -c "from sentiment_analysis import SentimentAnalyzer; print(SentimentAnalyzer().analyze_comment_sentiment('test'))"
```

## Future Enhancements

1. **Advanced Analytics**: Sentiment trends over time
2. **User Preferences**: Allow users to weight sentiment importance
3. **Multi-language Support**: Extend to non-English comments
4. **Real-time Updates**: WebSocket notifications for sentiment changes
5. **A/B Testing**: Compare recommendation performance with/without sentiment

## Security Considerations

- API key is embedded in code (consider environment variable for production)
- Sentiment data is not user-identifiable
- Rate limiting prevents API abuse
- Database queries use parameterized statements

## Performance Impact

- Minimal impact on user experience (async processing)
- Database queries optimized with indexes
- API calls cached to reduce external dependencies
- Graceful degradation when sentiment service unavailable
