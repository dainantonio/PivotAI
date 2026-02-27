import React from 'react';
import { 
  Plus, 
  Eye, 
  Github, 
  ExternalLink, 
  Layers, 
  Cpu, 
  Globe,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  status: 'live' | 'draft';
  views: number;
  imageSeed: string;
}

export default function PortfolioBuilder() {
  const projects: Project[] = [
    {
      id: '1',
      title: 'Automated Customer Support Agent',
      description: 'A multi-agent system using LangGraph to handle complex support tickets with RAG.',
      techStack: ['LangChain', 'OpenAI API', 'Next.js'],
      status: 'live',
      views: 452,
      imageSeed: 'support'
    },
    {
      id: '2',
      title: 'Legal Document Summarizer',
      description: 'Fine-tuned Llama 3 model for extracting key clauses from commercial contracts.',
      techStack: ['PyTorch', 'HuggingFace', 'FastAPI'],
      status: 'live',
      views: 289,
      imageSeed: 'legal'
    },
    {
      id: '3',
      title: 'AI-Powered Content Engine',
      description: 'Automated workflow for generating SEO-optimized blog posts from trending topics.',
      techStack: ['GPT-4', 'Python', 'Supabase'],
      status: 'draft',
      views: 0,
      imageSeed: 'content'
    }
  ];

  const stats = [
    { label: 'Total Views', value: '1,204', icon: Eye },
    { label: 'GitHub Repos Linked', value: '3', icon: Github },
    { label: 'Live Deployments', value: '2', icon: Globe },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My AI Portfolio</h1>
          <p className="text-slate-500 mt-1">Showcase your AI engineering prowess to potential employers.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 w-fit">
          <Plus className="w-5 h-5" />
          Add New Project
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-5"
          >
            <div className="bg-blue-600/20 p-3 rounded-2xl">
              <stat.icon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-blue-500 tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className={`
              bg-white rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 group border
              ${project.status === 'draft' ? 'border-dashed border-slate-300' : 'border-slate-200'}
            `}
          >
            {/* Project Image/Gradient */}
            <div className="h-48 relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${
                project.status === 'draft' 
                  ? 'from-slate-100 to-slate-200' 
                  : i % 2 === 0 ? 'from-blue-600 to-indigo-700' : 'from-purple-600 to-pink-700'
              } opacity-90 group-hover:scale-110 transition-transform duration-700`} />
              
              <img 
                src={`https://picsum.photos/seed/${project.imageSeed}/600/400?blur=2`} 
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                referrerPolicy="no-referrer"
              />

              <div className="absolute top-6 right-6">
                {project.status === 'draft' ? (
                  <div className="bg-white/90 backdrop-blur-sm text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <Clock className="w-3 h-3" />
                    In Progress
                  </div>
                ) : (
                  <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Live
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <button className="p-1 text-slate-400 hover:text-slate-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
                {project.description}
              </p>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-100">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {project.status === 'live' && (
                      <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </button>
                    )}
                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                      <Github className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {project.status === 'live' && (
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                      <Eye className="w-3.5 h-3.5" />
                      {project.views}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add Project Placeholder Card */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center group hover:bg-white hover:border-blue-300 transition-all duration-300 min-h-[400px]"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <Plus className="w-8 h-8 text-slate-400 group-hover:text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Build your next agent</h3>
          <p className="text-sm text-slate-500 max-w-[200px]">Start a new project from your curriculum templates.</p>
        </motion.button>
      </div>
    </div>
  );
}
