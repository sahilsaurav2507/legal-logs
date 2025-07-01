import React from 'react';
import { User } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Award, 
  Building, 
  ExternalLink,
  Calendar,
  Shield
} from 'lucide-react';

interface ModernBlueTemplateProps {
  user: User;
  className?: string;
}

const ModernBlueTemplate: React.FC<ModernBlueTemplateProps> = ({ user, className }) => {
  // Parse skills from bio or create default skills
  const getSkills = () => {
    // This could be enhanced to parse from a dedicated skills field
    return [
      'Legal Research',
      'Contract Analysis', 
      'Client Consultation',
      'Case Management',
      'Legal Writing',
      'Litigation Support'
    ];
  };

  // Parse work experience (this would ideally come from a dedicated field)
  const getWorkExperience = () => {
    return [
      {
        company: user.organization || 'Legal Organization',
        position: `${user.lawSpecialization || 'Legal'} Professional`,
        duration: `${new Date().getFullYear() - (user.yearsOfExperience || 1)} - Present`,
        description: [
          'Specialized in ' + (user.lawSpecialization || 'legal matters'),
          'Provided expert legal consultation and analysis',
          'Managed complex cases and client relationships'
        ]
      }
    ];
  };

  const skills = getSkills();
  const workExperience = getWorkExperience();

  return (
    <div className={cn("bg-white min-h-screen", className)}>
      <div className="flex">
        {/* Left Sidebar - Blue Section */}
        <div className="w-1/3 bg-gradient-to-b from-blue-600 to-blue-700 text-white p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 font-serif italic">
              {user.fullName}
            </h1>
            <p className="text-blue-100 text-lg">
              {user.lawSpecialization || 'Legal Professional'}
            </p>
            <div className="mt-4 space-y-2 text-sm">
              {user.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{user.phoneNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5" />
              <h2 className="text-xl font-bold">Skills:</h2>
            </div>
            <ul className="space-y-3 text-sm">
              {skills.map((skill, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{skill}</span>
                </li>
              ))}
              <li className="text-blue-200 text-xs italic mt-4">
                Include 6 to 8 skills, no more than 10
              </li>
              <li className="text-blue-200 text-xs italic">
                Hard skills: tools, software, etc. needed, like CRM or Python
              </li>
              <li className="text-blue-200 text-xs italic">
                Soft skills: not easy to measure, like communication or empathetic
              </li>
              <li className="text-blue-200 text-xs italic">
                Include "keywords," skills you find mentioned in the job ad
              </li>
              <li className="text-blue-200 text-xs italic">
                Be honest; exaggerating your abilities will eventually be found out
              </li>
              <li className="text-blue-200 text-xs italic">
                Make sure your skills are represented in your work experience
              </li>
            </ul>
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5" />
              <h2 className="text-xl font-bold">Education:</h2>
            </div>
            <div className="text-sm space-y-2">
              <p className="font-semibold">
                {user.education || 'Law Degree'}
              </p>
              <p className="text-blue-200 italic text-xs">
                (if you have a college degree, don't include a high school diploma)
              </p>
              <p className="font-medium">Degree earned</p>
              <p className="text-blue-200">Years attended | {user.location || 'City, State'}</p>
            </div>
          </div>

          {/* Certifications/Licenses */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5" />
              <h2 className="text-xl font-bold">Certifications/Licenses:</h2>
            </div>
            <div className="text-sm space-y-2">
              {user.barExamStatus === 'Passed' && (
                <p>• Bar Examination - Passed</p>
              )}
              {user.licenseNumber && (
                <p>• License #{user.licenseNumber}</p>
              )}
              <p className="text-blue-200 text-xs italic mt-3">
                Be sure to stay on top of this as certifications and licenses can 
                differ between states and even across jobs in the same industry.
              </p>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-8">
          {/* Summary Statement */}
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              {user.bio || `A summary statement is 2-3 sentences that provides a brief synopsis of your work experience and skills. You might use this if you have a few years of experience. An objective, on the other hand, is a focused 2-3-sentence statement that demonstrates your interest and candidacy for the position you hope to land. You might use an objective if you're changing careers, a student or entry-level candidate, or if you're going to take the time to write a compelling, custom objective.`}
            </p>
          </div>

          {/* Work Experience */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Building className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-blue-600">Work Experience:</h2>
            </div>
            
            {workExperience.map((job, index) => (
              <div key={index} className="mb-6">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-blue-600">
                    {job.company} / {user.location || 'Location'} 
                    <span className="text-gray-600 italic ml-2">({job.duration})</span>
                  </h3>
                  <p className="font-semibold text-gray-800">{job.position}</p>
                </div>
                
                <ul className="space-y-2 text-sm text-gray-700">
                  {job.description.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start">
                      <span className="mr-2 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                
                {index === 0 && (
                  <div className="mt-4 text-xs text-gray-500 space-y-1">
                    <p>• Focus on your contributions, not your responsibilities. For example, "Grew digital marketing ROI by 14%" is much better than saying, "Led digital marketing efforts."</p>
                    <p>• Start your job description bullet points with active verbs rather than personal pronouns. For instance, "Designed and implemented work ticketing system" propels your content forward while "I designed and implemented work ticketing system" slows the recruiter.</p>
                  </div>
                )}
              </div>
            ))}

            {/* Additional Experience Placeholder */}
            <div className="mb-6">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-blue-600">
                  {user.organization || 'Previous Organization'} / {user.location || 'Location'} 
                  <span className="text-gray-600 italic ml-2">(dates of employment)</span>
                </h3>
                <p className="font-semibold text-gray-800">Job title</p>
              </div>
              
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Quantify your impact whenever possible because numbers corroborate your claims. Stating that you "Uncovered $3.2M in potential savings" shows a real result over a generic claim like "Discovered potential savings."</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Keep your bullet point descriptions at three lines or under. "Created nutrition and personal training plans for 30+ clients, helping clients lose 26 pounds on average" is a lot more compelling than a run-on sentence, redundancies, or wordiness.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Write your job descriptions in the past tense, though you can write current experience in the present tense if you wish. "Partnered with cross-functional teams to design multimedia campaigns that boosted subscriptions by 17%" will make a lot more sense to a recruiter when you left that role three years ago.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Professional Links */}
          {user.linkedinUrl && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <a 
                href={user.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                LinkedIn Profile
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernBlueTemplate;
