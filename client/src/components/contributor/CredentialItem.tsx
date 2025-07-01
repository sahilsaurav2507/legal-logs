import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CredentialItemProps {
  icon: LucideIcon;
  label: string;
  value: string | React.ReactNode;
  type?: 'text' | 'badge' | 'link';
  badgeVariant?: 'default' | 'secondary' | 'success' | 'warning';
  href?: string;
  className?: string;
}

const CredentialItem: React.FC<CredentialItemProps> = ({
  icon: Icon,
  label,
  value,
  type = 'text',
  badgeVariant = 'default',
  href,
  className
}) => {
  const renderValue = () => {
    if (type === 'badge' && typeof value === 'string') {
      const badgeStyles = {
        default: "bg-lawvriksh-navy/10 text-lawvriksh-navy border-lawvriksh-navy/20",
        secondary: "bg-gray-100 text-gray-800 border-gray-300",
        success: "bg-green-100 text-green-800 border-green-300",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-300"
      };

      return (
        <Badge 
          variant="outline"
          className={cn("text-xs", badgeStyles[badgeVariant])}
        >
          {value}
        </Badge>
      );
    }

    if (type === 'link' && typeof value === 'string' && href) {
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="legal-text text-lawvriksh-navy text-sm hover:text-lawvriksh-gold transition-colors underline"
        >
          {value}
        </a>
      );
    }

    if (typeof value === 'string') {
      return (
        <p className={cn(
          "legal-text text-lawvriksh-gray text-sm",
          type === 'text' && "font-mono" // For license numbers, etc.
        )}>
          {value}
        </p>
      );
    }

    return value;
  };

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <Icon className="h-4 w-4 text-lawvriksh-gold mt-1 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-lawvriksh-navy text-sm mb-1">{label}</p>
        {renderValue()}
      </div>
    </div>
  );
};

export default CredentialItem;
