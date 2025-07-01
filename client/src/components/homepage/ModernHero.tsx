import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  Scale,
  ArrowRight,
  Shield,
  Award,
  Gavel,
  Building
} from 'lucide-react';

const ProfessionalHero = () => {
  const { isAuthenticated, user } = useAuth();

  const practiceAreas = [
    {
      icon: Scale,
      title: 'Corporate Law',
      description: 'Comprehensive corporate legal services and business advisory'
    },
    {
      icon: Gavel,
      title: 'Litigation',
      description: 'Expert representation in civil and commercial disputes'
    },
    {
      icon: Building,
      title: 'Real Estate',
      description: 'Property transactions and real estate legal solutions'
    },
    {
      icon: Shield,
      title: 'Compliance',
      description: 'Regulatory compliance and risk management services'
    }
  ];

  const stats = [
    { number: '25+', label: 'Years Experience', icon: Award },
    { number: '500+', label: 'Cases Won', icon: Scale },
    { number: '100+', label: 'Corporate Clients', icon: Building },
    { number: '98%', label: 'Success Rate', icon: Shield }
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center">
      {/* Professional Background with High-Quality Legal Image */}
      <div className="absolute inset-0">
        {/* Professional legal office background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/herosection.jpg')`
          }}
        />

        {/* Navy blue gradient overlay for professional look and text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-lawvriksh-navy/90 via-lawvriksh-navy-dark/85 to-lawvriksh-navy/90"></div>

        {/* Subtle professional pattern overlay - no animation */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />

        {/* Static professional legal elements - no animation */}
        <div className="absolute top-1/4 right-1/3 opacity-[0.06]">
          <Scale className="w-64 h-64 text-white" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 opacity-[0.04]">
          <Gavel className="w-48 h-48 text-white" />
        </div>
        <div className="absolute top-1/2 right-10 opacity-[0.03]">
          <Building className="w-56 h-56 text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Professional Header Badge */}
          <div className="flex justify-center mb-12">
            <Badge className="bg-lawvriksh-gold text-lawvriksh-navy border-lawvriksh-gold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-xs sm:text-sm font-semibold shadow-lg">
              <Award className="w-4 h-4 mr-3" />
              Trusted Legal Excellence Since 1998
            </Badge>
          </div>

          {/* Professional Main Headline with EB Garamond */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6 sm:mb-8">
              <img
                src="/LawVriksh.png"
                alt="LawVriksh"
                className="h-20 sm:h-24 md:h-32 lg:h-40 w-auto"
              />
            </div>

            <div className="w-24 h-1 bg-lawvriksh-gold mx-auto mb-8"></div>

            <p className="legal-heading text-xl md:text-2xl lg:text-3xl text-gray-100 max-w-4xl mx-auto mb-4 leading-relaxed font-light">
              Rooted in Excellence, Growing Your Trust
            </p>

            <p className="legal-text text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed">
              A distinguished law firm committed to delivering exceptional legal services
              with unwavering integrity, deep expertise, and personalized attention to every client.
            </p>

            {/* Professional CTA Buttons - no hover animations */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              {!isAuthenticated ? (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="bg-lawvriksh-gold text-lawvriksh-navy px-12 py-4 text-lg font-semibold rounded-lg shadow-lg"
                  >
                    <Link to="/contact">
                      Request a Consultation
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white text-white px-12 py-4 text-lg font-semibold rounded-lg"
                  >
                    <Link to="/about">
                      Learn More
                    </Link>
                  </Button>
                </>
              ) : (
                <Button
                  asChild
                  size="lg"
                  className="bg-lawvriksh-gold text-lawvriksh-navy px-12 py-4 text-lg font-semibold rounded-lg shadow-lg"
                >
                  <Link to={user?.role === 'User' ? '/dashboard' : '/editor-dashboard'}>
                    Go to Dashboard
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Practice Areas - Clean Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {practiceAreas.map((area, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 shadow-lg"
              >
                <div className="inline-flex p-4 rounded-lg bg-lawvriksh-gold/20 mb-6">
                  <area.icon className="w-8 h-8 text-lawvriksh-gold" />
                </div>
                <h3 className="legal-heading text-xl font-semibold text-white mb-4">{area.title}</h3>
                <p className="legal-text text-gray-200 leading-relaxed">{area.description}</p>
              </div>
            ))}
          </div>

          {/* Professional Stats Section - No animations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-4 rounded-full bg-white/[0.08] border border-white/[0.1] mb-6 shadow-lg backdrop-blur-sm">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                  {stat.number}
                </div>
                <div className="legal-text text-gray-300 text-base font-medium tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalHero;
