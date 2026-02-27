import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Github, 
  Mail, 
  Lock, 
  ArrowRight,
  Quote,
  Chrome
} from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function Auth({ onLogin, onBack }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Left Side: Brand & Inspiration */}
      <div className="lg:w-1/2 bg-slate-900 relative overflow-hidden flex flex-col p-12 lg:p-20">
        {/* Glowing Gradients */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          <div 
            onClick={onBack}
            className="flex items-center gap-3 mb-20 cursor-pointer group w-fit"
          >
            <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">PivotAI</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-8"
            >
              Pilot the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Future of Work.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 text-lg max-w-md mb-12 leading-relaxed"
            >
              The workforce is changing. Don't just adapt—evolve. Join 50,000+ professionals pivoting their careers with AI.
            </motion.p>

            {/* Testimonial Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md relative group"
            >
              <Quote className="absolute -top-4 -left-4 w-10 h-10 text-blue-500/40" />
              <p className="text-white text-lg font-medium leading-relaxed mb-6 italic">
                "PivotAI didn't just show me the risk; it gave me the exact roadmap to transition. I went from a struggling copywriter to a lead Prompt Engineer in 4 months."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  JS
                </div>
                <div>
                  <p className="text-white font-bold">James Sterling</p>
                  <p className="text-slate-400 text-sm">Former Copywriter, Now Prompt Engineer</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-auto pt-12 text-slate-500 text-sm">
            © 2026 PivotAI Intelligence Systems. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-20">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate-500">
              {mode === 'login' 
                ? 'Enter your credentials to access your career intelligence.' 
                : 'Start your career evolution today. No credit card required.'}
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <Chrome className="w-5 h-5" />
              Google
            </button>
            <button className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <Github className="w-5 h-5" />
              GitHub
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-slate-400">
              <span className="bg-slate-50 px-4">Or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Password</label>
                {mode === 'login' && (
                  <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-bold text-blue-600 hover:text-blue-700"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
