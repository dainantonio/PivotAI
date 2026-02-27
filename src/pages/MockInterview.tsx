import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Info, 
  Target, 
  Sparkles, 
  User,
  MoreVertical,
  RotateCcw,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  feedback?: string;
}

export default function MockInterview() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: "Hello Alex! I'm Coach Atlas. Today we're conducting a technical interview for the AI Prompt Engineer position. To start, can you explain how you would optimize a prompt to reduce hallucinations in a RAG-based system?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      feedback: "AI Feedback: Great use of the STAR method, but mention Chain-of-Thought prompting next time."
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "That's a solid approach. Following up on that, how do you handle context window limitations when dealing with extremely large document sets?"
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl">
      {/* Left Sidebar: Context */}
      <aside className="w-72 border-r border-slate-100 bg-slate-50/50 p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 leading-tight">Coach Atlas</h3>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Online • AI Interviewer</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Role</p>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-slate-700">AI Prompt Engineer</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Focus Area</p>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-bold text-slate-700">Technical</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-bold text-blue-900">Interview Tip</p>
              </div>
              <p className="text-xs text-blue-700 leading-relaxed">
                Focus on specific metrics and frameworks you've used. Atlas values data-driven answers.
              </p>
            </div>
          </div>
        </div>

        <button className="mt-auto flex items-center justify-center gap-2 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <RotateCcw className="w-4 h-4" />
          Restart Session
        </button>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Chat Header (Mobile) */}
        <div className="lg:hidden h-16 border-b border-slate-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">Coach Atlas</span>
          </div>
          <button className="p-2 text-slate-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 no-scrollbar"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] lg:max-w-[70%] space-y-2`}>
                  <div className={`
                    p-4 lg:p-6 rounded-2xl shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                    }
                  `}>
                    <p className="text-sm lg:text-base leading-relaxed">{msg.content}</p>
                  </div>
                  
                  {msg.feedback && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-start gap-3 shadow-sm"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] font-medium text-amber-800 leading-tight">
                        {msg.feedback}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Bar */}
        <div className="p-6 lg:p-8 border-t border-slate-100 bg-white">
          <div className="max-w-4xl mx-auto flex items-center gap-3 lg:gap-4">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your response..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button 
                onClick={handleSend}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`
                  p-4 rounded-2xl transition-all relative group
                  ${isRecording 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }
                `}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isRecording && (
                  <span className="absolute inset-0 rounded-2xl bg-red-500 animate-ping opacity-20" />
                )}
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">
            Press Enter to send • Atlas is listening
          </p>
        </div>
      </div>
    </div>
  );
}
