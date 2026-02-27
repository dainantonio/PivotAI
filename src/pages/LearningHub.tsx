import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Download, 
  MessageSquare,
  ChevronRight,
  Clock,
  BookOpen,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: 'completed' | 'active' | 'locked';
}

export default function LearningHub() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'resources'>('overview');
  
  const lessons: Lesson[] = [
    { id: '1', title: 'Introduction to LLM Architecture', duration: '12:45', status: 'completed' },
    { id: '2', title: 'Tokenization and Embedding Basics', duration: '18:20', status: 'completed' },
    { id: '3', title: 'Zero-Shot vs. Few-Shot Prompting', duration: '24:15', status: 'active' },
    { id: '4', title: 'Chain-of-Thought Engineering', duration: '32:10', status: 'locked' },
    { id: '5', title: 'Prompt Injection Security', duration: '15:40', status: 'locked' },
    { id: '6', title: 'Output Parsing and Validation', duration: '21:05', status: 'locked' },
  ];

  const progress = 35;

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-160px)]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Video Player Placeholder */}
        <div className="aspect-video bg-slate-900 rounded-3xl relative overflow-hidden group border border-slate-800 shadow-2xl">
          <img 
            src="https://picsum.photos/seed/learning/1280/720?blur=2" 
            alt="Video Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40 group-hover:bg-blue-500 transition-colors"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </motion.button>
          </div>
          
          {/* Video Overlay Info */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900 to-transparent">
            <h1 className="text-2xl font-bold text-white mb-2">3. Zero-Shot vs. Few-Shot Prompting</h1>
            <div className="flex items-center gap-4 text-slate-300 text-sm font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                24:15
              </span>
              <span className="w-1 h-1 bg-slate-500 rounded-full" />
              <span className="flex items-center gap-1.5 text-blue-400">
                <Star className="w-4 h-4 fill-current" />
                Advanced Module
              </span>
            </div>
          </div>
        </div>

        {/* Tabbed Interface */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex border-b border-slate-100">
            {(['overview', 'transcript', 'resources'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-5 text-sm font-bold uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                  />
                )}
              </button>
            ))}
          </div>
          
          <div className="p-8 min-h-[200px]">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-slate-900">Lesson Description</h3>
                  <p className="text-slate-600 leading-relaxed">
                    In this lesson, we explore the fundamental differences between zero-shot and few-shot prompting techniques. 
                    You'll learn how to provide context and examples to Large Language Models to significantly improve 
                    output accuracy and formatting consistency.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-sm text-slate-700 font-medium">Master context-window optimization</span>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-sm text-slate-700 font-medium">Build robust few-shot templates</span>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'transcript' && (
                <motion.div
                  key="transcript"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <span className="text-blue-600 font-mono text-sm shrink-0">00:12</span>
                      <p className="text-slate-600 text-sm leading-relaxed">Welcome back everyone. Today we're diving deep into the core of prompt engineering...</p>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-blue-600 font-mono text-sm shrink-0">01:45</span>
                      <p className="text-slate-600 text-sm leading-relaxed">Zero-shot prompting is exactly what it sounds like: asking the model a question without any prior examples...</p>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-blue-600 font-mono text-sm shrink-0">03:20</span>
                      <p className="text-slate-600 text-sm leading-relaxed">Now, let's contrast that with few-shot prompting, where we provide 2-5 examples of the desired output format...</p>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'resources' && (
                <motion.div
                  key="resources"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <button className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all group text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Prompt Templates.pdf</p>
                        <p className="text-xs text-slate-500">2.4 MB • PDF</p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </button>
                  <button className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all group text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Advanced Reading.epub</p>
                        <p className="text-xs text-slate-500">1.1 MB • EPUB</p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Curriculum */}
      <aside className="w-full lg:w-96 flex flex-col gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Course Progress</h2>
              <span className="text-sm font-black text-blue-600">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-blue-600"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Module 1: Foundations</h3>
              <div className="space-y-2">
                {lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    disabled={lesson.status === 'locked'}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group ${
                      lesson.status === 'active' 
                        ? 'bg-blue-50 border border-blue-100' 
                        : lesson.status === 'locked'
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      lesson.status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : lesson.status === 'active'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {lesson.status === 'completed' && <CheckCircle2 className="w-5 h-5" />}
                      {lesson.status === 'active' && <Play className="w-4 h-4 fill-current" />}
                      {lesson.status === 'locked' && <Lock className="w-4 h-4" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${
                        lesson.status === 'active' ? 'font-bold text-slate-900' : 'text-slate-500'
                      }`}>
                        {lesson.title}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {lesson.duration}
                      </p>
                    </div>
                    
                    {lesson.status === 'active' && (
                      <ChevronRight className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Community / Help Card */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-lg font-bold mb-2">Stuck on a concept?</h4>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Join the community discussion or ask Atlas for a quick explanation.</p>
            <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
              <MessageSquare className="w-4 h-4" />
              Open Community
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 blur-[60px] rounded-full" />
        </div>
      </aside>
    </div>
  );
}
