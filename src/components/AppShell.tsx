import React, { useState } from 'react';
import { 
  BrainCircuit, 
  LayoutDashboard, 
  Briefcase, 
  BookOpen, 
  User, 
  FileText, 
  Mic2, 
  Search, 
  Bell, 
  Menu, 
  X,
  Target,
  ChevronRight,
  LogOut,
  Sparkles,
  Users,
  Settings as SettingsIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AppShellProps {
  children: React.ReactNode;
  currentView: 'dashboard' | 'resume' | 'interview' | 'learning' | 'curriculum' | 'portfolio' | 'community' | 'settings' | 'job-matches' | 'skill-gap';
  setView: (view: 'landing' | 'auth' | 'dashboard' | 'resume' | 'interview' | 'learning' | 'curriculum' | 'portfolio' | 'community' | 'settings' | 'job-matches' | 'skill-gap') => void;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  isActive = false, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  isActive?: boolean, 
  onClick?: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive 
        ? 'bg-blue-600/20 text-blue-400 font-semibold' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    }`}
  >
    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'group-hover:text-slate-100'}`} />
    <span className="text-sm">{label}</span>
    {isActive && (
      <motion.div 
        layoutId="activeNav"
        className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"
      />
    )}
  </button>
);

export default function AppShell({ children, currentView, setView }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div 
            onClick={() => setView('landing')}
            className="flex items-center gap-3 mb-10 px-2 cursor-pointer"
          >
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">PivotAI</span>
          </div>

          {/* Navigation */}
          <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
            <div>
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
              <nav className="space-y-1">
                <NavItem 
                  icon={LayoutDashboard} 
                  label="Overview" 
                  isActive={currentView === 'dashboard'} 
                  onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }}
                />
                <NavItem 
                  icon={Target} 
                  label="Skill Gap" 
                  isActive={currentView === 'skill-gap'} 
                  onClick={() => { setView('skill-gap'); setIsSidebarOpen(false); }}
                />
                <NavItem 
                  icon={Briefcase} 
                  label="Job Matches" 
                  isActive={currentView === 'job-matches'} 
                  onClick={() => { setView('job-matches'); setIsSidebarOpen(false); }}
                />
                <NavItem 
                  icon={Users} 
                  label="Community" 
                  isActive={currentView === 'community'} 
                  onClick={() => { setView('community'); setIsSidebarOpen(false); }}
                />
                <NavItem 
                  icon={BookOpen} 
                  label="Curriculum" 
                  isActive={currentView === 'curriculum'} 
                  onClick={() => { setView('curriculum'); setIsSidebarOpen(false); }}
                />
                <NavItem 
                  icon={User} 
                  label="Portfolio" 
                  isActive={currentView === 'portfolio'} 
                  onClick={() => { setView('portfolio'); setIsSidebarOpen(false); }}
                />
                <NavItem 
                  icon={SettingsIcon} 
                  label="Settings" 
                  isActive={currentView === 'settings'} 
                  onClick={() => { setView('settings'); setIsSidebarOpen(false); }}
                />
              </nav>
            </div>

            <div>
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Tools</p>
              <nav className="space-y-1">
                <NavItem 
                  icon={FileText} 
                  label="Resume Optimizer" 
                  isActive={currentView === 'resume'} 
                  onClick={() => { setView('resume'); setIsSidebarOpen(false); }}
                />
                <NavItem 
                  icon={Mic2} 
                  label="Interview Simulator" 
                  isActive={currentView === 'interview'} 
                  onClick={() => { setView('interview'); setIsSidebarOpen(false); }}
                />
              </nav>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="mt-auto pt-6 border-t border-slate-800">
            <div 
              onClick={() => setView('landing')}
              className="bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3 group cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                AM
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Alex Morgan</p>
                <p className="text-xs text-slate-500 truncate">Free Tier</p>
              </div>
              <LogOut className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Bar */}
            <div className="max-w-md w-full relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search skills, jobs, or lessons..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-blue-100 transition-all">
              <Sparkles className="w-3.5 h-3.5" />
              Upgrade to Pro
            </button>

            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
            </button>

            <div className="w-8 h-8 rounded-full bg-slate-200 lg:hidden" />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 no-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
