import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Star, 
  ChevronRight, 
  Filter, 
  Search,
  Sparkles,
  Building2,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerPath } from '../services/geminiService';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
  matchScore: number;
  description: string;
  tags: string[];
  logo: string;
}

interface JobMatchesProps {
  careerData: CareerPath | null;
}

export default function JobMatches({ careerData }: JobMatchesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const jobs: Job[] = [
    {
      id: '1',
      title: careerData?.recommendedPivot || 'AI Prompt Engineer',
      company: 'Anthropic',
      location: 'San Francisco, CA (Remote)',
      salary: '$180k - $240k',
      type: 'Full-time',
      postedAt: '2h ago',
      matchScore: 98,
      description: 'We are looking for a creative and technical Prompt Engineer to help us push the boundaries of what Claude can do. You will work closely with our research and product teams.',
      tags: ['LLMs', 'Python', 'RAG', 'Evaluation'],
      logo: 'https://logo.clearbit.com/anthropic.com'
    },
    {
      id: '2',
      title: 'Senior AI Solutions Architect',
      company: 'Scale AI',
      location: 'New York, NY',
      salary: '$200k - $280k',
      type: 'Full-time',
      postedAt: '5h ago',
      matchScore: 92,
      description: 'Help our enterprise customers implement state-of-the-art AI solutions. You will be the bridge between our core technology and real-world business problems.',
      tags: ['Enterprise AI', 'Cloud', 'Sales Engineering'],
      logo: 'https://logo.clearbit.com/scale.com'
    },
    {
      id: '3',
      title: 'AI Product Manager',
      company: 'OpenAI',
      location: 'San Francisco, CA',
      salary: '$220k - $310k',
      type: 'Full-time',
      postedAt: '1d ago',
      matchScore: 85,
      description: 'Lead the development of new AI-powered features for our consumer and enterprise products. Define the roadmap for the future of human-AI interaction.',
      tags: ['Product Strategy', 'UX', 'AI Safety'],
      logo: 'https://logo.clearbit.com/openai.com'
    },
    {
      id: '4',
      title: 'Machine Learning Engineer (NLP)',
      company: 'Cohere',
      location: 'Toronto, ON (Hybrid)',
      salary: '$160k - $220k',
      type: 'Full-time',
      postedAt: '2d ago',
      matchScore: 78,
      description: 'Join our NLP team to build and scale large language models. Experience with transformer architectures and distributed training is a must.',
      tags: ['PyTorch', 'Transformers', 'Distributed Systems'],
      logo: 'https://logo.clearbit.com/cohere.com'
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-120px)]">
      {/* Left Column: Job List */}
      <div className="flex-1 flex flex-col gap-6 min-w-0 overflow-y-auto no-scrollbar pr-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 py-2">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Job Matches</h1>
            <p className="text-slate-500 mt-1">AI-curated opportunities based on your pivot trajectory.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-48 md:w-64"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              layoutId={job.id}
              onClick={() => setSelectedJob(job)}
              className={`
                bg-white rounded-3xl border p-6 cursor-pointer transition-all group
                ${selectedJob?.id === job.id ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}
              `}
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  <img 
                    src={job.logo} 
                    alt={job.company} 
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${job.company}&background=random`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 fill-current" />
                      {job.matchScore}% Match
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-4">
                    <Building2 className="w-4 h-4" />
                    {job.company}
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Column: Job Details */}
      <aside className="w-full lg:w-[450px] shrink-0">
        <AnimatePresence mode="wait">
          {selectedJob ? (
            <motion.div
              key={selectedJob.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-[2.5rem] border border-slate-200 h-full flex flex-col shadow-xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src={selectedJob.logo} 
                      alt={selectedJob.company} 
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert("Job saved to your favorites!")}
                      className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-amber-500 transition-colors border border-slate-100"
                    >
                      <Star className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => alert("Opening job posting in new tab...")}
                      className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-blue-600 transition-colors border border-slate-100"
                    >
                      <ArrowUpRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-2">{selectedJob.title}</h2>
                <p className="text-lg font-bold text-blue-600 mb-6">{selectedJob.company}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Salary Range</p>
                    <p className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      {selectedJob.salary}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Job Type</p>
                    <p className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      {selectedJob.type}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Job Description</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Why you're a match</h3>
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Sparkles className="w-4 h-4 text-white fill-current" />
                      </div>
                      <span className="text-sm font-black text-blue-900">AI Analysis</span>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-sm text-blue-800">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        Your recent curriculum in {careerData?.recommendedPivot || 'AI Engineering'} covers 90% of the required tech stack.
                      </li>
                      <li className="flex items-start gap-3 text-sm text-blue-800">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        Your background in {careerData?.industry || 'your current industry'} provides unique domain expertise for this role.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => alert(`Application submitted to ${selectedJob.company}!`)}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center gap-3"
                >
                  Apply Now
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 h-full flex flex-col items-center justify-center text-center p-12">
              <div className="bg-white p-6 rounded-3xl shadow-sm mb-6">
                <Briefcase className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Select a job to view details</h3>
              <p className="text-slate-500 max-w-[240px]">We'll show you why you're a match and how to apply.</p>
            </div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}
