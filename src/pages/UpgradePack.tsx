import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Zap, 
  Target, 
  CheckCircle2, 
  Layout, 
  FileText, 
  Linkedin, 
  Share2, 
  Download,
  Loader2,
  ArrowRight,
  MessageSquare,
  Send
} from 'lucide-react';
import { motion } from 'motion/react';
import { aiService, ParsedProfile, RoleMatch, UpgradePack } from '../services/aiService';

interface UpgradePackProps {
  profile: ParsedProfile | null;
  targetRole: RoleMatch | null;
  onFinish: () => void;
  onBack: () => void;
}

export default function UpgradePackView({ profile, targetRole, onFinish, onBack }: UpgradePackProps) {
  const [pack, setPack] = useState<UpgradePack | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mentorInput, setMentorInput] = useState('');
  const [mentorResponse, setMentorResponse] = useState<string | null>(null);
  const [isMentorLoading, setIsMentorLoading] = useState(false);

  useEffect(() => {
    if (profile && targetRole) {
      handleGeneratePack();
    }
  }, [profile, targetRole]);

  const handleGeneratePack = async () => {
    if (!profile || !targetRole) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.generateUpgradePack(profile, targetRole.role);
      setPack(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate your Upgrade Pack. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMentorChat = async () => {
    if (!mentorInput.trim()) return;
    setIsMentorLoading(true);
    try {
      const response = await aiService.chatWithMentor(
        mentorInput,
        profile,
        targetRole?.role || 'AI Professional',
        `The user is reviewing their final Upgrade Pack. Act as a supportive but direct mentor. Challenge excuses. Keep responses short and actionable. Ask what they have completed so far.`
      );
      setMentorResponse(response);
      setMentorInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsMentorLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-24 px-4 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-16 h-16 animate-spin mb-6 text-indigo-600" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Assembling Your Upgrade Pack</h2>
        <p>Consolidating your 7-day transformation strategy...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
          <Trophy className="w-4 h-4" />
          Final Milestone
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">AI Career <span className="text-indigo-600">Upgrade Pack</span></h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Your complete, actionable blueprint for a rapid pivot into AI. Structured, shareable, and ready for execution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Pack Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Role & Fit */}
          <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[5rem] -mr-10 -mt-10 opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-black text-slate-900">Target: {pack?.targetRole}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                {pack?.whyItFits}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pack?.top3Skills.map((skill, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Priority Skill {i+1}</p>
                    <p className="text-sm font-bold text-slate-900">{skill}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 7-Day Sprint Summary */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-black text-slate-900">7-Day Execution Sprint</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pack?.sevenDayPlan.map((day) => (
                <div key={day.day} className="bg-white p-6 rounded-3xl border border-slate-200 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shrink-0">
                    {day.day}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{day.task}</h4>
                    <p className="text-xs text-slate-500">{day.output}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Portfolio & Resume */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Layout className="w-6 h-6 text-rose-500" />
                <h2 className="text-2xl font-black text-slate-900">Portfolio</h2>
              </div>
              {pack?.projects.map((project, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200">
                  <h4 className="font-black text-slate-900 mb-2">{project.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{project.description}</p>
                </div>
              ))}
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-indigo-500" />
                <h2 className="text-2xl font-black text-slate-900">Resume Bullets</h2>
              </div>
              {pack?.resumeBullets.map((bullet, i) => (
                <div key={i} className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 text-indigo-800 text-sm font-medium italic">
                  "{bullet}"
                </div>
              ))}
            </section>
          </div>

          {/* LinkedIn */}
          <section className="bg-slate-900 text-white p-10 rounded-[3rem]">
            <div className="flex items-center gap-3 mb-6">
              <Linkedin className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-black">LinkedIn Optimization</h2>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">New Headline</p>
            <p className="text-xl font-bold leading-tight">
              {pack?.linkedinHeadline}
            </p>
          </section>
        </div>

        {/* Sidebar: Mentor & Actions */}
        <div className="space-y-8">
          {/* AI Mentor */}
          <section className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900">AI Mentor</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-600 leading-relaxed italic">
                {mentorResponse || "I've built your blueprint. No more excuses. What have you completed from the plan so far? Be honest."}
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={mentorInput}
                onChange={(e) => setMentorInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleMentorChat()}
                placeholder="Update your progress..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12"
              />
              <button 
                onClick={handleMentorChat}
                disabled={isMentorLoading}
                className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isMentorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </section>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
              <Share2 className="w-6 h-6" />
              Share Pack
            </button>
            <button className="w-full bg-white text-slate-900 border-2 border-slate-200 py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
              <Download className="w-6 h-6" />
              Export PDF
            </button>
          </div>

          <button
            onClick={onFinish}
            className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
          >
            Finish Transformation
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
