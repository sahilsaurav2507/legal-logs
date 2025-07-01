import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  FileText,
  StickyNote,
  Briefcase,
  GraduationCap,
  Users,
  Search,
  Star,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Award,
  Target,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  href: string;
  badge?: string;
  gradient: string;
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
  features,
  href,
  badge,
  gradient,
  delay = 0
}) => {
  return (
    <Card className="border-2 border-gray-100 bg-white shadow-lg">
      <CardHeader className="pb-6">
        <div className="flex items-start justify-between mb-6">
          <div className={cn(
            "p-5 rounded-3xl shadow-lg border border-gray-200",
            `bg-gradient-to-br ${gradient}`
          )}>
            <Icon className="h-10 w-10 text-white" />
          </div>
          {badge && (
            <Badge className="bg-lawvriksh-navy text-white font-bold px-3 py-1 text-xs">
              {badge}
            </Badge>
          )}
        </div>

        <CardTitle className="legal-heading text-2xl font-bold text-lawvriksh-navy tracking-tight leading-tight">
          {title}
        </CardTitle>

        <CardDescription className="legal-text text-gray-700 leading-relaxed text-lg font-medium">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-4 text-base text-gray-700 font-medium">
              <CheckCircle className="h-5 w-5 text-lawvriksh-gold flex-shrink-0" />
              <span className="legal-text">{feature}</span>
            </li>
          ))}
        </ul>

        <Button asChild className="w-full bg-lawvriksh-navy text-white font-semibold py-3 rounded-xl shadow-lg text-lg">
          <Link to={href}>
            Explore Service
            <ArrowRight className="ml-3 h-5 w-5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const ServiceShowcase = () => {
  const services = [
    {
      icon: BookOpen,
      title: 'Legal Publications',
      description: 'Access a comprehensive library of legal content including blog posts, articles, and expert insights.',
      features: [
        'Expert-authored blog posts',
        'Legal analysis and commentary',
        'Industry news and updates',
        'Professional insights'
      ],
      href: '/blogs',
      badge: 'Popular',
      gradient: 'from-blue-600 to-blue-800'
    },
    {
      icon: FileText,
      title: 'Research Papers',
      description: 'Discover scholarly research, academic papers, and in-depth legal studies from leading institutions.',
      features: [
        'Peer-reviewed research',
        'Academic publications',
        'Case study analysis',
        'Legal scholarship'
      ],
      href: '/research',
      gradient: 'from-green-600 to-green-800'
    },
    {
      icon: StickyNote,
      title: 'Professional Notes',
      description: 'Quick insights, tips, and professional knowledge shared by experienced legal practitioners.',
      features: [
        'Practice tips and tricks',
        'Quick legal insights',
        'Professional advice',
        'Community knowledge'
      ],
      href: '/notes',
      gradient: 'from-purple-600 to-purple-800'
    },
    {
      icon: Briefcase,
      title: 'Job Opportunities',
      description: 'Find your next career opportunity with our comprehensive job board for legal professionals.',
      features: [
        'Full-time positions',
        'Contract opportunities',
        'Remote work options',
        'Career advancement'
      ],
      href: '/jobs',
      badge: 'Hot',
      gradient: 'from-orange-600 to-orange-800'
    },
    {
      icon: GraduationCap,
      title: 'Internships',
      description: 'Launch your legal career with internship opportunities at top law firms and organizations.',
      features: [
        'Summer internships',
        'Part-time positions',
        'Mentorship programs',
        'Skill development'
      ],
      href: '/internships',
      gradient: 'from-indigo-600 to-indigo-800'
    },
    {
      icon: Search,
      title: 'Global Search',
      description: 'Powerful search capabilities across all content types to find exactly what you need.',
      features: [
        'Cross-platform search',
        'Advanced filters',
        'Relevant results',
        'Quick discovery'
      ],
      href: '/search',
      gradient: 'from-gray-600 to-gray-800'
    }
  ];

  const platformFeatures = [
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Enterprise-grade security protecting your professional data'
    },
    {
      icon: Users,
      title: 'Professional Network',
      description: 'Connect with 10,000+ legal professionals worldwide'
    },
    {
      icon: Award,
      title: 'Quality Content',
      description: 'Curated and verified content from industry experts'
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast platform built for professional use'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-white via-gray-50/30 to-white relative overflow-hidden">
      {/* Sophisticated background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm20 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Professional Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-lawvriksh-navy text-white px-8 py-3 rounded-lg text-sm font-bold mb-8 shadow-lg">
            <Target className="w-5 h-5" />
            Professional Services
          </div>
          <h2 className="legal-heading text-5xl md:text-6xl font-bold text-lawvriksh-navy mb-8 tracking-tight leading-tight">
            Everything You Need for Legal Excellence
          </h2>
          <div className="w-24 h-1 bg-lawvriksh-gold mx-auto mb-8" />
          <p className="legal-text text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto font-light leading-relaxed">
            From cutting-edge research to exclusive career opportunities, LawVriksh provides comprehensive
            resources for every stage of your distinguished legal journey.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              {...service}
              delay={0}
            />
          ))}
        </div>

        {/* Platform Features */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="legal-heading text-3xl font-bold text-lawvriksh-navy mb-4 tracking-tight">
              Why Choose LawVriksh?
            </h3>
            <p className="legal-text text-gray-600 text-lg">
              Built by legal professionals, for legal professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-4 rounded-2xl bg-lawvriksh-navy mb-4 shadow-lg">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="legal-heading text-lg font-bold text-lawvriksh-navy mb-2 tracking-tight">
                  {feature.title}
                </h4>
                <p className="legal-text text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-lawvriksh-navy rounded-2xl p-8 md:p-12 text-white shadow-lg">
            <h3 className="legal-heading text-3xl font-bold mb-4 tracking-tight">
              Ready to Elevate Your Legal Career?
            </h3>
            <p className="legal-text text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of legal professionals who trust LawVriksh for their career development
              and professional growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-lawvriksh-gold text-lawvriksh-navy font-semibold">
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white">
                <Link to="/blogs">
                  Explore Content
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceShowcase;
