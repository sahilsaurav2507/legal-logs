import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Type, 
  Layout, 
  Sliders,
  RotateCcw,
  Save
} from 'lucide-react';
import { TemplateType } from '@/pages/DigitalPortfolio';
import { cn } from '@/lib/utils';

interface CustomizationOptions {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'spacious';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
}

interface PortfolioCustomizerProps {
  template: TemplateType;
  customizations: CustomizationOptions;
  onCustomizationChange: (customizations: CustomizationOptions) => void;
  onSave?: () => void;
  onReset?: () => void;
  className?: string;
}

const COLOR_PRESETS = {
  'modern-blue': [
    { name: 'Classic Blue', primary: '#2563eb', secondary: '#1e40af' },
    { name: 'Navy Blue', primary: '#1e3a8a', secondary: '#1e40af' },
    { name: 'Sky Blue', primary: '#0ea5e9', secondary: '#0284c7' },
    { name: 'Indigo', primary: '#6366f1', secondary: '#4f46e5' },
  ],
  'elegant-rose': [
    { name: 'Rose Pink', primary: '#e11d48', secondary: '#be185d' },
    { name: 'Coral', primary: '#f97316', secondary: '#ea580c' },
    { name: 'Burgundy', primary: '#991b1b', secondary: '#7f1d1d' },
    { name: 'Magenta', primary: '#c2410c', secondary: '#9a3412' },
  ],
  'professional-dark': [
    { name: 'Charcoal', primary: '#1f2937', secondary: '#374151' },
    { name: 'Slate', primary: '#0f172a', secondary: '#1e293b' },
    { name: 'Dark Blue', primary: '#1e3a8a', secondary: '#1e40af' },
    { name: 'Dark Green', primary: '#14532d', secondary: '#166534' },
  ],
  'creative-gradient': [
    { name: 'Purple Gradient', primary: '#8b5cf6', secondary: '#a855f7' },
    { name: 'Pink Gradient', primary: '#ec4899', secondary: '#db2777' },
    { name: 'Orange Gradient', primary: '#f97316', secondary: '#ea580c' },
    { name: 'Teal Gradient', primary: '#0d9488', secondary: '#0f766e' },
  ]
};

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Modern Sans-serif)' },
  { value: 'Georgia', label: 'Georgia (Classic Serif)' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegant Serif)' },
  { value: 'Roboto', label: 'Roboto (Clean Sans-serif)' },
  { value: 'Merriweather', label: 'Merriweather (Readable Serif)' },
  { value: 'Montserrat', label: 'Montserrat (Modern Sans-serif)' },
];

const PortfolioCustomizer: React.FC<PortfolioCustomizerProps> = ({
  template,
  customizations,
  onCustomizationChange,
  onSave,
  onReset,
  className
}) => {
  const [activeSection, setActiveSection] = useState<'colors' | 'typography' | 'layout'>('colors');

  const updateCustomization = (key: keyof CustomizationOptions, value: any) => {
    onCustomizationChange({
      ...customizations,
      [key]: value
    });
  };

  const applyColorPreset = (preset: { primary: string; secondary: string }) => {
    onCustomizationChange({
      ...customizations,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    });
  };

  const colorPresets = COLOR_PRESETS[template] || COLOR_PRESETS['modern-blue'];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Section Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <Button
          variant={activeSection === 'colors' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('colors')}
          className="flex-1"
        >
          <Palette className="mr-2 h-4 w-4" />
          Colors
        </Button>
        <Button
          variant={activeSection === 'typography' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('typography')}
          className="flex-1"
        >
          <Type className="mr-2 h-4 w-4" />
          Typography
        </Button>
        <Button
          variant={activeSection === 'layout' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('layout')}
          className="flex-1"
        >
          <Layout className="mr-2 h-4 w-4" />
          Layout
        </Button>
      </div>

      {/* Colors Section */}
      {activeSection === 'colors' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Customization
            </CardTitle>
            <CardDescription>
              Customize the color scheme of your portfolio template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Color Presets */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Color Presets</Label>
              <div className="grid grid-cols-2 gap-3">
                {colorPresets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-3 flex items-center gap-3 justify-start"
                    onClick={() => applyColorPreset(preset)}
                  >
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                    <span className="text-sm">{preset.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Custom Colors */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Primary Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customizations.primaryColor}
                    onChange={(e) => updateCustomization('primaryColor', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customizations.primaryColor}
                    onChange={(e) => updateCustomization('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                    placeholder="#2563eb"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Secondary Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customizations.secondaryColor}
                    onChange={(e) => updateCustomization('secondaryColor', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customizations.secondaryColor}
                    onChange={(e) => updateCustomization('secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                    placeholder="#1e40af"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Typography Section */}
      {activeSection === 'typography' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Typography Settings
            </CardTitle>
            <CardDescription>
              Customize fonts and text sizing for your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Font Family</Label>
              <Select
                value={customizations.fontFamily}
                onValueChange={(value) => updateCustomization('fontFamily', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Font Size</Label>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <Button
                    key={size}
                    variant={customizations.fontSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateCustomization('fontSize', size)}
                    className="capitalize"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Layout Section */}
      {activeSection === 'layout' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Layout Options
            </CardTitle>
            <CardDescription>
              Adjust spacing and layout properties
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Spacing</Label>
              <div className="flex gap-2">
                {(['compact', 'normal', 'spacious'] as const).map((spacing) => (
                  <Button
                    key={spacing}
                    variant={customizations.spacing === spacing ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateCustomization('spacing', spacing)}
                    className="capitalize"
                  >
                    {spacing}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Border Radius</Label>
              <div className="flex gap-2">
                {(['none', 'small', 'medium', 'large'] as const).map((radius) => (
                  <Button
                    key={radius}
                    variant={customizations.borderRadius === radius ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateCustomization('borderRadius', radius)}
                    className="capitalize"
                  >
                    {radius}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        {onReset && (
          <Button variant="outline" onClick={onReset} className="flex-1">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
        )}
        {onSave && (
          <Button onClick={onSave} className="flex-1 bg-lawvriksh-navy hover:bg-lawvriksh-navy/90">
            <Save className="mr-2 h-4 w-4" />
            Save Customizations
          </Button>
        )}
      </div>
    </div>
  );
};

export default PortfolioCustomizer;
export type { CustomizationOptions };
