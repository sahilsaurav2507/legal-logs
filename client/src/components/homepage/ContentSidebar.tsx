import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  BarChart3, 
  BookOpen, 
  FileText, 
  Building2, 
  Newspaper, 
  Clock,
  LucideIcon 
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { getOptimizedImageUrl, handleImageError } from '@/utils/imageUtils';

interface ContentSidebarProps {
  trendingContent: any[];
  blogPostsCount: number;
  notesCount: number;
  corporateLawCount: number;
  legalNewsCount: number;
  todayContentCount: number;
  loading?: boolean;
}

interface StatItem {
  icon: LucideIcon;
  label: string;
  count: number;
  variant?: 'default' | 'outline';
}

const ContentSidebar: React.FC<ContentSidebarProps> = ({
  trendingContent,
  blogPostsCount,
  notesCount,
  corporateLawCount,
  legalNewsCount,
  todayContentCount,
  loading = false
}) => {
  const stats: StatItem[] = [
    { icon: BookOpen, label: 'Total Articles', count: blogPostsCount, variant: 'default' },
    { icon: FileText, label: 'Notes', count: notesCount, variant: 'default' },
    { icon: Building2, label: 'Corporate Law', count: corporateLawCount, variant: 'outline' },
    { icon: Clock, label: "Today's Content", count: todayContentCount, variant: 'outline' },
  ];

  return (
    <div className="space-y-6">
      {/* Popular Content */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <h3 className="legal-heading text-sm font-semibold text-lawvriksh-navy flex items-center gap-2">
            <Award className="h-4 w-4 text-lawvriksh-gold" />
            Most Popular
          </h3>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-2">
                <Skeleton className="w-12 h-10 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-2 w-2/3" />
                </div>
              </div>
            ))
          ) : (
            trendingContent.slice(0, 4).map((item, index) => (
              <Link
                key={item.content_id}
                to={`/blogs/${item.content_id}`}
                className="flex gap-3 group hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-10 rounded overflow-hidden bg-gray-100">
                  <img
                    src={getOptimizedImageUrl(item.featured_image, 80, 60, 'blog')}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, 'blog')}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-bold text-lawvriksh-gold">
                      #{index + 1}
                    </span>
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {item.category || 'Article'}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-medium line-clamp-2 group-hover:text-lawvriksh-navy transition-colors leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(item.created_at), 'MMM dd')}
                  </p>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      {/* Content Statistics */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <h3 className="legal-heading text-sm font-semibold text-lawvriksh-navy flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Content Overview
          </h3>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isLastItem = index === stats.length - 1;
            
            return (
              <div 
                key={stat.label}
                className={`flex items-center justify-between py-1 ${
                  isLastItem ? 'border-t border-gray-100 pt-2' : ''
                }`}
              >
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <Icon className="h-3 w-3" />
                  {stat.label}
                </span>
                <Badge 
                  variant={stat.variant === 'outline' ? 'outline' : 'secondary'} 
                  className="text-xs"
                >
                  {stat.count}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentSidebar;
