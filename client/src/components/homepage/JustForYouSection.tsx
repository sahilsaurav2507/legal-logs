import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, MessageCircle, Eye, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { RecommendationService, RecommendationResult } from '@/services/recommendationService';
import { BlogPost } from '@/services/api';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface JustForYouSectionProps {
  className?: string;
}

const JustForYouSection: React.FC<JustForYouSectionProps> = ({ className }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await RecommendationService.getPersonalizedRecommendations(user, 6);
        setRecommendations(result);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        toast({
          title: "Error",
          description: "Failed to load personalized recommendations.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, toast]);

  // Don't render anything for non-logged-in users
  if (!user) {
    return null;
  }

  const renderBlogCard = (blog: BlogPost) => (
    <Card key={blog.content_id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <Link to={`/blogs/${blog.content_id}`} className="block">
        <div className="relative overflow-hidden rounded-t-lg">
          {blog.featured_image ? (
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-lawvriksh-navy/10 to-lawvriksh-burgundy/10 flex items-center justify-center">
              <div className="text-lawvriksh-navy/40 text-4xl font-bold">
                {blog.title.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          
          {/* Engagement overlay */}
          <div className="absolute top-3 right-3 flex gap-2">
            {blog.is_featured && (
              <Badge className="bg-lawvriksh-burgundy text-white text-xs">
                Featured
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Category */}
            {blog.category && (
              <Badge variant="outline" className="text-xs text-lawvriksh-navy border-lawvriksh-navy/20">
                {blog.category}
              </Badge>
            )}

            {/* Title */}
            <h3 className="legal-heading text-lg font-semibold text-lawvriksh-navy line-clamp-2 group-hover:text-lawvriksh-burgundy transition-colors">
              {blog.title}
            </h3>

            {/* Summary */}
            {blog.summary && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {blog.summary}
              </p>
            )}

            {/* Author and Date */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{blog.author_name}</span>
              </div>
              <span>{format(new Date(blog.created_at), 'MMM dd, yyyy')}</span>
            </div>

            {/* Engagement Metrics */}
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
              {blog.views !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{blog.views}</span>
                </div>
              )}
              {blog.likes !== undefined && (
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{blog.likes}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{blog.comment_count}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );

  const renderLoadingSkeleton = () => (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2 md:-ml-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CarouselItem key={i} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <Card className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );

  return (
    <section className="bg-white py-16 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-lawvriksh-navy flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
            <h2 className="legal-heading text-3xl font-bold text-lawvriksh-navy mb-2">
              Just For You
            </h2>
           
            <div className="w-24 h-1 bg-lawvriksh-navy"></div>
             </div>
          </div>
          
          {recommendations?.message && (
            <p className="legal-text text-lg text-gray-600 max-w-3xl">
              {recommendations.message}
            </p>
          )}
        </div>

        {/* Content */}
        {loading ? (
          renderLoadingSkeleton()
        ) : recommendations && recommendations.blogs.length > 0 ? (
          <>
            <div className="mb-8">
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  loop: false,
                }}
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {recommendations.blogs.map((blog) => (
                    <CarouselItem key={blog.content_id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className="h-full">
                        {renderBlogCard(blog)}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </div>

            {/* View All Link */}
            
          </>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 rounded-full bg-gray-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Recommendations Available
            </h3>
            <p className="text-gray-500 mb-6">
              We're working on finding content that matches your interests.
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-lawvriksh-navy text-white rounded-lg hover:bg-lawvriksh-navy/90 transition-colors"
            >
              Browse All Content
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default JustForYouSection;
