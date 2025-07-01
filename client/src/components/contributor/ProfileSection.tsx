import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileSectionProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: 'navy' | 'burgundy' | 'gold' | 'gray';
  className?: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  description,
  icon: Icon,
  children,
  variant = 'navy',
  className
}) => {
  const variantStyles = {
    navy: {
      headerBg: 'bg-gradient-to-r from-lawvriksh-navy/5 to-lawvriksh-burgundy/5',
      iconBg: 'bg-lawvriksh-navy/10 border-lawvriksh-navy/20',
      iconColor: 'text-lawvriksh-navy'
    },
    burgundy: {
      headerBg: 'bg-gradient-to-r from-lawvriksh-burgundy/5 to-lawvriksh-navy/5',
      iconBg: 'bg-lawvriksh-burgundy/10 border-lawvriksh-burgundy/20',
      iconColor: 'text-lawvriksh-burgundy'
    },
    gold: {
      headerBg: 'bg-gradient-to-r from-lawvriksh-gold/5 to-lawvriksh-navy/5',
      iconBg: 'bg-lawvriksh-gold/20 border-lawvriksh-gold/30',
      iconColor: 'text-lawvriksh-navy'
    },
    gray: {
      headerBg: 'bg-gradient-to-r from-gray-50 to-gray-100',
      iconBg: 'bg-white border-gray-300',
      iconColor: 'text-gray-800'
    }
  };

  const styles = variantStyles[variant];

  return (
    <Card className={cn("border-2 border-lawvriksh-navy/20 shadow-xl bg-white", className)}>
      <CardHeader className={cn("pb-4", styles.headerBg)}>
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl border", styles.iconBg)}>
            <Icon className={cn("h-5 w-5", styles.iconColor)} />
          </div>
          <div>
            <CardTitle className="legal-heading text-xl text-lawvriksh-navy">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="legal-text text-lawvriksh-gray">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
