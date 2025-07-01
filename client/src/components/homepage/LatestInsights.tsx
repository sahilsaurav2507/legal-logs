import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  FileText,
  StickyNote,
  ArrowRight,
  Calendar,
  User,
  Clock,
  TrendingUp,
  Award,
  Scale
} from 'lucide-react';

const LatestInsights = () => {
  // Placeholder content for blog posts
  const blogPosts = [
    {
      id: 1,
      title: 'Understanding Corporate Compliance in 2024',
      excerpt: 'Navigate the evolving landscape of corporate compliance requirements and best practices for modern businesses.',
      category: 'Corporate Law',
      author: 'Senior Partner',
      date: '2024-01-15',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      featured: true
    },
    {
      id: 2,
      title: 'Recent Changes in Employment Law',
      excerpt: 'Key updates to employment regulations and their impact on workplace policies and procedures.',
      category: 'Employment Law',
      author: 'Associate Partner',
      date: '2024-01-12',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      featured: false
    },
    {
      id: 3,
      title: 'Real Estate Market Legal Considerations',
      excerpt: 'Essential legal factors to consider in today\'s dynamic real estate market environment.',
      category: 'Real Estate',
      author: 'Senior Associate',
      date: '2024-01-10',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      featured: false
    }
  ];

  // Placeholder content for case notes
  const caseNotes = [
    {
      id: 1,
      title: 'Landmark Corporate Governance Decision',
      summary: 'Analysis of recent court ruling on corporate board responsibilities and fiduciary duties.',
      category: 'Corporate Law',
      date: '2024-01-14',
      impact: 'High'
    },
    {
      id: 2,
      title: 'Employment Discrimination Precedent',
      summary: 'New precedent established in workplace discrimination case with broad implications.',
      category: 'Employment Law',
      date: '2024-01-11',
      impact: 'Medium'
    },
    {
      id: 3,
      title: 'Intellectual Property Rights Update',
      summary: 'Recent developments in IP protection and enforcement strategies.',
      category: 'IP Law',
      date: '2024-01-09',
      impact: 'High'
    }
  ];

  // Placeholder content for research papers
  const researchPapers = [
    {
      id: 1,
      title: 'The Future of Legal Technology',
      abstract: 'Comprehensive analysis of emerging technologies and their impact on legal practice.',
      authors: 'LawVriksh Research Team',
      date: '2024-01-08',
      pages: 45
    },
    {
      id: 2,
      title: 'Regulatory Compliance Trends',
      abstract: 'In-depth study of evolving compliance requirements across industries.',
      authors: 'Compliance Practice Group',
      date: '2024-01-05',
      pages: 32
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23003366' fill-opacity='1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-lawvriksh-navy text-white px-8 py-3 rounded-lg text-sm font-semibold mb-8 shadow-lg">
              <TrendingUp className="w-5 h-5" />
              Latest Insights
            </div>
            
            <h2 className="legal-heading text-4xl md:text-5xl lg:text-6xl font-bold text-lawvriksh-navy mb-8 tracking-tight leading-tight">
              Legal Expertise & Insights
            </h2>
            
            <div className="w-24 h-1 bg-lawvriksh-gold mx-auto mb-8"></div>
            
            <p className="legal-text text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Stay informed with our latest legal insights, case analyses, and expert commentary 
              on current legal developments affecting businesses and individuals.
            </p>
          </div>

          {/* Featured Blog Posts */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-12">
              <h3 className="legal-heading text-3xl font-bold text-lawvriksh-navy">
                Featured Articles
              </h3>
              <Button asChild variant="outline" className="border-lawvriksh-navy text-lawvriksh-navy">
                <Link to="/blogs">
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogPosts.map((post, index) => (
                <Card key={post.id} className={`border border-gray-200 shadow-lg bg-white ${index === 0 ? 'lg:col-span-2' : ''}`}>
                  <CardContent className="p-0">
                    {/* Professional Legal Image */}
                    <div className={`relative overflow-hidden ${index === 0 ? 'h-64' : 'h-48'}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-lawvriksh-navy/10"></div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Badge className="bg-lawvriksh-navy/10 text-lawvriksh-navy">
                          {post.category}
                        </Badge>
                        {post.featured && (
                          <Badge className="bg-lawvriksh-gold text-lawvriksh-navy">
                            <Award className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <h4 className={`legal-heading font-bold text-lawvriksh-navy mb-3 ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                        {post.title}
                      </h4>
                      
                      <p className="legal-text text-gray-600 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>
                      
                      <Button asChild variant="outline" className="w-full border-lawvriksh-navy text-lawvriksh-navy">
                        <Link to={`/blogs/${post.id}`}>
                          Read Article
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Case Notes and Research Papers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Case Notes */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="legal-heading text-2xl font-bold text-lawvriksh-navy flex items-center gap-3">
                  <Scale className="w-6 h-6" />
                  Case Notes
                </h3>
                <Button asChild variant="outline" size="sm" className="border-lawvriksh-navy text-lawvriksh-navy">
                  <Link to="/notes">
                    View All
                  </Link>
                </Button>
              </div>

              <div className="space-y-6">
                {caseNotes.map((note) => (
                  <Card key={note.id} className="border border-gray-200 bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-lawvriksh-navy/10 text-lawvriksh-navy">
                          {note.category}
                        </Badge>
                        <Badge className={getImpactColor(note.impact)}>
                          {note.impact} Impact
                        </Badge>
                      </div>
                      
                      <h4 className="legal-heading text-lg font-bold text-lawvriksh-navy mb-3">
                        {note.title}
                      </h4>
                      
                      <p className="legal-text text-gray-600 mb-4 text-sm leading-relaxed">
                        {note.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(note.date).toLocaleDateString()}
                        </div>
                        <Button asChild variant="ghost" size="sm" className="text-lawvriksh-navy">
                          <Link to={`/notes/${note.id}`}>
                            Read More
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Research Papers */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="legal-heading text-2xl font-bold text-lawvriksh-navy flex items-center gap-3">
                  <FileText className="w-6 h-6" />
                  Research Papers
                </h3>
                <Button asChild variant="outline" size="sm" className="border-lawvriksh-navy text-lawvriksh-navy">
                  <Link to="/research">
                    View All
                  </Link>
                </Button>
              </div>

              <div className="space-y-6">
                {researchPapers.map((paper) => (
                  <Card key={paper.id} className="border border-gray-200 bg-white">
                    <CardContent className="p-6">
                      <h4 className="legal-heading text-lg font-bold text-lawvriksh-navy mb-3">
                        {paper.title}
                      </h4>
                      
                      <p className="legal-text text-gray-600 mb-4 text-sm leading-relaxed">
                        {paper.abstract}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {paper.authors}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(paper.date).toLocaleDateString()}
                          </div>
                          <span>{paper.pages} pages</span>
                        </div>
                      </div>
                      
                      <Button asChild variant="outline" className="w-full border-lawvriksh-navy text-lawvriksh-navy">
                        <Link to={`/research/${paper.id}`}>
                          Download Paper
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestInsights;
