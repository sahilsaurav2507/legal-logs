import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  Bookmark, 
  ArrowRight, 
  FileText, 
  File,
  Clock,
  TrendingUp,
  Star,
  ChevronDown,
  Grid,
  List,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import ContentPreviewModal from '@/components/ui/content-preview-modal';
import { contentApi, userApi, BlogPost, Note } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { getOptimizedImageUrl, handleImageError } from '@/utils/imageUtils';

interface ContentHubProps {
  className?: string;
}

const ContentHub: React.FC<ContentHubProps> = ({ className }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = useState<'all' | 'blogs' | 'notes'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Content state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Preview modal state
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    contentId: number;
    contentType: 'blog' | 'note';
  }>({
    isOpen: false,
    contentId: 0,
    contentType: 'blog'
  });
  
  // Categories for filtering
  const blogCategories = [
    'Constitutional Law',
    'Corporate Law', 
    'Employment Law',
    'Intellectual Property',
    'Criminal Law',
    'Family Law',
    'General'
  ];
  
  const noteCategories = [
    'Study Notes',
    'Practice Notes', 
    'Research',
    'Case Notes',
    'Meeting Notes',
    'General'
  ];
  
  const allCategories = [...new Set([...blogCategories, ...noteCategories])];

  // Fetch content based on active tab and filters
  const fetchContent = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const currentPage = isLoadMore ? page + 1 : 1;
      const params = {
        page: currentPage,
        limit: 12,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchTerm || undefined,
        sort_by: sortBy
      };

      if (activeTab === 'blogs' || activeTab === 'all') {
        const blogResponse = await contentApi.getBlogPosts(params);
        if (isLoadMore) {
          setBlogPosts(prev => [...prev, ...blogResponse.blog_posts]);
        } else {
          setBlogPosts(blogResponse.blog_posts);
        }
      }

      if (activeTab === 'notes' || activeTab === 'all') {
        const notesResponse = await contentApi.getNotes(params);
        if (isLoadMore) {
          setNotes(prev => [...prev, ...notesResponse.notes]);
        } else {
          setNotes(notesResponse.notes);
        }
      }

      if (isLoadMore) {
        setPage(currentPage);
      } else {
        setPage(1);
      }
      
      // Check if there's more content to load
      const totalItems = (activeTab === 'blogs' ? blogPosts.length : 0) + 
                        (activeTab === 'notes' ? notes.length : 0);
      setHasMore(totalItems >= currentPage * 12);
      
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more content
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchContent(true);
    }
  };

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

  // Effect to fetch content when filters change
  useEffect(() => {
    fetchContent();
  }, [activeTab, selectedCategory, sortBy, searchTerm]);

  // Get filtered and combined content for 'all' tab
  const getCombinedContent = () => {
    const combined = [
      ...blogPosts.map(post => ({ ...post, type: 'blog' as const })),
      ...notes.map(note => ({ ...note, type: 'note' as const }))
    ];
    
    // Sort combined content
    return combined.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // Add other sorting logic as needed
      return 0;
    });
  };

  const renderContentCard = (item: any, type: 'blog' | 'note') => {
    const isGridView = viewMode === 'grid';
    
    return (
      <Card 
        key={`${type}-${item.content_id}`}
        className={cn(
          "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
          "border-2 border-gray-100 hover:border-lawvriksh-navy/20",
          isGridView ? "h-full" : "flex-row"
        )}
      >
        {/* Card content will be implemented in the next section */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-lg",
                type === 'blog' 
                  ? "bg-lawvriksh-gold/10 text-lawvriksh-navy" 
                  : "bg-lawvriksh-burgundy/10 text-lawvriksh-burgundy"
              )}>
                {type === 'blog' ? (
                  <FileText className="h-4 w-4" />
                ) : item.content_type === 'pdf' ? (
                  <File className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {type === 'blog' ? item.category : item.category}
              </Badge>
            </div>
            
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  setPreviewModal({
                    isOpen: true,
                    contentId: item.content_id,
                    contentType: type
                  });
                }}
                className="h-8 w-8 p-0"
                title="Quick Preview"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSaveContent(item.content_id, item.title);
                }}
                className="h-8 w-8 p-0"
                title="Save to Library"
              >
                <Bookmark className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <Link 
            to={type === 'blog' ? `/blogs/${item.content_id}` : `/notes/${item.note_id || item.content_id}`}
            className="block"
          >
            <h3 className="legal-heading text-lg font-semibold mb-2 line-clamp-2 group-hover:text-lawvriksh-navy transition-colors">
              {item.title}
            </h3>
            
            <p className="legal-text text-sm mb-4 line-clamp-3">
              {item.summary || (item.content && item.content.substring(0, 150) + '...')}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {item.author_name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(item.created_at), 'MMM dd, yyyy')}
                </span>
                {item.view_count && (
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.view_count}
                  </span>
                )}
              </div>
              
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </div>
      </Card>
    );
  };

  return (
    <section className={cn("py-12 sm:py-16 lg:py-24 bg-white relative overflow-hidden", className)}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white to-lawvriksh-gold/5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="legal-heading text-3xl sm:text-4xl md:text-5xl font-bold text-lawvriksh-navy mb-6">
            Legal Knowledge Hub
          </h2>
          <p className="legal-text text-lg max-w-3xl mx-auto">
            Explore our comprehensive collection of legal insights, case notes, and expert analysis. 
            Stay informed with the latest developments in law and legal practice.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles and notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="blogs">Articles</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="h-64">
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Content Display */}
          {!loading && (
            <>
              <TabsContent value="all" className="mt-0">
                <div className={cn(
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                )}>
                  {getCombinedContent().map((item) => 
                    renderContentCard(item, item.type)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="blogs" className="mt-0">
                <div className={cn(
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                )}>
                  {blogPosts.map((post) => renderContentCard(post, 'blog'))}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-0">
                <div className={cn(
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                )}>
                  {notes.map((note) => renderContentCard(note, 'note'))}
                </div>
              </TabsContent>
            </>
          )}

          {/* Load More Button */}
          {!loading && hasMore && (
            <div className="text-center mt-12">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                variant="outline"
                size="lg"
                className="min-w-32"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Content'
                )}
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && getCombinedContent().length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No content found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </Tabs>
      </div>

      {/* Content Preview Modal */}
      <ContentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal(prev => ({ ...prev, isOpen: false }))}
        contentId={previewModal.contentId}
        contentType={previewModal.contentType}
      />
    </section>
  );
};

export default ContentHub;
