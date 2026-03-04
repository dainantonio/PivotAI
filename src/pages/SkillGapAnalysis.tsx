import React from 'react';
import { 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  BarChart3,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { CareerPath, SkillGap } from '../services/geminiService';

interface SkillGapAnalysisProps {
  careerData: CareerPath | null;
  setView: (view: any) => void;
}

export default function SkillGapAnalysis({ careerData, setView }: SkillGapAnalysisProps) {
  if (!careerData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-slate-50 p-6 rounded-3xl mb-4">
          <Target className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Analysis Found</h3>
        <p className="text-slate-500 max-w-xs mt-2">Please run the Pivot Engine from the dashboard first.</p>
        <button 
          onClick={() => setView('dashboard')}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Skill Gap Intelligence</h1>
          <p className="text-slate-500 mt-1">Deep dive into the discrepancies between your current skills and future needs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border border-emerald-100">
            <TrendingUp className="w-4 h-4" />
            {careerData.matchPercentage}% Match
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Critical Gaps</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-5xl font-black text-red-600">
              {careerData.skillGaps.filter(g => g.priority === 'High').length}
            </h3>
            <span className="text-slate-400 font-bold">High Priority</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Transferable Skills</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-5xl font-black text-blue-600">
              {careerData.transferableSkills.length}
            </h3>
            <span className="text-slate-400 font-bold">Core Assets</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Automation Risk</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-5xl font-black text-slate-900">
              {careerData.displacementRisk}%
            </h3>
            <span className="text-slate-400 font-bold">Exposure</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Detailed Gap Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Detailed Discrepancy Report
          </h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {careerData.skillGaps.map((gap, i) => (
              <motion.div 
                key={gap.skill}
                variants={itemVariants}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                          gap.priority === 'High' ? 'bg-red-100 text-red-700' : 
                          gap.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {gap.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current</p>
                      <p className="text-lg font-black text-slate-400">{gap.currentLevel}%</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                    <div className="text-center">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Target</p>
                      <p className="text-lg font-black text-blue-600">{gap.targetLevel}%</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute inset-y-0 left-0 bg-slate-300 rounded-full transition-all duration-1000"
                      style={{ width: `${gap.currentLevel}%` }}
                    />
                    <div 
                      className="absolute inset-y-0 left-0 bg-blue-600 rounded-full opacity-40 transition-all duration-1000"
                      style={{ width: `${gap.targetLevel}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {gap.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Action Plan Sidebar */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Strategic Action Plan
          </h2>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Next Steps</p>
                <div className="space-y-6">
                  {careerData.syllabus.map((module, i) => (
                    <div key={module.moduleTitle} className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-xs font-black shrink-0">
                        0{i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold mb-1">{module.moduleTitle}</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          Focus on: {module.skillsToLearn.join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setView('curriculum')}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-500 transition-all group"
              >
                Launch Learning Path
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-600/20 blur-[80px] rounded-full" />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Expert Insight
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              "Your background in {careerData.industry} gives you a unique advantage in {careerData.recommendedPivot}. While the technical gap in {careerData.skillGaps[0].skill} is significant, your transferable skills in {careerData.transferableSkills[0]} will accelerate your transition."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <img src="https://i.pravatar.cc/150?u=atlas" className="w-10 h-10 rounded-xl" alt="Coach Atlas" />
              <div>
                <p className="text-xs font-black text-slate-900">Coach Atlas</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Career Strategist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
