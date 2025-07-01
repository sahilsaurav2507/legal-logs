import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  FileText, 
  File,
  Calendar, 
  User, 
  Eye,
  Clock,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { contentApi, userApi, BlogPost, Note } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: number;
  contentType: 'blog' | 'note';
}

const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  isOpen,
  onClose,
  contentId,
  contentType
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [content, setContent] = useState<BlogPost | Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && contentId) {
      fetchContent();
    }
  }, [isOpen, contentId, contentType]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      if (contentType === 'blog') {
        const response = await contentApi.getBlogPost(contentId);
        setContent(response.blog_post);
      } else {
        const response = await contentApi.getNote(contentId);
        setContent(response.note);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load content preview.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async () => {
    if (!user || !content) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save content.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      await userApi.saveContent({ 
        content_id: content.content_id, 
        notes: `Saved: ${content.title}` 
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
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (!content) return;
    
    const url = `${window.location.origin}/${contentType === 'blog' ? 'blogs' : 'notes'}/${contentId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.summary || 'Check out this legal content',
          url: url,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: "Content link copied to clipboard!",
        });
      }
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Content link copied to clipboard!",
      });
    }
  };

  const getContentUrl = () => {
    if (!content) return '#';
    return contentType === 'blog' 
      ? `/blogs/${content.content_id}` 
      : `/notes/${(content as Note).note_id || content.content_id}`;
  };

  const getContentTags = () => {
    if (!content) return [];
    if (contentType === 'blog') {
      return (content as BlogPost).tags?.split(',').map(tag => tag.trim()) || [];
    }
    return [(content as Note).category].filter(Boolean);
  };

  const truncateContent = (text: string, maxLength: number = 500) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                contentType === 'blog' 
                  ? "bg-lawvriksh-gold/10 text-lawvriksh-navy" 
                  : "bg-lawvriksh-burgundy/10 text-lawvriksh-burgundy"
              )}>
                {contentType === 'blog' ? (
                  <FileText className="h-5 w-5" />
                ) : (
                  <File className="h-5 w-5" />
                )}
              </div>
              <div>
                <Badge variant="outline" className="mb-2">
                  {contentType === 'blog' ? 'Article' : 'Note'}
                </Badge>
                <DialogTitle className="legal-heading text-xl font-bold text-lawvriksh-navy">
                  {loading ? <Skeleton className="h-6 w-96" /> : content?.title}
                </DialogTitle>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                disabled={loading}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveContent}
                disabled={loading || saving}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : content ? (
          <div className="space-y-6">
            {/* Content Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{content.author_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(content.created_at), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>5 min read</span>
              </div>
            </div>

            {/* Content Summary */}
            {content.summary && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="legal-heading font-semibold mb-2">Summary</h3>
                <p className="legal-text text-gray-700">{content.summary}</p>
              </div>
            )}

            {/* Content Preview */}
            <div>
              <h3 className="legal-heading font-semibold mb-3">Content Preview</h3>
              <div className="legal-text prose prose-sm max-w-none">
                <p>{truncateContent(content.content || 'No content available.')}</p>
              </div>
            </div>

            {/* Tags */}
            {getContentTags().length > 0 && (
              <div>
                <h3 className="legal-heading font-semibold mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getContentTags().map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button asChild className="flex-1">
                <Link to={getContentUrl()}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Read Full {contentType === 'blog' ? 'Article' : 'Note'}
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveContent}
                disabled={saving}
                className="flex-1"
              >
                <Bookmark className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save to Library'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Failed to load content preview.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContentPreviewModal;
