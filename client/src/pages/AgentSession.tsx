import AgentLayout from "@/components/AgentLayout";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Markdown } from "@/components/Markdown";
import { useParams, Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import {
  Brain,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Target,
  FileText,
  Briefcase,
  MessageSquare,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Wrench,
} from "lucide-react";
import { useState } from "react";

const agentIcons: Record<string, React.ElementType> = {
  orchestrator: Brain,
  career_strategist: Target,
  resume_expert: FileText,
  interview_coach: MessageSquare,
  skill_analyst: TrendingUp,
  job_matcher: Briefcase,
};

const agentColors: Record<string, string> = {
  orchestrator: "text-primary",
  career_strategist: "text-green-400",
  resume_expert: "text-violet-400",
  interview_coach: "text-amber-400",
  skill_analyst: "text-pink-400",
  job_matcher: "text-blue-400",
};

function statusIcon(status: string) {
  switch (status) {
    case "completed": return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    case "executing":
    case "planning": return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
    case "failed": return <AlertCircle className="w-4 h-4 text-destructive" />;
    default: return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    completed: "bg-green-400/10 text-green-400 border-green-400/20",
    executing: "bg-primary/10 text-primary border-primary/20",
    planning: "bg-primary/10 text-primary border-primary/20",
    failed: "bg-destructive/10 text-destructive border-destructive/20",
    pending: "bg-muted text-muted-foreground border-border",
  };
  return map[status] || map.pending;
}

export default function AgentSession() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());

  const { data: session, isLoading } = trpc.agent.getSession.useQuery({ sessionId });
  const { data: tasks } = trpc.agent.getTaskQueue.useQuery({ sessionId });
  const { data: messages } = trpc.agent.getSessionMessages.useQuery({ sessionId });

  const toggleTask = (id: number) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <AgentLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AgentLayout>
    );
  }

  if (!session) {
    return (
      <AgentLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
          <p className="text-muted-foreground">Session not found</p>
          <Link href="/agent">
            <Button variant="outline" size="sm" className="border-border gap-1">
              <ArrowLeft className="w-3 h-3" />
              Back to Agent Center
            </Button>
          </Link>
        </div>
      </AgentLayout>
    );
  }

  const progress = session.totalTasks
    ? Math.round(((session.completedTasks ?? 0) / session.totalTasks) * 100)
    : 0;

  // Determine agent type from tasks or default to orchestrator
  const primaryAgentType = (tasks && tasks.length > 0 ? tasks[0].agentType : "orchestrator") as string;
  const AgentIcon = agentIcons[primaryAgentType] || Brain;
  const agentColor = agentColors[primaryAgentType] || "text-primary";

  return (
    <AgentLayout
      title={session.title || session.goal.slice(0, 60)}
      subtitle={`Session ${session.id}`}
    >
      <div className="p-6 space-y-6">
        {/* Back + status bar */}
        <div className="flex items-center gap-4">
          <Link href="/agent">
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1">
              <ArrowLeft className="w-3 h-3" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            {statusIcon(session.status)}
            <Badge variant="outline" className={`text-xs ${statusBadge(session.status)}`}>
              {session.status}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">
            {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Goal card */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <AgentIcon className={`w-5 h-5 ${agentColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Goal</p>
              <p className="text-sm text-foreground leading-relaxed">{session.goal}</p>
              {session.totalTasks && session.totalTasks > 0 && (
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground shrink-0">
                    {session.completedTasks}/{session.totalTasks} tasks
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Tasks panel */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Agent Tasks</h3>
            {tasks && tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.map((task) => {
                  const isExpanded = expandedTasks.has(task.id as unknown as number);
                  const taskIdNum = task.id.charCodeAt(0); // use string id for toggle
                  return (
                    <div key={task.id} className="rounded-lg border border-border bg-card overflow-hidden">
                      <button
                        onClick={() => {
                          setExpandedTasks((prev) => {
                            const next = new Set(prev);
                            if (next.has(taskIdNum)) next.delete(taskIdNum);
                            else next.add(taskIdNum);
                            return next;
                          });
                        }}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary/50 transition-colors"
                      >
                        {statusIcon(task.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{task.title}</p>
                          {task.agentType && (
                            <p className="text-[10px] text-muted-foreground capitalize">
                              {task.agentType.replace(/_/g, " ")}
                            </p>
                          )}
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-3 pb-3 border-t border-border pt-2">
                          {task.description && (
                            <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                          )}
                          {task.output && (
                            <div className="prose prose-sm max-w-none text-xs">
                              <Markdown mode="static">{typeof task.output === "string" ? task.output : JSON.stringify(task.output, null, 2)}</Markdown>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-lg border border-dashed border-border text-center">
                <p className="text-xs text-muted-foreground">No tasks generated yet</p>
              </div>
            )}
          </div>

          {/* Messages panel */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Agent Conversation</h3>
            <ScrollArea className="h-[500px] rounded-lg border border-border bg-card p-4">
              {messages && messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const content = msg.content as any;
                    const parts = content?.parts || [];
                    const isUser = msg.role === "user";

                    return (
                      <div key={msg.id} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                        {!isUser && (
                          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                            <AgentIcon className={`w-3.5 h-3.5 ${agentColor}`} />
                          </div>
                        )}
                        <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
                          {parts.map((part: any, i: number) => {
                            if (part.type === "text" && part.text) {
                              return (
                                <div
                                  key={i}
                                  className={`rounded-xl px-3 py-2 text-xs ${
                                    isUser
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary border border-border text-foreground"
                                  }`}
                                >
                                  {isUser ? (
                                    <p className="whitespace-pre-wrap">{part.text}</p>
                                  ) : (
                                    <div className="prose prose-sm max-w-none">
                                      <Markdown mode="static">{part.text}</Markdown>
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                        {isUser && (
                          <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] font-bold text-primary">U</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-muted-foreground">No messages in this session</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
