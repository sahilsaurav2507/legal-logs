import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ContentDivisionProps {
  title: string;
  content: any[];
  icon: LucideIcon;
  viewAllLink: string;
  emptyMessage: string;
  maxItems?: number;
  loading?: boolean;
  renderContentCard: (item: any, type: string) => React.ReactNode;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
}

const ContentDivision: React.FC<ContentDivisionProps> = ({
  title,
  content,
  icon: Icon,
  viewAllLink,
  emptyMessage,
  maxItems = 6,
  loading = false,
  renderContentCard,
  className,
  variant = 'default'
}) => {
  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className={cn(
          "grid gap-4",
          variant === 'compact' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" :
          variant === 'featured' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" :
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}>
          {Array.from({ length: variant === 'compact' ? 4 : 3 }).map((_, i) => (
            <Card key={i} className="h-48">
              <Skeleton className="w-full h-32" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className={cn("text-center py-8 bg-gray-50 rounded-lg", className)}>
        <Icon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-lawvriksh-navy" />
          <h2 className="legal-heading text-lg font-semibold text-lawvriksh-navy">
            {title}
          </h2>
        </div>
        <Link 
          to={viewAllLink}
          className="text-sm text-lawvriksh-navy hover:text-lawvriksh-burgundy transition-colors flex items-center gap-1 group"
        >
          View All
          <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      
      <div className={cn(
        "grid gap-4",
        variant === 'compact' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" :
        variant === 'featured' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" :
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        {content.slice(0, maxItems).map((item) => {
          const itemType = item.type || (item.note_id ? 'note' : 'blog');
          return renderContentCard(item, itemType);
        })}
      </div>
    </div>
  );
};

export default ContentDivision;
