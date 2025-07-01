import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  Settings, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { TemplateType } from '@/pages/DigitalPortfolio';
import { 
  exportPortfolioToPDF, 
  isPDFExportSupported, 
  estimateExportTime,
  ExportOptions,
  ExportProgress 
} from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PDFExportDialogProps {
  template: TemplateType;
  userName: string;
  elementId: string;
  className?: string;
  children?: React.ReactNode;
}

const PDFExportDialog: React.FC<PDFExportDialogProps> = ({
  template,
  userName,
  elementId,
  className,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    filename: `${userName.replace(/\s+/g, '_')}_Portfolio.pdf`,
    quality: 2,
    format: 'a4',
    orientation: 'portrait'
  });
  
  const { toast } = useToast();
  const isSupported = isPDFExportSupported();
  const estimatedTime = estimateExportTime(template, exportOptions.quality || 2);

  const handleExport = async () => {
    if (!isSupported) {
      toast({
        title: "Export Not Supported",
        description: "PDF export is not supported in your current browser.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    setExportProgress(null);

    try {
      await exportPortfolioToPDF(
        elementId,
        template,
        userName,
        exportOptions,
        (progress) => {
          setExportProgress(progress);
        }
      );

      toast({
        title: "Export Successful",
        description: "Your portfolio has been exported as PDF successfully.",
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export portfolio.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const getQualityLabel = (quality: number) => {
    switch (quality) {
      case 1: return 'Standard (Fast)';
      case 2: return 'High (Recommended)';
      case 3: return 'Ultra (Slow)';
      default: return 'High';
    }
  };

  const getTemplateInfo = (template: TemplateType) => {
    const info = {
      'modern-blue': { name: 'Modern Blue', complexity: 'Simple', color: 'blue' },
      'elegant-rose': { name: 'Elegant Rose', complexity: 'Medium', color: 'rose' },
      'professional-dark': { name: 'Professional Dark', complexity: 'Medium', color: 'gray' },
      'creative-gradient': { name: 'Creative Gradient', complexity: 'Complex', color: 'purple' }
    };
    return info[template];
  };

  const templateInfo = getTemplateInfo(template);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className={cn("bg-lawvriksh-navy hover:bg-lawvriksh-navy/90", className)}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Portfolio as PDF
          </DialogTitle>
          <DialogDescription>
            Configure your PDF export settings and download your professional portfolio.
          </DialogDescription>
        </DialogHeader>

        {!isSupported && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              PDF export is not supported in your current browser. Please use a modern browser like Chrome, Firefox, or Safari.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Template Info */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{templateInfo.name}</p>
              <p className="text-sm text-gray-600">Template Complexity: {templateInfo.complexity}</p>
            </div>
            <Badge variant="outline" className={`bg-${templateInfo.color}-50 text-${templateInfo.color}-700 border-${templateInfo.color}-200`}>
              {template}
            </Badge>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="filename" className="text-sm font-medium">
                Filename
              </Label>
              <Input
                id="filename"
                value={exportOptions.filename}
                onChange={(e) => setExportOptions(prev => ({ ...prev, filename: e.target.value }))}
                placeholder="Enter filename..."
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Quality</Label>
                <Select
                  value={exportOptions.quality?.toString()}
                  onValueChange={(value) => setExportOptions(prev => ({ ...prev, quality: parseInt(value) }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{getQualityLabel(1)}</SelectItem>
                    <SelectItem value="2">{getQualityLabel(2)}</SelectItem>
                    <SelectItem value="3">{getQualityLabel(3)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Format</Label>
                <Select
                  value={exportOptions.format}
                  onValueChange={(value) => setExportOptions(prev => ({ ...prev, format: value as 'a4' | 'letter' }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                    <SelectItem value="letter">Letter (8.5 × 11 in)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Orientation</Label>
              <Select
                value={exportOptions.orientation}
                onValueChange={(value) => setExportOptions(prev => ({ ...prev, orientation: value as 'portrait' | 'landscape' }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <Clock className="h-4 w-4" />
            <span>Estimated export time: ~{estimatedTime} seconds</span>
          </div>

          {/* Export Progress */}
          {isExporting && exportProgress && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {exportProgress.message}
                </span>
                <span className="text-sm text-gray-500">
                  {exportProgress.progress}%
                </span>
              </div>
              <Progress value={exportProgress.progress} className="h-2" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {exportProgress.stage === 'complete' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span className="capitalize">{exportProgress.stage}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isExporting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={!isSupported || isExporting}
              className="flex-1 bg-lawvriksh-navy hover:bg-lawvriksh-navy/90"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFExportDialog;
