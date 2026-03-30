import React from 'react';
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface UpskillPlanProps {
  onNext: () => void;
  onBack: () => void;
}

export default function UpskillPlan({ onNext, onBack }: UpskillPlanProps) {
  const modules = [
    { 
      id: '1', 
      title: 'AI Strategy for Product Managers', 
      duration: '4 Weeks', 
      lessons: 12, 
      status: 'In Progress', 
      progress: 35,
      skills: ['AI Implementation', 'ROI Calculation', 'Vendor Selection']
    },
    { 
      id: '2', 
      title: 'Data Analytics & Predictive Modeling', 
      duration: '4 Weeks', 
      lessons: 15, 
      status: 'Locked', 
      progress: 0,
      skills: ['Python for Data', 'SQL', 'Visualization']
    },
    { 
      id: '3', 
      title: 'Natural Language Processing Fundamentals', 
      duration: '4 Weeks', 
      lessons: 10, 
      status: 'Locked', 
      progress: 0,
      skills: ['Transformers', 'Prompt Engineering', 'LLM Ethics']
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Micro-Upskill Plan</h1>
        <p className="text-slate-500 text-lg">A personalized, 12-week learning path designed to bridge your specific skill gaps.</p>
      </div>

      <div className="space-y-6 mb-12">
        {modules.map((module, index) => (
          <motion.div 
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white p-8 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden group ${
              module.status === 'In Progress' ? 'border-indigo-600 shadow-xl shadow-indigo-100' : 'border-slate-200 opacity-75'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                  module.status === 'In Progress' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-black text-slate-900">{module.title}</h3>
                    {module.status === 'In Progress' && (
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full">Active</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {module.duration}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Play className="w-4 h-4" />
                      {module.lessons} Lessons
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {module.status === 'In Progress' ? (
                  <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 group/btn">
                    Continue Learning
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                    <Zap className="w-4 h-4" />
                    Locked
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {module.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold border border-slate-100">
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">Module Progress</span>
                  <span className="text-indigo-600">{module.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${module.progress}%` }}
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                  />
                </div>
              </div>
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
          Back to Gap Analysis
        </button>
        <button 
          onClick={onNext}
          className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-bold text-lg flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-1 active:scale-95 group"
        >
          Finalize Resume & Portfolio
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
