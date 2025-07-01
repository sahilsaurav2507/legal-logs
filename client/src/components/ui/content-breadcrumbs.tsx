import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface ContentBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const ContentBreadcrumbs: React.FC<ContentBreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)} aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center text-gray-500 hover:text-lawvriksh-navy transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.href && !item.current ? (
            <Link
              to={item.href}
              className="text-gray-500 hover:text-lawvriksh-navy transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                item.current 
                  ? "text-lawvriksh-navy font-medium" 
                  : "text-gray-500"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default ContentBreadcrumbs;
