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
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { generatePath, CareerPath } from '../services/geminiService';

type EngineState = 'idle' | 'loading' | 'results';

interface DashboardProps {
  careerData: CareerPath | null;
  setCareerData: (data: CareerPath | null) => void;
  setView: (view: 'landing' | 'auth' | 'dashboard' | 'resume' | 'interview' | 'learning' | 'curriculum' | 'portfolio' | 'community' | 'settings' | 'job-matches' | 'skill-gap') => void;
}

export default function Dashboard({ careerData, setCareerData, setView }: DashboardProps) {
  const [state, setState] = useState<EngineState>(careerData ? 'results' : 'idle');
  const [loadingText, setLoadingText] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentRole, setCurrentRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Transform real skillGaps data for the radar chart
  const skillData = careerData?.skillGaps ? careerData.skillGaps.map(gap => ({
    subject: gap.skill,
    A: gap.currentLevel,
    B: gap.targetLevel,
    fullMark: 100
  })) : [
    { subject: 'Skill 1', A: 120, B: 110, fullMark: 150 },
    { subject: 'Skill 2', A: 98, B: 130, fullMark: 150 },
    { subject: 'Skill 3', A: 86, B: 130, fullMark: 150 },
    { subject: 'Skill 4', A: 99, B: 100, fullMark: 150 },
    { subject: 'Skill 5', A: 85, B: 90, fullMark: 150 },
    { subject: 'Skill 6', A: 65, B: 85, fullMark: 150 },
  ];

  const loadingSteps = [
    "Cross-referencing 50k+ job descriptions...",
    "Analyzing LLM benchmarks...",
    "Mapping transferable skills...",
    "Calculating displacement probability...",
    "Finalizing pivot recommendations..."
  ];

  const handleAnalyze = async () => {
    if (!currentRole.trim() || !industry.trim()) return;
    
    setState('loading');
    setProgress(0);
    setError(null);

    try {
      // Start the API call in parallel with the loading animation
      const dataPromise = generatePath(currentRole, industry);
      
      // We'll let the animation run for a bit even if the API is fast for "thematic" effect
      const data = await dataPromise;
      setCareerData(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate career path. Please check your API key and try again.");
      setState('idle');
    }
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
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    placeholder="e.g. Marketing Copywriter"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Industry</label>
                  <input 
                    type="text" 
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Advertising & Media"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-bold mb-4">{error}</p>
              )}

              <button 
                onClick={handleAnalyze}
                disabled={!currentRole.trim() || !industry.trim()}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
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
                <h3 className="text-7xl font-black text-slate-900 mb-4">{careerData?.displacementRisk}%</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your core tasks in <span className="font-bold text-slate-900">{currentRole}</span> within the <span className="font-bold text-slate-900">{industry}</span> sector are susceptible to automation.
                </p>
              </motion.div>

              {/* Transferable Assets */}
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-4">Transferable Assets</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <h3 className="text-7xl font-black text-slate-900">{careerData?.transferableSkills.length}</h3>
                  <span className="text-slate-400 font-bold">Core Pillars</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {careerData?.transferableSkills.map(tag => (
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
                    {careerData?.matchPercentage}% Match
                  </div>
                </div>
                
                <div className="relative z-10">
                  <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Recommended Pivot</p>
                  <h3 className="text-4xl font-black mb-8">{careerData?.recommendedPivot}</h3>
                  
                  <div className="space-y-4 mb-10">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Learning Syllabus</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {careerData?.syllabus.map(module => (
                        <div key={module.moduleTitle} className="flex items-start gap-3">
                          <div className="bg-emerald-500/20 p-1 rounded-full mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{module.moduleTitle}</p>
                            <p className="text-[10px] text-slate-400">{module.skillsToLearn.join(', ')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setView('curriculum')}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-blue-500 transition-all group/btn"
                  >
                    Start Learning Path
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Decorative Background */}
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />
              </motion.div>

              {/* Skill Gap Analysis Chart */}
              <motion.div variants={itemVariants} className="md:col-span-2 bg-white rounded-[2rem] border border-slate-200 p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-1">Skill Gap Analysis</p>
                    <h3 className="text-xl font-black text-slate-900">Current vs. Target</h3>
                  </div>
                  <button 
                    onClick={() => setView('skill-gap')}
                    className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors flex items-center gap-1"
                  >
                    View Details
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="flex-1 min-h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                      <Radar
                        name="Current"
                        dataKey="A"
                        stroke="#94a3b8"
                        fill="#94a3b8"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Target"
                        dataKey="B"
                        stroke="#2563eb"
                        fill="#2563eb"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Role</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={() => setView('resume')}
                className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">Optimize Resume</h4>
                <p className="text-sm text-slate-500">Rewrite your experience for {careerData?.recommendedPivot}.</p>
              </button>
              <button 
                onClick={() => setView('interview')}
                className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div className="bg-purple-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">Practice Interview</h4>
                <p className="text-sm text-slate-500">Mock technical interview with Coach Atlas.</p>
              </button>
              <button 
                onClick={() => setView('job-matches')}
                className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">Explore Jobs</h4>
                <p className="text-sm text-slate-500">View AI-curated job matches for your pivot.</p>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
