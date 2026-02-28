import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Copy,
  Share2,
  RotateCcw,
  Zap,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { optimizeResume, OptimizedResume, CareerPath } from '../services/geminiService';

interface ResumeOptimizerProps {
  careerData: CareerPath | null;
}

export default function ResumeOptimizer({ careerData }: ResumeOptimizerProps) {
  const [input, setInput] = useState('');
  const [targetRole, setTargetRole] = useState(careerData?.recommendedPivot || 'AI Prompt Engineer');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [optimizedData, setOptimizedData] = useState<OptimizedResume | null>(null);
  const [isShared, setIsShared] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!input.trim()) return;
    setIsOptimizing(true);
    setShowResults(false);
    setError(null);
    
    try {
      const data = await optimizeResume(input, targetRole);
      setOptimizedData(data);
      setIsOptimizing(false);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      setError("Failed to optimize resume. Please check your API key.");
      setIsOptimizing(false);
    }
  };

  const handleShare = () => {
    // Simulate sharing/copying link
    setIsShared(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setIsShared(false), 2000);
  };

  const keywords = ["Agentic Workflows", "LLM Evaluation", "Retrieval Augmented Generation", "Prompt Engineering"];
  const weakPhrases = ["Hard worker", "Team player", "Responsible for", "Assisted with"];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl">
      {/* Left Side: Legacy Resume */}
      <div className="flex-1 bg-slate-50 p-8 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Current Experience</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Targeting:</p>
              <input 
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-transparent border-b border-blue-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button 
            onClick={() => setInput('')}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Managed a team of 5 writers. Responsible for creating weekly content for the company blog. Assisted with social media strategy..."
          className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none shadow-inner"
        />
      </div>

      {/* Middle Divider & Button */}
      <div className="relative flex items-center justify-center lg:w-0 z-10">
        <motion.button
          onClick={handleOptimize}
          disabled={isOptimizing || !input.trim()}
          animate={isOptimizing ? {
            boxShadow: [
              "0 0 0px rgba(79, 70, 229, 0)",
              "0 0 20px rgba(79, 70, 229, 0.6)",
              "0 0 0px rgba(79, 70, 229, 0)"
            ],
            scale: [1, 1.02, 1]
          } : {}}
          transition={isOptimizing ? {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
          className={`
            lg:absolute flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-2xl transition-all active:scale-95
            ${isOptimizing || !input.trim() 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
            }
          `}
        >
          <Sparkles className={`w-5 h-5 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Optimizing...' : 'Optimize with AI'}</span>
        </motion.button>
      </div>

      {/* Right Side: AI Optimized */}
      <div className="flex-1 bg-white p-8 flex flex-col min-w-0 border-l border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">AI Optimized</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Tech-forward transformation</p>
          </div>
          {showResults && (
            <div className="flex gap-2 items-center">
              <AnimatePresence>
                {isShared && (
                  <motion.span 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded"
                  >
                    Link Copied!
                  </motion.span>
                )}
              </AnimatePresence>
              <button 
                onClick={handleShare}
                className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 rounded-lg relative group"
                title="Share Resume"
              >
                {isShared ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => {
                  if (optimizedData) {
                    const text = optimizedData.optimizedBullets.join('\n');
                    navigator.clipboard.writeText(text);
                    setIsShared(true);
                    setTimeout(() => setIsShared(false), 2000);
                  }
                }}
                className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 rounded-lg"
                title="Copy to Clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  alert("Downloading optimized resume as PDF...");
                }}
                className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 rounded-lg"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {!isOptimizing && !showResults && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-10"
              >
                <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-6">
                  <Zap className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-400">Ready to transform</h3>
                <p className="text-sm text-slate-400 max-w-[200px] mt-2">Paste your experience on the left to see the AI magic.</p>
              </motion.div>
            )}

            {isOptimizing && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-48 bg-slate-50 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                      <div className="h-4 w-5/6 bg-slate-50 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {showResults && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Match Score Header */}
                <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 flex items-center gap-6">
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="text-blue-100"
                        strokeDasharray="100, 100"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <motion.path
                        initial={{ strokeDasharray: "0, 100" }}
                        animate={{ strokeDasharray: `${optimizedData?.atsScore || 0}, 100` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-blue-600"
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-blue-700">{optimizedData?.atsScore}%</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">Optimization Score</h4>
                    <p className="text-sm text-slate-500">Your resume is now optimized for AI-first screening systems.</p>
                  </div>
                </div>

                {/* Tags Section */}
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Keywords Injected</p>
                    <div className="flex flex-wrap gap-2">
                      {optimizedData?.injectedKeywords.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Weak Phrases Removed</p>
                    <div className="flex flex-wrap gap-2">
                      {optimizedData?.removedWeakPhrases.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-[10px] font-bold border border-red-100 flex items-center gap-1.5 line-through opacity-60">
                          <XCircle className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Output Content */}
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                  <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-mono">
                    <p className="text-blue-600 font-bold tracking-tight mb-4 uppercase text-xs">Professional Experience Transformation</p>
                    <div className="space-y-4">
                      {optimizedData?.optimizedBullets.map((bullet, i) => (
                        <div key={i} className="flex gap-3">
                          <ArrowRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <p>{bullet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
