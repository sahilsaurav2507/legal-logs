import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  BookOpen,
  FileText,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Globe,
  Award,
  Clock,
  Star,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ElementType;
  number: string;
  label: string;
  description: string;
  gradient: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  number,
  label,
  description,
  gradient,
  delay = 0
}) => {
  return (
    <Card className="border-2 border-gray-100 bg-white shadow-lg">
      <CardContent className="p-10 text-center">
        <div className={cn(
          "inline-flex p-5 rounded-3xl mb-8 shadow-lg border border-gray-200",
          `bg-gradient-to-br ${gradient}`
        )}>
          <Icon className="h-10 w-10 text-white" />
        </div>

        <div className="text-5xl md:text-6xl font-black text-lawvriksh-navy mb-4 tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          {number}
        </div>

        <h3 className="legal-heading text-xl font-bold text-lawvriksh-navy mb-3 tracking-tight">
          {label}
        </h3>

        <p className="legal-text text-gray-700 text-base font-medium leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: '10K+',
      label: 'Legal Professionals',
      description: 'Active members in our growing community',
      gradient: 'from-blue-600 to-blue-800'
    },
    {
      icon: BookOpen,
      number: '2.5K+',
      label: 'Blog Posts',
      description: 'Expert insights and legal analysis',
      gradient: 'from-green-600 to-green-800'
    },
    {
      icon: FileText,
      number: '1.2K+',
      label: 'Research Papers',
      description: 'Scholarly publications and studies',
      gradient: 'from-purple-600 to-purple-800'
    },
    {
      icon: Briefcase,
      number: '500+',
      label: 'Job Opportunities',
      description: 'Active positions across all practice areas',
      gradient: 'from-orange-600 to-orange-800'
    },
    {
      icon: GraduationCap,
      number: '300+',
      label: 'Internships',
      description: 'Opportunities for aspiring lawyers',
      gradient: 'from-indigo-600 to-indigo-800'
    },
    {
      icon: TrendingUp,
      number: '95%',
      label: 'Success Rate',
      description: 'Members finding career opportunities',
      gradient: 'from-red-600 to-red-800'
    }
  ];

  const achievements = [
    {
      icon: Award,
      title: 'Industry Recognition',
      description: 'Trusted by top law firms and legal institutions'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Serving legal professionals across 50+ countries'
    },
    {
      icon: Clock,
      title: '24/7 Access',
      description: 'Round-the-clock access to legal resources'
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Curated content from verified legal experts'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100/50 relative overflow-hidden">
      {/* Sophisticated background pattern */}
      <div className="absolute inset-0 opacity-[0.01]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M50 50c0-13.807-11.193-25-25-25s-25 11.193-25 25 11.193 25 25 25 25-11.193 25-25zm25 0c0 13.807 11.193 25 25 25s25-11.193 25-25-11.193-25-25-25-25 11.193-25 25z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Professional Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-lawvriksh-navy text-white px-8 py-3 rounded-lg text-sm font-bold mb-8 shadow-lg">
            <Target className="w-5 h-5" />
            Platform Excellence
          </div>
          <h2 className="legal-heading text-5xl md:text-6xl font-bold text-lawvriksh-navy mb-8 tracking-tight leading-tight">
            Trusted by Legal Professionals Worldwide
          </h2>
          <div className="w-24 h-1 bg-lawvriksh-gold mx-auto mb-8" />
          <p className="legal-text text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto font-light leading-relaxed">
            Join a distinguished community of legal professionals who rely on LawVriksh
            for career advancement, knowledge sharing, and professional excellence.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              {...stat}
              delay={0}
            />
          ))}
        </div>

        {/* Achievements Section */}
        <div className="bg-lawvriksh-navy rounded-3xl p-8 md:p-12 text-white shadow-lg">
          <div className="text-center mb-12">
            <h3 className="legal-heading text-3xl font-bold mb-4 tracking-tight">
              Why Legal Professionals Choose LawVriksh
            </h3>
            <p className="legal-text text-gray-200 text-lg max-w-2xl mx-auto">
              Our commitment to excellence has made us the preferred platform
              for legal professionals seeking growth and opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-sm mb-4 shadow-lg">
                  <achievement.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="legal-heading text-lg font-bold mb-2 tracking-tight">
                  {achievement.title}
                </h4>
                <p className="legal-text text-gray-200 text-sm">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Metrics */}
        
      </div>
    </section>
  );
};

export default StatsSection;
