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
  Star,
  Zap,
  Target
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CreativeGradientTemplateProps {
  user: User;
  className?: string;
}

const CreativeGradientTemplate: React.FC<CreativeGradientTemplateProps> = ({ user, className }) => {
  // Parse skills with proficiency levels
  const getSkillsWithLevels = () => {
    return [
      { name: 'Legal Research', level: 95 },
      { name: 'Contract Analysis', level: 90 },
      { name: 'Client Relations', level: 88 },
      { name: 'Case Management', level: 92 },
      { name: 'Legal Writing', level: 85 },
      { name: 'Litigation Support', level: 87 },
      { name: 'Regulatory Compliance', level: 83 },
      { name: 'Negotiation', level: 89 }
    ];
  };

  // Parse work experience with achievements
  const getWorkExperience = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - (user.yearsOfExperience || 3);
    
    return [
      {
        title: `Senior ${user.lawSpecialization || 'Legal'} Specialist`,
        company: user.organization || 'Legal Innovation Firm',
        duration: `${startYear + 1} - Present`,
        location: user.location || 'New York, NY',
        achievements: [
          `Led ${user.lawSpecialization?.toLowerCase() || 'legal'} initiatives resulting in 40% efficiency improvement`,
          'Managed portfolio of 50+ high-value clients with 98% satisfaction rate',
          'Developed innovative legal strategies that reduced case resolution time by 35%',
          'Mentored junior legal professionals and contributed to team growth'
        ]
      },
      {
        title: `${user.lawSpecialization || 'Legal'} Associate`,
        company: user.organization || 'Progressive Law Group',
        duration: `${startYear - 1} - ${startYear + 1}`,
        location: user.location || 'New York, NY',
        achievements: [
          'Specialized in complex legal research and case analysis',
          'Built comprehensive legal documentation systems',
          'Collaborated with cross-functional teams on major cases',
          'Achieved 95% success rate in case preparations'
        ]
      }
    ];
  };

  const skillsWithLevels = getSkillsWithLevels();
  const workExperience = getWorkExperience();

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden", className)}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-r from-yellow-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <Avatar className="w-40 h-40 border-4 border-white/20 shadow-2xl backdrop-blur-sm">
              <AvatarImage src={user.profilePhoto} alt={user.fullName} />
              <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {user.fullName}
          </h1>
          <p className="text-2xl text-purple-200 font-medium mb-6 tracking-wide">
            {user.lawSpecialization?.toUpperCase() || 'LEGAL INNOVATOR'}
          </p>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-purple-100 leading-relaxed">
              {user.bio || `Innovative legal professional with ${user.yearsOfExperience || 'several'} years of experience in ${user.lawSpecialization?.toLowerCase() || 'legal practice'}. Passionate about leveraging technology and creative solutions to deliver exceptional legal services and drive meaningful outcomes for clients.`}
            </p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {user.phoneNumber && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Phone</p>
                  <p className="text-white font-medium">{user.phoneNumber}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-500 rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-purple-200 text-sm">Email</p>
                <p className="text-white font-medium text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {user.location && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Location</p>
                  <p className="text-white font-medium">{user.location}</p>
                </div>
              </div>
            </div>
          )}

          {user.linkedinUrl && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-purple-200 text-sm">LinkedIn</p>
                  <p className="text-white font-medium">Profile</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-12">
            {/* Skills Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Core Skills</h2>
              </div>
              
              <div className="space-y-6">
                {skillsWithLevels.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-purple-100 font-medium">{skill.name}</span>
                      <span className="text-cyan-300 text-sm font-bold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Education</h2>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-4 border-gradient-to-b from-green-400 to-teal-500 pl-6">
                  <h3 className="text-xl font-bold text-white mb-2">Juris Doctor (J.D.)</h3>
                  <p className="text-purple-200 mb-2">{user.education || 'Prestigious Law School'}</p>
                  <p className="text-purple-300 text-sm">
                    {new Date().getFullYear() - (user.yearsOfExperience || 3)} - {new Date().getFullYear() - (user.yearsOfExperience || 3) + 3}
                  </p>
                </div>
                
                {user.barExamStatus === 'Passed' && (
                  <div className="border-l-4 border-gradient-to-b from-yellow-400 to-orange-500 pl-6">
                    <h3 className="text-xl font-bold text-white mb-2">Bar Examination</h3>
                    <p className="text-purple-200 mb-2">{user.location || 'State'} Bar - Passed</p>
                    <p className="text-purple-300 text-sm">
                      {new Date().getFullYear() - (user.yearsOfExperience || 2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-12">
            {/* Experience Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-red-500 rounded-xl flex items-center justify-center">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Experience</h2>
              </div>
              
              <div className="space-y-8">
                {workExperience.map((job, index) => (
                  <div key={index} className="relative">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                      <p className="text-cyan-300 font-medium mb-1">{job.company}</p>
                      <div className="flex items-center gap-4 text-sm text-purple-200">
                        <span>{job.duration}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {job.achievements.map((achievement, achievementIndex) => (
                        <div key={achievementIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-purple-100 text-sm leading-relaxed">{achievement}</p>
                        </div>
                      ))}
                    </div>
                    
                    {index < workExperience.length - 1 && (
                      <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Key Achievements</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl p-6 border border-green-400/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="h-5 w-5 text-green-400" />
                    <h3 className="font-bold text-white">Excellence Award</h3>
                  </div>
                  <p className="text-green-100 text-sm">Outstanding performance in {user.lawSpecialization?.toLowerCase() || 'legal practice'}</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-400/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="h-5 w-5 text-blue-400" />
                    <h3 className="font-bold text-white">Client Satisfaction</h3>
                  </div>
                  <p className="text-blue-100 text-sm">98% client satisfaction rate across all cases</p>
                </div>
                
                <div className="bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-2xl p-6 border border-pink-400/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="h-5 w-5 text-pink-400" />
                    <h3 className="font-bold text-white">Innovation Leader</h3>
                  </div>
                  <p className="text-pink-100 text-sm">Pioneered digital transformation initiatives</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {user.linkedinUrl && (
          <div className="text-center mt-16">
            <a 
              href={user.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20 hover:bg-white/20 transition-all duration-300 text-white font-medium"
            >
              <ExternalLink className="h-5 w-5" />
              Connect on LinkedIn
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeGradientTemplate;
