/**
 * Cosine Similarity Test Suite
 * 
 * Test cases to verify the cosine similarity implementation
 * and recommendation system functionality.
 */

import { CosineSimilarityService } from '@/services/cosineSimilarityService';
import { BlogPost } from '@/services/api';
import { User } from '@/contexts/AuthContext';

// Mock data for testing
const mockUser: User = {
  userId: 1,
  email: 'test@example.com',
  fullName: 'John Doe',
  role: 'user',
  practiceArea: 'Corporate Law',
  bio: 'Experienced corporate lawyer specializing in mergers and acquisitions. Interested in securities law and corporate governance.',
  yearsOfExperience: 8,
  lawSpecialization: 'Corporate Finance',
  isAuthenticated: true
};

const mockBlogs: BlogPost[] = [
  {
    content_id: 1,
    user_id: 2,
    title: 'Understanding Corporate Mergers and Acquisitions',
    summary: 'A comprehensive guide to M&A transactions and due diligence processes.',
    content: 'Corporate mergers and acquisitions represent complex business transactions that require careful legal analysis. This article explores the key legal considerations in M&A deals, including due diligence, regulatory approvals, and post-merger integration strategies.',
    featured_image: '',
    tags: 'corporate law, mergers, acquisitions, due diligence',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    status: 'Active',
    is_featured: false,
    category: 'Corporate Law',
    allow_comments: true,
    is_published: true,
    publication_date: '2024-01-01',
    author_name: 'Jane Smith',
    comment_count: 5,
    views: 150,
    likes: 12,
    shares: 3,
    engagement_score: 25
  },
  {
    content_id: 2,
    user_id: 3,
    title: 'Criminal Defense Strategies in Federal Court',
    summary: 'Effective defense strategies for federal criminal cases.',
    content: 'Federal criminal defense requires specialized knowledge of federal procedures and sentencing guidelines. This article discusses key defense strategies, plea negotiations, and trial preparation techniques for federal criminal cases.',
    featured_image: '',
    tags: 'criminal law, federal court, defense strategies',
    created_at: '2024-01-02',
    updated_at: '2024-01-02',
    status: 'Active',
    is_featured: false,
    category: 'Criminal Law',
    allow_comments: true,
    is_published: true,
    publication_date: '2024-01-02',
    author_name: 'Mike Johnson',
    comment_count: 8,
    views: 200,
    likes: 15,
    shares: 5,
    engagement_score: 35
  },
  {
    content_id: 3,
    user_id: 4,
    title: 'Securities Regulation and Compliance',
    summary: 'Navigating SEC regulations and compliance requirements.',
    content: 'Securities regulation is a critical aspect of corporate law. This article examines SEC compliance requirements, disclosure obligations, and regulatory enforcement trends affecting public companies and investment advisors.',
    featured_image: '',
    tags: 'securities law, SEC, compliance, corporate governance',
    created_at: '2024-01-03',
    updated_at: '2024-01-03',
    status: 'Active',
    is_featured: false,
    category: 'Corporate Law',
    allow_comments: true,
    is_published: true,
    publication_date: '2024-01-03',
    author_name: 'Sarah Wilson',
    comment_count: 3,
    views: 120,
    likes: 8,
    shares: 2,
    engagement_score: 18
  },
  {
    content_id: 4,
    user_id: 5,
    title: 'Family Law: Child Custody Considerations',
    summary: 'Key factors in child custody determinations.',
    content: 'Child custody cases require careful consideration of the best interests of the child. This article explores factors courts consider in custody determinations, including parental fitness, stability, and the child\'s preferences.',
    featured_image: '',
    tags: 'family law, child custody, divorce',
    created_at: '2024-01-04',
    updated_at: '2024-01-04',
    status: 'Active',
    is_featured: false,
    category: 'Family Law',
    allow_comments: true,
    is_published: true,
    publication_date: '2024-01-04',
    author_name: 'Lisa Brown',
    comment_count: 6,
    views: 180,
    likes: 10,
    shares: 4,
    engagement_score: 28
  }
];

/**
 * Test cosine similarity calculation
 */
export const testCosineSimilarity = (): void => {
  console.log('🧪 Testing Cosine Similarity Implementation');
  console.log('==========================================');

  try {
    // Initialize the service with mock data
    CosineSimilarityService.initialize(mockBlogs);
    console.log('✅ Service initialized successfully');

    // Test recommendations for corporate law user
    const recommendations = CosineSimilarityService.getRecommendations(
      mockUser,
      mockBlogs,
      4,
      0.1 // Lower threshold for testing
    );

    console.log('\n📊 Recommendation Results:');
    console.log(`Found ${recommendations.length} recommendations`);

    recommendations.forEach((rec, index) => {
      const blog = mockBlogs.find(b => b.content_id === rec.contentId);
      console.log(`\n${index + 1}. ${blog?.title}`);
      console.log(`   Category: ${blog?.category}`);
      console.log(`   Similarity Score: ${(rec.score * 100).toFixed(1)}%`);
      console.log(`   Reasons: ${rec.reasons.join(', ')}`);
    });

    // Verify that corporate law posts are ranked higher
    const corporateLawPosts = recommendations.filter(rec => {
      const blog = mockBlogs.find(b => b.content_id === rec.contentId);
      return blog?.category === 'Corporate Law';
    });

    const otherPosts = recommendations.filter(rec => {
      const blog = mockBlogs.find(b => b.content_id === rec.contentId);
      return blog?.category !== 'Corporate Law';
    });

    if (corporateLawPosts.length > 0 && otherPosts.length > 0) {
      const avgCorporateScore = corporateLawPosts.reduce((sum, rec) => sum + rec.score, 0) / corporateLawPosts.length;
      const avgOtherScore = otherPosts.reduce((sum, rec) => sum + rec.score, 0) / otherPosts.length;

      console.log(`\n📈 Score Analysis:`);
      console.log(`   Average Corporate Law Score: ${(avgCorporateScore * 100).toFixed(1)}%`);
      console.log(`   Average Other Categories Score: ${(avgOtherScore * 100).toFixed(1)}%`);

      if (avgCorporateScore > avgOtherScore) {
        console.log('✅ Corporate law posts correctly ranked higher');
      } else {
        console.log('⚠️  Corporate law posts not ranked higher - check algorithm');
      }
    }

    console.log('\n✅ Cosine similarity test completed successfully');

  } catch (error) {
    console.error('❌ Cosine similarity test failed:', error);
  }
};

/**
 * Test with different user profiles
 */
export const testDifferentUserProfiles = (): void => {
  console.log('\n🧪 Testing Different User Profiles');
  console.log('==================================');

  const testUsers: Partial<User>[] = [
    {
      practiceArea: 'Criminal Law',
      bio: 'Criminal defense attorney with experience in federal and state courts.',
      yearsOfExperience: 5
    },
    {
      practiceArea: 'Family Law',
      bio: 'Family law practitioner focusing on divorce and child custody cases.',
      yearsOfExperience: 3
    },
    {
      practiceArea: 'Student',
      bio: 'Law student interested in corporate law and securities regulation.',
      yearsOfExperience: 0
    }
  ];

  CosineSimilarityService.initialize(mockBlogs);

  testUsers.forEach((userProfile, index) => {
    const testUser = { ...mockUser, ...userProfile } as User;
    
    console.log(`\n👤 User ${index + 1}: ${testUser.practiceArea} (${testUser.yearsOfExperience} years)`);
    
    const recommendations = CosineSimilarityService.getRecommendations(
      testUser,
      mockBlogs,
      3,
      0.05
    );

    recommendations.forEach((rec, recIndex) => {
      const blog = mockBlogs.find(b => b.content_id === rec.contentId);
      console.log(`   ${recIndex + 1}. ${blog?.title} (${(rec.score * 100).toFixed(1)}%)`);
    });
  });
};

/**
 * Test edge cases
 */
export const testEdgeCases = (): void => {
  console.log('\n🧪 Testing Edge Cases');
  console.log('====================');

  try {
    // Test with empty user profile
    const emptyUser: User = {
      ...mockUser,
      practiceArea: '',
      bio: '',
      yearsOfExperience: 0
    };

    CosineSimilarityService.initialize(mockBlogs);
    const emptyUserRecs = CosineSimilarityService.getRecommendations(emptyUser, mockBlogs, 2);
    console.log(`✅ Empty user profile: ${emptyUserRecs.length} recommendations`);

    // Test with no matching content
    const obscureUser: User = {
      ...mockUser,
      practiceArea: 'Space Law',
      bio: 'Specialist in extraterrestrial legal matters and asteroid mining rights.'
    };

    const obscureUserRecs = CosineSimilarityService.getRecommendations(obscureUser, mockBlogs, 2, 0.5);
    console.log(`✅ Obscure practice area: ${obscureUserRecs.length} recommendations (high threshold)`);

    // Test with single blog post
    const singleBlogRecs = CosineSimilarityService.getRecommendations(mockUser, [mockBlogs[0]], 5);
    console.log(`✅ Single blog post: ${singleBlogRecs.length} recommendations`);

    console.log('✅ Edge case testing completed');

  } catch (error) {
    console.error('❌ Edge case testing failed:', error);
  }
};

/**
 * Run all tests
 */
export const runAllTests = (): void => {
  console.log('🚀 Starting Cosine Similarity Test Suite');
  console.log('=========================================');

  testCosineSimilarity();
  testDifferentUserProfiles();
  testEdgeCases();

  console.log('\n🎉 All tests completed!');
  console.log('Check the console output above for detailed results.');
};

// Export for use in browser console or testing framework
export default {
  testCosineSimilarity,
  testDifferentUserProfiles,
  testEdgeCases,
  runAllTests,
  mockUser,
  mockBlogs
};
