import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TemplateType } from '@/pages/DigitalPortfolio';
import { Eye, Palette } from 'lucide-react';

interface TemplateOption {
  id: TemplateType;
  name: string;
  description: string;
  preview: string;
  colors: string[];
  features: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Clean, professional design with blue accents and sidebar layout. Perfect for legal professionals.',
    preview: '/templates/modern-blue-preview.jpg',
    colors: ['#2563eb', '#1e40af', '#3b82f6', '#60a5fa'],
    features: ['Left sidebar', 'Clean typography', 'Professional layout', 'Skills section', 'Work experience'],
    difficulty: 'Beginner'
  },
  {
    id: 'elegant-rose',
    name: 'Elegant Rose',
    description: 'Sophisticated design with rose/coral colors and elegant typography. Great for senior professionals.',
    preview: '/templates/elegant-rose-preview.jpg',
    colors: ['#e11d48', '#be185d', '#f43f5e', '#fb7185'],
    features: ['Profile photo', 'Elegant design', 'Contact sidebar', 'Experience timeline', 'Skills grid'],
    difficulty: 'Intermediate'
  },
  {
    id: 'professional-dark',
    name: 'Professional Dark',
    description: 'Modern dark theme with clean sections and professional appeal. Ideal for tech-savvy professionals.',
    preview: '/templates/professional-dark-preview.jpg',
    colors: ['#1f2937', '#374151', '#4b5563', '#6b7280'],
    features: ['Dark theme', 'Modern layout', 'Clean sections', 'Minimalist design', 'Expertise showcase'],
    difficulty: 'Intermediate'
  },
  {
    id: 'creative-gradient',
    name: 'Creative Gradient',
    description: 'Eye-catching design with gradients and creative layout. Perfect for creative professionals.',
    preview: '/templates/creative-gradient-preview.jpg',
    colors: ['#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe'],
    features: ['Gradient backgrounds', 'Creative layout', 'Modern design', 'Interactive elements'],
    difficulty: 'Advanced'
  }
];

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateSelect: (templateId: TemplateType) => void;
  onPreview?: (templateId: TemplateType) => void;
  className?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onPreview,
  className
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      {TEMPLATE_OPTIONS.map((template) => (
        <Card 
          key={template.id}
          className={cn(
            "cursor-pointer transition-all duration-300 hover:shadow-xl border-2 group",
            selectedTemplate === template.id 
              ? "border-lawvriksh-navy shadow-xl ring-2 ring-lawvriksh-navy/20" 
              : "border-gray-200 hover:border-lawvriksh-navy/50"
          )}
          onClick={() => onTemplateSelect(template.id)}
        >
          <CardHeader className="pb-4">
            {/* Template Preview */}
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
              {/* Mock preview based on template */}
              {template.id === 'modern-blue' && (
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-700 flex">
                  <div className="w-1/3 bg-blue-600 p-2">
                    <div className="w-full h-3 bg-white/20 rounded mb-2"></div>
                    <div className="w-2/3 h-2 bg-white/20 rounded mb-1"></div>
                    <div className="w-3/4 h-2 bg-white/20 rounded"></div>
                  </div>
                  <div className="flex-1 bg-white p-2">
                    <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                    <div className="w-4/5 h-2 bg-gray-300 rounded mb-1"></div>
                    <div className="w-3/5 h-2 bg-gray-300 rounded"></div>
                  </div>
                </div>
              )}
              
              {template.id === 'elegant-rose' && (
                <div className="w-full h-full bg-gradient-to-br from-rose-100 to-blue-100 p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-rose-400 rounded-full"></div>
                    <div className="flex-1">
                      <div className="w-2/3 h-2 bg-rose-600 rounded mb-1"></div>
                      <div className="w-1/2 h-1 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 h-12">
                    <div className="bg-rose-200 rounded"></div>
                    <div className="col-span-2 bg-blue-200 rounded"></div>
                  </div>
                </div>
              )}
              
              {template.id === 'professional-dark' && (
                <div className="w-full h-full bg-gray-900 flex">
                  <div className="w-1/3 bg-gray-800 p-2">
                    <div className="w-8 h-8 bg-gray-600 rounded-full mx-auto mb-2"></div>
                    <div className="w-full h-2 bg-gray-600 rounded mb-1"></div>
                    <div className="w-2/3 h-2 bg-gray-600 rounded"></div>
                  </div>
                  <div className="flex-1 bg-gray-100 p-2">
                    <div className="w-full h-2 bg-gray-800 rounded mb-2"></div>
                    <div className="w-4/5 h-2 bg-gray-400 rounded mb-1"></div>
                    <div className="w-3/5 h-2 bg-gray-400 rounded"></div>
                  </div>
                </div>
              )}
              
              {template.id === 'creative-gradient' && (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-2 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2"></div>
                    <div className="w-16 h-2 bg-white/30 rounded mx-auto mb-1"></div>
                    <div className="w-12 h-1 bg-white/30 rounded mx-auto"></div>
                  </div>
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                {onPreview && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(template.id);
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="legal-heading text-xl text-lawvriksh-navy flex items-center gap-2">
                  {template.name}
                  {selectedTemplate === template.id && (
                    <Badge className="bg-lawvriksh-navy text-white">Selected</Badge>
                  )}
                </CardTitle>
                <CardDescription className="legal-text mt-2">
                  {template.description}
                </CardDescription>
              </div>
              <Badge 
                variant="outline"
                className={cn("text-xs", getDifficultyColor(template.difficulty))}
              >
                {template.difficulty}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* Color Palette */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Palette className="h-3 w-3" />
                  Color Palette
                </p>
                <div className="flex gap-2">
                  {template.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              
              {/* Features */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Features</p>
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-lawvriksh-navy/10 text-lawvriksh-navy border-lawvriksh-navy/20"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export { TemplateSelector, TEMPLATE_OPTIONS };
export type { TemplateOption };
