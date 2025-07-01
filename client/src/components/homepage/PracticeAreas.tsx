import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Scale,
  Building,
  Users,
  Shield,
  Gavel,
  FileText,
  Home,
  Briefcase,
  ArrowRight,
  Target,
  Globe,
  Heart
} from 'lucide-react';

const PracticeAreas = () => {
  const practiceAreas = [
    {
      icon: Scale,
      title: 'Corporate Law',
      description: 'Comprehensive corporate legal services including mergers, acquisitions, compliance, and business formation.',
      features: [
        'Business Formation & Structure',
        'Mergers & Acquisitions',
        'Corporate Governance',
        'Securities & Finance'
      ],
      href: '/practice-areas/corporate-law'
    },
    {
      icon: Gavel,
      title: 'Civil Litigation',
      description: 'Expert representation in complex civil disputes, commercial litigation, and dispute resolution.',
      features: [
        'Commercial Disputes',
        'Contract Litigation',
        'Employment Law',
        'Alternative Dispute Resolution'
      ],
      href: '/practice-areas/litigation'
    },
    {
      icon: Building,
      title: 'Real Estate Law',
      description: 'Complete real estate legal services for residential, commercial, and industrial properties.',
      features: [
        'Property Transactions',
        'Commercial Real Estate',
        'Zoning & Land Use',
        'Real Estate Litigation'
      ],
      href: '/practice-areas/real-estate'
    },
    {
      icon: Shield,
      title: 'Regulatory Compliance',
      description: 'Navigate complex regulatory environments with expert compliance and risk management counsel.',
      features: [
        'Regulatory Advisory',
        'Compliance Programs',
        'Government Relations',
        'Risk Assessment'
      ],
      href: '/practice-areas/compliance'
    },
    {
      icon: Users,
      title: 'Employment Law',
      description: 'Comprehensive employment law services for both employers and employees.',
      features: [
        'Employment Contracts',
        'Workplace Policies',
        'Discrimination Claims',
        'Labor Relations'
      ],
      href: '/practice-areas/employment'
    },
    {
      icon: FileText,
      title: 'Intellectual Property',
      description: 'Protect and monetize your intellectual property assets with strategic legal counsel.',
      features: [
        'Patent & Trademark',
        'Copyright Protection',
        'Trade Secrets',
        'IP Litigation'
      ],
      href: '/practice-areas/intellectual-property'
    },
    {
      icon: Home,
      title: 'Family Law',
      description: 'Compassionate legal representation for family matters and domestic relations.',
      features: [
        'Divorce & Separation',
        'Child Custody',
        'Adoption Services',
        'Prenuptial Agreements'
      ],
      href: '/practice-areas/family-law'
    },
    {
      icon: Heart,
      title: 'Estate Planning',
      description: 'Comprehensive estate planning and wealth preservation strategies for individuals and families.',
      features: [
        'Wills & Trusts',
        'Estate Administration',
        'Tax Planning',
        'Probate Services'
      ],
      href: '/practice-areas/estate-planning'
    }
  ];

  const specializations = [
    {
      icon: Globe,
      title: 'International Law',
      description: 'Cross-border legal expertise for global business operations'
    },
    {
      icon: Briefcase,
      title: 'Business Advisory',
      description: 'Strategic legal counsel for business growth and operations'
    },
    {
      icon: Target,
      title: 'Risk Management',
      description: 'Proactive legal strategies to minimize business risks'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gray-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23003366' fill-opacity='1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-lawvriksh-navy text-white px-8 py-3 rounded-lg text-sm font-semibold mb-8 shadow-lg">
              <Scale className="w-5 h-5" />
              Practice Areas
            </div>
            
            <h2 className="legal-heading text-4xl md:text-5xl lg:text-6xl font-bold text-lawvriksh-navy mb-8 tracking-tight leading-tight">
              Comprehensive Legal Solutions
            </h2>
            
            <div className="w-24 h-1 bg-lawvriksh-gold mx-auto mb-8"></div>
            
            <p className="legal-text text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Our experienced attorneys provide expert legal counsel across a wide range of practice areas, 
              delivering tailored solutions for individuals, businesses, and organizations.
            </p>
          </div>

          {/* Practice Areas Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20">
            {practiceAreas.map((area, index) => (
              <Card key={index} className="border border-gray-200 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="inline-flex p-4 rounded-lg bg-lawvriksh-navy/10 mb-6">
                    <area.icon className="w-8 h-8 text-lawvriksh-navy" />
                  </div>
                  
                  <h3 className="legal-heading text-xl font-bold text-lawvriksh-navy mb-4">
                    {area.title}
                  </h3>
                  
                  <p className="legal-text text-gray-600 mb-6 leading-relaxed">
                    {area.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {area.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="legal-text text-sm text-gray-500 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-lawvriksh-gold rounded-full flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild variant="outline" className="w-full border-lawvriksh-navy text-lawvriksh-navy">
                    <Link to={area.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Specializations */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-16">
            <div className="text-center mb-12">
              <h3 className="legal-heading text-3xl font-bold text-lawvriksh-navy mb-4">
                Additional Specializations
              </h3>
              <p className="legal-text text-gray-600 text-lg max-w-2xl mx-auto">
                Beyond our core practice areas, we offer specialized expertise in emerging legal fields 
                and cross-disciplinary matters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {specializations.map((spec, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 rounded-full bg-lawvriksh-navy/10 mb-6">
                    <spec.icon className="w-8 h-8 text-lawvriksh-navy" />
                  </div>
                  <h4 className="legal-heading text-xl font-bold text-lawvriksh-navy mb-3">
                    {spec.title}
                  </h4>
                  <p className="legal-text text-gray-600">
                    {spec.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="legal-heading text-3xl font-bold text-lawvriksh-navy mb-6">
              Need Legal Assistance?
            </h3>
            <p className="legal-text text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
              Our experienced attorneys are ready to provide the expert legal counsel you need. 
              Contact us today to discuss your specific legal requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-lawvriksh-navy text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg">
                <Link to="/contact">
                  Schedule Consultation
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-lawvriksh-navy text-lawvriksh-navy px-8 py-4 text-lg font-semibold rounded-lg">
                <Link to="/practice-areas">
                  View All Practice Areas
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PracticeAreas;
