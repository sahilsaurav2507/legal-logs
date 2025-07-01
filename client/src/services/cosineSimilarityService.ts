/**
 * Cosine Similarity Service
 * 
 * Implements cosine similarity algorithm for content recommendation
 * using TF-IDF vectorization and cosine similarity calculation.
 */

import { BlogPost } from './api';
import { User } from '@/contexts/AuthContext';
import { getPracticeAreaKeywords } from '@/constants/practiceAreas';

export interface SimilarityScore {
  contentId: number;
  score: number;
  reasons: string[];
}

export interface UserFeatureVector {
  practiceAreaKeywords: string[];
  experienceLevel: number; // 0-1 normalized
  specializations: string[];
  interests: string[];
}

export interface BlogFeatureVector {
  contentId: number;
  title: string;
  category: string;
  tags: string[];
  content: string;
  keywords: string[];
  engagementScore: number;
}

/**
 * Text preprocessing utilities
 */
class TextProcessor {
  private static stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
  ]);

  static tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.stopWords.has(word));
  }

  static extractKeywords(text: string, maxKeywords: number = 20): string[] {
    const tokens = this.tokenize(text);
    const frequency: { [key: string]: number } = {};
    
    // Count word frequencies
    tokens.forEach(token => {
      frequency[token] = (frequency[token] || 0) + 1;
    });

    // Sort by frequency and return top keywords
    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }
}

/**
 * TF-IDF Vectorizer for text similarity
 */
class TFIDFVectorizer {
  private vocabulary: string[] = [];
  private documentFrequency: { [key: string]: number } = {};
  private totalDocuments: number = 0;

  /**
   * Build vocabulary from a collection of documents
   */
  buildVocabulary(documents: string[]): void {
    const allWords = new Set<string>();
    this.totalDocuments = documents.length;
    this.documentFrequency = {};

    documents.forEach(doc => {
      const words = new Set(TextProcessor.tokenize(doc));
      words.forEach(word => {
        allWords.add(word);
        this.documentFrequency[word] = (this.documentFrequency[word] || 0) + 1;
      });
    });

    this.vocabulary = Array.from(allWords).sort();
  }

  /**
   * Convert text to TF-IDF vector
   */
  vectorize(text: string): number[] {
    const tokens = TextProcessor.tokenize(text);
    const termFrequency: { [key: string]: number } = {};
    
    // Calculate term frequency
    tokens.forEach(token => {
      termFrequency[token] = (termFrequency[token] || 0) + 1;
    });

    // Convert to TF-IDF vector
    return this.vocabulary.map(word => {
      const tf = termFrequency[word] || 0;
      const df = this.documentFrequency[word] || 1;
      const idf = Math.log(this.totalDocuments / df);
      return tf * idf;
    });
  }
}

/**
 * Cosine Similarity Service
 */
export class CosineSimilarityService {
  private static vectorizer: TFIDFVectorizer = new TFIDFVectorizer();
  private static isInitialized: boolean = false;

  /**
   * Initialize the service with blog post data
   */
  static initialize(blogPosts: BlogPost[]): void {
    const documents = blogPosts.map(blog => 
      `${blog.title} ${blog.summary || ''} ${blog.category} ${blog.tags || ''}`
    );
    
    this.vectorizer.buildVocabulary(documents);
    this.isInitialized = true;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private static calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      magnitudeA += vectorA[i] * vectorA[i];
      magnitudeB += vectorB[i] * vectorB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Create user feature vector
   */
  private static createUserFeatureVector(user: User): UserFeatureVector {
    const practiceAreaKeywords = getPracticeAreaKeywords(user.practiceArea || '');
    const experienceLevel = Math.min((user.yearsOfExperience || 0) / 20, 1); // Normalize to 0-1
    
    const specializations = user.lawSpecialization 
      ? TextProcessor.tokenize(user.lawSpecialization)
      : [];
    
    const interests = user.bio 
      ? TextProcessor.extractKeywords(user.bio, 10)
      : [];

    return {
      practiceAreaKeywords,
      experienceLevel,
      specializations,
      interests
    };
  }

  /**
   * Create blog feature vector
   */
  private static createBlogFeatureVector(blog: BlogPost): BlogFeatureVector {
    const tags = blog.tags ? blog.tags.split(',').map(tag => tag.trim()) : [];
    const keywords = TextProcessor.extractKeywords(
      `${blog.title} ${blog.summary || ''} ${blog.content}`, 
      15
    );

    return {
      contentId: blog.content_id,
      title: blog.title,
      category: blog.category,
      tags,
      content: blog.content,
      keywords,
      engagementScore: blog.engagement_score || 0
    };
  }

  /**
   * Calculate similarity between user and blog post
   */
  static calculateUserBlogSimilarity(user: User, blog: BlogPost): SimilarityScore {
    if (!this.isInitialized) {
      throw new Error('CosineSimilarityService must be initialized before use');
    }

    const userVector = this.createUserFeatureVector(user);
    const blogVector = this.createBlogFeatureVector(blog);
    
    // Create text representations for TF-IDF
    const userText = [
      ...userVector.practiceAreaKeywords,
      ...userVector.specializations,
      ...userVector.interests
    ].join(' ');

    const blogText = `${blog.title} ${blog.summary || ''} ${blog.category} ${blog.tags || ''}`;

    // Calculate TF-IDF similarity
    const userTFIDF = this.vectorizer.vectorize(userText);
    const blogTFIDF = this.vectorizer.vectorize(blogText);
    const textSimilarity = this.calculateCosineSimilarity(userTFIDF, blogTFIDF);

    // Calculate additional similarity factors
    const practiceAreaMatch = user.practiceArea === blog.category ? 1.0 : 0.0;
    const experienceBonus = userVector.experienceLevel * 0.1; // Small bonus for experience

    // Combine similarities with weights
    const finalScore = (
      textSimilarity * 0.6 +           // 60% text similarity
      practiceAreaMatch * 0.3 +        // 30% practice area match
      experienceBonus * 0.1            // 10% experience bonus
    );

    // Generate reasons for the recommendation
    const reasons: string[] = [];
    if (practiceAreaMatch > 0) {
      reasons.push(`Matches your practice area: ${user.practiceArea}`);
    }
    if (textSimilarity > 0.3) {
      reasons.push('Similar content to your interests');
    }
    if (blog.engagement_score && blog.engagement_score > 10) {
      reasons.push('Highly engaged content');
    }

    return {
      contentId: blog.content_id,
      score: Math.max(0, Math.min(1, finalScore)), // Clamp between 0 and 1
      reasons
    };
  }

  /**
   * Get recommendations for a user based on cosine similarity
   */
  static getRecommendations(
    user: User, 
    blogPosts: BlogPost[], 
    limit: number = 6,
    minSimilarityThreshold: number = 0.1
  ): SimilarityScore[] {
    if (!this.isInitialized) {
      this.initialize(blogPosts);
    }

    const similarities = blogPosts
      .map(blog => this.calculateUserBlogSimilarity(user, blog))
      .filter(similarity => similarity.score >= minSimilarityThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return similarities;
  }
}

export default CosineSimilarityService;
