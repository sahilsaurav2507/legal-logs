import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Star,
  Eye,
  Calendar,
  User,
  ArrowRight,
  FileText,
  File,
  Bookmark,
  Heart,
  MessageSquare,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { contentApi, userApi, BlogPost, Note } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { getOptimizedImageUrl, handleImageError } from '@/utils/imageUtils';

interface FeaturedContentProps {
  className?: string;
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({ className }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [featuredBlog, setFeaturedBlog] = useState<BlogPost | null>(null);
  const [trendingContent, setTrendingContent] = useState<(BlogPost | Note)[]>([]);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured and trending content
  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        setLoading(true);

        // Fetch featured blog post
        const blogResponse = await contentApi.getBlogPosts({
          limit: 1,
          sort_by: 'popular'
        });
        if (blogResponse.blog_posts.length > 0) {
          setFeaturedBlog(blogResponse.blog_posts[0]);
        }

        // Fetch trending content (mix of blogs and notes)
        const [trendingBlogs, trendingNotes] = await Promise.all([
          contentApi.getBlogPosts({ limit: 3, sort_by: 'popular' }),
          contentApi.getNotes({ limit: 3, sort_by: 'popular' })
        ]);

        const combined = [
          ...trendingBlogs.blog_posts.map(post => ({ ...post, type: 'blog' as const })),
          ...trendingNotes.notes.map(note => ({ ...note, type: 'note' as const }))
        ].slice(0, 4);

        setTrendingContent(combined);

        // Fetch recent notes
        const recentNotesResponse = await contentApi.getNotes({
          limit: 3,
          sort_by: 'recent'
        });
        setRecentNotes(recentNotesResponse.notes);

      } catch (error) {
        console.error('Error fetching featured content:', error);
        // Use fallback data
        setFeaturedBlog({
          content_id: 1,
          user_id: 1,
          title: 'Understanding Constitutional Law: A Comprehensive Guide',
          summary: 'An in-depth exploration of constitutional principles and their modern applications in legal practice.',
          content: '',
          featured_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop&crop=center',
          tags: 'constitution,law,government',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
          status: 'published',
          is_featured: true,
          category: 'Constitutional Law',
          allow_comments: true,
          is_published: true,
          publication_date: '2024-01-15T00:00:00Z',
          author_name: 'Dr. Sarah Johnson',
          comment_count: 23,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  // Save content to user library
  const handleSaveContent = async (contentId: number, title: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save content.",
        variant: "destructive",
      });
      return;
    }

    try {
      await userApi.saveContent({
        content_id: contentId,
        notes: `Saved: ${title}`
      });
      toast({
        title: "Success",
        description: "Content saved to your library!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save content.",
        variant: "destructive",
      });
    }
  };

  const renderTrendingItem = (item: any, index: number) => {
    const isFirst = index === 0;

    return (
      <Card
        key={`${item.type}-${item.content_id}`}
        className={cn(
          "group cursor-pointer transition-all duration-300 hover:shadow-lg",
          "border border-gray-200 hover:border-lawvriksh-navy/30",
          isFirst ? "md:col-span-2 md:row-span-2" : ""
        )}
      >
        <Link
          to={item.type === 'blog' ? `/blogs/${item.content_id}` : `/notes/${item.note_id || item.content_id}`}
          className="block h-full"
        >
          <CardHeader className={cn("pb-3", isFirst ? "p-6" : "p-4")}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "p-1.5 rounded-md",
                  item.type === 'blog'
                    ? "bg-lawvriksh-gold/10 text-lawvriksh-navy"
                    : "bg-lawvriksh-burgundy/10 text-lawvriksh-burgundy"
                )}>
                  {item.type === 'blog' ? (
                    <FileText className="h-3 w-3" />
                  ) : item.content_type === 'pdf' ? (
                    <File className="h-3 w-3" />
                  ) : (
                    <FileText className="h-3 w-3" />
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
                {index < 3 && (
                  <Badge className="bg-lawvriksh-gold text-lawvriksh-navy text-xs">
                    <TrendingUp className="h-2 w-2 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSaveContent(item.content_id, item.title);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
              >
                <Bookmark className="h-3 w-3" />
              </Button>
            </div>

            <h3 className={cn(
              "legal-heading font-semibold line-clamp-2 group-hover:text-lawvriksh-navy transition-colors",
              isFirst ? "text-lg" : "text-sm"
            )}>
              {item.title}
            </h3>

            {isFirst && (
              <p className="legal-text text-sm line-clamp-3 mt-2">
                {item.summary || (item.content && item.content.substring(0, 120) + '...')}
              </p>
            )}
          </CardHeader>

          <CardContent className={cn("pt-0", isFirst ? "px-6 pb-6" : "px-4 pb-4")}>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <User className="h-2.5 w-2.5" />
                  {item.author_name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" />
                  {format(new Date(item.created_at), 'MMM dd')}
                </span>
                {item.view_count && (
                  <span className="flex items-center gap-1">
                    <Eye className="h-2.5 w-2.5" />
                    {item.view_count}
                  </span>
                )}
              </div>

              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  };

  if (loading) {
    return (
      <section className={cn("py-12 sm:py-16 lg:py-24 bg-gray-50", className)}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Article Skeleton */}
            <div className="lg:col-span-2">
              <Card className="h-96">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            </div>

            {/* Trending Content Skeleton */}
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="h-24">
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-12 sm:py-16 lg:py-24 bg-gray-50", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="legal-heading text-3xl sm:text-4xl font-bold text-lawvriksh-navy mb-4">
            Featured Legal Insights
          </h2>
          <p className="legal-text text-lg max-w-2xl mx-auto">
            Discover the most important legal developments and expert analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Article */}
          {featuredBlog && (
            <div className="lg:col-span-2">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl border-2 border-gray-200 hover:border-lawvriksh-navy/30 h-full">
                <Link to={`/blogs/${featuredBlog.content_id}`} className="block h-full">
                  {/* Featured Image */}
                  {featuredBlog.featured_image && (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                      <img
                        src={getOptimizedImageUrl(featuredBlog.featured_image, 800, 450, 'blog')}
                        alt={featuredBlog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => handleImageError(e, 'blog')}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-lawvriksh-gold text-lawvriksh-navy">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSaveContent(featuredBlog.content_id, featuredBlog.title);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <CardHeader className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{featuredBlog.category}</Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        5 min read
                      </span>
                    </div>

                    <h3 className="legal-heading text-2xl font-bold line-clamp-2 group-hover:text-lawvriksh-navy transition-colors mb-3">
                      {featuredBlog.title}
                    </h3>

                    <p className="legal-text line-clamp-3 mb-4">
                      {featuredBlog.summary}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {featuredBlog.author_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(featuredBlog.created_at), 'MMM dd, yyyy')}
                        </span>
                        {featuredBlog.comment_count > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {featuredBlog.comment_count}
                          </span>
                        )}
                      </div>

                      <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-lawvriksh-navy" />
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            </div>
          )}

          {/* Trending Content Sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="legal-heading text-xl font-semibold text-lawvriksh-navy mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Now
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {trendingContent.slice(0, 4).map((item, index) => renderTrendingItem(item, index))}
              </div>
            </div>

            {/* Recent Notes */}
            {recentNotes.length > 0 && (
              <div>
                <h3 className="legal-heading text-xl font-semibold text-lawvriksh-navy mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Latest Notes
                </h3>

                <div className="space-y-3">
                  {recentNotes.map((note) => (
                    <Card key={note.note_id} className="group cursor-pointer hover:shadow-md transition-all duration-200">
                      <Link to={`/notes/${note.note_id}`} className="block p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 rounded-md bg-lawvriksh-burgundy/10 text-lawvriksh-burgundy flex-shrink-0">
                            {note.content_type === 'pdf' ? (
                              <File className="h-3 w-3" />
                            ) : (
                              <FileText className="h-3 w-3" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="legal-heading text-sm font-medium line-clamp-1 group-hover:text-lawvriksh-navy transition-colors">
                              {note.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {note.author_name} • {format(new Date(note.created_at), 'MMM dd')}
                            </p>
                          </div>

                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 flex-shrink-0" />
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;

