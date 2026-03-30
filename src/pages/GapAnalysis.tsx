import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';

interface GapAnalysisProps {
  onNext: () => void;
  onBack: () => void;
}

export default function GapAnalysis({ onNext, onBack }: GapAnalysisProps) {
  const gaps = [
    { skill: 'AI Strategy', current: 20, target: 90, priority: 'High', description: 'Deep understanding of AI implementation frameworks and ROI calculation.' },
    { skill: 'Data Analytics', current: 45, target: 85, priority: 'Medium', description: 'Leveraging data for predictive modeling and business intelligence.' },
    { skill: 'Product Management', current: 80, target: 95, priority: 'Low', description: 'Advanced agile methodologies and product lifecycle management.' },
    { skill: 'NLP Fundamentals', current: 10, target: 75, priority: 'High', description: 'Understanding natural language processing and transformer architectures.' }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Gap Analysis</h1>
        <p className="text-slate-500 text-lg">We've identified the specific skill gaps between your current role and your target pivot.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Gap List */}
        <div className="lg:col-span-2 space-y-4">
          {gaps.map((gap, index) => (
            <motion.div 
              key={gap.skill}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${
                    gap.priority === 'High' ? 'bg-red-50 text-red-600' : 
                    gap.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 
                    'bg-blue-50 text-blue-600'
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{gap.skill}</h3>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                      gap.priority === 'High' ? 'bg-red-100 text-red-700' : 
                      gap.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {gap.priority} Priority
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current</p>
                    <p className="text-lg font-black text-slate-400">{gap.current}%</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                  <div className="text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Target</p>
                    <p className="text-lg font-black text-indigo-600">{gap.target}%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                  <div 
                    className="absolute inset-y-0 left-0 bg-slate-300 rounded-full transition-all duration-1000"
                    style={{ width: `${gap.current}%` }}
                  />
                  <div 
                    className="absolute inset-y-0 left-0 bg-indigo-600 rounded-full opacity-40 transition-all duration-1000"
                    style={{ width: `${gap.target}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {gap.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Summary</p>
              <div className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-5xl font-black text-white">4</h3>
                  <span className="text-slate-400 font-bold">Critical Gaps</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-5xl font-black text-white">12</h3>
                  <span className="text-slate-400 font-bold">Weeks to Pivot</span>
                </div>
              </div>
              <div className="mt-10 pt-10 border-t border-white/10">
                <p className="text-sm text-slate-400 leading-relaxed">
                  "Your background in Marketing gives you a unique advantage. The technical gap in AI Strategy is significant, but your transferable skills will accelerate your transition."
                </p>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-600/20 blur-[80px] rounded-full" />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Expert Insight
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              "Focus on AI Strategy first. It's the highest priority and will provide the most immediate value in your new role."
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 pt-8">
        <button 
          onClick={onBack}
          className="text-slate-400 font-bold hover:text-slate-600 transition-colors px-6 py-4"
        >
          Back to Role Matching
        </button>
        <button 
          onClick={onNext}
          className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-bold text-lg flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-1 active:scale-95 group"
        >
          Generate Upskill Plan
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
