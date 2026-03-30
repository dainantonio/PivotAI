import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Mail, 
  Linkedin, 
  Layout, 
  Download, 
  Copy, 
  ExternalLink, 
  Check,
  Sparkles,
  ArrowRight,
  Printer,
  FileDown,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService, ParsedProfile, RoleMatch, ResumeRewriteResult } from '../services/aiService';

interface ResumePortfolioProps {
  profile: ParsedProfile | null;
  targetRole: RoleMatch | null;
  onNext: () => void;
  onBack: () => void;
}

type TabType = 'resume' | 'cover-letter' | 'linkedin' | 'projects';

export default function ResumePortfolio({ profile, targetRole, onNext, onBack }: ResumePortfolioProps) {
  const [activeTab, setActiveTab] = useState<TabType>('resume');
  const [copied, setCopied] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeRewriteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile && targetRole) {
      handleRewriteResume();
    }
  }, [profile, targetRole]);

  const handleRewriteResume = async () => {
    if (!profile || !targetRole) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.rewriteResume(profile, targetRole.role);
      setResumeData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to rewrite resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'resume', label: 'Resume', icon: <FileText className="w-4 h-4" /> },
    { id: 'cover-letter', label: 'Cover Letter', icon: <Mail className="w-4 h-4" /> },
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Layout className="w-4 h-4" /> },
  ];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-24 px-4 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-16 h-16 animate-spin mb-6" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Optimizing Your Profile</h2>
        <p>Rewriting your resume for {targetRole?.role}...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Resume & Portfolio</h1>
        <p className="text-slate-500 text-lg">Your AI-optimized professional profile is ready for the market.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden min-h-[600px]"
            >
              {activeTab === 'resume' && resumeData && (
                <div className="p-12 font-serif text-slate-800 leading-relaxed">
                  <div className="text-center border-b border-slate-200 pb-8 mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Alex Rivera</h2>
                    <p className="text-indigo-600 font-bold mb-2">{targetRole?.role || 'AI Product Strategist'}</p>
                    <p className="text-sm text-slate-500">alex.rivera@example.com | San Francisco, CA</p>
                  </div>

                  <section className="mb-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-1">Professional Summary</h3>
                    <p className="text-sm">{resumeData.summary}</p>
                  </section>

                  <section className="mb-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-1">Professional Experience</h3>
                    <div className="space-y-6">
                      {resumeData.experience.map((exp, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-slate-900">{exp.company}</h4>
                              <p className="text-sm italic text-slate-600">{exp.role}</p>
                            </div>
                            <span className="text-sm text-slate-400">{exp.period}</span>
                          </div>
                          <ul className="list-disc list-outside ml-4 space-y-1">
                            {exp.bullets.map((bullet, j) => (
                              <li key={j} className="text-sm">{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-1">Core Competencies</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile?.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-700 text-xs font-medium rounded-md border border-slate-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'cover-letter' && resumeData && (
                <div className="p-12 font-serif text-slate-800 leading-relaxed">
                  <pre className="whitespace-pre-wrap font-serif text-sm">
                    {resumeData.coverLetter}
                  </pre>
                </div>
              )}

              {activeTab === 'linkedin' && resumeData && (
                <div className="p-12 space-y-12">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Headline</h3>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-800">
                      {resumeData.linkedin.headline}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">About Section</h3>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed">
                      {resumeData.linkedin.about}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && resumeData && (
                <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resumeData.projects.map((project, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all group">
                      <h4 className="text-xl font-black text-slate-900 mb-3">{project.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed mb-6">{project.description}</p>
                      <button className="flex items-center gap-2 text-indigo-600 font-bold text-sm group-hover:gap-3 transition-all">
                        View Project
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Actions
            </h3>
            
            <div className="space-y-3">
              {activeTab === 'resume' && (
                <>
                  <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all">
                    <FileDown className="w-5 h-5" />
                    Download PDF
                  </button>
                  <button className="w-full bg-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/20 transition-all border border-white/10">
                    <Printer className="w-5 h-5" />
                    Download DOC
                  </button>
                </>
              )}

              {activeTab === 'cover-letter' && (
                <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all">
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              )}

              {activeTab === 'linkedin' && (
                <button 
                  onClick={() => handleCopy(`${resumeData?.linkedin.headline}\n\n${resumeData?.linkedin.about}`)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'Copied!' : 'Copy Profile'}
                </button>
              )}

              {activeTab === 'projects' && (
                <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all">
                  <ExternalLink className="w-5 h-5" />
                  Share Portfolio
                </button>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-slate-400 text-xs leading-relaxed">
                Pro Tip: Tailor your resume for each specific application to increase your match score.
              </p>
            </div>
          </div>

          <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
            <h4 className="font-black text-indigo-900 mb-2">Ready to Apply?</h4>
            <p className="text-xs text-indigo-700 leading-relaxed mb-4">
              Your profile is optimized for AI Product Strategist roles. Start applying to the matched roles on your dashboard.
            </p>
            <button 
              onClick={onNext}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
            >
              Finish & Exit
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-center gap-8 mt-12">
        <button
          onClick={onBack}
          className="text-slate-400 font-bold hover:text-slate-600 transition-colors px-6 py-4"
        >
          Back to Upskill Plan
        </button>
      </div>
    </div>
  );
}
