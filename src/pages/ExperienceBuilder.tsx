import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  Trash2,
  Upload,
  Type,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  Settings,
  Target,
  Users,
  Building2,
  Wand2,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService, ParsedProfile } from '../services/aiService';

interface ExperienceBuilderProps {
  onNext: (profile: ParsedProfile) => void;
  onBack?: () => void;
}

type Mode = 'initial' | 'parsing' | 'guided' | 'results' | 'pasting';

export default function ExperienceBuilder({ onNext, onBack }: ExperienceBuilderProps) {
  const [mode, setMode] = useState<Mode>('initial');
  const [currentStep, setCurrentStep] = useState(1);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data States
  const [currentRole, setCurrentRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [repetitiveTasks, setRepetitiveTasks] = useState<string[]>([]);
  const [decisionMakingLevel, setDecisionMakingLevel] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [experience, setExperience] = useState<ParsedProfile['experience']>([]);

  const [guidedData, setGuidedData] = useState({
    jobTitle: '',
    tasks: '',
    tools: '',
    teamSize: '',
    industry: ''
  });

  const [pasteText, setPasteText] = useState('');

  const handleStartParsing = async (textToParse?: string) => {
    const text = textToParse || pasteText;
    if (!text) return;

    setMode('parsing');
    setIsParsing(true);
    setError(null);

    try {
      const result = await aiService.parseExperience(text);
      setCurrentRole(result.currentRole);
      setIndustry(result.industry);
      setYearsOfExperience(result.yearsOfExperience);
      setRepetitiveTasks(result.repetitiveTasks);
      setDecisionMakingLevel(result.decisionMakingLevel);
      setSkills(result.skills);
      setTools(result.tools);
      setExperience(result.experience);
      
      // Flatten responsibilities and achievements from all experience entries
      const allResponsibilities = result.experience.flatMap(exp => exp.responsibilities || []);
      setResponsibilities(allResponsibilities);
      
      const allAchievements = result.experience.flatMap(exp => exp.achievements);
      setAchievements(allAchievements);
      
      setMode('results');
    } catch (err) {
      console.error(err);
      setError("Failed to parse experience. Please try again.");
      setMode('initial');
    } finally {
      setIsParsing(false);
    }
  };

  const handleGuidedSubmit = () => {
    const combinedText = `
      Job Title: ${guidedData.jobTitle}
      Tasks: ${guidedData.tasks}
      Tools: ${guidedData.tools}
      Team Size: ${guidedData.teamSize}
      Industry: ${guidedData.industry}
    `;
    handleStartParsing(combinedText);
  };

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addTool = (tool: string) => {
    if (tool && !tools.includes(tool)) {
      setTools([...tools, tool]);
    }
  };

  const removeTool = (tool: string) => {
    setTools(tools.filter(t => t !== tool));
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = value;
    setAchievements(newAchievements);
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const addAchievement = () => {
    setAchievements([...achievements, '']);
  };

  const updateResponsibility = (index: number, value: string) => {
    const newResponsibilities = [...responsibilities];
    newResponsibilities[index] = value;
    setResponsibilities(newResponsibilities);
  };

  const removeResponsibility = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const addResponsibility = () => {
    setResponsibilities([...responsibilities, '']);
  };

  // Render Initial Selection
  if (mode === 'initial') {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            AI Career <span className="text-indigo-600">Transformation</span> Strategist
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            I'll convert your background into a high-ROI, AI-adjacent career path. Let's start by extracting your core competencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Upload Resume */}
          <motion.button
            whileHover={{ y: -8 }}
            onClick={handleStartParsing}
            className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 hover:border-indigo-500 transition-all text-left group shadow-sm hover:shadow-xl"
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Upload Resume</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              PDF or Word. Our AI will parse your history instantly.
            </p>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              Select File <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>

          {/* Paste Text */}
          <motion.button
            whileHover={{ y: -8 }}
            onClick={() => setMode('pasting')}
            className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 hover:border-indigo-500 transition-all text-left group shadow-sm hover:shadow-xl"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Type className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Paste Text</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Copy and paste your experience or LinkedIn bio.
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              Open Editor <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>

          {/* Guided Path */}
          <motion.button
            whileHover={{ y: -8 }}
            onClick={() => setMode('guided')}
            className="bg-indigo-900 p-10 rounded-[2.5rem] border-2 border-transparent hover:border-indigo-400 transition-all text-left group shadow-xl shadow-indigo-100"
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-indigo-300" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4">Guided Path</h3>
            <p className="text-indigo-200/70 text-sm leading-relaxed mb-8">
              Don't have a resume? We'll help you build one step-by-step.
            </p>
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              Start Wizard <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  // Render Pasting View
  if (mode === 'pasting') {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Paste Your Experience</h2>
            <button onClick={() => setMode('initial')} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-slate-500 mb-8">
            Paste your resume text, LinkedIn profile, or a detailed description of your work history.
          </p>
          <textarea
            autoFocus
            placeholder="Paste here..."
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-lg focus:outline-none focus:border-indigo-500 transition-all min-h-[300px] mb-8"
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              onClick={() => handleStartParsing()}
              disabled={!pasteText.trim()}
              className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyze Experience
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Parsing View
  if (mode === 'parsing') {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12"
        >
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center relative z-10">
              <BrainCircuit className="w-16 h-16 text-white animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20" />
            <div className="absolute -inset-4 border-2 border-dashed border-indigo-200 rounded-full animate-[spin_10s_linear_infinite]" />
          </div>
        </motion.div>
        
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
          AI Experience Extraction in Progress
        </h2>
        <p className="text-slate-500 text-lg mb-12 max-w-md mx-auto">
          We're analyzing your professional DNA to identify transferable skills for the AI economy.
        </p>

        <div className="max-w-md mx-auto space-y-4">
          {[
            'Parsing professional history...',
            'Identifying core competencies...',
            'Mapping transferable skills...',
            'Generating AI-ready suggestions...'
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-400">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${i < 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
                {i < 2 ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />}
              </div>
              {text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render Guided View
  if (mode === 'guided') {
    const steps = [
      { id: 1, title: 'Job Title', icon: Briefcase, field: 'jobTitle', placeholder: 'e.g. Senior Marketing Manager' },
      { id: 2, title: 'Daily Tasks', icon: Settings, field: 'tasks', placeholder: 'What were your primary responsibilities?' },
      { id: 3, title: 'Tools Used', icon: Wand2, field: 'tools', placeholder: 'e.g. Salesforce, Python, Excel' },
      { id: 4, title: 'Team Size', icon: Users, field: 'teamSize', placeholder: 'How many people did you manage or work with?' },
      { id: 5, title: 'Industry', icon: Building2, field: 'industry', placeholder: 'e.g. Fintech, Healthcare, SaaS' }
    ];

    const currentStepData = steps.find(s => s.id === currentStep)!;

    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setMode('initial')}
              className="text-slate-400 hover:text-slate-600 font-bold text-sm flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <div className="flex gap-2">
              {steps.map(s => (
                <div 
                  key={s.id}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    s.id === currentStep ? 'w-8 bg-indigo-600' : s.id < currentStep ? 'w-4 bg-emerald-500' : 'w-4 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-100"
            >
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8">
                <currentStepData.icon className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                {currentStepData.title}
              </h2>
              <p className="text-slate-500 mb-8">
                Step {currentStep} of 5: Tell us about your role.
              </p>

              {currentStepData.field === 'tasks' ? (
                <textarea
                  autoFocus
                  placeholder={currentStepData.placeholder}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-lg focus:outline-none focus:border-indigo-500 transition-all min-h-[200px]"
                  value={(guidedData as any)[currentStepData.field]}
                  onChange={(e) => setGuidedData({ ...guidedData, [currentStepData.field]: e.target.value })}
                />
              ) : (
                <input
                  autoFocus
                  type="text"
                  placeholder={currentStepData.placeholder}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-xl focus:outline-none focus:border-indigo-500 transition-all"
                  value={(guidedData as any)[currentStepData.field]}
                  onChange={(e) => setGuidedData({ ...guidedData, [currentStepData.field]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && (currentStep < 5 ? setCurrentStep(currentStep + 1) : handleGuidedSubmit())}
                />
              )}

              <div className="mt-12 flex justify-end">
                <button
                  onClick={() => currentStep < 5 ? setCurrentStep(currentStep + 1) : handleGuidedSubmit()}
                  className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                >
                  {currentStep === 5 ? 'Complete Profile' : 'Next Step'}
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Render Results View (Split Screen)
  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Editable Data */}
        <div className="flex-1 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Extracted Experience</h2>
                <p className="text-slate-500 text-sm">Refine your skills and achievements below.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4" />
                Verified by AI
              </div>
            </div>

            <div className="p-8 space-y-10">
              {/* Professional Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Current Role</label>
                  <input 
                    type="text" 
                    value={currentRole} 
                    onChange={(e) => setCurrentRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Industry</label>
                  <input 
                    type="text" 
                    value={industry} 
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Years of Experience</label>
                  <input 
                    type="text" 
                    value={yearsOfExperience} 
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Decision Level</label>
                  <select 
                    value={decisionMakingLevel} 
                    onChange={(e) => setDecisionMakingLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-all appearance-none"
                  >
                    <option value="Entry">Entry Level</option>
                    <option value="Mid">Mid Level</option>
                    <option value="Senior">Senior Level</option>
                    <option value="Executive">Executive Level</option>
                  </select>
                </div>
              </div>

              {/* Repetitive Tasks */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Repetitive Tasks (Automation Opportunities)</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {repetitiveTasks.map(task => (
                    <span key={task} className="group flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold border border-amber-100">
                      {task}
                      <button onClick={() => setRepetitiveTasks(repetitiveTasks.filter(t => t !== task))} className="text-amber-300 hover:text-amber-600 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <button className="px-4 py-2 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl text-sm font-bold hover:border-amber-300 hover:text-amber-600 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Core Skills</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map(skill => (
                    <span key={skill} className="group flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-100">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="text-indigo-300 hover:text-indigo-600 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <button className="px-4 py-2 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl text-sm font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                </div>
              </div>

              {/* Tools */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Tools & Technology</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tools.map(tool => (
                    <span key={tool} className="group flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold border border-slate-200">
                      {tool}
                      <button onClick={() => removeTool(tool)} className="text-slate-300 hover:text-slate-600 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <button className="px-4 py-2 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl text-sm font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Tool
                  </button>
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Key Responsibilities</label>
                <div className="space-y-4">
                  {responsibilities.map((responsibility, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex-1">
                        <textarea
                          value={responsibility}
                          onChange={(e) => updateResponsibility(i, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[80px]"
                        />
                      </div>
                      <button 
                        onClick={() => removeResponsibility(i)}
                        className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addResponsibility}
                    className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Responsibility
                  </button>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Key Achievements</label>
                <div className="space-y-4">
                  {achievements.map((achievement, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex-1">
                        <textarea
                          value={achievement}
                          onChange={(e) => updateAchievement(i, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[80px]"
                        />
                      </div>
                      <button 
                        onClick={() => removeAchievement(i)}
                        className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addAchievement}
                    className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Achievement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: AI Suggestions */}
        <div className="lg:w-[450px] space-y-8">
          <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 sticky top-8">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-white/10 p-2 rounded-xl">
                  <Sparkles className="w-6 h-6 text-indigo-300" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">AI Insights</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">Transferable Strengths</h4>
                  <div className="space-y-3">
                    {[
                      { title: 'Data-Driven Strategy', desc: 'Your experience with Tableau and Market Analysis maps perfectly to AI Product Strategy.' },
                      { title: 'Stakeholder Management', desc: 'Leading cross-functional teams is a critical skill for AI implementation projects.' }
                    ].map((item, i) => (
                      <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <p className="text-sm font-bold mb-1">{item.title}</p>
                        <p className="text-xs text-indigo-200/70 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">Recommended Additions</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Product Lifecycle', 'Agile Methodology', 'User Research', 'A/B Testing'].map(tag => (
                      <button key={tag} className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 rounded-lg text-[10px] font-bold border border-indigo-400/20 transition-colors flex items-center gap-2">
                        <Plus className="w-3 h-3" />
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <button 
                    onClick={() => {
                      const updatedExperience = experience.map((exp, i) => {
                        if (i === 0) {
                          return {
                            ...exp,
                            achievements: achievements,
                            responsibilities: responsibilities
                          };
                        }
                        return {
                          ...exp,
                          achievements: [],
                          responsibilities: []
                        };
                      });
                      onNext({ 
                        currentRole, 
                        industry, 
                        yearsOfExperience, 
                        repetitiveTasks, 
                        decisionMakingLevel, 
                        skills, 
                        tools, 
                        experience: updatedExperience 
                      });
                    }}
                    className="w-full bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all shadow-xl"
                  >
                    Confirm & Match Roles
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/20 blur-[100px] rounded-full" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 blur-[60px] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
