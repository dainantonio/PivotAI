import React from 'react';
import { 
  FileText, 
  Briefcase, 
  ExternalLink, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Layout,
  Plus,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface ResumePortfolioProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ResumePortfolio({ onNext, onBack }: ResumePortfolioProps) {
  const portfolioProjects = [
    { id: '1', title: 'AI-Driven Customer Segmentation', type: 'Data Science', status: 'Completed', description: 'Leveraging machine learning to identify high-value customer segments.' },
    { id: '2', title: 'Predictive Inventory Optimization', type: 'Product Strategy', status: 'In Progress', description: 'Optimizing supply chain efficiency using time-series forecasting.' }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Resume & Portfolio</h1>
        <p className="text-slate-500 text-lg">Finalize your professional profile to showcase your new AI-driven capabilities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Resume Optimizer Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <FileText className="w-6 h-6" />
            </div>
            <button className="flex items-center gap-2 text-indigo-600 font-bold text-xs hover:text-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-4">AI-Optimized Resume</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-8">
            We've rewritten your experience to highlight transferable skills and new AI competencies for the <span className="font-bold text-slate-900">AI Product Strategist</span> role.
          </p>

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">AI Enhancement</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                "Transformed marketing strategy into AI-driven product roadmaps, resulting in a 40% increase in operational efficiency."
              </p>
            </div>
          </div>

          <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group/btn">
            Refine with AI
            <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
          </button>
        </motion.div>

        {/* Portfolio Builder Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="bg-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <Layout className="w-6 h-6" />
            </div>
            <button className="flex items-center gap-2 text-purple-600 font-bold text-xs hover:text-purple-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-4">Project Portfolio</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-8">
            Showcase your practical application of AI through these hands-on projects.
          </p>

          <div className="space-y-4 mb-8">
            {portfolioProjects.map(project => (
              <div key={project.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group/project hover:bg-white hover:border-purple-200 transition-all">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{project.title}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{project.type}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {project.status}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full bg-white text-slate-900 border border-slate-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all group/btn">
            Preview Portfolio
            <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 pt-8">
        <button 
          onClick={onBack}
          className="text-slate-400 font-bold hover:text-slate-600 transition-colors px-6 py-4"
        >
          Back to Upskill Plan
        </button>
        <button 
          onClick={onNext}
          className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-bold text-lg flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-1 active:scale-95 group"
        >
          Go to Dashboard
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
