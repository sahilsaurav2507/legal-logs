import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  FileText, 
  File,
  Calendar, 
  User, 
  Eye,
  Clock,
  Bookmark,
  TrendingUp,
  Star
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

interface QuickContentPreviewProps {
  className?: string;
}

const QuickContentPreview: React.FC<QuickContentPreviewProps> = ({ className }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuickContent = async () => {
      try {
        setLoading(true);
        
        // Fetch recent content for quick preview
        const [blogsResponse, notesResponse] = await Promise.all([
          contentApi.getBlogPosts({ limit: 4, sort_by: 'recent' }),
          contentApi.getNotes({ limit: 4, sort_by: 'recent' })
        ]);
        
        setRecentBlogs(blogsResponse.blog_posts || []);
        setRecentNotes(notesResponse.notes || []);
        
      } catch (error) {
        console.error('Error fetching quick content:', error);
        // Use fallback data
        setRecentBlogs([
          {
            content_id: 1,
            user_id: 1,
            title: 'Recent Legal Developments in Corporate Law',
            summary: 'Overview of the latest changes in corporate governance and compliance requirements.',
            content: '',
            featured_image: '',
            tags: 'corporate,law,governance',
            created_at: '2024-01-15T00:00:00Z',
            updated_at: '2024-01-15T00:00:00Z',
            status: 'published',
            is_featured: false,
            category: 'Corporate Law',
            allow_comments: true,
            is_published: true,
            publication_date: '2024-01-15T00:00:00Z',
            author_name: 'Sarah Johnson',
            comment_count: 12,
          }
        ]);
        
        setRecentNotes([
          {
            note_id: 1,
            content_id: 1,
            user_id: 1,
            title: 'Contract Review Checklist',
            summary: 'Essential points to review in commercial contracts.',
            content: '',
            created_at: '2024-01-14T00:00:00Z',
            updated_at: '2024-01-14T00:00:00Z',
            status: 'Active',
            category: 'Practice Notes',
            is_private: false,
            author_name: 'Michael Chen',
            content_type: 'text'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuickContent();
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

  const renderQuickItem = (item: BlogPost | Note, type: 'blog' | 'note') => {
    return (
      <Card 
        key={`${type}-${item.content_id}`}
        className="group cursor-pointer transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-lawvriksh-navy/30"
      >
        <Link 
          to={type === 'blog' ? `/blogs/${item.content_id}` : `/notes/${(item as Note).note_id || item.content_id}`}
          className="block"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "p-1.5 rounded-md",
                  type === 'blog' 
                    ? "bg-lawvriksh-gold/10 text-lawvriksh-navy" 
                    : "bg-lawvriksh-burgundy/10 text-lawvriksh-burgundy"
                )}>
                  {type === 'blog' ? (
                    <FileText className="h-3 w-3" />
                  ) : (item as Note).content_type === 'pdf' ? (
                    <File className="h-3 w-3" />
                  ) : (
                    <FileText className="h-3 w-3" />
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {type === 'blog' ? (item as BlogPost).category : (item as Note).category}
                </Badge>
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
            
            <h3 className="legal-heading text-sm font-semibold line-clamp-2 group-hover:text-lawvriksh-navy transition-colors">
              {item.title}
            </h3>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <User className="h-2.5 w-2.5" />
                  {item.author_name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" />
                  {format(new Date(item.created_at), 'MMM dd')}
                </span>
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
      <section className={cn("py-12 bg-white", className)}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="h-20">
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="h-20">
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
    <section className={cn("py-12 bg-white", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="legal-heading text-2xl sm:text-3xl font-bold text-lawvriksh-navy mb-4">
            Quick Access
          </h2>
          <p className="legal-text max-w-2xl mx-auto">
            Jump into the latest legal content and professional insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Articles */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="legal-heading text-lg font-semibold text-lawvriksh-navy flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Articles
              </h3>
              <Button asChild variant="ghost" size="sm">
                <Link to="/blogs" className="text-lawvriksh-navy hover:text-lawvriksh-burgundy">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentBlogs.slice(0, 4).map((blog) => renderQuickItem(blog, 'blog'))}
            </div>
          </div>

          {/* Recent Notes */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="legal-heading text-lg font-semibold text-lawvriksh-navy flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Notes
              </h3>
              <Button asChild variant="ghost" size="sm">
                <Link to="/notes" className="text-lawvriksh-navy hover:text-lawvriksh-burgundy">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentNotes.slice(0, 4).map((note) => renderQuickItem(note, 'note'))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-lawvriksh-navy/5 to-lawvriksh-burgundy/5 rounded-2xl p-8">
            <h3 className="legal-heading text-xl font-semibold text-lawvriksh-navy mb-4">
              Explore Our Complete Knowledge Base
            </h3>
            <p className="legal-text mb-6 max-w-2xl mx-auto">
              Access thousands of legal articles, case notes, and professional insights. 
              Filter by practice area, search by keywords, and save content to your personal library.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-lawvriksh-navy hover:bg-lawvriksh-burgundy">
                <Link to="/content-hub">
                  Browse All Content
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/search">
                  Advanced Search
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickContentPreview;
