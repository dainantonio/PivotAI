import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Target, 
  Sparkles, 
  MoreVertical,
  RotateCcw,
  MessageSquare,
  ChevronRight,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { interview, CareerPath } from '../services/geminiService';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  feedback?: string;
}

interface InterviewSimulatorProps {
  careerData: CareerPath | null;
  setView: (view: any) => void;
}

export default function InterviewSimulator({ careerData, setView }: InterviewSimulatorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Hello Alex! I'm Coach Atlas. Today we're conducting a technical interview for the ${careerData?.recommendedPivot || 'AI Prompt Engineer'} position. To start, can you explain how you would optimize a prompt to reduce hallucinations in a RAG-based system?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [targetRole, setTargetRole] = useState(careerData?.recommendedPivot || 'AI Prompt Engineer');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const currentAnswer = input;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentAnswer,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      // Prepare history for Gemini
      const history = messages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        content: m.content
      }));

      const response = await interview(history, currentAnswer, targetRole);
      
      // Update the user's message with feedback
      setMessages(prev => prev.map(m => 
        m.id === userMessage.id ? { ...m, feedback: response.feedback } : m
      ));

      // Add AI's next question
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.nextQuestion
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "I'm sorry, I encountered an error processing your answer. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl">
      {/* Left Sidebar: Interview Context (1/3) */}
      <aside className="lg:w-1/3 bg-slate-900 p-8 lg:p-10 flex flex-col relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* AI Avatar Section */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse" />
              <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-blue-500/30 flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                <Bot className="w-12 h-12 text-blue-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-900 rounded-full" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-1">Coach Atlas</h2>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">AI Interviewer • Active</p>
          </div>

          {/* Details Panel */}
          <div className="space-y-8 flex-1">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Interview Context</p>
              <div className="space-y-3">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-colors">
                  <div className="bg-blue-500/20 p-2 rounded-xl">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Role</p>
                    <input 
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="text-sm font-bold text-white bg-transparent border-b border-white/10 focus:outline-none focus:border-blue-500 w-full"
                    />
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-colors">
                  <div className="bg-purple-500/20 p-2 rounded-xl">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Focus Area</p>
                    <p className="text-sm font-bold text-white">Technical Assessment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progress</p>
                <p className="text-xs font-bold text-white">4/10 Questions</p>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '40%' }}
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setMessages([{
                  id: '1',
                  role: 'ai',
                  content: `Hello Alex! I'm Coach Atlas. Today we're conducting a technical interview for the ${careerData?.recommendedPivot || 'AI Prompt Engineer'} position. To start, can you explain how you would optimize a prompt to reduce hallucinations in a RAG-based system?`
                }])}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Session
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <button 
              onClick={() => setShowEndConfirmation(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut className="w-4 h-4" />
              End Interview
            </button>
          </div>
        </div>

        {/* End Interview Confirmation Dialog */}
        <AnimatePresence>
          {showEndConfirmation && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-xs"
              >
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">End Interview?</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  Are you sure you want to end this session? Your progress in this mock interview will not be saved.
                </p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setView('dashboard')}
                    className="w-full py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors"
                  >
                    Yes, End Session
                  </button>
                  <button 
                    onClick={() => setShowEndConfirmation(false)}
                    className="w-full py-3 bg-white/5 text-slate-400 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* Main Area: Chat Interface (2/3) */}
      <div className="flex-1 flex flex-col bg-slate-50 relative">
        {/* Chat Header (Mobile) */}
        <div className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-bold text-slate-900">Coach Atlas</span>
          </div>
          <button className="p-2 text-slate-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Viewport */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-10 no-scrollbar"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] lg:max-w-[75%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`
                    p-5 lg:p-7 rounded-[2rem] shadow-sm relative
                    ${msg.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                    }
                  `}>
                    <p className="text-sm lg:text-base leading-relaxed font-medium">{msg.content}</p>
                  </div>
                  
                  {msg.feedback && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex items-start gap-3 shadow-sm max-w-[90%]"
                    >
                      <div className="bg-yellow-200/50 p-1.5 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-yellow-700" />
                      </div>
                      <p className="text-xs font-bold text-yellow-800 leading-relaxed">
                        {msg.feedback}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Atlas is thinking...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Controls (Floating Dock) */}
        <div className="p-6 lg:p-10 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-3 shadow-2xl flex items-center gap-3 lg:gap-4">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your answer..."
                  className="w-full bg-transparent py-4 pl-6 pr-4 text-sm lg:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pr-2">
                <button 
                  onClick={() => {
                    if (!isRecording) {
                      alert("Voice input activated. Speak clearly into your microphone.");
                    }
                    setIsRecording(!isRecording);
                  }}
                  className={`
                    w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all relative
                    ${isRecording 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }
                  `}
                >
                  {isRecording ? <MicOff className="w-5 h-5 lg:w-6 lg:h-6" /> : <Mic className="w-5 h-5 lg:w-6 lg:h-6" />}
                  {isRecording && (
                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
                  )}
                </button>

                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none active:scale-95"
                >
                  <Send className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Press Enter to Send
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <MessageSquare className="w-3.5 h-3.5" />
                Atlas is Listening
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
