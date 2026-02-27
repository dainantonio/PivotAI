import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Award, 
  Clock,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

const StatCard = ({ label, value, trend, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">
        <TrendingUp className="w-3 h-3" />
        {trend}
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
  </div>
);

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Alex</h1>
        <p className="text-slate-500">Here's what's happening with your workforce intelligence today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Skill Match" 
          value="84%" 
          trend="+12%" 
          icon={Award} 
          color="bg-blue-600" 
        />
        <StatCard 
          label="Job Applications" 
          value="12" 
          trend="+3" 
          icon={Briefcase} 
          color="bg-indigo-600" 
        />
        <StatCard 
          label="Learning Hours" 
          value="24.5h" 
          trend="+5.2h" 
          icon={Clock} 
          color="bg-purple-600" 
        />
        <StatCard 
          label="Network Reach" 
          value="1.2k" 
          trend="+18%" 
          icon={Users} 
          color="bg-slate-900" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Skill Growth Trajectory</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 w-full bg-slate-50 rounded-2xl border border-slate-100 flex items-end justify-between p-6 gap-2">
            {[40, 55, 45, 70, 60, 85, 75, 95, 80, 100, 90, 110].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-100 rounded-t-lg relative group">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(h / 110) * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                  className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-lg group-hover:bg-blue-500 transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Recommended Actions</h3>
          <div className="space-y-4">
            {[
              { title: 'Update Cloud Certs', desc: 'Your AWS cert expires in 30 days', type: 'Urgent' },
              { title: 'Review Job Match', desc: 'Senior Architect at NexaCorp', type: 'New' },
              { title: 'Complete Python Lab', desc: 'Advanced decorators module', type: 'Course' }
            ].map((action, i) => (
              <div key={i} className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{action.title}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 rounded text-slate-500">{action.type}</span>
                </div>
                <p className="text-xs text-slate-500">{action.desc}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
}

import { Briefcase } from 'lucide-react';
