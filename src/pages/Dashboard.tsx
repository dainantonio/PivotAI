import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  AlertTriangle, 
  Zap, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Target,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type EngineState = 'idle' | 'loading' | 'results';

export default function Dashboard() {
  const [state, setState] = useState<EngineState>('idle');
  const [loadingText, setLoadingText] = useState('');
  const [progress, setProgress] = useState(0);

  const loadingSteps = [
    "Cross-referencing 50k+ job descriptions...",
    "Analyzing LLM benchmarks...",
    "Mapping transferable skills...",
    "Calculating displacement probability...",
    "Finalizing pivot recommendations..."
  ];

  const handleAnalyze = () => {
    setState('loading');
    setProgress(0);
  };

  useEffect(() => {
    if (state === 'loading') {
      let stepIndex = 0;
      const stepInterval = setInterval(() => {
        setLoadingText(loadingSteps[stepIndex]);
        stepIndex = (stepIndex + 1) % loadingSteps.length;
      }, 800);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
            setTimeout(() => setState('results'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 60);

      return () => {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
      };
    }
  }, [state]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 max-w-xl w-full text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <ShieldAlert className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">What do you do today?</h2>
              <p className="text-slate-500 mb-10">Enter your current role to assess AI displacement risk and discover your optimal career pivot.</p>
              
              <div className="space-y-4 mb-10">
                <div className="text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Current Role Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Marketing Copywriter"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Industry</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Advertising & Media"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
              >
                Analyze Career Risk
              </button>
            </div>
          </motion.div>
        )}

        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full animate-pulse" />
              <Loader2 className="w-20 h-20 text-blue-600 animate-spin relative z-10" />
            </div>
            
            <div className="max-w-md w-full">
              <p className="text-xl font-bold text-slate-900 mb-6 h-8">{loadingText}</p>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{progress}% Analysis Complete</p>
            </div>
          </motion.div>
        )}

        {state === 'results' && (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 py-4"
          >
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Risk Assessment Report</h2>
              <button 
                onClick={() => setState('idle')}
                className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Reset Analysis
              </button>
            </motion.div>

            {/* Top Row Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Displacement Risk */}
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4">
                  <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    High Exposure
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-4">Displacement Risk</p>
                <h3 className="text-7xl font-black text-slate-900 mb-4">78%</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your core tasks in <span className="font-bold text-slate-900">Content Generation</span> and <span className="font-bold text-slate-900">Research</span> are highly susceptible to LLM automation within the next 18 months.
                </p>
              </motion.div>

              {/* Transferable Assets */}
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-4">Transferable Assets</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <h3 className="text-7xl font-black text-slate-900">4</h3>
                  <span className="text-slate-400 font-bold">Core Pillars</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Domain Knowledge', 'Project Mgmt', 'Stakeholder Comms', 'Strategic Planning'].map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Pivot Timeline */}
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-4">Pivot Timeline</p>
                  <h3 className="text-5xl font-black text-slate-900 mb-2">12 Weeks</h3>
                  <p className="text-sm text-slate-600">Estimated time to reach proficiency in recommended pivot paths.</p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  Accelerated Path Available
                </div>
              </motion.div>
            </div>

            {/* Bottom Row - Pivot Paths */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Primary Path */}
              <motion.div variants={itemVariants} className="md:col-span-3 bg-slate-900 rounded-[2rem] p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8">
                  <div className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    92% Match
                  </div>
                </div>
                
                <div className="relative z-10">
                  <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Recommended Pivot</p>
                  <h3 className="text-4xl font-black mb-8">AI Prompt Engineer</h3>
                  
                  <div className="space-y-4 mb-10">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Technical Gap Skills</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        'Context Window Optimization',
                        'Few-Shot Prompting Patterns',
                        'LLM Evaluation Frameworks'
                      ].map(skill => (
                        <div key={skill} className="flex items-center gap-3">
                          <div className="bg-emerald-500/20 p-1 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                          <span className="text-sm text-slate-300">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-blue-500 transition-all group/btn">
                    Start Learning Path
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Decorative Background */}
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />
              </motion.div>

              {/* Secondary Path */}
              <motion.div variants={itemVariants} className="md:col-span-2 bg-white rounded-[2rem] border border-slate-200 p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      75% Match
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-3">Secondary Pivot</p>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight">Human-in-the-Loop Auditor</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Leverage your domain expertise to validate AI outputs for compliance and brand voice consistency.
                  </p>
                </div>
                <button className="mt-8 flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors group">
                  View Path Details
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
