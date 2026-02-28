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
  Star,
  Search,
  Filter,
  Sparkles,
  Zap,
  TrendingUp,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  imageSeed: string;
  category: string;
  progress?: number;
}

interface LearningHubProps {
  setView: (view: any) => void;
}

export default function LearningHub({ setView }: LearningHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(['1']);
  
  const courses: Course[] = [
    {
      id: '1',
      title: 'Prompt Engineering Foundations',
      instructor: 'Coach Atlas',
      duration: '12h 45m',
      level: 'Beginner',
      rating: 4.9,
      students: 12402,
      imageSeed: 'ai-brain',
      category: 'Core AI',
      progress: 35
    },
    {
      id: '2',
      title: 'Advanced RAG Architectures',
      instructor: 'Dr. Elena Rodriguez',
      duration: '18h 20m',
      level: 'Advanced',
      rating: 4.8,
      students: 5620,
      imageSeed: 'network',
      category: 'Engineering'
    },
    {
      id: '3',
      title: 'AI Product Strategy',
      instructor: 'Sarah Chen',
      duration: '10h 15m',
      level: 'Intermediate',
      rating: 4.7,
      students: 8900,
      imageSeed: 'strategy',
      category: 'Product'
    },
    {
      id: '4',
      title: 'LLM Security & Safety',
      instructor: 'Marcus Thorne',
      duration: '8h 30m',
      level: 'Intermediate',
      rating: 4.9,
      students: 3400,
      imageSeed: 'security',
      category: 'Safety'
    }
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Learning Hub</h1>
          <p className="text-slate-500 mt-1">Master the skills needed for your next career move.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {['All Courses', 'Core AI', 'Engineering', 'Product', 'Safety', 'Ethics'].map((cat, i) => (
          <button 
            key={cat}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Course */}
      <div className="relative bg-slate-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl group">
        <div className="absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-1000">
          <img 
            src="https://picsum.photos/seed/ai-future/1920/1080?blur=2" 
            alt="Featured" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3 fill-current" />
            Trending Now
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            The Complete Guide to <br />
            <span className="text-blue-500">Agentic Workflows</span>
          </h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Learn how to build autonomous AI agents that can plan, use tools, and collaborate to solve complex problems.
          </p>
          <div className="flex flex-wrap gap-6 mb-10">
            <div className="flex items-center gap-2 text-white font-bold">
              <Clock className="w-5 h-5 text-blue-500" />
              24 Hours
            </div>
            <div className="flex items-center gap-2 text-white font-bold">
              <Users className="w-5 h-5 text-blue-500" />
              15.2k Students
            </div>
            <div className="flex items-center gap-2 text-white font-bold">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Advanced
            </div>
          </div>
          <button 
            onClick={() => {
              alert("Enrolled in Agentic Workflows! Redirecting to curriculum...");
              setView('curriculum');
            }}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-3"
          >
            Enroll Now
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <div className="h-48 relative overflow-hidden">
              <img 
                src={`https://picsum.photos/seed/${course.imageSeed}/600/400`} 
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                  {course.category}
                </span>
              </div>
              {course.progress !== undefined && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-200">
                  <div 
                    className="h-full bg-blue-600"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              )}
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(course.rating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-400">{course.rating} ({course.students.toLocaleString()})</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                {course.title}
              </h3>
              <p className="text-sm font-bold text-slate-500 mb-6">by {course.instructor}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Zap className="w-3.5 h-3.5" />
                    {course.level}
                  </div>
                </div>
                <button 
                  onClick={() => setView('curriculum')}
                  className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
