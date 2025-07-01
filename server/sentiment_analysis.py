"""
Sentiment Analysis Module for Blog Post Comments using Groq API

This module provides sentiment analysis functionality to enhance the recommendation system
by analyzing comment sentiment and adjusting blog post recommendation scores accordingly.
"""

import os
import json
import time
import logging
from typing import Dict, List, Tuple, Optional
from groq import Groq
import mysql.connector
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    """
    Sentiment analyzer using Groq API to analyze blog post comments
    and provide sentiment-based weighting for recommendations.
    """
    
    def __init__(self, api_key: str = None):
        """Initialize the sentiment analyzer with Groq API key."""
        self.api_key = api_key or "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"

        # Set the API key as environment variable for Groq client
        import os
        os.environ['GROQ_API_KEY'] = self.api_key

        try:
            self.client = Groq()
        except Exception as e:
            logger.error(f"Failed to initialize Groq client: {e}")
            # Try with explicit API key
            self.client = Groq(api_key=self.api_key)

        # Use a more stable model
        self.model = "llama3-8b-8192"
        
        # Rate limiting
        self.last_request_time = 0
        self.min_request_interval = 1.0  # Minimum 1 second between requests
        
        # Sentiment cache to avoid repeated API calls
        self.sentiment_cache = {}
        self.cache_expiry_hours = 24  # Cache sentiment for 24 hours
    
    def _rate_limit(self):
        """Implement simple rate limiting."""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        
        if time_since_last < self.min_request_interval:
            sleep_time = self.min_request_interval - time_since_last
            time.sleep(sleep_time)
        
        self.last_request_time = time.time()
    
    def analyze_comment_sentiment(self, comment_text: str) -> Dict[str, float]:
        """
        Analyze sentiment of a single comment using Groq API.
        
        Args:
            comment_text (str): The comment text to analyze
            
        Returns:
            Dict[str, float]: Sentiment scores with keys 'positive', 'negative', 'neutral'
        """
        if not comment_text or len(comment_text.strip()) < 3:
            return {'positive': 0.0, 'negative': 0.0, 'neutral': 1.0}
        
        # Check cache first
        cache_key = hash(comment_text.strip().lower())
        if cache_key in self.sentiment_cache:
            cached_result, timestamp = self.sentiment_cache[cache_key]
            if datetime.now() - timestamp < timedelta(hours=self.cache_expiry_hours):
                return cached_result
        
        try:
            self._rate_limit()
            
            prompt = f"""
            Analyze the sentiment of the following comment and provide scores for positive, negative, and neutral sentiment.
            Return only a JSON object with three keys: "positive", "negative", "neutral" with values between 0.0 and 1.0 that sum to 1.0.
            
            Comment: "{comment_text}"
            
            JSON Response:
            """
            
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.1,  # Low temperature for consistent results
                max_tokens=150,
                top_p=0.9,
                stream=False,
            )
            
            response_text = completion.choices[0].message.content.strip()
            
            # Extract JSON from response
            try:
                # Find JSON object in response
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_str = response_text[start_idx:end_idx]
                    sentiment_scores = json.loads(json_str)
                    
                    # Validate and normalize scores
                    required_keys = ['positive', 'negative', 'neutral']
                    if all(key in sentiment_scores for key in required_keys):
                        # Normalize scores to sum to 1.0
                        total = sum(sentiment_scores[key] for key in required_keys)
                        if total > 0:
                            for key in required_keys:
                                sentiment_scores[key] = sentiment_scores[key] / total
                        else:
                            sentiment_scores = {'positive': 0.0, 'negative': 0.0, 'neutral': 1.0}
                        
                        # Cache the result
                        self.sentiment_cache[cache_key] = (sentiment_scores, datetime.now())
                        return sentiment_scores
                
            except json.JSONDecodeError:
                logger.warning(f"Failed to parse JSON from Groq response: {response_text}")
            
            # Fallback: neutral sentiment
            return {'positive': 0.0, 'negative': 0.0, 'neutral': 1.0}
            
        except Exception as e:
            logger.error(f"Error analyzing sentiment with Groq API: {str(e)}")
            # Return neutral sentiment on error
            return {'positive': 0.0, 'negative': 0.0, 'neutral': 1.0}
    
    def analyze_blog_post_sentiment(self, content_id: int, db_connection) -> Dict[str, float]:
        """
        Analyze overall sentiment for a blog post based on its comments.
        
        Args:
            content_id (int): The content ID of the blog post
            db_connection: Database connection object
            
        Returns:
            Dict[str, float]: Aggregated sentiment scores and metrics
        """
        try:
            cursor = db_connection.cursor(dictionary=True)
            
            # Get all active comments for the blog post
            cursor.execute("""
                SELECT Comment_Content, Created_At
                FROM Content_Comments
                WHERE Content_ID = %s AND Status = 'Active'
                ORDER BY Created_At DESC
            """, (content_id,))
            
            comments = cursor.fetchall()
            cursor.close()
            
            if not comments:
                return {
                    'overall_sentiment': 'neutral',
                    'sentiment_score': 0.0,
                    'positive_ratio': 0.0,
                    'negative_ratio': 0.0,
                    'neutral_ratio': 1.0,
                    'comment_count': 0,
                    'confidence': 0.0
                }
            
            # Analyze sentiment for each comment
            sentiment_results = []
            for comment in comments:
                sentiment = self.analyze_comment_sentiment(comment['Comment_Content'])
                sentiment_results.append(sentiment)
            
            # Aggregate sentiment scores using simple statistical methods
            total_comments = len(sentiment_results)
            
            # Calculate average sentiment scores
            avg_positive = sum(s['positive'] for s in sentiment_results) / total_comments
            avg_negative = sum(s['negative'] for s in sentiment_results) / total_comments
            avg_neutral = sum(s['neutral'] for s in sentiment_results) / total_comments
            
            # Determine overall sentiment
            if avg_positive > avg_negative and avg_positive > avg_neutral:
                overall_sentiment = 'positive'
                sentiment_score = avg_positive - avg_negative  # Range: -1 to 1
            elif avg_negative > avg_positive and avg_negative > avg_neutral:
                overall_sentiment = 'negative'
                sentiment_score = avg_positive - avg_negative  # Range: -1 to 1
            else:
                overall_sentiment = 'neutral'
                sentiment_score = 0.0
            
            # Calculate confidence based on comment count and sentiment clarity
            confidence = min(1.0, total_comments / 10.0)  # More comments = higher confidence
            sentiment_clarity = abs(sentiment_score)  # How clear the sentiment is
            confidence *= sentiment_clarity
            
            return {
                'overall_sentiment': overall_sentiment,
                'sentiment_score': sentiment_score,
                'positive_ratio': avg_positive,
                'negative_ratio': avg_negative,
                'neutral_ratio': avg_neutral,
                'comment_count': total_comments,
                'confidence': confidence
            }
            
        except Exception as e:
            logger.error(f"Error analyzing blog post sentiment: {str(e)}")
            return {
                'overall_sentiment': 'neutral',
                'sentiment_score': 0.0,
                'positive_ratio': 0.0,
                'negative_ratio': 0.0,
                'neutral_ratio': 1.0,
                'comment_count': 0,
                'confidence': 0.0
            }
    
    def calculate_sentiment_weight(self, sentiment_data: Dict[str, float]) -> float:
        """
        Calculate sentiment weight for recommendation scoring.
        
        Args:
            sentiment_data (Dict[str, float]): Sentiment analysis results
            
        Returns:
            float: Weight multiplier for recommendation score (0.5 to 1.5)
        """
        sentiment_score = sentiment_data.get('sentiment_score', 0.0)
        confidence = sentiment_data.get('confidence', 0.0)
        comment_count = sentiment_data.get('comment_count', 0)
        
        # Base weight is 1.0 (no change)
        base_weight = 1.0
        
        # Apply sentiment adjustment based on confidence
        if confidence > 0.1 and comment_count >= 2:  # Minimum threshold for sentiment consideration
            # Positive sentiment boosts score, negative sentiment reduces it
            sentiment_adjustment = sentiment_score * confidence * 0.5  # Max adjustment of ±0.5
            weight = base_weight + sentiment_adjustment
            
            # Clamp weight between 0.5 and 1.5
            weight = max(0.5, min(1.5, weight))
        else:
            # Not enough data for sentiment weighting
            weight = base_weight
        
        return weight


def get_db_connection():
    """Get database connection using the same configuration as the main app."""
    try:
        from dotenv import load_dotenv
        load_dotenv()
        
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            database=os.getenv('DB_NAME', 'lawfort'),
            pool_size=int(os.getenv('DB_POOL_SIZE', 5))
        )
        return connection
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        return None


# Global sentiment analyzer instance
sentiment_analyzer = SentimentAnalyzer()


def analyze_content_sentiment(content_id: int) -> Dict[str, float]:
    """
    Convenience function to analyze sentiment for a specific content ID.
    
    Args:
        content_id (int): The content ID to analyze
        
    Returns:
        Dict[str, float]: Sentiment analysis results
    """
    connection = get_db_connection()
    if not connection:
        return {
            'overall_sentiment': 'neutral',
            'sentiment_score': 0.0,
            'positive_ratio': 0.0,
            'negative_ratio': 0.0,
            'neutral_ratio': 1.0,
            'comment_count': 0,
            'confidence': 0.0
        }
    
    try:
        result = sentiment_analyzer.analyze_blog_post_sentiment(content_id, connection)
        return result
    finally:
        connection.close()


def get_sentiment_weight(content_id: int) -> float:
    """
    Get sentiment weight for a specific content ID.
    
    Args:
        content_id (int): The content ID
        
    Returns:
        float: Sentiment weight multiplier
    """
    sentiment_data = analyze_content_sentiment(content_id)
    return sentiment_analyzer.calculate_sentiment_weight(sentiment_data)
