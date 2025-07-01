import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Share, 
  Copy, 
  Link, 
  Code,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  CheckCircle,
  ExternalLink,
  Globe
} from 'lucide-react';
import { TemplateType } from '@/pages/DigitalPortfolio';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ShareDialogProps {
  template: TemplateType;
  userName: string;
  userEmail?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  template,
  userName,
  userEmail,
  className,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Generate share URL and embed code
  useEffect(() => {
    if (isOpen) {
      const baseUrl = window.location.origin;
      const portfolioId = generatePortfolioId(userName, template);
      const url = `${baseUrl}/portfolio/${portfolioId}`;
      const embed = `<iframe src="${url}?embed=true" width="800" height="1000" frameborder="0" scrolling="auto"></iframe>`;
      
      setShareUrl(url);
      setEmbedCode(embed);
    }
  }, [isOpen, userName, template]);

  const generatePortfolioId = (name: string, template: TemplateType): string => {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${cleanName}-${template}`;
  };

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      toast({
        title: "Copied!",
        description: `${item} copied to clipboard.`,
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const shareOnSocialMedia = (platform: string) => {
    const text = `Check out my professional portfolio: ${userName}`;
    const url = shareUrl;
    
    let shareUrl_platform = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl_platform = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl_platform = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl_platform = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl_platform = `mailto:?subject=${encodeURIComponent(`Portfolio: ${userName}`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
        break;
    }
    
    if (shareUrl_platform) {
      window.open(shareUrl_platform, '_blank', 'width=600,height=400');
    }
  };

  const getTemplateInfo = (template: TemplateType) => {
    const info = {
      'modern-blue': { name: 'Modern Blue', color: 'blue' },
      'elegant-rose': { name: 'Elegant Rose', color: 'rose' },
      'professional-dark': { name: 'Professional Dark', color: 'gray' },
      'creative-gradient': { name: 'Creative Gradient', color: 'purple' }
    };
    return info[template];
  };

  const templateInfo = getTemplateInfo(template);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className={cn("border-lawvriksh-navy text-lawvriksh-navy hover:bg-lawvriksh-navy hover:text-white", className)}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Share Your Portfolio
          </DialogTitle>
          <DialogDescription>
            Share your professional portfolio with others or embed it on your website.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Portfolio Info */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{userName}</p>
              <p className="text-sm text-gray-600">{templateInfo.name} Template</p>
            </div>
            <Badge variant="outline" className={`bg-${templateInfo.color}-50 text-${templateInfo.color}-700 border-${templateInfo.color}-200`}>
              {template}
            </Badge>
          </div>

          {/* Share URL */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Portfolio URL</Label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(shareUrl, 'URL')}
                className="flex-shrink-0"
              >
                {copiedItem === 'URL' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Anyone with this link can view your portfolio
            </p>
          </div>

          {/* Social Media Sharing */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Share on Social Media</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => shareOnSocialMedia('linkedin')}
                className="justify-start"
              >
                <Linkedin className="mr-2 h-4 w-4 text-blue-600" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                onClick={() => shareOnSocialMedia('twitter')}
                className="justify-start"
              >
                <Twitter className="mr-2 h-4 w-4 text-blue-400" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => shareOnSocialMedia('facebook')}
                className="justify-start"
              >
                <Facebook className="mr-2 h-4 w-4 text-blue-700" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => shareOnSocialMedia('email')}
                className="justify-start"
              >
                <Mail className="mr-2 h-4 w-4 text-gray-600" />
                Email
              </Button>
            </div>
          </div>

          <Separator />

          {/* Embed Code */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Embed Code</Label>
            <div className="space-y-2">
              <Textarea
                value={embedCode}
                readOnly
                className="font-mono text-xs resize-none"
                rows={3}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Copy this code to embed your portfolio on any website
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(embedCode, 'Embed Code')}
                >
                  {copiedItem === 'Embed Code' ? (
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  ) : (
                    <Code className="mr-2 h-4 w-4" />
                  )}
                  Copy Code
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Link */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => window.open(shareUrl, '_blank')}
              className="w-full"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview Portfolio
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
