import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: 'navy' | 'burgundy' | 'gold' | 'green' | 'gray';
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  variant = 'navy',
  className
}) => {
  const variantStyles = {
    navy: {
      bg: 'bg-gradient-to-br from-lawvriksh-navy/5 to-lawvriksh-navy/10',
      border: 'border-lawvriksh-navy/20',
      iconColor: 'text-lawvriksh-navy',
      valueColor: 'text-lawvriksh-navy'
    },
    burgundy: {
      bg: 'bg-gradient-to-br from-lawvriksh-burgundy/5 to-lawvriksh-burgundy/10',
      border: 'border-lawvriksh-burgundy/20',
      iconColor: 'text-lawvriksh-burgundy',
      valueColor: 'text-lawvriksh-burgundy'
    },
    gold: {
      bg: 'bg-gradient-to-br from-lawvriksh-gold/5 to-lawvriksh-gold/10',
      border: 'border-lawvriksh-gold/30',
      iconColor: 'text-lawvriksh-gold-dark',
      valueColor: 'text-lawvriksh-gold-dark'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      border: 'border-green-200',
      iconColor: 'text-green-600',
      valueColor: 'text-green-700'
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      iconColor: 'text-lawvriksh-navy',
      valueColor: 'text-lawvriksh-navy'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn(
      "text-center p-4 rounded-xl border transition-all duration-300 hover:shadow-md",
      styles.bg,
      styles.border,
      className
    )}>
      <div className="flex items-center justify-center mb-2">
        <Icon className={cn("h-6 w-6", styles.iconColor)} />
      </div>
      <div className={cn("text-2xl font-bold legal-heading", styles.valueColor)}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-sm legal-text text-lawvriksh-gray">{title}</div>
      {description && (
        <div className="text-xs legal-text text-lawvriksh-gray-light mt-1">
          {description}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
