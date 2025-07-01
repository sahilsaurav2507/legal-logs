import React from 'react';
import { User } from '@/contexts/AuthContext';
import { TemplateType } from '@/pages/DigitalPortfolio';
import ModernBlueTemplate from './templates/ModernBlueTemplate';
import ElegantRoseTemplate from './templates/ElegantRoseTemplate';
import ProfessionalDarkTemplate from './templates/ProfessionalDarkTemplate';
import CreativeGradientTemplate from './templates/CreativeGradientTemplate';

interface PortfolioRendererProps {
  user: User;
  template: TemplateType;
  customizations?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    fontSize?: 'small' | 'medium' | 'large';
  };
  className?: string;
}

const PortfolioRenderer: React.FC<PortfolioRendererProps> = ({
  user,
  template,
  customizations,
  className
}) => {
  // Apply customizations via CSS variables
  const customStyles = customizations ? {
    '--primary-color': customizations.primaryColor,
    '--secondary-color': customizations.secondaryColor,
    '--font-family': customizations.fontFamily,
    '--font-size': customizations.fontSize === 'small' ? '0.875rem' : 
                   customizations.fontSize === 'large' ? '1.125rem' : '1rem'
  } as React.CSSProperties : {};

  const renderTemplate = () => {
    switch (template) {
      case 'modern-blue':
        return <ModernBlueTemplate user={user} className={className} />;
      case 'elegant-rose':
        return <ElegantRoseTemplate user={user} className={className} />;
      case 'professional-dark':
        return <ProfessionalDarkTemplate user={user} className={className} />;
      case 'creative-gradient':
        return <CreativeGradientTemplate user={user} className={className} />;
      default:
        return <ModernBlueTemplate user={user} className={className} />;
    }
  };

  return (
    <div style={customStyles} className="portfolio-renderer">
      {renderTemplate()}
    </div>
  );
};

export default PortfolioRenderer;
