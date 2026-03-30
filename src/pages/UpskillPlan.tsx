import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Clock, 
  Award,
  ExternalLink,
  Plus,
  ArrowRight,
  MonitorPlay,
  Hammer,
  Trophy,
  Zap,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { aiService, ParsedProfile, RoleMatch, UpskillRecommendation, ExecutionPlan } from '../services/aiService';

interface UpskillPlanProps {
  profile: ParsedProfile | null;
  targetRole: RoleMatch | null;
  onNext: () => void;
  onBack: () => void;
}

export default function UpskillPlan({ profile, targetRole, onNext, onBack }: UpskillPlanProps) {
  const [upskillData, setUpskillData] = useState<UpskillRecommendation | null>(null);
  const [executionPlan, setExecutionPlan] = useState<ExecutionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile && targetRole) {
      handleGenerateData();
    }
  }, [profile, targetRole]);

  const handleGenerateData = async () => {
    if (!profile || !targetRole) return;
    setIsLoading(true);
    setError(null);
    try {
      const [upskillResult, executionResult] = await Promise.all([
        aiService.generateUpskills(profile.skills, targetRole.role),
        aiService.generateExecutionPlan(profile, targetRole.role, profile.skills)
      ]);
      setUpskillData(upskillResult);
      setExecutionPlan(executionResult);
    } catch (err) {
      console.error(err);
      setError("Failed to generate transformation plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-24 px-4 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-16 h-16 animate-spin mb-6" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Curating Your Learning Path</h2>
        <p>Finding the best courses and projects for {targetRole?.role}...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">7-Day <span className="text-indigo-600">Transformation</span> Plan</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          High-ROI actions curated by your AI Career Transformation Strategist. Focus on transferable skills and tangible results you can add to your resume within 7 days.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: 7-Day Sprint */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">7-Day Rapid Execution Sprint</h2>
            </div>

            <div className="space-y-6 relative before:absolute before:left-6 before:top-8 before:bottom-8 before:w-0.5 before:bg-slate-100">
              {executionPlan?.days.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-16 group"
                >
                  <div className={`absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border-4 transition-all duration-300 ${
                    index === 6 ? 'bg-indigo-600 border-indigo-100 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-600'
                  }`}>
                    {day.day}
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <h3 className="text-lg font-black text-slate-900">{day.task}</h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {day.timeEstimate}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tools to use</p>
                        <div className="flex flex-wrap gap-2">
                          {day.tools.map(tool => (
                            <span key={tool} className="px-2 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-100">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Daily Output</p>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{day.output}</p>
                      </div>
                    </div>

                    {index === 6 && (
                      <div className="mt-6 pt-6 border-t border-indigo-100 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Final Project</p>
                          <p className="text-xs font-bold text-indigo-700">{executionPlan.finalDeliverables.project}</p>
                        </div>
                        <div className="flex-1 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Resume Bullet</p>
                          <p className="text-xs font-bold text-emerald-700">"{executionPlan.finalDeliverables.resumeBullet}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Courses Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                <MonitorPlay className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Supplementary Learning</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upskillData?.courses.map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <MonitorPlay className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      course.isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {course.isFree ? 'Free' : 'Paid'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight">{course.title}</h3>
                  <p className="text-slate-400 text-sm font-bold mb-2">{course.platform}</p>
                  <div className="mb-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Why this course?</p>
                    <p className="text-xs text-slate-600 font-medium leading-tight">{course.whyChosen}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <button className="flex items-center gap-2 text-indigo-600 font-black text-sm hover:gap-3 transition-all">
                      Start Course
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Capstone Project Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                <Hammer className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Capstone Application Project</h2>
            </div>
            {upskillData?.project && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-900 mb-2">{upskillData.project.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{upskillData.project.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tools Required</p>
                        <div className="flex flex-wrap gap-2">
                          {upskillData.project.tools.map(tool => (
                            <span key={tool} className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-100">{tool}</span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Final Deliverable</p>
                        <p className="text-[10px] font-bold text-emerald-700 leading-tight">{upskillData.project.finalDeliverable}</p>
                      </div>
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shrink-0 self-start md:self-center">
                    <Plus className="w-4 h-4" />
                    Add to Portfolio
                  </button>
                </div>
              </motion.div>
            )}
          </section>
        </div>

        {/* Right Column: Sprint Summary */}
        <div className="space-y-8">
          <section className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200 sticky top-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <Trophy className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black">Sprint Goals</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">2 High-ROI Courses</p>
                  <p className="text-xs text-slate-500">Master the core AI concepts for your pivot.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">1 Portfolio Project</p>
                  <p className="text-xs text-slate-500">Build a tangible asset to prove your skills.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Resume Ready</p>
                  <p className="text-xs text-slate-500">Update your experience with AI-first language.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-black text-xl">
                  7
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Days to Pivot</p>
                  <p className="text-sm font-bold">Rapid Execution Plan</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Your transformation is designed for speed. Follow the daily sprint tasks to see results by next week.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-center gap-8 mt-20 pt-12 border-t border-slate-100">
        <button
          onClick={onBack}
          className="text-slate-400 font-bold hover:text-slate-600 transition-colors px-6 py-4"
        >
          Back to Gap Analysis
        </button>
        <button
          onClick={onNext}
          className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-1 active:scale-95 group"
        >
          Finalize Resume & Portfolio
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
