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
  Calendar
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ElegantRoseTemplateProps {
  user: User;
  className?: string;
}

const ElegantRoseTemplate: React.FC<ElegantRoseTemplateProps> = ({ user, className }) => {
  // Parse skills from user data
  const getSkills = () => {
    return [
      'Legal Research',
      'Contract Analysis',
      'Client Relations',
      'Case Management',
      'Legal Writing',
      'Litigation Support',
      'Regulatory Compliance',
      'Negotiation'
    ];
  };

  // Parse work experience
  const getWorkExperience = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - (user.yearsOfExperience || 2);
    
    return [
      {
        title: `${user.lawSpecialization || 'Legal'} Professional`,
        company: user.organization || 'Legal Firm',
        duration: `${startYear} - Present`,
        description: [
          `Specialized in ${user.lawSpecialization?.toLowerCase() || 'legal matters'} and client consultation`,
          'Built comprehensive legal strategies for complex cases and regulatory compliance',
          'Managed client relationships and provided expert legal guidance across multiple practice areas'
        ]
      },
      {
        title: 'Legal Associate',
        company: user.organization || 'Previous Legal Firm',
        duration: `${startYear - 2} - ${startYear}`,
        description: [
          `Specialized in ${user.lawSpecialization?.toLowerCase() || 'legal research'} and case analysis`,
          'Built foundational expertise in legal research and client communication',
          'Supported senior attorneys in case preparation and legal documentation'
        ]
      }
    ];
  };

  const skills = getSkills();
  const workExperience = getWorkExperience();

  return (
    <div className={cn("bg-white min-h-screen", className)}>
      {/* Header with geometric design */}
      <div className="relative bg-gradient-to-r from-rose-100 via-white to-blue-100 p-8">
        {/* Geometric shapes */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-rose-400 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 opacity-10 transform rotate-45 translate-x-24 -translate-y-24"></div>
        
        <div className="relative flex items-start gap-8 max-w-6xl mx-auto">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
              <AvatarImage src={user.profilePhoto} alt={user.fullName} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-rose-400 to-rose-600 text-white">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Header Content */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-rose-600 mb-2 font-serif">
              {user.fullName}
            </h1>
            <p className="text-xl text-gray-700 font-medium mb-4 tracking-wide">
              {user.lawSpecialization?.toUpperCase() || 'LEGAL PROFESSIONAL'}
            </p>
            <p className="text-gray-600 leading-relaxed max-w-2xl">
              {user.bio || `I am a qualified and professional legal expert with ${user.yearsOfExperience || 'several'} years of experience in ${user.lawSpecialization?.toLowerCase() || 'legal practice'} and client consultation. Strong creative and analytical skills. Team player with an eye for detail.`}
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex-shrink-0 space-y-3 text-sm">
            {user.phoneNumber && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4 text-rose-600" />
                </div>
                <span className="text-gray-700">{user.phoneNumber}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4 text-rose-600" />
              </div>
              <span className="text-gray-700">{user.email}</span>
            </div>
            {user.location && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-rose-600" />
                </div>
                <span className="text-gray-700">{user.location}</span>
              </div>
            )}
            {user.linkedinUrl && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                  <Globe className="h-4 w-4 text-rose-600" />
                </div>
                <span className="text-gray-700">LinkedIn Profile</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Skills */}
            <div>
              <div className="bg-rose-200 text-rose-800 px-4 py-2 rounded-lg mb-4">
                <h2 className="font-bold text-lg">SKILLS</h2>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {skills.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-rose-600">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education */}
            <div>
              <div className="bg-rose-200 text-rose-800 px-4 py-2 rounded-lg mb-4">
                <h2 className="font-bold text-lg">EDUCATION</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <h3 className="font-bold text-gray-800">LAW DEGREE</h3>
                  <p className="text-gray-600">{user.education || 'Law School'}</p>
                  <p className="text-gray-500">
                    {new Date().getFullYear() - (user.yearsOfExperience || 3)} - {new Date().getFullYear() - (user.yearsOfExperience || 3) + 3}
                  </p>
                </div>
                {user.barExamStatus === 'Passed' && (
                  <div>
                    <h3 className="font-bold text-gray-800">BAR EXAMINATION</h3>
                    <p className="text-gray-600">Passed - {user.location || 'State'} Bar</p>
                    <p className="text-gray-500">
                      {new Date().getFullYear() - (user.yearsOfExperience || 2)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="bg-rose-200 text-rose-800 px-4 py-2 rounded-lg mb-4">
                <h2 className="font-bold text-lg">LANGUAGE</h2>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p>English</p>
                <p>Spanish</p>
                <p>German</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience */}
            <div>
              <div className="bg-blue-200 text-blue-800 px-4 py-2 rounded-lg mb-6">
                <h2 className="font-bold text-lg">EXPERIENCE</h2>
              </div>
              
              {workExperience.map((job, index) => (
                <div key={index} className="mb-8">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-blue-700 uppercase">
                      {job.title}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      {job.company} <span className="text-gray-500 italic">({job.duration})</span>
                    </p>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-gray-700">
                    {job.description.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start">
                        <span className="mr-2 text-blue-600 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Additional Experience Section */}
            <div>
              <div className="mb-3">
                <h3 className="text-lg font-bold text-blue-700 uppercase">
                  LEGAL RESEARCH ANALYST
                </h3>
                <p className="text-blue-600 font-medium">
                  {user.organization || 'Legal Research Firm'} <span className="text-gray-500 italic">(2018 - 2020)</span>
                </p>
              </div>
              
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600 mt-1">•</span>
                  <span>Conducted comprehensive legal research and analysis for complex litigation cases</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600 mt-1">•</span>
                  <span>Prepared detailed legal memoranda and case summaries for senior attorneys</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600 mt-1">•</span>
                  <span>Collaborated with legal teams to develop case strategies and client presentations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Professional Links */}
        {user.linkedinUrl && (
          <div className="mt-12 pt-6 border-t border-gray-200 text-center">
            <a 
              href={user.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              View LinkedIn Profile
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElegantRoseTemplate;
