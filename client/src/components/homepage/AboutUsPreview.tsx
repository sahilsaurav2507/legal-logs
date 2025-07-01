import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Scale,
  Shield,
  Award,
  Users,
  ArrowRight,
  CheckCircle,
  Target,
  Heart,
  Briefcase
} from 'lucide-react';

const AboutUsPreview = () => {
  const values = [
    {
      icon: Scale,
      title: 'Justice & Integrity',
      description: 'Unwavering commitment to ethical practice and fair representation for every client.'
    },
    {
      icon: Shield,
      title: 'Trust & Reliability',
      description: 'Building lasting relationships through consistent, dependable legal counsel.'
    },
    {
      icon: Award,
      title: 'Excellence & Expertise',
      description: 'Delivering superior legal outcomes through deep knowledge and experience.'
    },
    {
      icon: Heart,
      title: 'Client-Centered Service',
      description: 'Personalized attention and dedicated advocacy for each unique legal matter.'
    }
  ];

  const achievements = [
    'Over 25 years of distinguished legal practice',
    '500+ successful cases across multiple practice areas',
    'Recognized by leading legal publications',
    'Trusted by Fortune 500 companies',
    'Award-winning client service excellence',
    'Active in community legal education'
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Professional office background with overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3')`
          }}
        />
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23003366' fill-opacity='1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-lawvriksh-navy text-white px-8 py-3 rounded-lg text-sm font-semibold mb-8 shadow-lg">
              <Target className="w-5 h-5" />
              About LawVriksh
            </div>
            
            <h2 className="legal-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-lawvriksh-navy mb-6 sm:mb-8 tracking-tight leading-tight">
              Built on Trust, Driven by Excellence
            </h2>
            
            <div className="w-24 h-1 bg-lawvriksh-gold mx-auto mb-8"></div>
            
            <p className="legal-text text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              For over two decades, LawVriksh has been the cornerstone of legal excellence, 
              providing comprehensive legal solutions with unwavering commitment to our clients' success.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            {/* Mission & Vision */}
            <div>
              <h3 className="legal-heading text-2xl md:text-3xl font-bold text-lawvriksh-navy mb-6">
                Our Mission
              </h3>
              <p className="legal-text text-lg text-gray-700 mb-8 leading-relaxed">
                To provide exceptional legal services that protect our clients' interests while 
                upholding the highest standards of professional integrity. We believe that every 
                legal challenge is an opportunity to demonstrate our commitment to justice and excellence.
              </p>
              
              <h3 className="legal-heading text-2xl md:text-3xl font-bold text-lawvriksh-navy mb-6">
                Our Vision
              </h3>
              <p className="legal-text text-lg text-gray-700 mb-8 leading-relaxed">
                To be the most trusted legal partner for individuals and businesses, known for our 
                innovative approach, deep expertise, and unwavering dedication to achieving the best 
                possible outcomes for our clients.
              </p>

              {/* Key Achievements */}
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <CheckCircle className="h-5 w-5 text-lawvriksh-gold flex-shrink-0" />
                    <span className="legal-text text-gray-700 font-medium">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Values Cards */}
            <div>
              <h3 className="legal-heading text-2xl md:text-3xl font-bold text-lawvriksh-navy mb-8">
                Our Core Values
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <Card key={index} className="border border-gray-200 shadow-lg">
                    <CardContent className="p-6">
                      <div className="inline-flex p-3 rounded-lg bg-lawvriksh-navy/10 mb-4">
                        <value.icon className="w-6 h-6 text-lawvriksh-navy" />
                      </div>
                      <h4 className="legal-heading text-lg font-bold text-lawvriksh-navy mb-3">
                        {value.title}
                      </h4>
                      <p className="legal-text text-gray-600 text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Leadership Preview */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-16">
            <div className="text-center mb-12">
              <h3 className="legal-heading text-3xl font-bold text-lawvriksh-navy mb-4">
                Distinguished Leadership
              </h3>
              <p className="legal-text text-gray-600 text-lg max-w-2xl mx-auto">
                Our experienced team of legal professionals brings decades of combined expertise 
                across multiple practice areas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Placeholder for leadership team - using placeholder content */}
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-16 h-16 text-gray-500" />
                </div>
                <h4 className="legal-heading text-xl font-bold text-lawvriksh-navy mb-2">
                  Senior Partner
                </h4>
                <p className="legal-text text-gray-600 mb-4">Managing Partner & Lead Counsel</p>
                <p className="legal-text text-sm text-gray-500">
                  25+ years of experience in corporate law and litigation
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Briefcase className="w-16 h-16 text-gray-500" />
                </div>
                <h4 className="legal-heading text-xl font-bold text-lawvriksh-navy mb-2">
                  Associate Partner
                </h4>
                <p className="legal-text text-gray-600 mb-4">Litigation & Dispute Resolution</p>
                <p className="legal-text text-sm text-gray-500">
                  15+ years specializing in commercial litigation
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Scale className="w-16 h-16 text-gray-500" />
                </div>
                <h4 className="legal-heading text-xl font-bold text-lawvriksh-navy mb-2">
                  Senior Associate
                </h4>
                <p className="legal-text text-gray-600 mb-4">Corporate & Regulatory Affairs</p>
                <p className="legal-text text-sm text-gray-500">
                  12+ years in corporate compliance and regulatory law
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="legal-heading text-3xl font-bold text-lawvriksh-navy mb-6">
              Ready to Experience Legal Excellence?
            </h3>
            <p className="legal-text text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover how our commitment to excellence and client-focused approach can serve your legal needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-lawvriksh-navy text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg">
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-lawvriksh-navy text-lawvriksh-navy px-8 py-4 text-lg font-semibold rounded-lg">
                <Link to="/contact">
                  Schedule Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsPreview;
