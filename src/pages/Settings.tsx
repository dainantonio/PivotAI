import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  CreditCard, 
  Cpu, 
  Bell, 
  Download, 
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SettingsTab = 'profile' | 'security' | 'billing' | 'api' | 'notifications';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    role: 'Aspiring AI Prompt Engineer',
    location: 'San Francisco, CA'
  });
  const [tempProfileData, setTempProfileData] = useState(profileData);

  const handleEditProfile = () => {
    setTempProfileData(profileData);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setProfileData(tempProfileData);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Account Security', icon: Shield },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'api', label: 'API Usage', icon: Cpu },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const invoices = [
    { date: 'Feb 01, 2026', amount: '$29.00', status: 'Paid' },
    { date: 'Jan 01, 2026', amount: '$29.00', status: 'Paid' },
    { date: 'Dec 01, 2025', amount: '$29.00', status: 'Paid' },
  ];

  const tokenUsage = 45000;
  const tokenLimit = 100000;
  const usagePercent = (tokenUsage / tokenLimit) * 100;

  const getUsageColor = (percent: number) => {
    if (percent > 90) return 'bg-red-500';
    if (percent > 70) return 'bg-amber-500';
    return 'bg-blue-600';
  };

  const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? 'bg-blue-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  const [notifications, setNotifications] = useState({
    jobMatches: true,
    curriculumUpdates: true,
    mentorMessages: false,
    securityAlerts: true
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-160px)]">
      {/* Left Navigation Menu */}
      <aside className="w-full lg:w-64 flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as SettingsTab)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Public Profile</h2>
                <p className="text-slate-500">Manage your public presence and how others see you on PivotAI.</p>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-xl">
                    AM
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-slate-600 hover:text-blue-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Full Name</label>
                      {isEditingProfile ? (
                        <input 
                          type="text" 
                          value={tempProfileData.name}
                          onChange={(e) => setTempProfileData({ ...tempProfileData, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-900"
                        />
                      ) : (
                        <p className="text-slate-900 font-bold">{profileData.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Email Address</label>
                      {isEditingProfile ? (
                        <input 
                          type="email" 
                          value={tempProfileData.email}
                          onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-900"
                        />
                      ) : (
                        <p className="text-slate-900 font-bold">{profileData.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Current Role</label>
                      {isEditingProfile ? (
                        <input 
                          type="text" 
                          value={tempProfileData.role}
                          onChange={(e) => setTempProfileData({ ...tempProfileData, role: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-900"
                        />
                      ) : (
                        <p className="text-slate-900 font-bold">{profileData.role}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Location</label>
                      {isEditingProfile ? (
                        <input 
                          type="text" 
                          value={tempProfileData.location}
                          onChange={(e) => setTempProfileData({ ...tempProfileData, location: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-900"
                        />
                      ) : (
                        <p className="text-slate-900 font-bold">{profileData.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
                    {isEditingProfile ? (
                      <>
                        <button 
                          onClick={handleSaveProfile}
                          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2"
                        >
                          Save Changes
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="bg-slate-100 text-slate-600 px-8 py-3 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={handleEditProfile}
                        className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2"
                      >
                        Edit Profile
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div
              key="billing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Billing & Plans</h2>
                <p className="text-slate-500">Manage your subscription, payment methods, and view invoices.</p>
              </div>

              {/* Current Plan Card */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-blue-600 text-[10px] font-black uppercase tracking-widest rounded">Active</span>
                      <h3 className="text-xl font-bold">Pro Plan</h3>
                    </div>
                    <p className="text-3xl font-black text-blue-400 mb-4">$29<span className="text-sm font-medium text-slate-400">/mo</span></p>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Next billing date: March 01, 2026
                    </div>
                  </div>
                  <button 
                    onClick={() => alert("Redirecting to Stripe Customer Portal...")}
                    className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all shadow-lg active:scale-95"
                  >
                    Manage Subscription
                  </button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 blur-[60px] rounded-full" />
              </div>

              {/* API Usage Widget */}
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-bold text-slate-900">AI Generation Tokens</h4>
                    <p className="text-sm text-slate-500">Usage for the current billing cycle</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">{tokenUsage.toLocaleString()} / {tokenLimit.toLocaleString()}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tokens Used</p>
                  </div>
                </div>
                
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden mb-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${usagePercent}%` }}
                    className={`h-full transition-colors duration-500 ${getUsageColor(usagePercent)}`}
                  />
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <AlertCircle className="w-4 h-4" />
                  You have used {usagePercent}% of your monthly token allowance.
                </div>
              </div>

              {/* Invoice History */}
              <div>
                <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                  Invoice History
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="pb-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {invoices.map((invoice, i) => (
                        <tr key={i} className="group hover:bg-slate-50 transition-colors">
                          <td className="py-4 text-sm font-medium text-slate-700">{invoice.date}</td>
                          <td className="py-4 text-sm font-bold text-slate-900">{invoice.amount}</td>
                          <td className="py-4">
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-100">
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => alert(`Downloading invoice for ${invoice.date}...`)}
                              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Account Security</h2>
                <p className="text-slate-500">Manage your password and security preferences.</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-4">Change Password</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="password" 
                      placeholder="Current Password"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <input 
                      type="password" 
                      placeholder="New Password"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <button 
                    onClick={() => alert("Password update initiated. Check your email for confirmation.")}
                    className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                  >
                    Update Password
                  </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <div>
                    <h4 className="font-bold text-slate-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                  </div>
                  <Toggle enabled={false} onChange={() => alert("2FA setup will be available in the next update.")} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div
              key="api"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">API Usage</h2>
                <p className="text-slate-500">Manage your API keys for integrating PivotAI into your workflows.</p>
              </div>

              <div className="space-y-6">
                <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold">Production API Key</h4>
                    <span className="px-2 py-0.5 bg-emerald-500 text-[10px] font-black uppercase tracking-widest rounded">Active</span>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 mb-4">
                    <code className="text-blue-400 font-mono text-sm truncate">pk_live_51P...9k2m</code>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText("pk_live_51P...9k2m");
                        alert("API key copied to clipboard!");
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">Created on Jan 12, 2026. Never share your secret keys.</p>
                </div>

                <button 
                  onClick={() => alert("New API key generation is currently restricted to Enterprise accounts.")}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-sm font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  + Create New API Key
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Notifications</h2>
                <p className="text-slate-500">Choose how you want to be notified about your career progress.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <div>
                    <h4 className="font-bold text-slate-900">Job Matches</h4>
                    <p className="text-sm text-slate-500">Email me about new job matches that fit my profile.</p>
                  </div>
                  <Toggle 
                    enabled={notifications.jobMatches} 
                    onChange={() => setNotifications(prev => ({ ...prev, jobMatches: !prev.jobMatches }))} 
                  />
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <div>
                    <h4 className="font-bold text-slate-900">Curriculum Updates</h4>
                    <p className="text-sm text-slate-500">Notify me when new lessons are added to my path.</p>
                  </div>
                  <Toggle 
                    enabled={notifications.curriculumUpdates} 
                    onChange={() => setNotifications(prev => ({ ...prev, curriculumUpdates: !prev.curriculumUpdates }))} 
                  />
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <div>
                    <h4 className="font-bold text-slate-900">Mentor Messages</h4>
                    <p className="text-sm text-slate-500">Receive alerts when a mentor responds to your intro request.</p>
                  </div>
                  <Toggle 
                    enabled={notifications.mentorMessages} 
                    onChange={() => setNotifications(prev => ({ ...prev, mentorMessages: !prev.mentorMessages }))} 
                  />
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <div>
                    <h4 className="font-bold text-slate-900">Security Alerts</h4>
                    <p className="text-sm text-slate-500">Get notified about new logins or security changes.</p>
                  </div>
                  <Toggle 
                    enabled={notifications.securityAlerts} 
                    onChange={() => setNotifications(prev => ({ ...prev, securityAlerts: !prev.securityAlerts }))} 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab !== 'billing' && activeTab !== 'notifications' && activeTab !== 'profile' && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-12"
            >
              <div className="bg-slate-50 p-6 rounded-3xl mb-4">
                <ExternalLink className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Section Under Development</h3>
              <p className="text-slate-500 max-w-xs mt-2">We're currently polishing the {activeTab} settings for you.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
