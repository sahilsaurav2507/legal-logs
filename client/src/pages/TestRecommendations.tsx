import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { RecommendationService } from '@/services/recommendationService';
import { runAllTests } from '@/tests/cosineSimilarityTest';
import { analyzePracticeAreaMigration } from '@/utils/practiceAreaMigration';
import { PRACTICE_AREAS } from '@/constants/practiceAreas';
import { Loader2, TestTube, User, BookOpen, TrendingUp } from 'lucide-react';

const TestRecommendations: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string>('');
  const [migrationAnalysis, setMigrationAnalysis] = useState<any>(null);

  // Test cosine similarity recommendations
  const testCosineSimilarity = async () => {
    if (!user) {
      alert('Please log in to test recommendations');
      return;
    }

    setLoading(true);
    try {
      // Test with cosine similarity enabled
      const cosineSimilarityRecs = await RecommendationService.getPersonalizedRecommendations(
        user, 
        6, 
        true // Enable cosine similarity
      );

      // Test with cosine similarity disabled (fallback to practice area)
      const practiceAreaRecs = await RecommendationService.getPersonalizedRecommendations(
        user, 
        6, 
        false // Disable cosine similarity
      );

      setRecommendations({
        cosineSimiliarity: cosineSimilarityRecs,
        practiceArea: practiceAreaRecs
      });
    } catch (error) {
      console.error('Error testing recommendations:', error);
      alert('Error testing recommendations. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Run unit tests
  const runUnitTests = () => {
    // Capture console output
    const originalLog = console.log;
    let output = '';
    
    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalLog(...args);
    };

    try {
      runAllTests();
      setTestResults(output);
    } catch (error) {
      setTestResults(`Error running tests: ${error}`);
    } finally {
      console.log = originalLog;
    }
  };

  // Analyze practice area migration
  const analyzeMigration = () => {
    if (!user?.practiceArea) {
      alert('User must have a practice area to analyze');
      return;
    }

    const analysis = analyzePracticeAreaMigration(user.practiceArea);
    setMigrationAnalysis(analysis);
  };

  const getRecommendationTypeColor = (type: string) => {
    switch (type) {
      case 'cosine_similarity':
        return 'bg-green-100 text-green-800';
      case 'practice_area':
        return 'bg-blue-100 text-blue-800';
      case 'popular':
        return 'bg-yellow-100 text-yellow-800';
      case 'fallback':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Recommendation System Testing
        </h1>
        <p className="text-gray-600">
          Test the enhanced cosine similarity recommendation system and practice area functionality.
        </p>
      </div>

      {/* User Info */}
      {user && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Current User Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Name:</strong> {user.fullName}</p>
                <p><strong>Practice Area:</strong> {user.practiceArea || 'Not set'}</p>
                <p><strong>Experience:</strong> {user.yearsOfExperience || 0} years</p>
              </div>
              <div>
                <p><strong>Specialization:</strong> {user.lawSpecialization || 'Not set'}</p>
                <p><strong>Bio:</strong> {user.bio ? `${user.bio.substring(0, 100)}...` : 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Button 
          onClick={testCosineSimilarity} 
          disabled={loading || !user}
          className="h-auto p-4 flex flex-col items-center gap-2"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <BookOpen className="h-5 w-5" />}
          <span>Test Recommendations</span>
          <span className="text-xs opacity-75">Compare algorithms</span>
        </Button>

        <Button 
          onClick={runUnitTests}
          variant="outline"
          className="h-auto p-4 flex flex-col items-center gap-2"
        >
          <TestTube className="h-5 w-5" />
          <span>Run Unit Tests</span>
          <span className="text-xs opacity-75">Test similarity algorithm</span>
        </Button>

        <Button 
          onClick={analyzeMigration}
          variant="outline"
          disabled={!user?.practiceArea}
          className="h-auto p-4 flex flex-col items-center gap-2"
        >
          <TrendingUp className="h-5 w-5" />
          <span>Analyze Migration</span>
          <span className="text-xs opacity-75">Check practice area</span>
        </Button>
      </div>

      {/* Recommendation Results */}
      {recommendations && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Cosine Similarity Results */}
          <Card>
            <CardHeader>
              <CardTitle>Cosine Similarity Recommendations</CardTitle>
              <CardDescription>
                Enhanced algorithm using text similarity and profile matching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getRecommendationTypeColor(recommendations.cosineSimiliarity.recommendationType)}>
                    {recommendations.cosineSimiliarity.recommendationType}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {recommendations.cosineSimiliarity.blogs.length} recommendations
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {recommendations.cosineSimiliarity.message}
                </p>

                {recommendations.cosineSimiliarity.blogs.map((blog: any, index: number) => (
                  <div key={blog.content_id} className="border rounded p-3">
                    <h4 className="font-medium text-sm">{blog.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Category: {blog.category} | Engagement: {blog.engagement_score || 0}
                    </p>
                    {recommendations.cosineSimiliarity.similarityScores && (
                      <p className="text-xs text-green-600 mt-1">
                        Similarity: {(recommendations.cosineSimiliarity.similarityScores[index]?.score * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Practice Area Results */}
          <Card>
            <CardHeader>
              <CardTitle>Practice Area Recommendations</CardTitle>
              <CardDescription>
                Traditional algorithm using practice area matching only
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getRecommendationTypeColor(recommendations.practiceArea.recommendationType)}>
                    {recommendations.practiceArea.recommendationType}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {recommendations.practiceArea.blogs.length} recommendations
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {recommendations.practiceArea.message}
                </p>

                {recommendations.practiceArea.blogs.map((blog: any) => (
                  <div key={blog.content_id} className="border rounded p-3">
                    <h4 className="font-medium text-sm">{blog.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Category: {blog.category} | Engagement: {blog.engagement_score || 0}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Migration Analysis */}
      {migrationAnalysis && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Practice Area Migration Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <strong>Original Value:</strong> "{migrationAnalysis.originalValue}"
              </div>
              <div>
                <strong>Suggested Value:</strong> "{migrationAnalysis.migratedValue}"
              </div>
              <div className="flex items-center gap-2">
                <strong>Confidence:</strong>
                <Badge variant={migrationAnalysis.confidence === 'high' ? 'default' : 'secondary'}>
                  {migrationAnalysis.confidence}
                </Badge>
              </div>
              {migrationAnalysis.suggestions && (
                <div>
                  <strong>Alternative Suggestions:</strong> {migrationAnalysis.suggestions.join(', ')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Unit Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {testResults}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Practice Areas Reference */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Available Practice Areas</CardTitle>
          <CardDescription>
            Standardized practice areas used in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {PRACTICE_AREAS.map((area) => (
              <Badge key={area.value} variant="outline" className="justify-start">
                {area.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestRecommendations;
