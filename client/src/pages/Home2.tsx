import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Clock,
  User,
  Eye,
  MessageSquare,
  BookOpen,
  FileText,
  Calendar,
  ArrowRight,
  Star,
  Bookmark,
  Gavel,
  Building2,
  Newspaper,
  Zap,
  Users,
  Target,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import AuthHeader from '@/components/AuthHeader';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

import ContentSlider from '@/components/homepage/ContentSlider';
import ContentSidebar from '@/components/homepage/ContentSidebar';
import JustForYouSection from '@/components/homepage/JustForYouSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { contentApi, BlogPost, Note } from '@/services/api';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { getOptimizedImageUrl, handleImageError } from '@/utils/imageUtils';
import { RecommendationService } from '@/services/recommendationService';

const Home2 = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('latest');
  
  // Content state
  const [featuredContent, setFeaturedContent] = useState<BlogPost | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [trendingContent, setTrendingContent] = useState<BlogPost[]>([]);

  // Content divisions for different categories
  const [corporateLawContent, setCorporateLawContent] = useState<BlogPost[]>([]);
  const [recentUpdatesContent, setRecentUpdatesContent] = useState<(BlogPost | Note)[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);

      // Load featured content and recent posts
      const [blogsResponse, notesResponse] = await Promise.all([
        contentApi.getBlogPosts({ limit: 50 }),
        contentApi.getNotes({ limit: 20 })
      ]);

      const blogs = blogsResponse.blog_posts || [];
      const notesData = notesResponse.notes || [];

      // Set featured content (first featured blog or first blog)
      const featured = blogs.find(blog => blog.is_featured) || blogs[0];
      setFeaturedContent(featured);

      // Set other content
      setBlogPosts(blogs.filter(blog => blog.content_id !== featured?.content_id));
      setNotes(notesData);

      // Set trending content using engagement metrics
      const trendingBlogs = await RecommendationService.getTrendingBlogs(6);
      setTrendingContent(trendingBlogs);

      // Organize content by categories for different divisions
      setCorporateLawContent(blogs.filter(blog =>
        blog.category?.toLowerCase().includes('corporate') ||
        blog.title.toLowerCase().includes('corporate') ||
        blog.summary?.toLowerCase().includes('corporate')
      ).slice(0, 6));

      // Recent updates - mix of recent blogs and notes
      const recentBlogs = blogs.slice(0, 8).map(blog => ({ ...blog, type: 'blog' as const }));
      const recentNotes = notesData.slice(0, 4).map(note => ({ ...note, type: 'note' as const }));
      setRecentUpdatesContent([...recentBlogs, ...recentNotes].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 12));

    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort content
  const getFilteredContent = () => {
    let allContent: any[] = [];
    
    if (selectedCategory === 'all' || selectedCategory === 'blogs') {
      allContent = [...allContent, ...blogPosts.map(blog => ({ ...blog, type: 'blog' }))];
    }
    
    if (selectedCategory === 'all' || selectedCategory === 'notes') {
      allContent = [...allContent, ...notes.map(note => ({ ...note, type: 'note' }))];
    }

    // Apply sorting
    switch (sortBy) {
      case 'latest':
        allContent.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'popular':
        allContent.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        break;
      case 'alphabetical':
        allContent.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return allContent;
  };

  const renderContentCard = (item: any, type: string) => {
    const isNote = type === 'note';
    const linkTo = isNote ? `/notes/${item.note_id}` : `/blogs/${item.content_id}`;
    
    if (viewMode === 'list') {
      return (
        <Card key={`${type}-${item.content_id || item.note_id}`} className="group hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-lawvriksh-navy/20 overflow-hidden">
          <Link to={linkTo} className="block">
            <CardContent className="p-4 overflow-hidden">
              <div className="flex gap-4 overflow-hidden">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-20 h-14 rounded overflow-hidden bg-gray-100">
                  <img
                    src={getOptimizedImageUrl(item.featured_image, 160, 112, type)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => handleImageError(e, type)}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs font-medium">
                      {isNote ? 'Note' : 'Article'}
                    </Badge>
                    {item.category && (
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-lawvriksh-navy transition-colors mb-1">
                    {item.title}
                  </h3>

                  {item.summary && (
                    <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                      {item.summary}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-500 overflow-hidden">
                    <span className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
                      <User className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{item.author_name || 'Anonymous'}</span>
                    </span>
                    <span className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                      <Calendar className="h-3 w-3" />
                      {item.created_at ? format(new Date(item.created_at), 'MMM dd') : 'No date'}
                    </span>
                    {item.view_count && (
                      <span className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                        <Eye className="h-3 w-3" />
                        {item.view_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      );
    }

    // Grid view - Professional Design
    return (
      <Card key={`${type}-${item.content_id || item.note_id}`} className="group hover:shadow-xl transition-shadow duration-200 h-full min-h-[360px] border-2 border-gray-200 hover:border-lawvriksh-navy/30 overflow-hidden flex flex-col bg-white">
        <Link to={linkTo} className="h-full flex flex-col">
          {/* Professional Thumbnail */}
          <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 relative">
            <img
              src={getOptimizedImageUrl(item.featured_image, 400, 300, type)}
              alt={item.title}
              className="w-full h-full object-cover group-hover:opacity-95 transition-opacity duration-200"
              onError={(e) => handleImageError(e, type)}
            />
            {/* Professional overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </div>

          <CardContent className="p-6 flex flex-col flex-1 overflow-hidden">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="secondary"
                  className={`text-xs font-semibold px-3 py-1 ${
                    isNote
                      ? 'bg-lawvriksh-burgundy/10 text-lawvriksh-burgundy border border-lawvriksh-burgundy/20'
                      : 'bg-lawvriksh-navy/10 text-lawvriksh-navy border border-lawvriksh-navy/20'
                  }`}
                >
                  {isNote ? 'LEGAL NOTE' : 'ARTICLE'}
                </Badge>
                {item.category && (
                  <Badge variant="outline" className="text-xs font-medium px-2 py-1 border-gray-300 text-gray-600">
                    {item.category.toUpperCase()}
                  </Badge>
                )}
              </div>

              <h3 className="legal-heading font-bold text-lg line-clamp-2 text-lawvriksh-navy group-hover:text-lawvriksh-burgundy transition-colors mb-3 leading-tight">
                {item.title}
              </h3>

              {item.summary && (
                <p className="legal-text text-sm text-gray-700 line-clamp-3 mb-4 leading-relaxed">
                  {item.summary}
                </p>
              )}
            </div>

            {/* Professional footer with sharp design */}
            <div className="mt-auto pt-4 border-t-2 border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-lawvriksh-navy/10 flex items-center justify-center">
                    <User className="h-3 w-3 text-lawvriksh-navy" />
                  </div>
                  <span className="font-medium text-gray-800">{item.author_name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">
                    {item.created_at ? format(new Date(item.created_at), 'MMM dd, yyyy') : 'No date'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  };

  // Render note card function (for dedicated Notes section) - Professional Design
  const renderNoteCard = (note: Note) => {
    return (
      <Card className="group hover:shadow-2xl transition-shadow duration-200 h-full min-h-[380px] border-2 border-lawvriksh-burgundy/30 hover:border-lawvriksh-burgundy/50 overflow-hidden flex flex-col bg-white">
        <Link to={`/notes/${note.note_id}`} className="h-full flex flex-col">
          {/* Professional Note Header */}
          <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-lawvriksh-burgundy/5 to-lawvriksh-burgundy/15 flex-shrink-0 relative">
            <img
              src={getOptimizedImageUrl(
                (note as any).featured_image || '/api/placeholder/400/300',
                400,
                300,
                'note'
              )}
              alt={note.title}
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
              onError={(e) => handleImageError(e, 'note')}
            />
            {/* Professional Note Indicator */}
            <div className="absolute top-0 left-0 bg-lawvriksh-burgundy text-white px-4 py-2 text-xs font-bold tracking-wide">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                LEGAL NOTE
              </div>
            </div>
            {/* Professional overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-lawvriksh-burgundy/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </div>

          <CardContent className="p-6 flex flex-col flex-1 overflow-hidden">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {note.category && (
                  <Badge
                    variant="outline"
                    className="text-xs font-semibold px-3 py-1 border-2 border-lawvriksh-burgundy/30 text-lawvriksh-burgundy bg-lawvriksh-burgundy/5"
                  >
                    {note.category.toUpperCase()}
                  </Badge>
                )}
                {note.content_type && (
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300"
                  >
                    {note.content_type.toUpperCase()}
                  </Badge>
                )}
              </div>

              <h3 className="legal-heading font-bold text-xl text-lawvriksh-burgundy mb-4 line-clamp-2 leading-tight group-hover:text-lawvriksh-navy transition-colors">
                {note.title}
              </h3>

              <p className="legal-text text-gray-700 text-sm line-clamp-3 mb-4 leading-relaxed">
                {(note as any).excerpt || note.content?.substring(0, 140) + '...'}
              </p>
            </div>

            {/* Professional footer with sharp design */}
            <div className="mt-auto pt-4 border-t-2 border-lawvriksh-burgundy/20">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-lawvriksh-burgundy/10 flex items-center justify-center">
                    <User className="h-3 w-3 text-lawvriksh-burgundy" />
                  </div>
                  <span className="font-semibold text-lawvriksh-burgundy">{note.author_name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium">
                    {note.created_at ? format(new Date(note.created_at), 'MMM dd, yyyy') : 'No date'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  };

  const filteredContent = getFilteredContent();



  return (
    <div className="min-h-screen bg-white">
      <AuthHeader />
      
      <main className="pt-20">


        {/* Professional Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Professional Legal Background Image */}
          <div className="absolute inset-0">
            <img
              src="/herosection.jpg"
              alt="Professional Legal Services"
              className="w-full h-full object-cover"
            />
            {/* Professional overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-lawvriksh-navy/85 via-lawvriksh-navy/75 to-lawvriksh-burgundy/80"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="max-w-5xl mx-auto">
              {/* Professional Badge */}
              <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-lawvriksh-navy" />
                  </div>
                  <span className="text-white font-bold tracking-widest text-sm">LEGAL KNOWLEDGE PLATFORM</span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="legal-heading text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="block text-white mb-2">Your Gateway to</span>
                <span className="pb-3 block bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Legal Knowledge
                </span>
              </h1>

              {/* Professional Subtitle */}
              <p className="legal-text text-xl sm:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto">
                Discover comprehensive legal articles, insightful blogs, and professional notes
                curated by experts to enhance your understanding of law and legal practice.
              </p>

              {/* Professional Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link
                  to="/blogs"
                  className="group bg-white text-lawvriksh-navy px-10 py-5 font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-2xl border-2 border-white hover:border-gray-100 tracking-wide"
                >
                  <span className="flex items-center gap-3">
                    EXPLORE ARTICLES
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  to="/notes"
                  className="group border-2 border-white text-white px-10 py-5 font-bold text-lg hover:bg-white hover:text-lawvriksh-navy transition-all duration-200 tracking-wide"
                >
                  <span className="flex items-center gap-3">
                    READ NOTES
                    <FileText className="w-5 h-5" />
                  </span>
                </Link>
              </div>

              {/* Professional Stats/Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">500+</h3>
                  <p className="text-white/80 font-medium tracking-wide">PUBLISHED ARTICLES</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">200+</h3>
                  <p className="text-white/80 font-medium tracking-wide">PROFESSIONAL NOTES</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">50+</h3>
                  <p className="text-white/80 font-medium tracking-wide">EXPERT AUTHORS</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Just For You Section - Personalized Recommendations */}
        <JustForYouSection />

        {/* Diversified Content Layout */}
        <div className="space-y-12 py-8">
            {/* Corporate Law Section - Professional Design */}
            <section className="bg-white py-16 border-b border-gray-200">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-lawvriksh-navy flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="legal-heading text-3xl font-bold text-lawvriksh-navy mb-2">Corporate Law</h2>
                      <div className="w-24 h-1 bg-lawvriksh-navy"></div>
                    </div>
                  </div>
                  <p className="legal-text text-lg text-gray-600 max-w-3xl">
                    Comprehensive corporate legal insights, regulations, and professional guidance for business excellence.
                  </p>
                </div>
                <ContentSlider
                  title=""
                  content={corporateLawContent}
                  icon={Building2}
                  viewAllLink="/blogs?category=Corporate Law"
                  emptyMessage="No corporate law content available"
                  maxItems={12}
                  loading={loading}
                  renderContentCard={renderContentCard}
                />
              </div>
            </section>

            {/* Recent Updates Section - Professional Design */}
            <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16 border-b border-gray-200">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-lawvriksh-navy to-lawvriksh-burgundy flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="legal-heading text-3xl font-bold text-gray-900 mb-2">Recent Updates</h2>
                      <div className="w-24 h-1 bg-gradient-to-r from-lawvriksh-navy to-lawvriksh-burgundy"></div>
                    </div>
                  </div>
                  <p className="legal-text text-lg text-gray-600 max-w-3xl">
                    Stay informed with the latest legal developments, case updates, and professional insights.
                  </p>
                </div>
                <ContentSlider
                  title=""
                  content={recentUpdatesContent}
                  icon={Zap}
                  viewAllLink="/blogs"
                  emptyMessage="No recent updates available"
                  maxItems={12}
                  loading={loading}
                  renderContentCard={renderContentCard}
                />
              </div>
            </section>

            {/* Trending Topics Section - Professional Design */}
            <section className="bg-white py-16 border-b border-gray-200">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-lawvriksh-burgundy flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="legal-heading text-3xl font-bold text-lawvriksh-burgundy mb-2">Trending Topics</h2>
                      <div className="w-24 h-1 bg-lawvriksh-burgundy"></div>
                    </div>
                  </div>
                  <p className="legal-text text-lg text-gray-600 max-w-3xl">
                    Explore the most discussed legal topics and emerging trends in the legal profession.
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Main Trending Content */}
                  <div className="lg:col-span-3">
                    <ContentSlider
                      title=""
                      content={trendingContent}
                      icon={TrendingUp}
                      viewAllLink="/blogs"
                      emptyMessage="No trending content available"
                      maxItems={12}
                      loading={loading}
                      renderContentCard={renderContentCard}
                    />
                  </div>

                  {/* Sidebar with Quick Stats and Popular Content */}
                  <div className="lg:col-span-1">
                    <ContentSidebar
                      trendingContent={trendingContent}
                      blogPostsCount={blogPosts.length + (featuredContent ? 1 : 0)}
                      notesCount={notes.length}
                      corporateLawCount={corporateLawContent.length}
                      legalNewsCount={0}
                      todayContentCount={recentUpdatesContent.filter(item => {
                        const today = new Date();
                        const itemDate = new Date(item.created_at);
                        return itemDate.toDateString() === today.toDateString();
                      }).length}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Notes Section - Premium Professional Design */}
            <section className="py-20 bg-gradient-to-br from-lawvriksh-burgundy/8 to-lawvriksh-burgundy/12 border-b border-lawvriksh-burgundy/20">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16">
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-lawvriksh-burgundy flex items-center justify-center">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="inline-block bg-lawvriksh-burgundy text-white px-6 py-2 text-sm font-bold tracking-wider mb-4">
                        LEGAL NOTES
                      </div>
                      <h2 className="legal-heading text-4xl font-bold text-lawvriksh-burgundy mb-4">
                        Professional Legal Notes
                      </h2>
                      <div className="w-32 h-1 bg-lawvriksh-burgundy mx-auto"></div>
                    </div>
                  </div>
                  <p className="legal-text text-xl text-gray-700 max-w-4xl mx-auto text-center leading-relaxed">
                    Curated legal notes, case summaries, and professional insights to enhance your legal knowledge and practice.
                  </p>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="h-[340px] animate-pulse">
                        <div className="aspect-[16/9] bg-gray-200"></div>
                        <CardContent className="p-5">
                          <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="space-y-2">
                              <div className="h-3 bg-gray-200 rounded"></div>
                              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : notes.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                      {notes.slice(0, 6).map((note) => renderNoteCard(note))}
                    </div>

                    {notes.length > 6 && (
                      <div className="text-center">
                        <Link
                          to="/notes"
                          className="inline-flex items-center gap-2 bg-lawvriksh-burgundy text-white px-6 py-3 rounded-lg font-semibold hover:bg-lawvriksh-burgundy/90 transition-colors shadow-lg"
                        >
                          View All Notes
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-lawvriksh-burgundy/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Notes Available</h3>
                    <p className="text-gray-500">Legal notes will appear here once they are published.</p>
                  </div>
                )}
              </div>
            </section>
        </div>

        {/* Contact Us Form Section - Professional Design */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 border-t-4 border-lawvriksh-navy">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-block bg-lawvriksh-navy text-white px-8 py-3 text-sm font-bold tracking-wider mb-6">
                  PROFESSIONAL CONSULTATION
                </div>
                <h2 className="legal-heading text-4xl font-bold text-lawvriksh-navy mb-6">
                  Contact Our Legal Experts
                </h2>
                <div className="w-32 h-1 bg-lawvriksh-navy mx-auto mb-6"></div>
                <p className="legal-text text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  Connect with our experienced legal professionals for comprehensive consultation and expert guidance.
                </p>
              </div>

              <div className="bg-white shadow-2xl border-2 border-gray-200 p-10 md:p-16">
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">
                        FIRST NAME *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full px-5 py-4 border-2 border-gray-300 focus:border-lawvriksh-navy focus:outline-none transition-colors bg-gray-50 focus:bg-white font-medium"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">
                        LAST NAME *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full px-5 py-4 border-2 border-gray-300 focus:border-lawvriksh-navy focus:outline-none transition-colors bg-gray-50 focus:bg-white font-medium"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-5 py-4 border-2 border-gray-300 focus:border-lawvriksh-navy focus:outline-none transition-colors bg-gray-50 focus:bg-white font-medium"
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">
                        PHONE NUMBER
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-5 py-4 border-2 border-gray-300 focus:border-lawvriksh-navy focus:outline-none transition-colors bg-gray-50 focus:bg-white font-medium"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">
                      SUBJECT *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-5 py-4 border-2 border-gray-300 focus:border-lawvriksh-navy focus:outline-none transition-colors bg-gray-50 focus:bg-white font-medium"
                      placeholder="Enter the subject of your inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="legalArea" className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">
                      LEGAL AREA OF INTEREST
                    </label>
                    <select
                      id="legalArea"
                      name="legalArea"
                      className="w-full px-5 py-4 border-2 border-gray-300 focus:border-lawvriksh-navy focus:outline-none transition-colors bg-gray-50 focus:bg-white font-medium"
                    >
                      <option value="">Select a legal area</option>
                      <option value="corporate">Corporate Law</option>
                      <option value="litigation">Civil Litigation</option>
                      <option value="real-estate">Real Estate Law</option>
                      <option value="employment">Employment Law</option>
                      <option value="intellectual-property">Intellectual Property</option>
                      <option value="family">Family Law</option>
                      <option value="estate-planning">Estate Planning</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">
                      MESSAGE *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-300 focus:border-lawvriksh-navy focus:outline-none transition-colors bg-gray-50 focus:bg-white font-medium resize-vertical"
                      placeholder="Please describe your legal needs or questions in detail..."
                    ></textarea>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 border-l-4 border-lawvriksh-navy">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      required
                      className="mt-1 h-5 w-5 text-lawvriksh-navy focus:ring-lawvriksh-navy border-2 border-gray-400"
                    />
                    <label htmlFor="consent" className="text-sm text-gray-700 font-medium leading-relaxed">
                      I consent to being contacted by LawVriksh regarding my inquiry and understand that this does not establish an attorney-client relationship. *
                    </label>
                  </div>

                  <div className="text-center pt-8">
                    <button
                      type="submit"
                      className="bg-lawvriksh-navy text-white px-12 py-5 font-bold text-lg hover:bg-lawvriksh-navy/90 transition-colors shadow-xl border-2 border-lawvriksh-navy hover:border-lawvriksh-navy/90 tracking-wide"
                    >
                      SEND MESSAGE
                    </button>
                  </div>
                </form>
              </div>

              {/* Professional Contact Information */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-8 bg-white border-2 border-gray-200 hover:border-lawvriksh-navy/30 transition-colors">
                  <div className="w-16 h-16 bg-lawvriksh-navy flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="legal-heading text-xl font-bold text-lawvriksh-navy mb-3 tracking-wide">PHONE</h3>
                  <div className="w-12 h-1 bg-lawvriksh-navy mx-auto mb-4"></div>
                  <p className="legal-text text-gray-700 font-semibold text-lg">+1 (555) 123-4567</p>
                </div>

                <div className="text-center p-8 bg-white border-2 border-gray-200 hover:border-lawvriksh-navy/30 transition-colors">
                  <div className="w-16 h-16 bg-lawvriksh-navy flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="legal-heading text-xl font-bold text-lawvriksh-navy mb-3 tracking-wide">EMAIL</h3>
                  <div className="w-12 h-1 bg-lawvriksh-navy mx-auto mb-4"></div>
                  <p className="legal-text text-gray-700 font-semibold text-lg">contact@lawvriksh.com</p>
                </div>

                <div className="text-center p-8 bg-white border-2 border-gray-200 hover:border-lawvriksh-navy/30 transition-colors">
                  <div className="w-16 h-16 bg-lawvriksh-navy flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="legal-heading text-xl font-bold text-lawvriksh-navy mb-3 tracking-wide">OFFICE</h3>
                  <div className="w-12 h-1 bg-lawvriksh-navy mx-auto mb-4"></div>
                  <p className="legal-text text-gray-700 font-semibold text-lg leading-relaxed">
                    123 Legal District<br />Professional Plaza, Suite 456
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Home2;
