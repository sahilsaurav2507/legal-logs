import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Phone,
  Download,
  Calendar,
  MessageCircle,
  FileText,
  Scale,
  Shield,
  Users,
  Clock
} from 'lucide-react';

interface CTAProps {
  variant?: 'primary' | 'secondary' | 'consultation' | 'resources' | 'contact';
  className?: string;
}

const StrategicCTA: React.FC<CTAProps> = ({ variant = 'primary', className = '' }) => {
  const renderPrimaryCTA = () => (
    <div className={`bg-lawvriksh-navy rounded-2xl p-8 md:p-12 text-white shadow-lg ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-lg text-sm font-semibold mb-6">
          <Scale className="w-4 h-4" />
          Professional Legal Services
        </div>
        
        <h3 className="legal-heading text-3xl md:text-4xl font-bold mb-6 tracking-tight">
          Ready to Protect Your Interests?
        </h3>
        
        <p className="legal-text text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
          Get expert legal counsel tailored to your specific needs. Our experienced attorneys 
          are ready to provide the guidance you deserve.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button asChild size="lg" className="bg-lawvriksh-gold text-lawvriksh-navy px-8 py-4 text-lg font-semibold rounded-lg shadow-lg">
            <Link to="/contact">
              <Calendar className="mr-3 h-5 w-5" />
              Schedule Consultation
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white text-white px-8 py-4 text-lg font-semibold rounded-lg">
            <Link to="/practice-areas">
              View Practice Areas
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderConsultationCTA = () => (
    <Card className={`border-2 border-lawvriksh-navy/20 bg-gradient-to-br from-white to-gray-50 shadow-lg ${className}`}>
      <CardContent className="p-8">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-full bg-lawvriksh-navy/10 mb-6">
            <Phone className="w-8 h-8 text-lawvriksh-navy" />
          </div>
          
          <h4 className="legal-heading text-2xl font-bold text-lawvriksh-navy mb-4">
            Free Consultation
          </h4>
          
          <p className="legal-text text-gray-700 mb-6 leading-relaxed">
            Discuss your legal needs with our experienced attorneys. 
            Get personalized advice and understand your options.
          </p>
          
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-lawvriksh-gold" />
              <span>30-minute consultation</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-lawvriksh-gold" />
              <span>Confidential & secure</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
              <Users className="w-4 h-4 text-lawvriksh-gold" />
              <span>Expert legal counsel</span>
            </div>
          </div>
          
          <Button asChild className="w-full bg-lawvriksh-navy text-white font-semibold py-3 rounded-lg shadow-lg">
            <Link to="/contact">
              <Calendar className="mr-2 h-5 w-5" />
              Request Consultation
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderResourcesCTA = () => (
    <Card className={`border-2 border-lawvriksh-burgundy/20 bg-gradient-to-br from-white to-gray-50 shadow-lg ${className}`}>
      <CardContent className="p-8">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-full bg-lawvriksh-burgundy/10 mb-6">
            <Download className="w-8 h-8 text-lawvriksh-burgundy" />
          </div>
          
          <h4 className="legal-heading text-2xl font-bold text-lawvriksh-navy mb-4">
            Legal Resources
          </h4>
          
          <p className="legal-text text-gray-700 mb-6 leading-relaxed">
            Access our comprehensive library of legal guides, templates, 
            and resources to help you understand your rights.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="text-left">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <FileText className="w-4 h-4 text-lawvriksh-gold" />
                <span>Legal Guides</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4 text-lawvriksh-gold" />
                <span>Document Templates</span>
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <FileText className="w-4 h-4 text-lawvriksh-gold" />
                <span>Case Studies</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4 text-lawvriksh-gold" />
                <span>Legal Updates</span>
              </div>
            </div>
          </div>
          
          <Button asChild className="w-full bg-lawvriksh-burgundy text-white font-semibold py-3 rounded-lg shadow-lg">
            <Link to="/resources">
              <Download className="mr-2 h-5 w-5" />
              Download Resources
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderContactCTA = () => (
    <div className={`bg-gradient-to-r from-lawvriksh-navy to-lawvriksh-burgundy rounded-2xl p-8 text-white shadow-lg ${className}`}>
      <div className="text-center">
        <div className="inline-flex p-3 rounded-full bg-white/10 backdrop-blur-sm mb-4">
          <MessageCircle className="w-6 h-6" />
        </div>
        
        <h4 className="legal-heading text-xl font-bold mb-3">
          Need Legal Assistance?
        </h4>
        
        <p className="legal-text text-gray-200 mb-6 text-sm leading-relaxed">
          Our experienced attorneys are here to help. Contact us today for expert legal counsel.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="sm" className="bg-lawvriksh-gold text-lawvriksh-navy font-semibold rounded-lg">
            <Link to="/contact">
              <Phone className="mr-2 h-4 w-4" />
              Call Now
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="border-white text-white rounded-lg">
            <Link to="/contact">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSecondaryCTA = () => (
    <div className={`bg-gray-50 border-2 border-lawvriksh-navy/10 rounded-xl p-6 ${className}`}>
      <div className="text-center">
        <h4 className="legal-heading text-lg font-bold text-lawvriksh-navy mb-3">
          Explore Our Services
        </h4>
        
        <p className="legal-text text-gray-600 mb-4 text-sm">
          Discover how our legal expertise can benefit you and your business.
        </p>
        
        <Button asChild variant="outline" className="border-lawvriksh-navy text-lawvriksh-navy font-semibold">
          <Link to="/practice-areas">
            Learn More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );

  switch (variant) {
    case 'consultation':
      return renderConsultationCTA();
    case 'resources':
      return renderResourcesCTA();
    case 'contact':
      return renderContactCTA();
    case 'secondary':
      return renderSecondaryCTA();
    default:
      return renderPrimaryCTA();
  }
};

export default StrategicCTA;
