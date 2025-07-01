import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  FileText,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  GraduationCap,
  Building,
  Scale,
  Shield,
  ExternalLink,
  Download,
  BarChart3,
  Clock,
  Star,
  Users,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { contributorApi } from '@/services/api';
import { MetricCard, CredentialItem, ProfileSection } from '@/components/contributor';

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

const ContributorProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<ContributorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has access (editor or admin only)
  const hasAccess = user && (user.role === UserRole.EDITOR || user.role === UserRole.ADMIN);

  useEffect(() => {
    if (!hasAccess) {
      return;
    }

    // Fetch contributor statistics
    fetchContributorStats();
  }, [hasAccess]);

  const fetchContributorStats = async () => {
    try {
      setIsLoading(true);
      const response = await contributorApi.getStats();
      setStats(response);
    } catch (error) {
      console.error('Error fetching contributor stats:', error);
      toast({
        title: "Error",
        description: "Failed to load contributor statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Access control - redirect if not authorized
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md mx-auto border-2 border-red-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-800 legal-heading">Access Restricted</CardTitle>
            <CardDescription className="text-red-600">
              This page is only accessible to editors and administrators.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/dashboard">
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lawvriksh-navy mx-auto mb-4"></div>
          <p className="text-lawvriksh-gray legal-text">Loading contributor profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-lawvriksh-gold/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-lawvriksh-navy shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="legal-heading text-3xl md:text-4xl font-bold text-lawvriksh-navy">
                Contributor Profile
              </h1>
              <p className="legal-text text-lawvriksh-gray mt-1">
                Professional digital presence and contribution showcase
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="border-2 border-lawvriksh-navy/20 shadow-xl bg-white">
              <CardHeader className="text-center pb-6 bg-gradient-to-br from-lawvriksh-navy/5 to-lawvriksh-gold/5">
                <div className="relative mx-auto mb-4">
                  <Avatar className="w-32 h-32 border-4 border-lawvriksh-navy/20 shadow-lg">
                    <AvatarImage src={user?.profilePhoto} alt={user?.fullName} />
                    <AvatarFallback className="text-2xl font-bold bg-lawvriksh-navy text-white">
                      {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 p-2 bg-lawvriksh-gold rounded-full border-4 border-white shadow-lg">
                    <Award className="h-4 w-4 text-lawvriksh-navy" />
                  </div>
                </div>
                <CardTitle className="legal-heading text-2xl text-lawvriksh-navy mb-2">
                  {user?.fullName}
                </CardTitle>
                <div className="flex justify-center mb-3">
                  <Badge 
                    variant="outline" 
                    className="border-lawvriksh-navy text-lawvriksh-navy bg-lawvriksh-navy/5 px-3 py-1"
                  >
                    {user?.role}
                  </Badge>
                </div>
                <CardDescription className="legal-text text-lawvriksh-gray">
                  {user?.practiceArea}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Contact Information */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-lawvriksh-navy" />
                      <span className="legal-text text-lawvriksh-gray">{user?.email}</span>
                    </div>
                    {user?.phoneNumber && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-lawvriksh-navy" />
                        <span className="legal-text text-lawvriksh-gray">{user?.phoneNumber}</span>
                      </div>
                    )}
                    {user?.location && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-lawvriksh-navy" />
                        <span className="legal-text text-lawvriksh-gray">{user?.location}</span>
                      </div>
                    )}
                    {stats && (
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-lawvriksh-navy" />
                        <span className="legal-text text-lawvriksh-gray">
                          Joined {new Date(stats.joinDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Credentials Card */}
            <ProfileSection
              title="Legal Credentials"
              icon={Scale}
              variant="navy"
            >
              <div className="space-y-4">
                {user?.lawSpecialization && (
                  <CredentialItem
                    icon={Award}
                    label="Specialization"
                    value={user.lawSpecialization}
                  />
                )}
                {user?.education && (
                  <CredentialItem
                    icon={GraduationCap}
                    label="Education"
                    value={user.education}
                  />
                )}
                {user?.barExamStatus && (
                  <CredentialItem
                    icon={Shield}
                    label="Bar Exam Status"
                    value={user.barExamStatus}
                    type="badge"
                    badgeVariant={user.barExamStatus === 'Passed' ? 'success' : 'warning'}
                  />
                )}
                {user?.licenseNumber && (
                  <CredentialItem
                    icon={FileText}
                    label="License Number"
                    value={user.licenseNumber}
                    type="text"
                  />
                )}
                {user?.organization && (
                  <CredentialItem
                    icon={Building}
                    label="Organization"
                    value={user.organization}
                  />
                )}
                {user?.yearsOfExperience && (
                  <CredentialItem
                    icon={Clock}
                    label="Experience"
                    value={`${user.yearsOfExperience} ${user.yearsOfExperience === 1 ? 'year' : 'years'}`}
                  />
                )}
                {user?.linkedinUrl && (
                  <CredentialItem
                    icon={ExternalLink}
                    label="LinkedIn"
                    value="View Profile"
                    type="link"
                    href={user.linkedinUrl}
                  />
                )}
              </div>
            </ProfileSection>
          </div>

          {/* Right Column - Contribution Metrics and Bio */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            {user?.bio && (
              <ProfileSection
                title="Professional Bio"
                icon={User}
                variant="gold"
              >
                <p className="legal-text text-lawvriksh-gray leading-relaxed">
                  {user.bio}
                </p>
              </ProfileSection>
            )}

            {/* Contribution Statistics */}
            {stats && (
              <ProfileSection
                title="Platform Contributions"
                description="Your impact and engagement metrics"
                icon={BarChart3}
                variant="navy"
              >
                {/* Primary Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <MetricCard
                    title="Blog Posts"
                    value={stats.totalBlogPosts}
                    icon={FileText}
                    variant="navy"
                  />
                  <MetricCard
                    title="Notes Shared"
                    value={stats.totalNotes}
                    icon={BookOpen}
                    variant="burgundy"
                  />
                  <MetricCard
                    title="Total Views"
                    value={stats.totalViews}
                    icon={Eye}
                    variant="gold"
                  />
                  <MetricCard
                    title="Likes Received"
                    value={stats.totalLikes}
                    icon={Heart}
                    variant="green"
                  />
                </div>

                <Separator className="my-6" />

                {/* Secondary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Share2 className="h-5 w-5 text-lawvriksh-navy" />
                    <div>
                      <div className="font-semibold text-lawvriksh-navy">{stats.totalShares}</div>
                      <div className="text-sm legal-text text-lawvriksh-gray">Shares</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <MessageCircle className="h-5 w-5 text-lawvriksh-navy" />
                    <div>
                      <div className="font-semibold text-lawvriksh-navy">{stats.totalComments}</div>
                      <div className="text-sm legal-text text-lawvriksh-gray">Comments</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Star className="h-5 w-5 text-lawvriksh-gold" />
                    <div>
                      <div className="font-semibold text-lawvriksh-navy">{stats.featuredContent}</div>
                      <div className="text-sm legal-text text-lawvriksh-gray">Featured</div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Activity Timeline */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lawvriksh-navy legal-heading">Activity Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="legal-text text-lawvriksh-gray">Published Content:</span>
                      <span className="font-semibold text-lawvriksh-navy">{stats.publishedContent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="legal-text text-lawvriksh-gray">Last Active:</span>
                      <span className="font-semibold text-lawvriksh-navy">
                        {new Date(stats.lastActive).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </ProfileSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorProfile;
