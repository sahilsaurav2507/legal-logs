import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  X,
  FileText, 
  File,
  Calendar, 
  User, 
  ArrowRight,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { contentApi, BlogPost, Note } from '@/services/api';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface UnifiedSearchProps {
  className?: string;
  placeholder?: string;
  showFilters?: boolean;
  maxResults?: number;
}

interface SearchResult {
  id: string;
  type: 'blog' | 'note';
  title: string;
  summary?: string;
  author: string;
  date: string;
  category: string;
  url: string;
}

const UnifiedSearch: React.FC<UnifiedSearchProps> = ({ 
  className, 
  placeholder = "Search articles, notes, and legal content...",
  showFilters = true,
  maxResults = 8
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Categories for filtering
  const categories = [
    'Constitutional Law',
    'Corporate Law', 
    'Employment Law',
    'Intellectual Property',
    'Criminal Law',
    'Family Law',
    'Study Notes',
    'Practice Notes', 
    'Research',
    'Case Notes',
    'Meeting Notes'
  ];

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        performSearch();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, selectedType]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      
      const searchParams = {
        search: searchTerm,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        limit: maxResults
      };

      const searchResults: SearchResult[] = [];

      // Search blogs if type is 'all' or 'blog'
      if (selectedType === 'all' || selectedType === 'blog') {
        try {
          const blogResponse = await contentApi.getBlogPosts(searchParams);
          const blogResults = blogResponse.blog_posts.map((post: BlogPost) => ({
            id: `blog-${post.content_id}`,
            type: 'blog' as const,
            title: post.title,
            summary: post.summary,
            author: post.author_name,
            date: post.created_at,
            category: post.category,
            url: `/blogs/${post.content_id}`
          }));
          searchResults.push(...blogResults);
        } catch (error) {
          console.error('Error searching blogs:', error);
        }
      }

      // Search notes if type is 'all' or 'note'
      if (selectedType === 'all' || selectedType === 'note') {
        try {
          const notesResponse = await contentApi.getNotes(searchParams);
          const noteResults = notesResponse.notes.map((note: Note) => ({
            id: `note-${note.content_id}`,
            type: 'note' as const,
            title: note.title,
            summary: note.summary,
            author: note.author_name,
            date: note.created_at,
            category: note.category,
            url: `/notes/${note.note_id || note.content_id}`
          }));
          searchResults.push(...noteResults);
        } catch (error) {
          console.error('Error searching notes:', error);
        }
      }

      // Sort by relevance/date and limit results
      const sortedResults = searchResults
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, maxResults);

      setResults(sortedResults);
      setShowResults(true);

      // Add to recent searches
      if (searchTerm.trim() && !recentSearches.includes(searchTerm.trim())) {
        setRecentSearches(prev => [searchTerm.trim(), ...prev.slice(0, 4)]);
      }

    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to full search results page
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}&category=${selectedCategory}&type=${selectedType}`;
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const renderSearchResult = (result: SearchResult) => (
    <Link
      key={result.id}
      to={result.url}
      className="block p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
      onClick={() => setShowResults(false)}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-1.5 rounded-md flex-shrink-0 mt-0.5",
          result.type === 'blog' 
            ? "bg-lawvriksh-gold/10 text-lawvriksh-navy" 
            : "bg-lawvriksh-burgundy/10 text-lawvriksh-burgundy"
        )}>
          {result.type === 'blog' ? (
            <FileText className="h-3 w-3" />
          ) : (
            <File className="h-3 w-3" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="legal-heading text-sm font-medium line-clamp-1">
              {result.title}
            </h4>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {result.category}
            </Badge>
          </div>
          
          {result.summary && (
            <p className="legal-text text-xs text-gray-600 line-clamp-2 mb-2">
              {result.summary}
            </p>
          )}
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <User className="h-2.5 w-2.5" />
              {result.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-2.5 w-2.5" />
              {format(new Date(result.date), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
        
        <ArrowRight className="h-3 w-3 text-gray-400 flex-shrink-0 mt-1" />
      </div>
    </Link>
  );

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <form onSubmit={handleSearchSubmit} className="space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setShowResults(true);
            }}
            className="pl-10 pr-10 h-12 text-base"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="blog">Articles</SelectItem>
                <SelectItem value="note">Notes</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button type="submit" className="w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Search All
            </Button>
          </div>
        )}
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-hidden shadow-xl border-2">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-6 w-6 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="max-h-80 overflow-y-auto">
                  {results.map(renderSearchResult)}
                </div>
                <div className="p-3 bg-gray-50 border-t">
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-lawvriksh-navy hover:text-lawvriksh-burgundy"
                    onClick={handleSearchSubmit}
                  >
                    View all results for "{searchTerm}"
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </>
            ) : searchTerm.trim().length >= 2 ? (
              <div className="p-6 text-center">
                <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No results found for "{searchTerm}"</p>
                <p className="text-xs text-gray-400 mt-1">Try different keywords or check spelling</p>
              </div>
            ) : (
              recentSearches.length > 0 && (
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    Recent Searches
                  </h4>
                  <div className="space-y-1">
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchTerm(term)}
                        className="block w-full text-left text-sm text-gray-600 hover:text-lawvriksh-navy py-1 px-2 rounded hover:bg-gray-50 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnifiedSearch;
