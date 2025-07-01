import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Scale,
  BookOpen,
  Users,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  ArrowRight,
  Award,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getEnabledNavigationItems } from '@/config/features';

const Footer = () => {
  const enabledFeatures = getEnabledNavigationItems();

  return (
    <footer className="relative bg-gradient-to-br from-lawvriksh-navy via-gray-900 to-black text-white overflow-hidden border-t-4 border-lawvriksh-burgundy">
      {/* Professional Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Professional legal pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Crect x='0' y='0' width='40' height='40'/%3E%3Crect x='40' y='40' width='40' height='40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        {/* Professional geometric elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/[0.02] blur-2xl" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-lawvriksh-burgundy/[0.03] blur-xl" />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-white/[0.015] blur-3xl" />

        {/* Professional legal icons */}
        <div className="absolute top-1/4 right-1/3 opacity-[0.025]">
          <Scale className="w-64 h-64 text-white" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 opacity-[0.02]">
          <Shield className="w-48 h-48 text-white" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Professional Header Section */}
        <div className="text-center mb-20">
          <div className="inline-block bg-white/[0.08] text-white px-10 py-4 text-sm font-bold mb-10 shadow-2xl backdrop-blur-md border-2 border-white/[0.15]">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-white flex items-center justify-center">
                <Award className="w-5 h-5 text-lawvriksh-navy" />
              </div>
              <span className="tracking-widest">TRUSTED LEGAL PLATFORM</span>
            </div>
          </div>
          <div className="flex justify-center mb-8">
            <img
              src="/footerlogo.png"
              alt="LawVriksh"
              className="h-16 md:h-20 w-auto"
            />
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-white to-white/40 mx-auto mb-8" />
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Empowering legal professionals with sophisticated resources, exclusive opportunities,
            and an elite community of industry leaders committed to excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <img
                src="/footerlogo.png"
                alt="LawVriksh"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-400 leading-relaxed font-light">
              The premier platform for legal professionals seeking excellence in education,
              career advancement, and professional networking.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="group p-3 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300">
                <Twitter className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="group p-3 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300">
                <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="group p-3 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300">
                <Facebook className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="group p-3 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300">
                <Instagram className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-lawvriksh-navy to-lawvriksh-burgundy shadow-2xl border-2 border-white/[0.1] flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Publications</h3>
            </div>
            <ul className="space-y-4">
              {enabledFeatures.blogPosts && (
                <li>
                  <Link to="/blogs" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Blog Posts
                  </Link>
                </li>
              )}
              {enabledFeatures.researchPapers && (
                <li>
                  <Link to="/research" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Research Papers
                  </Link>
                </li>
              )}
              {enabledFeatures.notes && (
                <li>
                  <Link to="/notes" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Professional Notes
                  </Link>
                </li>
              )}
              {enabledFeatures.courses && (
                <li>
                  <Link to="/courses" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Legal Courses
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Career Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-lawvriksh-navy to-lawvriksh-burgundy shadow-2xl border-2 border-white/[0.1] flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Career</h3>
            </div>
            <ul className="space-y-4">
              {enabledFeatures.jobs && (
                <li>
                  <Link to="/jobs" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Job Opportunities
                  </Link>
                </li>
              )}
              {enabledFeatures.internships && (
                <li>
                  <Link to="/internships" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Internships
                  </Link>
                </li>
              )}
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300">
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  Career Guidance
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300">
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  Professional Development
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-lawvriksh-navy to-lawvriksh-burgundy shadow-2xl border-2 border-white/[0.1] flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Stay Connected</h3>
            </div>
            <p className="text-gray-400 leading-relaxed font-light">
              Join our exclusive newsletter for the latest legal insights, career opportunities, and industry updates.
            </p>
            <form className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-6 py-5 bg-white/[0.05] border-2 border-white/[0.1] text-white placeholder-gray-400 focus:outline-none focus:border-white/[0.3] transition-all duration-200 backdrop-blur-md font-medium"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-2 bg-white text-lawvriksh-navy hover:bg-gray-100 px-8 py-3 font-bold transition-all duration-200 shadow-xl border-2 border-white hover:border-gray-100 tracking-wide"
                >
                  SUBSCRIBE
                </Button>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                We respect your privacy. Read our{' '}
                <a href="#" className="text-white hover:underline transition-colors font-medium">Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>

        {/* Professional Contact Information Section */}
        <div className="border-t-2 border-white/[0.1] mt-20 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 bg-white/[0.05] border-2 border-white/[0.1] group-hover:bg-white/[0.08] group-hover:border-white/[0.2] transition-all duration-200 flex items-center justify-center">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 text-lg tracking-wide">EMAIL US</h4>
                <p className="legal-text text-gray-300 font-medium">contact@lawvriksh.com</p>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 bg-white/[0.05] border-2 border-white/[0.1] group-hover:bg-white/[0.08] group-hover:border-white/[0.2] transition-all duration-200 flex items-center justify-center">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 text-lg tracking-wide">CALL US</h4>
                <p className="text-gray-300 font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 bg-white/[0.05] border-2 border-white/[0.1] group-hover:bg-white/[0.08] group-hover:border-white/[0.2] transition-all duration-200 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 text-lg tracking-wide">VISIT US</h4>
                <p className="text-gray-300 font-medium">Legal District, Professional Plaza</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/[0.1] pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center gap-3">
                <p className="text-gray-400 text-sm font-light">
                  &copy; {new Date().getFullYear()}
                </p>
                <img
                  src="/footerlogo.png"
                  alt="LawVriksh"
                  className="h-5 w-auto"
                />
                <p className="text-gray-400 text-sm font-light">
                  All rights reserved.
                </p>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield className="h-4 w-4" />
                <span>Trusted by 10,000+ Legal Professionals</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-300 font-medium">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-300 font-medium">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-300 font-medium">
                Cookie Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-300 font-medium">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
