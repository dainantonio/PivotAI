import AgentLayout from "@/components/AgentLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Markdown } from "@/components/Markdown";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Brain,
  Send,
  Sparkles,
  Loader2,
  Target,
  FileText,
  Briefcase,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  Wrench,
  CheckCircle2,
  Plus,
  ArrowRight,
  Zap,
} from "lucide-react";

const AGENT_TYPES = [
  { id: "orchestrator", label: "Master Orchestrator", icon: Brain, color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", desc: "Plans & coordinates all agents" },
  { id: "career_strategist", label: "Career Strategist", icon: Target, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", desc: "Risk analysis & career pivots" },
  { id: "resume_expert", label: "Resume Expert", icon: FileText, color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20", desc: "ATS optimization & rewriting" },
  { id: "interview_coach", label: "Coach Atlas", icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", desc: "Interview prep & STAR stories" },
  { id: "skill_analyst", label: "Skill Analyst", icon: TrendingUp, color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20", desc: "Skill gaps & learning roadmap" },
  { id: "job_matcher", label: "Job Matcher", icon: Briefcase, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", desc: "Job matching & market intel" },
];

const EXAMPLE_GOALS = [
  "I'm a software engineer with 5 years of experience. Help me transition into AI/ML engineering.",
  "Analyze my career risk as a data analyst and create a complete pivot strategy.",
  "I want to move from marketing manager to product manager. Build me a full plan.",
  "Help me prepare for senior engineering interviews at FAANG companies.",
  "I'm a teacher wanting to transition into instructional design or ed-tech. What's my path?",
];

export default function AgentCommandCenter() {
  const { user } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState("orchestrator");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const { data: sessions } = trpc.agent.listSessions.useQuery({ limit: 10 });

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/agent/stream",
      prepareSendMessagesRequest({ messages: msgs, id }) {
        return {
          body: {
            message: msgs[msgs.length - 1],
            agentType: selectedAgent,
            userId: user?.id,
            sessionId,
          },
        };
      },
    }),
    onError: (error) => {
      toast.error("Agent error: " + error.message);
    },
    onFinish: () => {
      utils.agent.listSessions.invalidate();
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    sendMessage({ text: inputValue.trim() });
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectedAgentInfo = AGENT_TYPES.find((a) => a.id === selectedAgent)!;

  return (
    <AgentLayout title="Agent Command Center" subtitle="Autonomous multi-agent career AI">
      <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
        {/* Left: Agent selector + sessions */}
        <div className="w-72 border-r border-border flex flex-col shrink-0 overflow-hidden">
          {/* Agent selector */}
          <div className="p-4 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Select Agent</p>
            <div className="space-y-1">
              {AGENT_TYPES.map((agent) => {
                const Icon = agent.icon;
                const isSelected = selectedAgent === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${
                      isSelected
                        ? `${agent.bg} border ${agent.border}`
                        : "hover:bg-secondary border border-transparent"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? agent.color : "text-muted-foreground"}`} />
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${isSelected ? agent.color : "text-foreground"}`}>
                        {agent.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">{agent.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent sessions */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 pb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sessions</p>
              <Button
                size="icon"
                variant="ghost"
                className="w-5 h-5 text-muted-foreground hover:text-primary"
                onClick={() => {
                  setSessionId(null);
                }}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <ScrollArea className="flex-1 px-4">
              {sessions && sessions.length > 0 ? (
                <div className="space-y-1 pb-4">
                  {sessions.map((session) => (
                    <Link key={session.id} href={`/agent/session/${session.id}`}>
                      <div className="p-2 rounded-lg hover:bg-secondary cursor-pointer group">
                        <p className="text-xs text-foreground truncate group-hover:text-primary transition-colors">
                          {session.title || session.goal.slice(0, 40)}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            session.status === "completed" ? "bg-green-400" :
                            session.status === "executing" ? "bg-primary" :
                            session.status === "failed" ? "bg-destructive" : "bg-muted-foreground"
                          }`} />
                          <p className="text-[10px] text-muted-foreground capitalize">{session.status}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">No sessions yet</p>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Center: Chat interface */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Agent header */}
          <div className={`px-6 py-3 border-b border-border flex items-center gap-3 ${selectedAgentInfo.bg}`}>
            {(() => {
              const Icon = selectedAgentInfo.icon;
              return <Icon className={`w-5 h-5 ${selectedAgentInfo.color}`} />;
            })()}
            <div>
              <p className={`text-sm font-semibold ${selectedAgentInfo.color}`}>{selectedAgentInfo.label}</p>
              <p className="text-[10px] text-muted-foreground">{selectedAgentInfo.desc}</p>
            </div>
            {isLoading && (
              <div className="ml-auto flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full bg-primary animate-bounce`}
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-primary">Agent thinking...</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={stop}
                >
                  Stop
                </Button>
              </div>
            )}
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1" ref={scrollRef}>
            <div className="p-6 space-y-6">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className={`w-16 h-16 rounded-2xl ${selectedAgentInfo.bg} border ${selectedAgentInfo.border} flex items-center justify-center`}>
                    {(() => {
                      const Icon = selectedAgentInfo.icon;
                      return <Icon className={`w-8 h-8 ${selectedAgentInfo.color}`} />;
                    })()}
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{selectedAgentInfo.label}</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">{selectedAgentInfo.desc}. Describe your goal and I'll get to work.</p>
                  </div>
                  <div className="w-full max-w-lg space-y-2">
                    <p className="text-xs text-muted-foreground text-center mb-3">Try an example goal:</p>
                    {EXAMPLE_GOALS.slice(0, 3).map((goal) => (
                      <button
                        key={goal}
                        onClick={() => setInputValue(goal)}
                        className="w-full text-left p-3 rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-all text-xs text-muted-foreground hover:text-foreground"
                      >
                        <ChevronRight className="w-3 h-3 inline mr-1 text-primary" />
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && (
                    <div className={`w-8 h-8 rounded-lg ${selectedAgentInfo.bg} border ${selectedAgentInfo.border} flex items-center justify-center shrink-0 mt-0.5`}>
                      {(() => {
                        const Icon = selectedAgentInfo.icon;
                        return <Icon className={`w-4 h-4 ${selectedAgentInfo.color}`} />;
                      })()}
                    </div>
                  )}

                  <div className={`max-w-[75%] space-y-2 ${message.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                    {message.parts.map((part, i) => {
                      if (part.type === "text") {
                        return (
                          <div
                            key={i}
                            className={`rounded-xl px-4 py-3 text-sm ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-card border border-border text-foreground"
                            }`}
                          >
                            {message.role === "user" ? (
                              <p className="whitespace-pre-wrap">{part.text}</p>
                            ) : (
                              <div className="prose prose-sm max-w-none prose-invert">
                                <Markdown>{part.text}</Markdown>
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Tool invocation
                      if (part.type.startsWith("tool-")) {
                        const toolName = part.type.replace("tool-", "");
                        const isRunning = (part as any).state === "input-streaming" || (part as any).state === "input-available";
                        const isDone = (part as any).state === "output-available";

                        return (
                          <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-secondary border border-border text-xs">
                            {isRunning ? (
                              <Loader2 className="w-3.5 h-3.5 text-primary animate-spin shrink-0 mt-0.5" />
                            ) : isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                            ) : (
                              <Wrench className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className="text-muted-foreground">Tool: </span>
                              <span className="text-primary font-mono">{toolName}</span>
                              {isRunning && <span className="text-muted-foreground ml-1">running...</span>}
                              {isDone && <span className="text-green-400 ml-1">completed</span>}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Tell ${selectedAgentInfo.label} your career goal...`}
                  className="min-h-[52px] max-h-32 resize-none bg-card border-border text-foreground placeholder:text-muted-foreground pr-4 text-sm"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="h-[52px] w-[52px] shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                size="icon"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] text-muted-foreground">
                <kbd className="px-1 py-0.5 rounded bg-secondary text-[9px]">Enter</kbd> to send,{" "}
                <kbd className="px-1 py-0.5 rounded bg-secondary text-[9px]">Shift+Enter</kbd> for new line
              </p>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-[10px] text-muted-foreground">Powered by Gemini 2.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
