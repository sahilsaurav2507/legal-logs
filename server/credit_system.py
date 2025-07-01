"""
Credit System Module for LawFort Application

This module handles the credit/money system where editors earn credits
when users like their content. Currently awards 10 rupees per like.

Features:
- Award credits for likes on editor content
- Deduct credits when likes are removed
- Track all credit transactions
- Provide credit balance and transaction history
- Support for future monetization features (ads, engagement time, etc.)
"""

import mysql.connector
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import logging

# Configure logging
logger = logging.getLogger(__name__)

class CreditSystem:
    """
    Handles all credit-related operations for the LawFort platform
    """
    
    # Credit rates (in rupees)
    CREDIT_PER_LIKE = 10
    
    # Transaction types
    TRANSACTION_TYPES = {
        'LIKE_RECEIVED': 'Credit earned from receiving a like',
        'LIKE_REMOVED': 'Credit deducted from like removal',
        'AD_REVENUE': 'Credit earned from advertisement revenue',
        'ENGAGEMENT_BONUS': 'Credit earned from engagement time bonus',
        'MANUAL_ADJUSTMENT': 'Manual credit adjustment by admin'
    }
    
    def __init__(self, connection_pool):
        """
        Initialize credit system with database connection pool
        
        Args:
            connection_pool: MySQL connection pool instance
        """
        self.connection_pool = connection_pool
    
    def get_db_connection(self):
        """Get database connection from pool"""
        return self.connection_pool.get_connection()
    
    def award_like_credit(self, content_id: int, liker_user_id: int) -> Dict:
        """
        Award credit to content creator when their content receives a like
        
        Args:
            content_id: ID of the content that was liked
            liker_user_id: ID of the user who liked the content
            
        Returns:
            Dict with success status, message, and transaction details
        """
        try:
            connection = self.get_db_connection()
            cursor = connection.cursor(dictionary=True)
            
            # Get content creator and their role
            cursor.execute("""
                SELECT c.User_ID as creator_id, u.Role_ID, r.Role_Name, c.Title
                FROM Content c
                JOIN Users u ON c.User_ID = u.User_ID
                JOIN Roles r ON u.Role_ID = r.Role_ID
                WHERE c.Content_ID = %s AND c.Status = 'Active'
            """, (content_id,))
            
            content_info = cursor.fetchone()
            
            if not content_info:
                return {
                    'success': False,
                    'message': 'Content not found or inactive'
                }
            
            creator_id = content_info['creator_id']
            creator_role = content_info['Role_Name']
            
            # Only award credits to editors (Role_ID = 2)
            if content_info['Role_ID'] != 2:
                return {
                    'success': True,
                    'message': f'No credit awarded - content creator is not an editor (Role: {creator_role})',
                    'credit_awarded': 0
                }
            
            # Don't award credit if user likes their own content
            if creator_id == liker_user_id:
                return {
                    'success': True,
                    'message': 'No credit awarded for self-likes',
                    'credit_awarded': 0
                }
            
            # Award credit
            credit_amount = self.CREDIT_PER_LIKE
            transaction_result = self._add_credit_transaction(
                user_id=creator_id,
                amount=credit_amount,
                transaction_type='LIKE_RECEIVED',
                description=f'Credit earned from like on content: {content_info["Title"]}',
                related_content_id=content_id,
                related_user_id=liker_user_id,
                cursor=cursor
            )
            
            if transaction_result['success']:
                connection.commit()
                logger.info(f"Awarded {credit_amount} credits to user {creator_id} for like on content {content_id}")
                
                return {
                    'success': True,
                    'message': f'Awarded {credit_amount} rupees for receiving a like',
                    'credit_awarded': credit_amount,
                    'transaction_id': transaction_result['transaction_id'],
                    'new_balance': transaction_result['new_balance']
                }
            else:
                connection.rollback()
                return transaction_result
                
        except Exception as e:
            if 'connection' in locals():
                connection.rollback()
            logger.error(f"Error awarding like credit: {str(e)}")
            return {
                'success': False,
                'message': f'Error awarding credit: {str(e)}'
            }
        finally:
            if 'cursor' in locals():
                cursor.close()
            if 'connection' in locals():
                connection.close()
    
    def deduct_like_credit(self, content_id: int, unliker_user_id: int) -> Dict:
        """
        Deduct credit from content creator when a like is removed
        
        Args:
            content_id: ID of the content that was unliked
            unliker_user_id: ID of the user who removed the like
            
        Returns:
            Dict with success status, message, and transaction details
        """
        try:
            connection = self.get_db_connection()
            cursor = connection.cursor(dictionary=True)
            
            # Get content creator and their role
            cursor.execute("""
                SELECT c.User_ID as creator_id, u.Role_ID, r.Role_Name, c.Title
                FROM Content c
                JOIN Users u ON c.User_ID = u.User_ID
                JOIN Roles r ON u.Role_ID = r.Role_ID
                WHERE c.Content_ID = %s AND c.Status = 'Active'
            """, (content_id,))
            
            content_info = cursor.fetchone()
            
            if not content_info:
                return {
                    'success': False,
                    'message': 'Content not found or inactive'
                }
            
            creator_id = content_info['creator_id']
            creator_role = content_info['Role_Name']
            
            # Only deduct credits from editors (Role_ID = 2)
            if content_info['Role_ID'] != 2:
                return {
                    'success': True,
                    'message': f'No credit deducted - content creator is not an editor (Role: {creator_role})',
                    'credit_deducted': 0
                }
            
            # Don't deduct credit if user unlikes their own content
            if creator_id == unliker_user_id:
                return {
                    'success': True,
                    'message': 'No credit deducted for self-unlikes',
                    'credit_deducted': 0
                }
            
            # Deduct credit
            credit_amount = -self.CREDIT_PER_LIKE  # Negative amount for deduction
            transaction_result = self._add_credit_transaction(
                user_id=creator_id,
                amount=credit_amount,
                transaction_type='LIKE_REMOVED',
                description=f'Credit deducted from like removal on content: {content_info["Title"]}',
                related_content_id=content_id,
                related_user_id=unliker_user_id,
                cursor=cursor
            )
            
            if transaction_result['success']:
                connection.commit()
                logger.info(f"Deducted {abs(credit_amount)} credits from user {creator_id} for unlike on content {content_id}")
                
                return {
                    'success': True,
                    'message': f'Deducted {abs(credit_amount)} rupees for like removal',
                    'credit_deducted': abs(credit_amount),
                    'transaction_id': transaction_result['transaction_id'],
                    'new_balance': transaction_result['new_balance']
                }
            else:
                connection.rollback()
                return transaction_result
                
        except Exception as e:
            if 'connection' in locals():
                connection.rollback()
            logger.error(f"Error deducting like credit: {str(e)}")
            return {
                'success': False,
                'message': f'Error deducting credit: {str(e)}'
            }
        finally:
            if 'cursor' in locals():
                cursor.close()
            if 'connection' in locals():
                connection.close()
    
    def get_user_credit_balance(self, user_id: int) -> Dict:
        """
        Get current credit balance for a user
        
        Args:
            user_id: ID of the user
            
        Returns:
            Dict with success status and credit balance
        """
        try:
            connection = self.get_db_connection()
            cursor = connection.cursor(dictionary=True)
            
            cursor.execute("""
                SELECT Credit_Balance, Last_Updated
                FROM User_Credits
                WHERE User_ID = %s
            """, (user_id,))
            
            result = cursor.fetchone()
            
            if result:
                return {
                    'success': True,
                    'balance': float(result['Credit_Balance']),
                    'last_updated': result['Last_Updated']
                }
            else:
                # User doesn't have a credit record yet, return 0 balance
                return {
                    'success': True,
                    'balance': 0.0,
                    'last_updated': None
                }
                
        except Exception as e:
            logger.error(f"Error getting credit balance: {str(e)}")
            return {
                'success': False,
                'message': f'Error getting credit balance: {str(e)}'
            }
        finally:
            if 'cursor' in locals():
                cursor.close()
            if 'connection' in locals():
                connection.close()

    def get_user_transaction_history(self, user_id: int, limit: int = 50, offset: int = 0) -> Dict:
        """
        Get transaction history for a user

        Args:
            user_id: ID of the user
            limit: Maximum number of transactions to return
            offset: Number of transactions to skip

        Returns:
            Dict with success status and transaction list
        """
        try:
            connection = self.get_db_connection()
            cursor = connection.cursor(dictionary=True)

            cursor.execute("""
                SELECT
                    ct.Transaction_ID,
                    ct.Amount,
                    ct.Transaction_Type,
                    ct.Description,
                    ct.Created_At,
                    ct.Related_Content_ID,
                    ct.Related_User_ID,
                    c.Title as content_title,
                    up.Full_Name as related_user_name
                FROM Credit_Transactions ct
                LEFT JOIN Content c ON ct.Related_Content_ID = c.Content_ID
                LEFT JOIN User_Profile up ON ct.Related_User_ID = up.User_ID
                WHERE ct.User_ID = %s
                ORDER BY ct.Created_At DESC
                LIMIT %s OFFSET %s
            """, (user_id, limit, offset))

            transactions = cursor.fetchall()

            # Get total count
            cursor.execute("""
                SELECT COUNT(*) as total_count
                FROM Credit_Transactions
                WHERE User_ID = %s
            """, (user_id,))

            total_count = cursor.fetchone()['total_count']

            return {
                'success': True,
                'transactions': transactions,
                'total_count': total_count,
                'limit': limit,
                'offset': offset
            }

        except Exception as e:
            logger.error(f"Error getting transaction history: {str(e)}")
            return {
                'success': False,
                'message': f'Error getting transaction history: {str(e)}'
            }
        finally:
            if 'cursor' in locals():
                cursor.close()
            if 'connection' in locals():
                connection.close()

    def _add_credit_transaction(self, user_id: int, amount: float, transaction_type: str,
                              description: str, related_content_id: Optional[int] = None,
                              related_user_id: Optional[int] = None, cursor=None) -> Dict:
        """
        Internal method to add a credit transaction and update user balance

        Args:
            user_id: ID of the user receiving/losing credits
            amount: Amount of credits (positive for credit, negative for debit)
            transaction_type: Type of transaction
            description: Description of the transaction
            related_content_id: Optional content ID related to transaction
            related_user_id: Optional user ID related to transaction
            cursor: Database cursor (if part of larger transaction)

        Returns:
            Dict with success status and transaction details
        """
        try:
            close_connection = False
            if cursor is None:
                connection = self.get_db_connection()
                cursor = connection.cursor(dictionary=True)
                close_connection = True

            # Get current balance or create new credit record
            cursor.execute("""
                SELECT Credit_Balance FROM User_Credits WHERE User_ID = %s
            """, (user_id,))

            current_balance_result = cursor.fetchone()

            if current_balance_result:
                current_balance = float(current_balance_result['Credit_Balance'])
            else:
                current_balance = 0.0
                # Create new credit record
                cursor.execute("""
                    INSERT INTO User_Credits (User_ID, Credit_Balance)
                    VALUES (%s, 0.0)
                """, (user_id,))

            # Calculate new balance
            new_balance = current_balance + amount

            # Prevent negative balance (optional - you might want to allow debt)
            if new_balance < 0:
                logger.warning(f"Transaction would result in negative balance for user {user_id}. Current: {current_balance}, Amount: {amount}")
                # You can choose to either:
                # 1. Allow negative balance (comment out the return below)
                # 2. Reject the transaction (uncomment the return below)
                # return {
                #     'success': False,
                #     'message': 'Insufficient credit balance'
                # }

            # Add transaction record
            cursor.execute("""
                INSERT INTO Credit_Transactions
                (User_ID, Amount, Transaction_Type, Description, Related_Content_ID, Related_User_ID)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (user_id, amount, transaction_type, description, related_content_id, related_user_id))

            transaction_id = cursor.lastrowid

            # Update user balance
            cursor.execute("""
                UPDATE User_Credits
                SET Credit_Balance = %s, Last_Updated = NOW()
                WHERE User_ID = %s
            """, (new_balance, user_id))

            if close_connection:
                connection.commit()

            return {
                'success': True,
                'transaction_id': transaction_id,
                'previous_balance': current_balance,
                'amount': amount,
                'new_balance': new_balance
            }

        except Exception as e:
            if close_connection and 'connection' in locals():
                connection.rollback()
            logger.error(f"Error adding credit transaction: {str(e)}")
            return {
                'success': False,
                'message': f'Error processing transaction: {str(e)}'
            }
        finally:
            if close_connection:
                if 'cursor' in locals():
                    cursor.close()
                if 'connection' in locals():
                    connection.close()

    def get_credit_statistics(self, user_id: int) -> Dict:
        """
        Get credit statistics for a user

        Args:
            user_id: ID of the user

        Returns:
            Dict with credit statistics
        """
        try:
            connection = self.get_db_connection()
            cursor = connection.cursor(dictionary=True)

            # Get current balance
            balance_result = self.get_user_credit_balance(user_id)

            # Get total earned and spent
            cursor.execute("""
                SELECT
                    SUM(CASE WHEN Amount > 0 THEN Amount ELSE 0 END) as total_earned,
                    SUM(CASE WHEN Amount < 0 THEN ABS(Amount) ELSE 0 END) as total_spent,
                    COUNT(*) as total_transactions,
                    COUNT(CASE WHEN Transaction_Type = 'LIKE_RECEIVED' THEN 1 END) as likes_received,
                    COUNT(CASE WHEN Transaction_Type = 'LIKE_REMOVED' THEN 1 END) as likes_removed
                FROM Credit_Transactions
                WHERE User_ID = %s
            """, (user_id,))

            stats = cursor.fetchone()

            return {
                'success': True,
                'current_balance': balance_result.get('balance', 0.0),
                'total_earned': float(stats['total_earned'] or 0),
                'total_spent': float(stats['total_spent'] or 0),
                'total_transactions': stats['total_transactions'],
                'likes_received': stats['likes_received'],
                'likes_removed': stats['likes_removed']
            }

        except Exception as e:
            logger.error(f"Error getting credit statistics: {str(e)}")
            return {
                'success': False,
                'message': f'Error getting credit statistics: {str(e)}'
            }
        finally:
            if 'cursor' in locals():
                cursor.close()
            if 'connection' in locals():
                connection.close()
