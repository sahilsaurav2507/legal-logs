import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Palette,
  Download,
  Share,
  Edit3,
  Eye,
  ArrowLeft,
  UserX,
  FileText,
  Layout,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { TemplateSelector } from '@/components/portfolio/TemplateSelector';
import PortfolioRenderer from '@/components/portfolio/PortfolioRenderer';
import PortfolioCustomizer, { CustomizationOptions } from '@/components/portfolio/PortfolioCustomizer';
import PDFExportDialog from '@/components/portfolio/PDFExportDialog';
import ShareDialog from '@/components/portfolio/ShareDialog';
import ResponsiveWrapper from '@/components/portfolio/ResponsiveWrapper';

// Template types
export type TemplateType = 'modern-blue' | 'elegant-rose' | 'professional-dark' | 'creative-gradient';

const ResumeBuilder: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern-blue');
  const [currentView, setCurrentView] = useState<'select' | 'preview' | 'customize'>('select');
  const [isLoading, setIsLoading] = useState(false);
  const [customizations, setCustomizations] = useState<CustomizationOptions>({
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    fontFamily: 'Inter',
    fontSize: 'medium',
    spacing: 'normal',
    borderRadius: 'small'
  });

  // Check if user has access (Editor or Admin only)
  const hasAccess = user && (user.role === UserRole.EDITOR || user.role === UserRole.ADMIN);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lawvriksh-navy/5 to-lawvriksh-burgundy/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-2 border-lawvriksh-navy/20 shadow-xl">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-lawvriksh-burgundy/10 rounded-full flex items-center justify-center mb-4">
              <UserX className="h-8 w-8 text-lawvriksh-burgundy" />
            </div>
            <CardTitle className="legal-heading text-xl text-lawvriksh-navy">
              Access Restricted
            </CardTitle>
            <CardDescription className="legal-text text-lawvriksh-gray">
              Resume Builder is only available to Editors and Administrators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard">
              <Button className="w-full bg-lawvriksh-navy hover:bg-lawvriksh-navy/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleTemplateSelect = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
    setCurrentView('preview');
    // Reset customizations when template changes
    resetCustomizations(templateId);
  };

  const resetCustomizations = (templateId?: TemplateType) => {
    const template = templateId || selectedTemplate;
    // Set default colors based on template
    const defaultColors = {
      'modern-blue': { primary: '#2563eb', secondary: '#1e40af' },
      'elegant-rose': { primary: '#e11d48', secondary: '#be185d' },
      'professional-dark': { primary: '#1f2937', secondary: '#374151' },
      'creative-gradient': { primary: '#8b5cf6', secondary: '#a855f7' }
    };

    setCustomizations({
      primaryColor: defaultColors[template].primary,
      secondaryColor: defaultColors[template].secondary,
      fontFamily: 'Inter',
      fontSize: 'medium',
      spacing: 'normal',
      borderRadius: 'small'
    });
  };

  const handleCustomizationChange = (newCustomizations: CustomizationOptions) => {
    setCustomizations(newCustomizations);
  };

  const handleSaveCustomizations = () => {
    // TODO: Save customizations to backend/localStorage
    toast({
      title: "Customizations Saved",
      description: "Your resume customizations have been saved successfully.",
    });
  };

  const handleExportPDF = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement PDF export functionality
      toast({
        title: "Export Started",
        description: "Your resume is being exported as PDF...",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      // TODO: Implement share functionality
      const shareUrl = `${window.location.origin}/resume/${user?.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Resume link copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lawvriksh-navy/5 to-lawvriksh-burgundy/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-lawvriksh-navy/10 border border-lawvriksh-navy/20">
                <FileText className="h-6 w-6 text-lawvriksh-navy" />
              </div>
              <div>
                <h1 className="legal-heading text-3xl text-lawvriksh-navy">
                  Resume Builder
                </h1>
                <p className="legal-text text-lawvriksh-gray">
                  Create your professional resume with beautiful templates
                </p>
              </div>
            </div>
            
            {currentView === 'preview' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('select')}
                  className="border-lawvriksh-navy/20"
                >
                  <Layout className="mr-2 h-4 w-4" />
                  Change Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('customize')}
                  className="border-lawvriksh-navy/20"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Customize
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="border-lawvriksh-navy/20"
                >
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  onClick={handleExportPDF}
                  disabled={isLoading}
                  className="bg-lawvriksh-navy hover:bg-lawvriksh-navy/90"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="select" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Select Template
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="customize" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Customize
            </TabsTrigger>
          </TabsList>

          <TabsContent value="select">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
              onPreview={(templateId) => {
                setSelectedTemplate(templateId);
                setCurrentView('preview');
              }}
            />
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-6">
              {/* Export Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-lawvriksh-navy">Resume Preview</h3>
                  <p className="text-gray-600">Review your resume before exporting or sharing</p>
                </div>
                <div className="flex gap-3">
                  <PDFExportDialog
                    template={selectedTemplate}
                    userName={user?.fullName || 'Resume'}
                    elementId="portfolio-preview"
                  />
                  <ShareDialog
                    template={selectedTemplate}
                    userName={user?.fullName || 'Resume'}
                    userEmail={user?.email}
                  />
                </div>
              </div>

              {/* Resume Preview */}
              <ResponsiveWrapper showControls={true}>
                <div id="portfolio-preview" className="bg-white rounded-xl shadow-xl border-2 border-lawvriksh-navy/20 overflow-hidden">
                  {user && (
                    <PortfolioRenderer
                      user={user}
                      template={selectedTemplate}
                      customizations={customizations}
                    />
                  )}
                </div>
              </ResponsiveWrapper>
            </div>
          </TabsContent>

          <TabsContent value="customize">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customization Panel */}
              <div>
                <PortfolioCustomizer
                  template={selectedTemplate}
                  customizations={customizations}
                  onCustomizationChange={handleCustomizationChange}
                  onSave={handleSaveCustomizations}
                  onReset={() => resetCustomizations()}
                />
              </div>

              {/* Live Preview */}
              <div className="bg-white rounded-xl shadow-xl border-2 border-lawvriksh-navy/20 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Live Preview</h3>
                    <p className="text-sm text-gray-600">Changes will be reflected in real-time</p>
                  </div>
                  <PDFExportDialog
                    template={selectedTemplate}
                    userName={user?.fullName || 'Resume'}
                    elementId="portfolio-customize-preview"
                  >
                    <Button size="sm" variant="outline" className="border-lawvriksh-navy text-lawvriksh-navy hover:bg-lawvriksh-navy hover:text-white">
                      <Download className="mr-2 h-3 w-3" />
                      Export
                    </Button>
                  </PDFExportDialog>
                </div>
                <div id="portfolio-customize-preview" className="max-h-96 overflow-y-auto">
                  {user && (
                    <PortfolioRenderer
                      user={user}
                      template={selectedTemplate}
                      customizations={customizations}
                      className="transform scale-50 origin-top-left"
                    />
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResumeBuilder;
