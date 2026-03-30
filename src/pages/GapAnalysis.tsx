import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  Zap,
  Target,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  BrainCircuit,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService, ParsedProfile, RoleMatch, GapAnalysisResult } from '../services/aiService';

interface GapAnalysisProps {
  profile: ParsedProfile | null;
  targetRole: RoleMatch | null;
  onNext: () => void;
  onBack: () => void;
}

export default function GapAnalysis({ profile, targetRole, onNext, onBack }: GapAnalysisProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [gapData, setGapData] = useState<GapAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile && targetRole) {
      handleAnalyzeGaps();
    }
  }, [profile, targetRole]);

  const handleAnalyzeGaps = async () => {
    if (!profile || !targetRole) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.analyzeGaps(profile.skills, targetRole.role);
      setGapData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze gaps. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-24 px-4 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-16 h-16 animate-spin mb-6" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Analyzing Skill Gaps</h2>
        <p>Mapping your DNA against the {targetRole?.role} role...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
          Gap <span className="text-indigo-600">Analysis</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          We've mapped your current DNA against the requirements for an <span className="font-bold text-slate-900">{targetRole?.role}</span>.
        </p>
      </div>

      {/* 3-Column Skill Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Skills You Have */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-50 p-2 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Skills You Have</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {gapData?.skillsHave.map(skill => (
              <span key={skill} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Missing */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-red-50 p-2 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Skills Missing</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {gapData?.skillsMissing.map(skill => (
              <span key={skill} className="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-100">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Transferable Skills */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-50 p-2 rounded-xl">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Transferable</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {gapData?.transferableSkills.map(skill => (
              <span key={skill} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-100">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Skills Section */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white mb-12 relative overflow-hidden shadow-2xl shadow-slate-200">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-indigo-500/20 p-2 rounded-xl">
              <Target className="w-6 h-6 text-indigo-300" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">Priority Focus Areas</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gapData?.priorityFocus.map((skill, i) => (
              <motion.div 
                key={skill}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-lg">{skill}</h4>
                  <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
                    High Impact
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Critical for bridging the gap to {targetRole?.role}.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <Zap className="w-3 h-3" />
                  Effort: Medium
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Detailed Report Expandable */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-12">
        <button 
          onClick={() => setIsReportOpen(!isReportOpen)}
          className="w-full p-8 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 p-2 rounded-xl">
              <BarChart3 className="w-6 h-6 text-slate-600" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Detailed Analysis Report</h3>
              <p className="text-slate-500 text-sm">In-depth breakdown of your career pivot readiness.</p>
            </div>
          </div>
          {isReportOpen ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
        </button>

        <AnimatePresence>
          {isReportOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-8 pt-0 border-t border-slate-50 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-indigo-600" />
                      Cognitive Mapping
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Your experience in <span className="font-bold text-slate-900">Product Management</span> provides a 75% overlap with the strategic requirements of an AI role. The primary cognitive shift required is moving from deterministic logic to probabilistic reasoning (AI models).
                    </p>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Pivot Readiness Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-indigo-600">82</span>
                        <span className="text-slate-400 font-bold">/ 100</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Market Viability
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      The demand for <span className="font-bold text-slate-900">AI Product Strategists</span> has increased by 140% in the last 12 months. Your background in high-growth SaaS makes you a top-tier candidate once the technical gaps are addressed.
                    </p>
                    <ul className="space-y-3">
                      {['High salary growth potential', 'Low automation risk', 'Strategic leadership role'].map(item => (
                        <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
