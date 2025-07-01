import React from 'react';
import { formatBlogContent, sanitizeHtml } from '@/utils/textUtils';

interface BlogContentProps {
  content: string;
  className?: string;
  maxLines?: number;
}

const BlogContent: React.FC<BlogContentProps> = ({ 
  content, 
  className = '', 
  maxLines 
}) => {
  const { html } = formatBlogContent(content);
  const sanitizedHtml = sanitizeHtml(html);
  
  const baseClasses = "prose prose-sm max-w-none text-gray-700";
  const lineClampClass = maxLines ? `line-clamp-${maxLines}` : '';
  const combinedClasses = `${baseClasses} ${lineClampClass} ${className}`.trim();
  
  return (
    <div 
      className={combinedClasses}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={{
        // Custom CSS for better formatting
        '--tw-prose-headings': '#1e3a8a', // lawvriksh-navy
        '--tw-prose-links': '#7c2d12', // lawvriksh-burgundy
        '--tw-prose-bold': '#1e3a8a', // lawvriksh-navy
      } as React.CSSProperties}
    />
  );
};

export default BlogContent;
