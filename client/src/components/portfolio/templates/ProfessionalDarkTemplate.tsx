import React from 'react';
import { User } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  GraduationCap, 
  Award, 
  Building, 
  ExternalLink,
  Calendar,
  Shield
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfessionalDarkTemplateProps {
  user: User;
  className?: string;
}

const ProfessionalDarkTemplate: React.FC<ProfessionalDarkTemplateProps> = ({ user, className }) => {
  // Parse skills from user data
  const getSkills = () => {
    return [
      'Legal Research & Analysis',
      'Contract Negotiation',
      'Client Consultation',
      'Case Management',
      'Regulatory Compliance',
      'Legal Documentation',
      'Litigation Support',
      'Risk Assessment'
    ];
  };

  // Parse work experience
  const getWorkExperience = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - (user.yearsOfExperience || 3);
    
    return [
      {
        title: `Senior ${user.lawSpecialization || 'Legal'} Specialist`,
        company: user.organization || 'Legal Consulting Firm',
        duration: `${startYear + 2} - Present`,
        description: `Specialized in ${user.lawSpecialization?.toLowerCase() || 'legal consulting'} with ${user.yearsOfExperience || 3}+ years of experience working in fast-paced startup to Los Angeles. I'm passionate in branding and managing all aspects of digital marketing.`
      },
      {
        title: `${user.lawSpecialization || 'Legal'} Associate`,
        company: user.organization || 'Law Firm',
        duration: `${startYear} - ${startYear + 2}`,
        description: `My responsibility as a junior legal associate was to actively participate in the education of paralegals and junior staff, implementing all channels of legal research and case management.`
      },
      {
        title: 'Legal Research Assistant',
        company: 'Legal Research Institute',
        duration: `${startYear - 1} - ${startYear}`,
        description: `My responsibility as a legal research assistant was to actively participate in the education of law students and junior researchers, implementing all channels of legal research and case analysis.`
      }
    ];
  };

  // Parse expertise areas
  const getExpertise = () => {
    return [
      'Legal Research & Analysis',
      'Contract Law',
      'Corporate Compliance',
      'Client Relations',
      'Case Strategy',
      'Legal Writing',
      'Regulatory Affairs',
      'Risk Management'
    ];
  };

  const skills = getSkills();
  const workExperience = getWorkExperience();
  const expertise = getExpertise();

  return (
    <div className={cn("bg-gray-900 text-white min-h-screen", className)}>
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-gray-800 to-gray-900 p-8">
          {/* Profile Photo */}
          <div className="mb-8 text-center">
            <Avatar className="w-32 h-32 mx-auto border-4 border-gray-600 shadow-xl">
              <AvatarImage src={user.profilePhoto} alt={user.fullName} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-gray-600 to-gray-800 text-white">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-300">My Contact</h2>
            <div className="space-y-3 text-sm">
              {user.phoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{user.phoneNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="break-all">{user.email}</span>
              </div>
              {user.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.linkedinUrl && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span>LinkedIn Profile</span>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-300">Educations</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-bold text-white">LAW DEGREE</h3>
                <p className="text-gray-400">{user.education || 'Law School'}</p>
                <p className="text-gray-500">
                  {new Date().getFullYear() - (user.yearsOfExperience || 3)} - {new Date().getFullYear() - (user.yearsOfExperience || 3) + 3}
                </p>
              </div>
              {user.barExamStatus === 'Passed' && (
                <div>
                  <h3 className="font-bold text-white">BAR EXAMINATION</h3>
                  <p className="text-gray-400">State Bar Certification</p>
                  <p className="text-gray-500">
                    {new Date().getFullYear() - (user.yearsOfExperience || 2)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Expertise */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-300">Expertise</h2>
            <div className="space-y-2 text-sm">
              {expertise.map((item, index) => (
                <div key={index} className="text-gray-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-gray-100 text-gray-900 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-800 mb-2">
              {user.fullName}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {user.lawSpecialization || 'Legal Professional'}
            </p>
            <p className="text-gray-700 leading-relaxed max-w-3xl">
              {user.bio || `I am a qualified and professional legal expert with ${user.yearsOfExperience || 'several'} years of experience working in ${user.lawSpecialization?.toLowerCase() || 'legal practice'}. I'm passionate about providing excellent legal services and managing all aspects of client relations and case management.`}
            </p>
          </div>

          {/* Experiences */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Experiences</h2>
            
            {workExperience.map((job, index) => (
              <div key={index} className="mb-8">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 font-medium">
                    {job.company} | {job.duration}
                  </p>
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  {job.description}
                </p>
              </div>
            ))}
          </div>

          {/* Expertise Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Expertise</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Legal Specializations</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• {user.lawSpecialization || 'General Legal Practice'}</li>
                  <li>• Contract Law & Negotiation</li>
                  <li>• Corporate Compliance</li>
                  <li>• Regulatory Affairs</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Professional Skills</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Legal Research & Analysis</li>
                  <li>• Client Consultation</li>
                  <li>• Case Management</li>
                  <li>• Legal Documentation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Certifications */}
          {(user.barExamStatus === 'Passed' || user.licenseNumber) && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Certifications & Licenses</h2>
              <div className="space-y-3 text-sm text-gray-700">
                {user.barExamStatus === 'Passed' && (
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <span>Bar Examination - Passed ({user.location || 'State'} Bar)</span>
                  </div>
                )}
                {user.licenseNumber && (
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-gray-600" />
                    <span>Professional License #{user.licenseNumber}</span>
                  </div>
                )}
                {user.professionalMemberships && (
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-600" />
                    <span>{user.professionalMemberships}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Professional Links */}
          {user.linkedinUrl && (
            <div className="mt-12 pt-6 border-t border-gray-300">
              <a 
                href={user.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                View LinkedIn Profile
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDarkTemplate;
