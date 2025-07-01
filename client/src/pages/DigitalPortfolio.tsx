import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { contributorApi } from '../services/api';
import { UserRole } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useToast } from '../hooks/use-toast';
import {
  Shield,
  Layout,
  Settings,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  Award,
  Target,
  Users,
  Briefcase,
  GraduationCap,
  BadgeCheck,
  Star,
  Quote,
  Lightbulb,
  FileText,
  Scale,
  Building,
  Globe,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Heart,
  Share2,
  Eye,
  PenTool,
  Clock,
  Zap,
  ChevronRight,
  ArrowRight,
  Play
} from 'lucide-react';

interface ContributorStats {
  totalBlogPosts: number;
  totalNotes: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  joinDate: string;
  lastActive: string;
  featuredContent: number;
  publishedContent: number;
}

type PortfolioTemplate = 'comprehensive' | 'modern-minimal' | 'executive-profile';

interface TemplateOption {
  id: PortfolioTemplate;
  name: string;
  description: string;
  preview: string;
  features: string[];
}

const DigitalPortfolio: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<ContributorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplate | null>(null);
  const [showTemplateSelection, setShowTemplateSelection] = useState(true);

  // Check if user has access (Editor or Admin only)
  const hasAccess = user && (user.role === UserRole.EDITOR || user.role === UserRole.ADMIN);

  // Template options
  const templateOptions: TemplateOption[] = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Legal Landing',
      description: 'Complete professional landing page with services, testimonials, and detailed background',
      preview: '/api/placeholder/400/300',
      features: ['Hero Section', 'Services Showcase', 'Client Testimonials', 'Professional Background', 'Contact Integration']
    },
    {
      id: 'modern-minimal',
      name: 'Modern Minimalist',
      description: 'Clean, contemporary design focusing on essential information and visual hierarchy',
      preview: '/api/placeholder/400/300',
      features: ['Minimalist Design', 'Focus on Content', 'Professional Typography', 'Clean Layout', 'Mobile Optimized']
    },
    {
      id: 'executive-profile',
      name: 'Executive Profile',
      description: 'Corporate-style profile emphasizing leadership, achievements, and professional network',
      preview: '/api/placeholder/400/300',
      features: ['Executive Summary', 'Achievement Highlights', 'Professional Network', 'Leadership Focus', 'Corporate Aesthetic']
    }
  ];

  // Template Components
  const ComprehensiveTemplate: React.FC<{ user: any; stats: any; getInitials: any }> = ({ user, stats, getInitials }) => {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-black text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10"></div>
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Legal Professional"
              className="w-full h-full object-cover opacity-40"
            />
          </div>

          <div className="relative z-20 container mx-auto px-6 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-red-500 text-sm font-medium tracking-wider uppercase">
                    <div className="w-8 h-px bg-red-500"></div>
                    PROFESSIONAL PORTFOLIO
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    {user?.fullName || 'LEADING'}
                    <br />
                    <span className="text-red-500">LEGAL</span>
                    <br />
                    PRACTICE
                  </h1>
                  <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                    {user?.lawSpecialization || 'Legal Professional'} with expertise in delivering exceptional legal services and comprehensive solutions.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg font-semibold"
                  >
                    VIEW PORTFOLIO
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold"
                  >
                    CONTACT
                  </Button>
                </div>

                {/* Stats Preview */}
                <div className="flex items-center gap-8 pt-8 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">
                      {stats?.totalBlogPosts || 0}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">
                      Publications
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">
                      {stats?.totalViews ? Math.floor(stats.totalViews / 1000) + 'K' : '0'}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">
                      Total Views
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">
                      {user?.yearsOfExperience || '0'}+
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">
                      Years Experience
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Professional Photo */}
              <div className="relative">
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-full h-full border-2 border-red-500 z-0"></div>
                  <div className="relative z-10 bg-white p-1">
                    <Avatar className="w-full h-96 rounded-none">
                      <AvatarImage
                        src={user?.profilePhoto || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={user?.fullName}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-6xl font-bold bg-gradient-to-br from-red-500 to-red-700 text-white rounded-none">
                        {getInitials(user?.fullName || 'LP')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium tracking-wider uppercase mb-4">
                  <div className="w-8 h-px bg-red-500"></div>
                  ABOUT ME
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Professional Legal Expert
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {user?.bio || 'Dedicated legal professional committed to providing exceptional legal services and achieving favorable outcomes for clients.'}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  {user?.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Location</div>
                        <div className="text-gray-600">{user.location}</div>
                      </div>
                    </div>
                  )}
                  {user?.education && (
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Education</div>
                        <div className="text-gray-600">{user.education}</div>
                      </div>
                    </div>
                  )}
                  {user?.barExamStatus === 'Passed' && (
                    <div className="flex items-center gap-3">
                      <BadgeCheck className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Bar Status</div>
                        <div className="text-gray-600">Licensed Attorney</div>
                      </div>
                    </div>
                  )}
                  {user?.organization && (
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Organization</div>
                        <div className="text-gray-600">{user.organization}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Details</h3>
                <div className="space-y-4">
                  {user?.practiceArea && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Practice Area:</span>
                      <span className="text-gray-900">{user.practiceArea}</span>
                    </div>
                  )}
                  {user?.lawSpecialization && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Specialization:</span>
                      <span className="text-gray-900">{user.lawSpecialization}</span>
                    </div>
                  )}
                  {user?.yearsOfExperience && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Experience:</span>
                      <span className="text-gray-900">{user.yearsOfExperience}+ Years</span>
                    </div>
                  )}
                  {user?.licenseNumber && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">License:</span>
                      <span className="text-gray-900">{user.licenseNumber}</span>
                    </div>
                  )}
                  {user?.phoneNumber && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Phone:</span>
                      <span className="text-gray-900">{user.phoneNumber}</span>
                    </div>
                  )}
                  {user?.email && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="text-gray-900">{user.email}</span>
                    </div>
                  )}
                  {user?.linkedinUrl && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">LinkedIn:</span>
                      <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600">
                        View Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 text-red-500 text-sm font-medium tracking-wider uppercase mb-4">
                <div className="w-8 h-px bg-red-500"></div>
                LEGAL SERVICES
                <div className="w-8 h-px bg-red-500"></div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Comprehensive Legal Solutions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Providing expert legal counsel and representation across multiple practice areas with a commitment to excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Service Cards */}
              <div className="bg-gray-50 p-8 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                  <Scale className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Legal Consultation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Expert legal advice and strategic counsel tailored to your specific needs and circumstances.
                </p>
              </div>

              <div className="bg-gray-50 p-8 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Document Review</h3>
                <p className="text-gray-600 leading-relaxed">
                  Thorough analysis and review of legal documents to ensure compliance and protect your interests.
                </p>
              </div>

              <div className="bg-gray-50 p-8 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Client Representation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Professional representation in legal proceedings with dedicated advocacy for your case.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Background Section */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium tracking-wider uppercase mb-4">
                  <div className="w-8 h-px bg-red-500"></div>
                  PROFESSIONAL BACKGROUND
                </div>
                <h2 className="text-4xl font-bold mb-6">
                  Experience & Credentials
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  Built on a foundation of excellence, integrity, and unwavering commitment to client success.
                </p>

                <div className="space-y-6">
                  {user?.alumniInformation && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Alumni Information</h4>
                        <p className="text-gray-300">{user.alumniInformation}</p>
                      </div>
                    </div>
                  )}

                  {user?.professionalMemberships && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Professional Memberships</h4>
                        <p className="text-gray-300">{user.professionalMemberships}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Content Contributions</h4>
                      <p className="text-gray-300">
                        {stats?.totalBlogPosts || 0} published articles with {stats?.totalViews || 0} total views,
                        demonstrating thought leadership in the legal field.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white text-gray-900 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-6">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500 mb-2">
                      {stats?.totalBlogPosts || 0}
                    </div>
                    <div className="text-sm text-gray-600 uppercase tracking-wider">
                      Blog Posts
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500 mb-2">
                      {stats?.totalNotes || 0}
                    </div>
                    <div className="text-sm text-gray-600 uppercase tracking-wider">
                      Legal Notes
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500 mb-2">
                      {stats?.totalLikes || 0}
                    </div>
                    <div className="text-sm text-gray-600 uppercase tracking-wider">
                      Total Likes
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500 mb-2">
                      {stats?.totalShares || 0}
                    </div>
                    <div className="text-sm text-gray-600 uppercase tracking-wider">
                      Shares
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-red-500 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Work Together?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get in touch to discuss your legal needs and discover how we can help achieve your objectives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-red-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Schedule Consultation
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-red-500 px-8 py-4 text-lg font-semibold"
              >
                View Portfolio
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  };

  // Modern Minimalist Template
  const ModernMinimalistTemplate: React.FC<{ user: any; stats: any; getInitials: any }> = ({ user, stats, getInitials }) => {
    return (
      <div className="min-h-screen bg-white">
        {/* Clean Header */}
        <div className="bg-black text-white py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-red-500">
                  <AvatarImage
                    src={user?.profilePhoto}
                    alt={user?.fullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-red-500 to-red-700 text-white">
                    {getInitials(user?.fullName || 'LP')}
                  </AvatarFallback>
                </Avatar>
              </div>

              <h1 className="text-5xl font-light mb-4 tracking-tight">
                {user?.fullName || 'Legal Professional'}
              </h1>
              <div className="w-16 h-px bg-red-500 mx-auto mb-6"></div>
              <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                {user?.lawSpecialization || 'Legal Professional'} • {user?.location || 'Professional Practice'}
              </p>

              {/* Contact Info */}
              <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm">
                {user?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-red-500" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user?.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-red-500" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                {user?.linkedinUrl && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-red-500" />
                    <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-light text-gray-900 mb-6">About</h2>
                <div className="w-12 h-px bg-red-500 mx-auto mb-8"></div>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  {user?.bio || 'Dedicated legal professional committed to providing exceptional legal services and achieving favorable outcomes for clients through strategic counsel and comprehensive legal solutions.'}
                </p>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {user?.practiceArea && (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Scale className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Practice Area</h3>
                    <p className="text-gray-600">{user.practiceArea}</p>
                  </div>
                )}

                {user?.yearsOfExperience && (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
                    <p className="text-gray-600">{user.yearsOfExperience}+ Years</p>
                  </div>
                )}

                {user?.education && (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
                    <p className="text-gray-600">{user.education}</p>
                  </div>
                )}
              </div>

              {/* Professional Details */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user?.organization && (
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">Organization</div>
                        <div className="text-gray-600">{user.organization}</div>
                      </div>
                    </div>
                  )}

                  {user?.lawSpecialization && (
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">Specialization</div>
                        <div className="text-gray-600">{user.lawSpecialization}</div>
                      </div>
                    </div>
                  )}

                  {user?.barExamStatus === 'Passed' && (
                    <div className="flex items-center gap-3">
                      <BadgeCheck className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">Bar Status</div>
                        <div className="text-gray-600">Licensed Attorney</div>
                      </div>
                    </div>
                  )}

                  {user?.licenseNumber && (
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">License Number</div>
                        <div className="text-gray-600">{user.licenseNumber}</div>
                      </div>
                    </div>
                  )}

                  {user?.alumniInformation && (
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">Alumni</div>
                        <div className="text-gray-600">{user.alumniInformation}</div>
                      </div>
                    </div>
                  )}

                  {user?.professionalMemberships && (
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">Memberships</div>
                        <div className="text-gray-600">{user.professionalMemberships}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Contributions */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-light text-gray-900 mb-6">Content & Contributions</h2>
              <div className="w-12 h-px bg-red-500 mx-auto mb-12"></div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-light text-red-500 mb-2">
                    {stats?.totalBlogPosts || 0}
                  </div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">
                    Articles
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-light text-red-500 mb-2">
                    {stats?.totalNotes || 0}
                  </div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">
                    Notes
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-light text-red-500 mb-2">
                    {stats?.totalViews ? Math.floor(stats.totalViews / 1000) + 'K' : '0'}
                  </div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">
                    Views
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-light text-red-500 mb-2">
                    {stats?.totalLikes || 0}
                  </div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">
                    Likes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Contact */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-light mb-6">Get In Touch</h2>
            <div className="w-12 h-px bg-red-500 mx-auto mb-8"></div>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Ready to discuss your legal needs? Let's connect and explore how we can work together.
            </p>
            <Button
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 font-light"
            >
              Contact Me
            </Button>
          </div>
        </section>
      </div>
    );
  };

  // Executive Profile Template
  const ExecutiveProfileTemplate: React.FC<{ user: any; stats: any; getInitials: any }> = ({ user, stats, getInitials }) => {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Executive Header */}
        <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white">
          <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              {/* Profile Photo */}
              <div className="text-center lg:text-left">
                <Avatar className="w-48 h-48 mx-auto lg:mx-0 border-4 border-red-500 shadow-2xl">
                  <AvatarImage
                    src={user?.profilePhoto}
                    alt={user?.fullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-red-500 to-red-700 text-white">
                    {getInitials(user?.fullName || 'EP')}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Executive Info */}
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <div className="inline-block px-4 py-2 bg-red-500 text-white text-sm font-medium tracking-wider uppercase rounded">
                    {user?.lawSpecialization || 'Legal Executive'}
                  </div>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  {user?.fullName || 'Executive Profile'}
                </h1>
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  {user?.organization || 'Leading Legal Organization'} • {user?.location || 'Professional Practice'}
                </p>
                <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                  {user?.bio || 'Distinguished legal executive with extensive experience in strategic leadership, client relations, and comprehensive legal solutions. Committed to excellence and innovation in legal practice.'}
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-8 mt-8 pt-8 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {user?.yearsOfExperience || 0}+
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {stats?.totalBlogPosts || 0}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">
                      Publications
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {stats?.totalViews ? Math.floor(stats.totalViews / 1000) + 'K' : '0'}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">
                      Total Reach
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column - Key Information */}
                <div className="lg:col-span-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Executive Profile</h2>

                  <div className="space-y-6">
                    {user?.practiceArea && (
                      <div className="border-l-4 border-red-500 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-1">Practice Area</h3>
                        <p className="text-gray-600">{user.practiceArea}</p>
                      </div>
                    )}

                    {user?.education && (
                      <div className="border-l-4 border-red-500 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-1">Education</h3>
                        <p className="text-gray-600">{user.education}</p>
                      </div>
                    )}

                    {user?.barExamStatus === 'Passed' && (
                      <div className="border-l-4 border-red-500 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-1">Bar Admission</h3>
                        <p className="text-gray-600">Licensed Attorney</p>
                        {user?.licenseNumber && (
                          <p className="text-sm text-gray-500">License: {user.licenseNumber}</p>
                        )}
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        {user?.email && (
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-red-500" />
                            <span className="text-gray-600">{user.email}</span>
                          </div>
                        )}
                        {user?.phoneNumber && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-red-500" />
                            <span className="text-gray-600">{user.phoneNumber}</span>
                          </div>
                        )}
                        {user?.location && (
                          <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-red-500" />
                            <span className="text-gray-600">{user.location}</span>
                          </div>
                        )}
                        {user?.linkedinUrl && (
                          <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4 text-red-500" />
                            <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600">
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Professional Achievements */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Professional Achievements</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Leadership */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Leadership</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Demonstrated leadership in legal practice with {user?.yearsOfExperience || 'extensive'} years of experience guiding teams and clients.
                      </p>
                    </div>

                    {/* Expertise */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Specialization</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {user?.lawSpecialization || 'Comprehensive legal expertise'} with focus on delivering strategic solutions and exceptional results.
                      </p>
                    </div>

                    {/* Publications */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Publications</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {stats?.totalBlogPosts || 0} published articles with {stats?.totalViews || 0} total views, establishing thought leadership.
                      </p>
                    </div>

                    {/* Professional Network */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Recognition</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {stats?.totalLikes || 0} endorsements and {stats?.totalShares || 0} professional shares across published content.
                      </p>
                    </div>
                  </div>

                  {/* Professional Background */}
                  {(user?.alumniInformation || user?.professionalMemberships) && (
                    <div className="bg-gray-50 p-8 rounded-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Professional Background</h3>
                      <div className="space-y-4">
                        {user?.alumniInformation && (
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <GraduationCap className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Alumni Information</h4>
                              <p className="text-gray-600">{user.alumniInformation}</p>
                            </div>
                          </div>
                        )}
                        {user?.professionalMemberships && (
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <Award className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Professional Memberships</h4>
                              <p className="text-gray-600">{user.professionalMemberships}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Connect with a Legal Executive
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Ready to discuss strategic legal solutions? Let's explore how executive-level expertise can benefit your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-red-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Schedule Executive Consultation
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-red-500 px-8 py-4 text-lg font-semibold"
              >
                View Full Portfolio
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Load saved template preference
  useEffect(() => {
    const savedTemplate = localStorage.getItem('portfolioTemplate') as PortfolioTemplate;
    if (savedTemplate && templateOptions.find(t => t.id === savedTemplate)) {
      setSelectedTemplate(savedTemplate);
      setShowTemplateSelection(false);
    }
  }, []);

  useEffect(() => {
    if (hasAccess) {
      fetchContributorStats();
    }
  }, [hasAccess]);

  const fetchContributorStats = async () => {
    try {
      setLoading(true);
      const contributorStats = await contributorApi.getStats();
      setStats(contributorStats);
    } catch (error) {
      console.error('Error fetching contributor stats:', error);
      toast({
        title: "Error",
        description: "Failed to load contribution statistics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: PortfolioTemplate) => {
    setSelectedTemplate(templateId);
    localStorage.setItem('portfolioTemplate', templateId);
    setShowTemplateSelection(false);
    toast({
      title: "Template Selected",
      description: `${templateOptions.find(t => t.id === templateId)?.name} template has been applied.`,
    });
  };

  // Handle template change
  const handleChangeTemplate = () => {
    setShowTemplateSelection(true);
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lawvriksh-navy/5 to-lawvriksh-burgundy/5 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl border border-lawvriksh-navy/20 max-w-md">
          <div className="w-16 h-16 bg-lawvriksh-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-lawvriksh-burgundy" />
          </div>
          <h2 className="legal-heading text-2xl text-lawvriksh-navy mb-4">
            Access Restricted
          </h2>
          <p className="legal-text text-lawvriksh-gray mb-6">
            Digital Portfolio access is limited to Editors and Administrators only.
          </p>
          <Button
            variant="outline"
            className="border-lawvriksh-navy text-lawvriksh-navy hover:bg-lawvriksh-navy hover:text-white"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your portfolio...</p>
          </div>
        </div>
      ) : showTemplateSelection ? (
        // Template Selection Interface
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
          <div className="container mx-auto px-6 py-20">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 text-red-500 text-sm font-medium tracking-wider uppercase mb-4">
                <div className="w-8 h-px bg-red-500"></div>
                PORTFOLIO TEMPLATES
                <div className="w-8 h-px bg-red-500"></div>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Choose Your <span className="text-red-500">Professional</span> Template
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Select from three distinct professional portfolio templates, each designed to showcase your legal expertise and professional profile in a unique way.
              </p>
            </div>

            {/* Template Options */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {templateOptions.map((template) => (
                <div key={template.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors duration-300 group">
                  {/* Preview Image */}
                  <div className="aspect-video bg-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-black/60 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                          <Layout className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-white font-medium">Preview</p>
                      </div>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3">{template.name}</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">{template.description}</p>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-red-500 mb-2 uppercase tracking-wider">Features</h4>
                      <ul className="space-y-1">
                        {template.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-400 flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Select Button */}
                    <Button
                      onClick={() => handleTemplateSelect(template.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 transition-colors duration-300"
                    >
                      Select Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                You can change your template selection at any time from your portfolio page.
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                  <span>Fully Responsive</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                  <span>Professional Design</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                  <span>Complete Profile Integration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Selected Template Display
        <div className="relative">
          {/* Template Change Button */}
          <div className="fixed top-4 right-4 z-50">
            <Button
              onClick={handleChangeTemplate}
              className="bg-red-500 hover:bg-red-600 text-white shadow-lg"
              size="sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Change Template
            </Button>
          </div>

          {/* Render Selected Template */}
          {selectedTemplate === 'comprehensive' && (
            <ComprehensiveTemplate user={user} stats={stats} getInitials={getInitials} />
          )}
          {selectedTemplate === 'modern-minimal' && (
            <ModernMinimalistTemplate user={user} stats={stats} getInitials={getInitials} />
          )}
          {selectedTemplate === 'executive-profile' && (
            <ExecutiveProfileTemplate user={user} stats={stats} getInitials={getInitials} />
          )}
        </div>
      )}
    </div>
  );
};

export default DigitalPortfolio;