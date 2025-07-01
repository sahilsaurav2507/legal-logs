import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface ContentSliderProps {
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

const ContentSlider: React.FC<ContentSliderProps> = ({
  title,
  content,
  icon: Icon,
  viewAllLink,
  emptyMessage,
  maxItems = 12,
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
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CarouselItem key={i} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-64">
                  <Skeleton className="w-full h-40" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
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
      
      <Carousel 
        className="w-full"
        opts={{
          align: "start",
          loop: false,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {content.slice(0, maxItems).map((item, index) => {
            const itemType = item.type || (item.note_id ? 'note' : 'blog');
            return (
              <CarouselItem 
                key={item.content_id || item.note_id || index} 
                className={cn(
                  "pl-2 md:pl-4",
                  variant === 'compact' ? "basis-full md:basis-1/2 lg:basis-1/4" :
                  variant === 'featured' ? "basis-full md:basis-1/2 lg:basis-1/2" :
                  "basis-full md:basis-1/2 lg:basis-1/3"
                )}
              >
                <div className="h-full">
                  {renderContentCard(item, itemType)}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default ContentSlider;
