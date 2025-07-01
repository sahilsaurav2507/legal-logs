import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TemplateType } from '@/pages/DigitalPortfolio';

interface ExportOptions {
  filename?: string;
  quality?: number;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}

interface ExportProgress {
  stage: 'preparing' | 'capturing' | 'generating' | 'complete';
  progress: number;
  message: string;
}

export class PortfolioPDFExporter {
  private onProgress?: (progress: ExportProgress) => void;

  constructor(onProgress?: (progress: ExportProgress) => void) {
    this.onProgress = onProgress;
  }

  private updateProgress(stage: ExportProgress['stage'], progress: number, message: string) {
    if (this.onProgress) {
      this.onProgress({ stage, progress, message });
    }
  }

  async exportToPDF(
    elementId: string,
    template: TemplateType,
    userName: string,
    options: ExportOptions = {}
  ): Promise<void> {
    const {
      filename = `${userName.replace(/\s+/g, '_')}_Portfolio_${template}.pdf`,
      quality = 2,
      format = 'a4',
      orientation = 'portrait'
    } = options;

    try {
      this.updateProgress('preparing', 10, 'Preparing portfolio for export...');

      // Get the portfolio element
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Portfolio element not found');
      }

      // Prepare element for capture
      await this.prepareElementForCapture(element);
      
      this.updateProgress('capturing', 30, 'Capturing portfolio content...');

      // Configure html2canvas options based on template
      const canvasOptions = this.getCanvasOptions(template, quality);
      
      // Capture the element as canvas
      const canvas = await html2canvas(element, canvasOptions);
      
      this.updateProgress('generating', 70, 'Generating PDF document...');

      // Create PDF
      const pdf = this.createPDF(canvas, format, orientation);
      
      this.updateProgress('complete', 100, 'Download starting...');

      // Download the PDF
      pdf.save(filename);

      // Cleanup
      await this.cleanupAfterCapture(element);

    } catch (error) {
      console.error('PDF export failed:', error);
      throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async prepareElementForCapture(element: HTMLElement): Promise<void> {
    // Ensure all images are loaded
    const images = element.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(true);
        } else {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true); // Continue even if image fails
        }
      });
    });

    await Promise.all(imagePromises);

    // Add print-specific styles
    element.style.transform = 'scale(1)';
    element.style.transformOrigin = 'top left';
    
    // Ensure proper dimensions
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.width === 'auto' || computedStyle.width === '0px') {
      element.style.width = '1200px'; // Default width for capture
    }
  }

  private async cleanupAfterCapture(element: HTMLElement): Promise<void> {
    // Remove any temporary styles
    element.style.transform = '';
    element.style.transformOrigin = '';
    element.style.width = '';
  }

  private getCanvasOptions(template: TemplateType, quality: number): any {
    const baseOptions = {
      scale: quality,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      removeContainer: true,
    };

    // Template-specific optimizations
    switch (template) {
      case 'creative-gradient':
        return {
          ...baseOptions,
          backgroundColor: '#1a1a2e', // Dark background for gradients
          scale: Math.max(quality, 2), // Higher quality for gradients
        };
      
      case 'professional-dark':
        return {
          ...baseOptions,
          backgroundColor: '#1f2937',
        };
      
      case 'elegant-rose':
        return {
          ...baseOptions,
          backgroundColor: '#ffffff',
        };
      
      case 'modern-blue':
      default:
        return {
          ...baseOptions,
          backgroundColor: '#ffffff',
        };
    }
  }

  private createPDF(canvas: HTMLCanvasElement, format: string, orientation: string): jsPDF {
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // PDF dimensions
    const pdfDimensions = this.getPDFDimensions(format, orientation);
    const pdf = new jsPDF({
      orientation: orientation as 'portrait' | 'landscape',
      unit: 'mm',
      format: format as 'a4' | 'letter'
    });

    // Calculate scaling to fit content
    const canvasAspectRatio = canvas.width / canvas.height;
    const pdfAspectRatio = pdfDimensions.width / pdfDimensions.height;

    let imgWidth = pdfDimensions.width;
    let imgHeight = pdfDimensions.height;

    if (canvasAspectRatio > pdfAspectRatio) {
      // Canvas is wider than PDF
      imgHeight = imgWidth / canvasAspectRatio;
    } else {
      // Canvas is taller than PDF
      imgWidth = imgHeight * canvasAspectRatio;
    }

    // Center the image
    const x = (pdfDimensions.width - imgWidth) / 2;
    const y = (pdfDimensions.height - imgHeight) / 2;

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

    return pdf;
  }

  private getPDFDimensions(format: string, orientation: string) {
    const dimensions = {
      a4: { width: 210, height: 297 },
      letter: { width: 216, height: 279 }
    };

    const dim = dimensions[format as keyof typeof dimensions] || dimensions.a4;
    
    if (orientation === 'landscape') {
      return { width: dim.height, height: dim.width };
    }
    
    return dim;
  }
}

// Utility function for quick export
export const exportPortfolioToPDF = async (
  elementId: string,
  template: TemplateType,
  userName: string,
  options?: ExportOptions,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> => {
  const exporter = new PortfolioPDFExporter(onProgress);
  return exporter.exportToPDF(elementId, template, userName, options);
};

// Utility function to check if PDF export is supported
export const isPDFExportSupported = (): boolean => {
  try {
    // Check if required APIs are available
    return !!(
      window.HTMLCanvasElement &&
      document.createElement('canvas').getContext &&
      window.URL &&
      window.URL.createObjectURL
    );
  } catch {
    return false;
  }
};

// Utility function to estimate export time
export const estimateExportTime = (template: TemplateType, quality: number): number => {
  // Base time in seconds
  let baseTime = 3;
  
  // Template complexity factor
  const complexityFactors = {
    'modern-blue': 1,
    'elegant-rose': 1.2,
    'professional-dark': 1.1,
    'creative-gradient': 1.5 // More complex due to gradients and animations
  };
  
  // Quality factor
  const qualityFactor = quality * 0.5;
  
  return Math.round(baseTime * complexityFactors[template] * qualityFactor);
};

export type { ExportOptions, ExportProgress };
