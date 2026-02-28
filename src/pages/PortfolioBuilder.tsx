import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  Github, 
  ExternalLink, 
  Layers, 
  Cpu, 
  Globe,
  Clock,
  MoreHorizontal,
  X,
  Upload,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateProjectDescription, CareerPath } from '../services/geminiService';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  status: 'live' | 'draft';
  views: number;
  imageSeed: string;
}

interface PortfolioBuilderProps {
  careerData: CareerPath | null;
}

export default function PortfolioBuilder({ careerData }: PortfolioBuilderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('pivotai_portfolio_projects');
    if (saved) return JSON.parse(saved);
    return [
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
  });

  useEffect(() => {
    localStorage.setItem('pivotai_portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    status: 'draft' as const
  });

  const handleAddProject = () => {
    const project: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: newProject.title,
      description: newProject.description,
      techStack: newProject.techStack.split(',').map(s => s.trim()),
      status: newProject.status,
      views: 0,
      imageSeed: newProject.title.toLowerCase().replace(/\s+/g, '-')
    };
    setProjects([project, ...projects]);
    setIsModalOpen(false);
    setNewProject({ title: '', description: '', techStack: '', status: 'draft' });
  };

  const handleEnhanceDescription = async () => {
    if (!newProject.title || !newProject.description) return;
    setIsEnhancing(true);
    try {
      const enhanced = await generateProjectDescription(
        newProject.title,
        newProject.description,
        careerData?.recommendedPivot || 'AI Engineer'
      );
      setNewProject(prev => ({ ...prev, description: enhanced }));
    } catch (error) {
      console.error('Failed to enhance description:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

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
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 w-fit"
        >
          <Plus className="w-5 h-5" />
          Add New Project
        </button>
      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-xl">
                    <Sparkles className="w-5 h-5 text-white fill-current" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Add New AI Project</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Showcase your latest work</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Project Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Multi-Agent RAG System"
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tech Stack (comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. LangChain, Python, React"
                      value={newProject.techStack}
                      onChange={(e) => setNewProject({...newProject, techStack: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
                    <button 
                      onClick={handleEnhanceDescription}
                      disabled={isEnhancing || !newProject.description}
                      className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Sparkles className={`w-3 h-3 ${isEnhancing ? 'animate-spin' : ''}`} />
                      {isEnhancing ? 'Enhancing...' : 'Magic Write'}
                    </button>
                  </div>
                  <textarea 
                    rows={4}
                    placeholder="Describe the problem you solved and the AI architecture you used..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setNewProject({...newProject, status: 'draft'})}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${newProject.status === 'draft' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                      >
                        Draft
                      </button>
                      <button 
                        onClick={() => setNewProject({...newProject, status: 'live'})}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${newProject.status === 'live' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                      >
                        Live
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Cover Image</label>
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all">
                      <Upload className="w-4 h-4" />
                      Upload Screenshot
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddProject}
                  disabled={!newProject.title || !newProject.description}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publish Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
          onClick={() => setIsModalOpen(true)}
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
