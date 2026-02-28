import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Zap, 
  ArrowRight, 
  Star,
  Trophy,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Mentor {
  id: string;
  name: string;
  currentRole: string;
  previousRole: string;
  superpowers: string[];
  avatar: string;
  company: string;
}

interface Contributor {
  id: string;
  name: string;
  points: number;
  avatar: string;
  rank: number;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  replies: number;
  time: string;
}

export default function CommunityNetwork() {
  const [activeTab, setActiveTab] = useState<'mentors' | 'discussion' | 'events'>('mentors');
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('pivotai_community_posts');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: '1',
        author: 'Alex Morgan',
        avatar: 'https://i.pravatar.cc/150?u=alex',
        title: 'How to handle hallucination in production RAG?',
        content: 'I\'m seeing about 5% hallucination rate even with strict system prompts. What are your favorite evaluation frameworks?',
        tags: ['RAG', 'Evaluation', 'Production'],
        likes: 24,
        replies: 12,
        time: '2h ago'
      },
      {
        id: '2',
        author: 'Sarah Chen',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        title: 'Transitioning from Sales to AI PM',
        content: 'Sharing my journey of how I used my negotiation skills to land a PM role at Stripe. Hint: It\'s all about the data.',
        tags: ['Career Pivot', 'Product Management'],
        likes: 56,
        replies: 8,
        time: '5h ago'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('pivotai_community_posts', JSON.stringify(posts));
  }, [posts]);

  const [newPostContent, setNewPostContent] = useState('');

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      author: 'Dain Russell',
      avatar: 'https://i.pravatar.cc/150?u=dain',
      title: 'New Discussion',
      content: newPostContent,
      tags: ['General', 'Community'],
      likes: 0,
      replies: 0,
      time: 'Just now'
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    alert("Post published successfully!");
  };

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const mentors: Mentor[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      currentRole: 'AI Product Manager',
      company: 'Stripe',
      previousRole: 'Former Sales Exec',
      superpowers: ['Negotiation', 'Agentic Workflows', 'Product Strategy'],
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    {
      id: '2',
      name: 'Marcus Thorne',
      currentRole: 'Lead Prompt Engineer',
      company: 'Anthropic',
      previousRole: 'Former Copywriter',
      superpowers: ['NLP', 'Creative Writing', 'LLM Evaluation'],
      avatar: 'https://i.pravatar.cc/150?u=marcus'
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      currentRole: 'AI Solutions Architect',
      company: 'AWS',
      previousRole: 'Former Project Manager',
      superpowers: ['Cloud Architecture', 'RAG Systems', 'Agile'],
      avatar: 'https://i.pravatar.cc/150?u=elena'
    },
    {
      id: '4',
      name: 'David Kim',
      currentRole: 'Machine Learning Engineer',
      company: 'Tesla',
      previousRole: 'Former Data Analyst',
      superpowers: ['Python', 'Computer Vision', 'Data Viz'],
      avatar: 'https://i.pravatar.cc/150?u=david'
    }
  ];

  const contributors: Contributor[] = [
    { id: '1', name: 'Alex M.', points: 2450, avatar: 'https://i.pravatar.cc/150?u=alex', rank: 1 },
    { id: '2', name: 'Jordan S.', points: 1820, avatar: 'https://i.pravatar.cc/150?u=jordan', rank: 2 },
    { id: '3', name: 'Casey L.', points: 1560, avatar: 'https://i.pravatar.cc/150?u=casey', rank: 3 },
    { id: '4', name: 'Taylor W.', points: 1200, avatar: 'https://i.pravatar.cc/150?u=taylor', rank: 4 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-160px)]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Community Network</h1>
            <p className="text-slate-500 mt-1">Connect with those who have successfully pivoted.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search mentors or skills..."
                className="bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200">
          {[
            { id: 'mentors', label: 'Mentors', icon: Users },
            { id: 'discussion', label: 'Discussion Board', icon: MessageSquare },
            { id: 'events', label: 'Upcoming Events', icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative ${
                activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                />
              )}
            </button>
          ))}
        </div>

        {/* Mentors Grid */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'mentors' && (
              <motion.div
                key="mentors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {mentors.map((mentor) => (
                  <div 
                    key={mentor.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-5 mb-6">
                      <div className="relative">
                        <img 
                          src={mentor.avatar} 
                          alt={mentor.name} 
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 p-1 rounded-lg border-2 border-white">
                          <Zap className="w-3 h-3 text-white fill-current" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-slate-900 truncate">{mentor.name}</h3>
                        <p className="text-sm font-bold text-blue-600 mb-1">
                          {mentor.currentRole} <span className="text-slate-400 font-medium">at</span> {mentor.company}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {mentor.previousRole}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Superpowers</p>
                      <div className="flex flex-wrap gap-2">
                        {mentor.superpowers.map(power => (
                          <span key={power} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-100">
                            {power}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => alert(`Intro request sent to ${mentor.name}!`)}
                        className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                      >
                        Request Intro
                      </button>
                      <button 
                        onClick={() => alert(`Viewing ${mentor.name}'s career journey...`)}
                        className="flex-1 bg-slate-50 text-slate-700 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all border border-slate-200 active:scale-95"
                      >
                        View Journey
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'discussion' && (
              <motion.div
                key="discussion"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex gap-4">
                    <img src="https://i.pravatar.cc/150?u=me" className="w-10 h-10 rounded-xl" alt="Me" />
                    <div className="flex-1">
                      <textarea 
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Start a discussion or ask a question..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end mt-3">
                        <button 
                          onClick={handlePost}
                          className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                        >
                          Post Discussion
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-6">
                      <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-xl" />
                      <div>
                        <p className="text-sm font-black text-slate-900">{post.author}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.time}</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex gap-2">
                        {post.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold border border-slate-100">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Star className="w-4 h-4" />
                          <span className="text-xs font-bold">{post.likes}</span>
                        </button>
                        <button 
                          onClick={() => alert("Opening thread...")}
                          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-xs font-bold">{post.replies}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200"
              >
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                  <Calendar className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Upcoming Events</h3>
                <p className="text-slate-500 max-w-xs mt-2">We're organizing webinars and networking mixers. Stay tuned!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Sidebar: Top Contributors */}
      <aside className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Top Contributors
            </h2>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="space-y-4">
            {contributors.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer">
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white ${
                    user.rank === 1 ? 'bg-amber-400 text-amber-900' : 
                    user.rank === 2 ? 'bg-slate-300 text-slate-700' : 
                    'bg-orange-300 text-orange-900'
                  }`}>
                    {user.rank}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{user.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.points} Points</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
            View Leaderboard
          </button>
        </div>

        {/* Community Stats Card */}
        <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden mb-6">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest opacity-80">Community Pulse</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-black">12,402</p>
                <p className="text-xs font-medium opacity-70">Active Members</p>
              </div>
              <div>
                <p className="text-2xl font-black">856</p>
                <p className="text-xs font-medium opacity-70">Successful Pivots</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-[60px] rounded-full" />
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Live Activity
            </h2>
          </div>
          <div className="space-y-6">
            {[
              { user: 'Marco T.', action: 'started a new path', time: 'Just now' },
              { user: 'Sarah C.', action: 'liked your post', time: '2m ago' },
              { user: 'Elena R.', action: 'published a project', time: '5m ago' },
              { user: 'David K.', action: 'completed Module 1', time: '12m ago' },
            ].map((event, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {event.user} <span className="font-medium text-slate-500">{event.action}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{event.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
