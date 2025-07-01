import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Tablet, Smartphone, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  showControls?: boolean;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  className,
  showControls = false
}) => {
  const [currentViewport, setCurrentViewport] = useState<ViewportSize>('desktop');
  const [actualViewport, setActualViewport] = useState<ViewportSize>('desktop');

  // Detect actual viewport size
  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setActualViewport('mobile');
      } else if (width < 1024) {
        setActualViewport('tablet');
      } else {
        setActualViewport('desktop');
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const getViewportStyles = (viewport: ViewportSize) => {
    switch (viewport) {
      case 'mobile':
        return {
          width: '375px',
          minHeight: '667px',
          maxWidth: '375px'
        };
      case 'tablet':
        return {
          width: '768px',
          minHeight: '1024px',
          maxWidth: '768px'
        };
      case 'desktop':
      default:
        return {
          width: '100%',
          minHeight: 'auto',
          maxWidth: '100%'
        };
    }
  };

  const getViewportIcon = (viewport: ViewportSize) => {
    switch (viewport) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      case 'desktop':
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getViewportLabel = (viewport: ViewportSize) => {
    switch (viewport) {
      case 'mobile':
        return 'Mobile (375px)';
      case 'tablet':
        return 'Tablet (768px)';
      case 'desktop':
      default:
        return 'Desktop (100%)';
    }
  };

  const viewportStyles = getViewportStyles(currentViewport);

  return (
    <div className={cn("w-full", className)}>
      {showControls && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Preview Mode</span>
              <Badge variant="outline" className="text-xs">
                Current: {getViewportLabel(actualViewport)}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            {(['desktop', 'tablet', 'mobile'] as ViewportSize[]).map((viewport) => (
              <Button
                key={viewport}
                variant={currentViewport === viewport ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentViewport(viewport)}
                className={cn(
                  "flex items-center gap-2",
                  currentViewport === viewport && "bg-lawvriksh-navy hover:bg-lawvriksh-navy/90"
                )}
              >
                {getViewportIcon(viewport)}
                <span className="hidden sm:inline">{getViewportLabel(viewport)}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <div 
          className={cn(
            "mx-auto transition-all duration-300 ease-in-out",
            currentViewport !== 'desktop' && "border border-gray-300 rounded-lg shadow-lg bg-white"
          )}
          style={viewportStyles}
        >
          <div className={cn(
            "w-full h-full",
            currentViewport === 'mobile' && "text-sm",
            currentViewport === 'tablet' && "text-base"
          )}>
            {children}
          </div>
        </div>
      </div>

      {showControls && currentViewport !== 'desktop' && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Viewing in {getViewportLabel(currentViewport)} mode. 
            {currentViewport !== actualViewport && (
              <span className="text-amber-600 ml-1">
                (Your actual screen is {getViewportLabel(actualViewport)})
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

// Hook for responsive utilities
export const useResponsive = () => {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setViewport('mobile');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < 1024) {
        setViewport('tablet');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else {
        setViewport('desktop');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return {
    viewport,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints: {
      mobile: 768,
      tablet: 1024
    }
  };
};

// Responsive text utility
export const getResponsiveTextSize = (viewport: ViewportSize, baseSize: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl') => {
  const sizeMap = {
    mobile: {
      'sm': 'text-xs',
      'base': 'text-sm',
      'lg': 'text-base',
      'xl': 'text-lg',
      '2xl': 'text-xl',
      '3xl': 'text-2xl',
      '4xl': 'text-3xl'
    },
    tablet: {
      'sm': 'text-sm',
      'base': 'text-base',
      'lg': 'text-lg',
      'xl': 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl'
    },
    desktop: {
      'sm': 'text-sm',
      'base': 'text-base',
      'lg': 'text-lg',
      'xl': 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl'
    }
  };

  return sizeMap[viewport][baseSize];
};

// Responsive spacing utility
export const getResponsiveSpacing = (viewport: ViewportSize, baseSpacing: 'sm' | 'md' | 'lg' | 'xl') => {
  const spacingMap = {
    mobile: {
      'sm': 'p-2 gap-2',
      'md': 'p-3 gap-3',
      'lg': 'p-4 gap-4',
      'xl': 'p-6 gap-6'
    },
    tablet: {
      'sm': 'p-3 gap-3',
      'md': 'p-4 gap-4',
      'lg': 'p-6 gap-6',
      'xl': 'p-8 gap-8'
    },
    desktop: {
      'sm': 'p-4 gap-4',
      'md': 'p-6 gap-6',
      'lg': 'p-8 gap-8',
      'xl': 'p-12 gap-12'
    }
  };

  return spacingMap[viewport][baseSpacing];
};

export default ResponsiveWrapper;
export type { ViewportSize };
