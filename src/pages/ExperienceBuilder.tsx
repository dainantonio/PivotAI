import React, { useState } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  ChevronRight, 
  Plus, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface ExperienceBuilderProps {
  onNext: () => void;
}

export default function ExperienceBuilder({ onNext }: ExperienceBuilderProps) {
  const [experiences, setExperiences] = useState([
    { id: '1', role: 'Senior Marketing Manager', company: 'Global Tech Solutions', duration: '2020 - Present' }
  ]);

  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now().toString(), role: '', company: '', duration: '' }]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Experience Builder</h1>
        <p className="text-slate-500 text-lg">Let's map out your professional journey to identify your core strengths.</p>
      </div>

      <div className="space-y-8">
        {/* Experience Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Professional History</h3>
            <button 
              onClick={addExperience}
              className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:text-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          </div>

          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Role Title</label>
                  <input 
                    type="text" 
                    defaultValue={exp.role}
                    placeholder="e.g. Senior Product Manager"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Company</label>
                  <input 
                    type="text" 
                    defaultValue={exp.company}
                    placeholder="e.g. Google"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="md:col-span-1 flex items-end gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Duration</label>
                    <input 
                      type="text" 
                      defaultValue={exp.duration}
                      placeholder="e.g. 2018 - 2022"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <button 
                    onClick={() => removeExperience(exp.id)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skills Section */}
        <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/10 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="text-xl font-bold">AI Skill Extraction</h3>
            </div>
            <p className="text-indigo-200 mb-8 leading-relaxed max-w-xl">
              Our AI will analyze your experience to extract core competencies and transferable skills for your next pivot.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Strategic Planning', 'Team Leadership', 'Market Analysis', 'Budgeting'].map(skill => (
                <span key={skill} className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold border border-white/10">
                  {skill}
                </span>
              ))}
              <span className="px-4 py-2 bg-indigo-500/30 rounded-full text-xs font-bold border border-indigo-400/30 animate-pulse">
                Extracting more...
              </span>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/20 blur-[100px] rounded-full" />
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-8">
          <button 
            onClick={onNext}
            className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-bold text-lg flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-1 active:scale-95 group"
          >
            Analyze My Experience
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
