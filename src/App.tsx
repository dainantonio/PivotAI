/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  ChevronRight, 
  Play, 
  BarChart3, 
  Users, 
  Zap, 
  Target, 
  ShieldCheck, 
  ArrowUpRight,
  Menu,
  X,
  Globe,
  Layers,
  Cpu,
  Upload,
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import ResumeOptimizer from './pages/ResumeOptimizer';
import InterviewSimulator from './pages/InterviewSimulator';
import LearningHub from './pages/LearningHub';
import CurriculumPlayer from './pages/CurriculumPlayer';
import PortfolioBuilder from './pages/PortfolioBuilder';
import CommunityNetwork from './pages/CommunityNetwork';
import Settings from './pages/Settings';
import JobMatches from './pages/JobMatches';
import Auth from './pages/Auth';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import ExperienceBuilder from './pages/ExperienceBuilder';
import RoleMatching from './pages/RoleMatching';
import GapAnalysis from './pages/GapAnalysis';
import UpskillPlan from './pages/UpskillPlan';
import ResumePortfolio from './pages/ResumePortfolio';
import StepIndicator from './components/StepIndicator';
import { CareerPath } from './services/geminiService';

export default function App() {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'experience' | 'matching' | 'gap-analysis' | 'upskill' | 'resume-portfolio' | 'settings'>('landing');
  const [wizardStep, setWizardStep] = useState(0);
  const [careerData, setCareerData] = useState<CareerPath | null>(() => {
    const saved = localStorage.getItem('pivotai_career_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (careerData) {
      localStorage.setItem('pivotai_career_data', JSON.stringify(careerData));
    } else {
      localStorage.removeItem('pivotai_career_data');
    }
  }, [careerData]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (view === 'auth') {
    return (
      <Auth 
        onLogin={() => setView('experience')} 
        onBack={() => setView('landing')} 
      />
    );
  }

  const wizardSteps = [
    { id: 'experience', title: 'Experience' },
    { id: 'matching', title: 'Matching' },
    { id: 'gap-analysis', title: 'Gap Analysis' },
    { id: 'upskill', title: 'Upskill' },
    { id: 'resume-portfolio', title: 'Profile' }
  ];

  const handleNextStep = () => {
    if (wizardStep < wizardSteps.length - 1) {
      const nextStep = wizardStep + 1;
      setWizardStep(nextStep);
      setView(wizardSteps[nextStep].id as any);
    } else {
      setView('dashboard');
    }
  };

  const handlePrevStep = () => {
    if (wizardStep > 0) {
      const prevStep = wizardStep - 1;
      setWizardStep(prevStep);
      setView(wizardSteps[prevStep].id as any);
    } else {
      setView('landing');
    }
  };

  if (view === 'dashboard' || view === 'experience' || view === 'matching' || view === 'gap-analysis' || view === 'upskill' || view === 'resume-portfolio' || view === 'settings') {
    const isWizardView = ['experience', 'matching', 'gap-analysis', 'upskill', 'resume-portfolio'].includes(view);

    return (
      <AppShell currentView={view} setView={setView}>
        {isWizardView && (
          <div className="pt-8 pb-12">
            <StepIndicator steps={wizardSteps} currentStepIndex={wizardStep} />
          </div>
        )}
        {view === 'dashboard' && <Dashboard careerData={careerData} setCareerData={setCareerData} setView={setView} />}
        {view === 'experience' && <ExperienceBuilder onNext={handleNextStep} />}
        {view === 'matching' && <RoleMatching onNext={handleNextStep} onBack={handlePrevStep} />}
        {view === 'gap-analysis' && <GapAnalysis onNext={handleNextStep} onBack={handlePrevStep} />}
        {view === 'upskill' && <UpskillPlan onNext={handleNextStep} onBack={handlePrevStep} />}
        {view === 'resume-portfolio' && <ResumePortfolio onNext={handleNextStep} onBack={handlePrevStep} />}
        {view === 'settings' && <Settings />}
      </AppShell>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Career Bridge</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Platform</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Solutions</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Resources</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => setView('auth')}
                className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Log in
              </button>
              <button 
                onClick={() => setView('auth')}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-4">
                <a href="#" className="block text-base font-medium text-slate-900">Platform</a>
                <a href="#" className="block text-base font-medium text-slate-900">Solutions</a>
                <a href="#" className="block text-base font-medium text-slate-900">Resources</a>
                <a href="#" className="block text-base font-medium text-slate-900">Pricing</a>
                <div className="pt-4 flex flex-col gap-3">
                  <button 
                    onClick={() => { setView('auth'); setIsMobileMenuOpen(false); }}
                    className="w-full text-center py-3 text-base font-semibold text-slate-700 border border-slate-200 rounded-xl"
                  >
                    Log in
                  </button>
                  <button 
                    onClick={() => { setView('auth'); setIsMobileMenuOpen(false); }}
                    className="w-full text-center py-3 text-base font-semibold text-white bg-indigo-600 rounded-xl"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-purple-200/30 blur-[120px] rounded-full" />
          <div className="absolute top-[20%] right-[10%] w-[25%] h-[25%] bg-blue-200/20 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Series B Funding Announcement
            <ChevronRight className="w-3 h-3" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]"
          >
            Turn your experience into <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
              AI-ready opportunities
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-16 leading-relaxed"
          >
            The intelligent platform that maps your existing skills to high-growth AI roles and builds your personalized transition path.
          </motion.p>

          {/* Input Options Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24"
          >
            {/* Option 1: Upload Resume */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer text-left flex flex-col h-full">
              <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Upload Resume</h3>
              <p className="text-slate-500 text-sm mb-8 flex-1">Let our AI analyze your professional history and extract your core transferable skills instantly.</p>
              
              <label className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-8 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 hover:border-indigo-300 transition-all cursor-pointer">
                <input type="file" className="hidden" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Drop PDF or Browse</span>
              </label>
            </div>

            {/* Option 2: Paste Job Description */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer text-left flex flex-col h-full">
              <div className="bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Paste Job Goal</h3>
              <p className="text-slate-500 text-sm mb-8 flex-1">Have a specific AI role in mind? Paste the description and we'll show you exactly how to bridge the gap.</p>
              
              <textarea 
                placeholder="Paste job description here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none h-32"
              />
            </div>

            {/* Option 3: Guided Input */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer text-left flex flex-col h-full">
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Guided Path</h3>
              <p className="text-slate-500 text-sm mb-8 flex-1">Not sure where to start? Our step-by-step career assessment will help you find your perfect AI pivot.</p>
              
              <button 
                onClick={() => setView('auth')}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all group/btn"
              >
                Start Assessment
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>


        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-12">
            Empowering workforce transformation at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale">
            {['Vanguard', 'NexaCorp', 'Luminary', 'Stratos', 'Aether'].map((name) => (
              <span key={name} className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Platform Capabilities</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Engineered for the Enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
            {/* Large Vertical Card */}
            <div className="md:col-span-4 md:row-span-2 bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Predictive Risk Modeling</h3>
                <p className="text-slate-600 leading-relaxed">
                  Identify flight risks and skill shortages before they impact your bottom line. Our AI models predict attrition with 94% accuracy.
                </p>
              </div>
              <div className="relative mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm font-bold text-indigo-600">
                  <span>Explore Risk Engine</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Dark Card */}
            <div className="md:col-span-8 md:row-span-1 bg-slate-900 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-300 overflow-hidden relative">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full" />
              <div className="flex-1 relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Skill Gap Analysis</h3>
                <p className="text-slate-400 mb-6">
                  Instantly map your entire organization's capabilities against industry benchmarks.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'AWS', 'Strategy', 'React', 'FinOps'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-medium border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-48 h-full bg-slate-800 rounded-2xl border border-slate-700 p-4 flex flex-col justify-center gap-3 relative z-10">
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-3/4" />
                </div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-1/2" />
                </div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-5/6" />
                </div>
              </div>
            </div>

            {/* Square Card */}
            <div className="md:col-span-4 md:row-span-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors">
                <Users className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Resume Optimizer</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automated internal mobility matching based on verified skills and project history.
              </p>
            </div>

            {/* Wide Horizontal Card */}
            <div className="md:col-span-4 md:row-span-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                  <Layers className="w-6 h-6 text-slate-600 group-hover:text-purple-600" />
                </div>
                <div className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded uppercase">Beta</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Live Curriculum</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Dynamic learning paths that evolve with your market position.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-6xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">2.4M</p>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Total Skills Mapped</p>
            </div>
            <div>
              <p className="text-6xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">185%</p>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Avg. Retention Boost</p>
            </div>
            <div>
              <p className="text-6xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">400+</p>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Enterprise Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">
            Ready to transform your <br /> workforce?
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Join the world's most innovative companies using PivotAI to build resilient, high-performing teams.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setView('auth')}
              className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-1 active:scale-95"
            >
              Start your assessment today
            </button>
            <button className="w-full sm:w-auto text-slate-600 font-bold hover:text-slate-900 transition-colors px-6 py-4">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      {/* Mega Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            <div className="md:col-span-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <BrainCircuit className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">PivotAI</span>
              </div>
              <p className="text-slate-500 leading-relaxed mb-8 max-w-xs">
                The Operating System for Workforce Intelligence. Building the infrastructure for the future of work.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-slate-900 mb-6">Solutions</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Enterprise</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Startups</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Government</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Education</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-slate-900 mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-slate-900 mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Newsroom</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © 2026 PivotAI Technologies Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-slate-600 transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
