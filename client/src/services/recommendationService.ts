import { contentApi, BlogPost } from './api';
import { User } from '@/contexts/AuthContext';
import { CosineSimilarityService, SimilarityScore } from './cosineSimilarityService';

export interface RecommendationResult {
  blogs: BlogPost[];
  recommendationType: 'cosine_similarity' | 'practice_area' | 'popular' | 'fallback';
  message?: string;
  similarityScores?: SimilarityScore[];
}

export class RecommendationService {
  /**
   * Get personalized blog recommendations for a user
   * Enhanced with cosine similarity for better content matching
   * Fallback hierarchy: Cosine Similarity -> Practice Area -> Popular -> Recent
   */
  static async getPersonalizedRecommendations(
    user: User | null,
    limit: number = 6,
    useCosineSimiliarity: boolean = true
  ): Promise<RecommendationResult> {
    console.log('RecommendationService.getPersonalizedRecommendations called with:', {
      user: user?.email,
      practiceArea: user?.practiceArea,
      limit,
      useCosineSimiliarity
    });

    // If no user is logged in, return empty result
    if (!user) {
      console.log('No user logged in, returning empty result');
      return {
        blogs: [],
        recommendationType: 'fallback',
        message: 'Please log in to see personalized recommendations'
      };
    }

    try {
      // First, try cosine similarity recommendations if enabled
      if (useCosineSimiliarity && user.practiceArea && user.bio) {
        console.log('Attempting cosine similarity recommendations');

        try {
          const cosineSimilarityResult = await this.getCosineSimilarityRecommendations(user, limit);
          if (cosineSimilarityResult.blogs.length > 0) {
            console.log('Returning cosine similarity recommendations:', cosineSimilarityResult.blogs.length, 'blogs found');
            return cosineSimilarityResult;
          }
        } catch (cosineError) {
          console.warn('Cosine similarity failed, falling back to practice area matching:', cosineError);
        }
      }

      console.log('Attempting to get practice area blogs for:', user.practiceArea);

      // Second, try to get blogs matching user's practice area
      const practiceAreaBlogs = await this.getBlogsByPracticeArea(
        user.practiceArea,
        limit
      );

      console.log('Practice area blogs result:', practiceAreaBlogs.length, 'blogs found');

      if (practiceAreaBlogs.length > 0) {
        console.log('Returning practice area recommendations');
        return {
          blogs: practiceAreaBlogs,
          recommendationType: 'practice_area',
          message: `Recommended based on your practice area: ${user.practiceArea}`
        };
      }

      console.log('No practice area blogs found, falling back to popular blogs');

      // Third, fallback to popular blogs by engagement
      const popularBlogs = await this.getPopularBlogs(limit);

      console.log('Popular blogs result:', popularBlogs.length, 'blogs found');

      return {
        blogs: popularBlogs,
        recommendationType: 'popular',
        message: 'Popular content based on community engagement'
      };

    } catch (error) {
      console.error('Error getting personalized recommendations:', error);

      // Final fallback: Get recent blogs
      try {
        const recentBlogs = await this.getRecentBlogs(limit);
        return {
          blogs: recentBlogs,
          recommendationType: 'fallback',
          message: 'Recent blog posts'
        };
      } catch (fallbackError) {
        console.error('Error getting fallback recommendations:', fallbackError);
        return {
          blogs: [],
          recommendationType: 'fallback',
          message: 'Unable to load recommendations at this time'
        };
      }
    }
  }

  /**
   * Get recommendations using cosine similarity algorithm
   */
  private static async getCosineSimilarityRecommendations(
    user: User,
    limit: number,
    minSimilarityThreshold: number = 0.15
  ): Promise<RecommendationResult> {
    // Get a larger pool of blogs for similarity calculation
    const response = await contentApi.getBlogPosts({
      sort_by: 'engagement',
      limit: Math.max(50, limit * 3), // Get more blogs for better similarity calculation
      status: 'Active'
    });

    if (response.blog_posts.length === 0) {
      throw new Error('No blogs available for similarity calculation');
    }

    // Calculate similarity scores
    const similarityScores = CosineSimilarityService.getRecommendations(
      user,
      response.blog_posts,
      limit,
      minSimilarityThreshold
    );

    if (similarityScores.length === 0) {
      throw new Error('No similar content found above threshold');
    }

    // Map similarity scores back to blog posts
    const recommendedBlogs = similarityScores
      .map(score => {
        const blog = response.blog_posts.find(b => b.content_id === score.contentId);
        return blog;
      })
      .filter((blog): blog is BlogPost => blog !== undefined);

    const avgSimilarity = similarityScores.reduce((sum, score) => sum + score.score, 0) / similarityScores.length;
    const topReasons = similarityScores[0]?.reasons || [];

    return {
      blogs: recommendedBlogs,
      recommendationType: 'cosine_similarity',
      message: `Personalized recommendations based on your profile and interests (${Math.round(avgSimilarity * 100)}% match)`,
      similarityScores
    };
  }

  /**
   * Get blogs that match the user's practice area
   */
  private static async getBlogsByPracticeArea(
    practiceArea: string,
    limit: number
  ): Promise<BlogPost[]> {
    const response = await contentApi.getBlogPosts({
      practice_area: practiceArea,
      sort_by: 'engagement',
      limit,
      status: 'Active'
    });

    return response.blog_posts;
  }

  /**
   * Get popular blogs based on engagement metrics
   */
  private static async getPopularBlogs(limit: number): Promise<BlogPost[]> {
    const response = await contentApi.getBlogPosts({
      sort_by: 'engagement',
      limit,
      status: 'Active'
    });

    return response.blog_posts;
  }

  /**
   * Get recent blogs as final fallback
   */
  private static async getRecentBlogs(limit: number): Promise<BlogPost[]> {
    const response = await contentApi.getBlogPosts({
      sort_by: 'recent',
      limit,
      status: 'Active'
    });

    return response.blog_posts;
  }

  /**
   * Get trending blogs based on engagement metrics
   * Used for the enhanced "Trending Topics" section
   */
  static async getTrendingBlogs(limit: number = 6): Promise<BlogPost[]> {
    console.log('RecommendationService.getTrendingBlogs called with limit:', limit);

    try {
      const response = await contentApi.getBlogPosts({
        sort_by: 'engagement',
        limit,
        status: 'Active'
      });

      console.log('Trending blogs API response:', response.blog_posts.length, 'blogs found');
      return response.blog_posts;
    } catch (error) {
      console.error('Error getting trending blogs:', error);
      
      // Fallback to popular sorting
      try {
        const response = await contentApi.getBlogPosts({
          sort_by: 'popular',
          limit,
          status: 'Active'
        });

        return response.blog_posts;
      } catch (fallbackError) {
        console.error('Error getting fallback trending blogs:', fallbackError);
        return [];
      }
    }
  }

  /**
   * Calculate engagement score for a blog post
   * Used for client-side sorting if needed
   */
  static calculateEngagementScore(blog: BlogPost): number {
    const likes = blog.likes || 0;
    const comments = blog.comment_count || 0;
    const views = blog.views || 0;
    const shares = blog.shares || 0;

    // Weighted engagement score
    // Comments and likes are more valuable than views
    return (comments * 3) + (likes * 2) + (shares * 2) + (views * 0.1);
  }

  /**
   * Get practice area categories that exist in the system
   * Useful for understanding what practice areas have content
   */
  static async getAvailablePracticeAreas(): Promise<string[]> {
    try {
      // Get a sample of blogs to extract categories
      const response = await contentApi.getBlogPosts({
        limit: 100,
        status: 'Active'
      });

      const categories = new Set<string>();
      response.blog_posts.forEach(blog => {
        if (blog.category) {
          categories.add(blog.category);
        }
      });

      return Array.from(categories).sort();
    } catch (error) {
      console.error('Error getting available practice areas:', error);
      return [];
    }
  }

  /**
   * Check if a user's practice area has matching content
   */
  static async hasPracticeAreaContent(practiceArea: string): Promise<boolean> {
    try {
      const response = await contentApi.getBlogPosts({
        practice_area: practiceArea,
        limit: 1,
        status: 'Active'
      });

      return response.blog_posts.length > 0;
    } catch (error) {
      console.error('Error checking practice area content:', error);
      return false;
    }
  }
}

export default RecommendationService;
