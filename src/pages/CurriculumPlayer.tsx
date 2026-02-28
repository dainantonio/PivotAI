import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  FileText, 
  Download, 
  MessageSquare, 
  Info,
  Clock,
  BookOpen,
  Sparkles,
  Maximize2,
  Volume2,
  Settings as SettingsIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerPath } from '../services/geminiService';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: 'completed' | 'active' | 'locked';
}

interface CurriculumPlayerProps {
  careerData: CareerPath | null;
}

export default function CurriculumPlayer({ careerData }: CurriculumPlayerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'resources' | 'discussion'>('overview');
  const [currentLessonId, setCurrentLessonId] = useState('1');

  // Map syllabus to lessons if available
  const lessons: Lesson[] = careerData ? careerData.syllabus.flatMap((module, mIdx) => 
    module.skillsToLearn.map((skill, sIdx) => ({
      id: `${mIdx * 10 + sIdx + 1}`,
      title: `${module.moduleTitle}: ${skill}`,
      duration: '15:00',
      status: mIdx === 0 && sIdx === 0 ? 'active' : (mIdx === 0 ? 'completed' : 'locked')
    }))
  ) : [
    { id: '1', title: 'Introduction to LLM Architectures', duration: '08:45', status: 'completed' },
    { id: '2', title: 'The Art of the System Prompt', duration: '12:20', status: 'active' },
    { id: '3', title: 'Few-Shot vs. Zero-Shot Learning', duration: '15:10', status: 'locked' },
    { id: '4', title: 'Chain-of-Thought Frameworks', duration: '18:30', status: 'locked' },
    { id: '5', title: 'Prompt Chaining and State Management', duration: '22:15', status: 'locked' },
    { id: '6', title: 'Evaluating Model Outputs at Scale', duration: '14:50', status: 'locked' },
  ];

  const currentLesson = lessons.find(l => l.id === currentLessonId) || lessons[0];
  const progress = careerData ? 35 : 35;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl">
      {/* Left Column: The Content (70%) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto no-scrollbar">
        {/* Video Player Placeholder */}
        <div className="aspect-video bg-slate-950 relative group cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-white/20 shadow-2xl">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>

          {/* Video Controls Overlay (Fake) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-col gap-4">
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[70%]" />
              </div>
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-6">
                  <Play className="w-4 h-4 fill-white" />
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs font-bold font-mono tracking-wider">14:02 / 20:00</span>
                </div>
                <div className="flex items-center gap-6">
                  <SettingsIcon className="w-4 h-4" />
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Navigation */}
        <div className="px-8 lg:px-12 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'transcript', label: 'Transcript', icon: FileText },
              { id: 'resources', label: 'Resources', icon: Download },
              { id: 'discussion', label: 'Discussion', icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-6 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="playerTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 lg:p-12 max-w-4xl">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
                    {currentLesson.title}
                  </h1>
                  <div className="flex items-center gap-6 text-slate-500 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {currentLesson.duration} Duration
                    </div>
                    <div className="flex items-center gap-2 text-blue-600">
                      <Sparkles className="w-4 h-4" />
                      {careerData ? careerData.recommendedPivot : 'AI Prompt Engineer'}
                    </div>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-lg leading-relaxed text-slate-700">
                    In this lesson, we dive deep into the most critical component of any LLM application: the System Prompt. You'll learn how to establish persona, set behavioral guardrails, and implement structural constraints that ensure your model remains consistent across thousands of interactions.
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">What you'll learn:</h3>
                  <ul className="space-y-3 list-none p-0">
                    {[
                      'Defining clear personas using the "Act as a..." pattern',
                      'Implementing negative constraints to prevent common failure modes',
                      'Structuring output formats (JSON, Markdown, YAML) via system instructions',
                      'Balancing brevity with descriptive clarity for token efficiency'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab !== 'overview' && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 flex flex-col items-center justify-center text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200"
              >
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Content Coming Soon</h3>
                <p className="text-slate-500 max-w-xs mt-2">We're finalizing the {activeTab} for this lesson.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column: The Syllabus Sidebar (30%) */}
      <aside className="w-full lg:w-96 bg-white border-l border-slate-200 flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Course Syllabus</h2>
          <h3 className="text-lg font-black text-slate-900 leading-tight mb-6">
            {careerData ? `Path: ${careerData.recommendedPivot}` : 'Module 1: Prompt Engineering Foundations'}
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">35% Complete</span>
              <span className="text-[10px] font-bold text-slate-400">2/6 Lessons</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '35%' }}
                className="h-full bg-blue-600 rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4">
          <div className="space-y-2">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => lesson.status !== 'locked' && setCurrentLessonId(lesson.id)}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group
                  ${lesson.status === 'active' 
                    ? 'bg-blue-50 border border-blue-100' 
                    : lesson.status === 'locked'
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:bg-slate-50'
                  }
                `}
              >
                <div className="shrink-0">
                  {lesson.status === 'completed' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  )}
                  {lesson.status === 'active' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                      <Play className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                  )}
                  {lesson.status === 'locked' && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`
                    text-sm truncate mb-0.5
                    ${lesson.status === 'active' ? 'font-black text-slate-900' : 'font-bold text-slate-600'}
                    ${lesson.status === 'completed' ? 'text-slate-400 line-through' : ''}
                  `}>
                    {lesson.id}. {lesson.title}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    {lesson.duration}
                  </div>
                </div>

                {lesson.status !== 'locked' && (
                  <ChevronRight className={`
                    w-4 h-4 transition-transform group-hover:translate-x-1
                    ${lesson.status === 'active' ? 'text-blue-400' : 'text-slate-300'}
                  `} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2">
            Next Lesson
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </div>
  );
}
