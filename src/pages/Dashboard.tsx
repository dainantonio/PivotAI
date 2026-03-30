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
  ChevronRight,
  Trophy,
  Flame,
  MessageSquare,
  Bell,
  Briefcase,
  Send,
  User,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { aiService, CareerPath, ParsedProfile, RoleMatch } from '../services/aiService';

type EngineState = 'idle' | 'loading' | 'results';

interface DashboardProps {
  careerData: CareerPath | null;
  userProfile: ParsedProfile | null;
  roleMatches: RoleMatch[];
  selectedRole: RoleMatch | null;
  setCareerData: (data: CareerPath | null) => void;
  setView: (view: 'landing' | 'auth' | 'dashboard' | 'experience' | 'matching' | 'gap-analysis' | 'upskill' | 'resume-portfolio' | 'settings') => void;
}

export default function Dashboard({ careerData, userProfile, roleMatches, selectedRole, setCareerData, setView }: DashboardProps) {
  const [state, setState] = useState<EngineState>(userProfile ? 'results' : 'idle');
  const [loadingText, setLoadingText] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentRole, setCurrentRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');

  // Mock Gamification Data
  const gamification = {
    points: 1250,
    streak: 5,
    badges: [
      { id: 1, name: 'AI Pioneer', icon: <Sparkles className="w-4 h-4" />, color: 'bg-indigo-100 text-indigo-600' },
      { id: 2, name: 'Fast Learner', icon: <Zap className="w-4 h-4" />, color: 'bg-amber-100 text-amber-600' },
      { id: 3, name: 'Strategist', icon: <Target className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-600' },
    ]
  };

  // Mock Job Alerts
  const jobAlerts = [
    { id: 1, title: 'AI Product Strategist', company: 'NeuralSoft', match: 98, location: 'Remote', salary: '$140k - $180k' },
    { id: 2, title: 'Technical Product Manager', company: 'OpenAI (Mock)', match: 92, location: 'San Francisco', salary: '$160k - $210k' },
    { id: 3, title: 'AI Operations Lead', company: 'FutureScale', match: 85, location: 'Hybrid', salary: '$130k - $165k' },
  ];

  const careerSteps = [
    { id: 'profile', label: 'Profile', status: 'complete' },
    { id: 'matching', label: 'Role Match', status: 'complete' },
    { id: 'gap', label: 'Gap Analysis', status: 'current' },
    { id: 'upskill', label: 'Upskilling', status: 'pending' },
    { id: 'portfolio', label: 'Portfolio', status: 'pending' },
    { id: 'ready', label: 'Job Ready', status: 'pending' },
  ];

  // Transform real skillGaps data for the radar chart
  const skillData = careerData?.skillGaps ? careerData.skillGaps.map(gap => ({
    subject: gap.skill,
    A: gap.currentLevel,
    B: gap.targetLevel,
    fullMark: 100
  })) : [
    { subject: 'AI Strategy', A: 80, B: 100, fullMark: 100 },
    { subject: 'LLM Ops', A: 40, B: 90, fullMark: 100 },
    { subject: 'Prompt Eng', A: 90, B: 95, fullMark: 100 },
    { subject: 'Data Ethics', A: 70, B: 85, fullMark: 100 },
    { subject: 'Product Mgmt', A: 95, B: 95, fullMark: 100 },
    { subject: 'Python', A: 30, B: 75, fullMark: 100 },
  ];

  const loadingSteps = [
    "Cross-referencing 50k+ job descriptions...",
    "Analyzing LLM benchmarks...",
    "Mapping transferable skills...",
    "Calculating displacement probability...",
    "Finalizing pivot recommendations..."
  ];

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
    <div className="max-w-7xl mx-auto px-4 py-8">
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
              <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <ShieldAlert className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Bridge your AI Career</h2>
              <p className="text-slate-500 mb-10">Start your journey by building your experience profile and discovering your optimal career pivot.</p>
              
              <button 
                onClick={() => setView('experience')}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
              >
                Start Career Bridge
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
              <div className="absolute inset-0 bg-indigo-400/20 blur-3xl rounded-full animate-pulse" />
              <Loader2 className="w-20 h-20 text-indigo-600 animate-spin relative z-10" />
            </div>
            
            <div className="max-w-md w-full">
              <p className="text-xl font-bold text-slate-900 mb-6 h-8">{loadingText}</p>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-indigo-600"
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
            className="space-y-8"
          >
            {/* Comprehensive Career Progress Bar */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Career Control Center</h2>
                  <p className="text-slate-500 font-medium">Targeting: <span className="text-indigo-600 font-bold">{selectedRole?.role || 'AI Product Strategist'}</span></p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overall Readiness</p>
                    <p className="text-2xl font-black text-slate-900">68%</p>
                  </div>
                  <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '68%' }}
                      className="h-full bg-indigo-600 rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Step Progress */}
              <div className="relative">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-0" />
                <div className="flex justify-between relative z-10">
                  {careerSteps.map((step, idx) => (
                    <div key={step.id} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                        step.status === 'complete' ? 'bg-indigo-600 border-indigo-100 text-white' :
                        step.status === 'current' ? 'bg-white border-indigo-600 text-indigo-600 shadow-lg shadow-indigo-100' :
                        'bg-white border-slate-100 text-slate-300'
                      }`}>
                        {step.status === 'complete' ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{idx + 1}</span>}
                      </div>
                      <span className={`mt-3 text-[10px] font-black uppercase tracking-widest ${
                        step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'
                      }`}>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Gamification Bento Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Points</p>
                  <p className="text-2xl font-black text-slate-900">{gamification.points}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Day Streak</p>
                  <p className="text-2xl font-black text-slate-900">{gamification.streak}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasks Done</p>
                  <p className="text-2xl font-black text-slate-900">12/18</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</p>
                  <p className="text-2xl font-black text-slate-900">Elite</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Analysis & Jobs */}
              <div className="lg:col-span-2 space-y-8">
                {/* Skill Gap Analysis */}
                <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Target className="w-5 h-5 text-indigo-600" />
                      Skill Gap Analysis
                    </h3>
                    <button 
                      onClick={() => setView('gap-analysis')}
                      className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                    >
                      Full Report
                    </button>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
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
                          stroke="#4f46e5"
                          fill="#4f46e5"
                          fillOpacity={0.5}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Job Alerts */}
                <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-indigo-600" />
                      Job Alerts
                    </h3>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">3 New Matches</span>
                  </div>
                  <div className="space-y-4">
                    {roleMatches.length > 0 ? roleMatches.map((job, idx) => (
                      <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                              <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900">{job.role}</h4>
                              <p className="text-xs text-slate-500 font-bold">NeuralSoft • Remote</p>
                              <p className="text-[10px] text-emerald-600 font-black mt-1">$140k - $180k</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Score</p>
                              <p className="text-lg font-black text-indigo-600">{job.matchPercentage}%</p>
                            </div>
                            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95">
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </div>
                    )) : jobAlerts.map(job => (
                      <div key={job.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                              <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900">{job.title}</h4>
                              <p className="text-xs text-slate-500 font-bold">{job.company} • {job.location}</p>
                              <p className="text-[10px] text-emerald-600 font-black mt-1">{job.salary}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Score</p>
                              <p className="text-lg font-black text-indigo-600">{job.match}%</p>
                            </div>
                            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95">
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Gamification & AI Mentor */}
              <div className="space-y-8">
                {/* Badges & Achievements */}
                <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-6">Achievements</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {gamification.badges.map(badge => (
                      <div key={badge.id} className="flex flex-col items-center text-center group cursor-help">
                        <div className={`w-12 h-12 rounded-2xl ${badge.color} flex items-center justify-center mb-2 transition-transform group-hover:scale-110`}>
                          {badge.icon}
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{badge.name}</span>
                      </div>
                    ))}
                    <div className="flex flex-col items-center text-center opacity-30">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-2">
                        <ShieldAlert className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Locked</span>
                    </div>
                  </div>
                </motion.div>

                {/* AI Mentor Chatbot */}
                <motion.div variants={itemVariants} className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 flex flex-col h-[500px]">
                  <div className="p-6 bg-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">AI Career Mentor</h4>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-white transition-colors">
                      <Sparkles className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-900/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none text-sm text-slate-300 leading-relaxed">
                        Hello Alex! I've analyzed your progress. You're just 2 modules away from completing your AI Strategy certification. How can I help you today?
                      </div>
                    </div>
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-indigo-600 p-4 rounded-2xl rounded-tr-none text-sm text-white leading-relaxed">
                        What's the best way to explain my transition to AI in an interview?
                      </div>
                      <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-white shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-800">
                    <div className="relative">
                      <input 
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Ask your mentor..."
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
