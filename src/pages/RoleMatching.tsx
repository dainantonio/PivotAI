import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Zap, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';

interface RoleMatchingProps {
  onNext: () => void;
  onBack: () => void;
}

export default function RoleMatching({ onNext, onBack }: RoleMatchingProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    { 
      id: '1', 
      title: 'AI Operations Specialist', 
      match: 94, 
      salary: '$135k - $180k',
      description: 'Optimize business workflows by integrating AI tools and managing model performance.',
      skills: ['Workflow Automation', 'AI Implementation', 'Process Optimization', 'Python']
    },
    { 
      id: '2', 
      title: 'Prompt Engineer', 
      match: 88, 
      salary: '$145k - $190k',
      description: 'Design and refine high-performance prompts for LLMs to solve complex business problems.',
      skills: ['NLP', 'Iterative Testing', 'Creative Strategy', 'LLM Architecture']
    },
    { 
      id: '3', 
      title: 'AI Data Analyst', 
      match: 82, 
      salary: '$120k - $165k',
      description: 'Translate raw data into actionable AI insights using advanced predictive modeling.',
      skills: ['Data Visualization', 'SQL', 'Predictive Modeling', 'Machine Learning']
    },
    { 
      id: '4', 
      title: 'AI Product Strategist', 
      match: 78, 
      salary: '$160k - $210k',
      description: 'Bridge the gap between AI technical capabilities and market-ready product features.',
      skills: ['Product Roadmap', 'Market Analysis', 'Stakeholder Management', 'AI Feasibility']
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">AI Role Matching</h1>
        <p className="text-slate-500 text-lg">Based on your experience, we've identified the best tech-adjacent pivot roles for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {roles.map((role, index) => (
          <motion.div 
            key={role.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedRole(role.id)}
            className={`cursor-pointer p-8 rounded-[2.5rem] border-2 transition-all duration-300 relative overflow-hidden group ${
              selectedRole === role.id 
                ? 'border-indigo-600 bg-indigo-50/50 shadow-2xl shadow-indigo-100 -translate-y-2' 
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1'
            }`}
          >
            {selectedRole === role.id && (
              <div className="absolute top-0 right-0 p-6">
                <div className="bg-indigo-600 text-white p-2 rounded-full shadow-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl transition-colors ${
                selectedRole === role.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
              }`}>
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{role.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{role.match}% Match</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-8 h-12">
              {role.description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Match Strength</span>
                <span className="text-indigo-600 font-black">{role.match}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                  style={{ width: `${role.match}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {role.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-[10px] font-bold">
                  {skill}
                </span>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-black text-slate-900">{role.salary}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Salary</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 pt-8">
        <button 
          onClick={onBack}
          className="text-slate-400 font-bold hover:text-slate-600 transition-colors px-6 py-4"
        >
          Back to Experience
        </button>
        <button 
          onClick={onNext}
          disabled={!selectedRole}
          className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-bold text-lg flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-1 active:scale-95 group disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
        >
          Confirm My Pivot
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
