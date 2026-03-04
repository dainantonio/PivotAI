import AgentLayout from "@/components/AgentLayout";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import {
  Brain,
  Target,
  FileText,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  Database,
  GitBranch,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const agentCards = [
  { href: "/career-profile", icon: Target, label: "Career Strategist", color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", desc: "Risk analysis & strategy" },
  { href: "/resume", icon: FileText, label: "Resume Expert", color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20", desc: "ATS optimization" },
  { href: "/interview", icon: MessageSquare, label: "Interview Coach", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", desc: "STAR stories & prep" },
  { href: "/skills", icon: TrendingUp, label: "Skill Analyst", color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20", desc: "Gap analysis & roadmap" },
  { href: "/jobs", icon: Briefcase, label: "Job Matcher", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", desc: "Opportunity matching" },
];

const agentMeta: Record<string, { label: string; color: string; bg: string; border: string }> = {
  orchestrator: { label: "Orchestrator", color: "#60a5fa", bg: "bg-primary/10", border: "border-primary/30" },
  career_strategist: { label: "Career Strategist", color: "#4ade80", bg: "bg-green-400/10", border: "border-green-400/20" },
  resume_expert: { label: "Resume Expert", color: "#a78bfa", bg: "bg-violet-400/10", border: "border-violet-400/20" },
  interview_coach: { label: "Interview Coach", color: "#fbbf24", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  skill_analyst: { label: "Skill Analyst", color: "#f472b6", bg: "bg-pink-400/10", border: "border-pink-400/20" },
  job_matcher: { label: "Job Matcher", color: "#60a5fa", bg: "bg-blue-400/10", border: "border-blue-400/20" },
};

const agentLayout: Record<string, { x: number; y: number }> = {
  orchestrator: { x: 320, y: 52 },
  career_strategist: { x: 130, y: 128 },
  resume_expert: { x: 260, y: 128 },
  interview_coach: { x: 385, y: 128 },
  skill_analyst: { x: 510, y: 128 },
  job_matcher: { x: 320, y: 214 },
};

function statusIcon(status: string) {
  switch (status) {
    case "completed": return <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />;
    case "executing":
    case "planning": return <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />;
    case "failed": return <AlertCircle className="w-3.5 h-3.5 text-destructive" />;
    default: return <Clock className="w-3.5 h-3.5 text-muted-foreground" />;
  }
}

function statusColor(status: string) {
  switch (status) {
    case "completed": return "bg-green-400/10 text-green-400 border-green-400/20";
    case "executing":
    case "planning": return "bg-primary/10 text-primary border-primary/20";
    case "failed": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
}

export default function Dashboard() {
  const { data: sessions, isLoading: sessionsLoading } = trpc.agent.listSessions.useQuery({ limit: 5 }, { refetchInterval: 5000 });
  const { data: taskQueue, isLoading: tasksLoading } = trpc.agent.getTaskQueue.useQuery({ limit: 40 }, { refetchInterval: 4000 });
  const { data: profile } = trpc.career.getProfile.useQuery();
  const { data: memory } = trpc.agent.getMemory.useQuery({ limit: 5 });
  const { data: jobs } = trpc.jobs.getMatches.useQuery({ limit: 3 });
  const { data: resumes } = trpc.resume.getVersions.useQuery();

  const totalSessions = sessions?.length ?? 0;
  const completedSessions = sessions?.filter((s) => s.status === "completed").length ?? 0;
  const activeSessions = sessions?.filter((s) => s.status === "executing" || s.status === "planning").length ?? 0;

  const visibleTasks = (taskQueue ?? []).slice(0, 24);
  const taskById = new Map(visibleTasks.map((task) => [task.id, task]));

  const collaborationEdges = new Map<string, { from: string; to: string; count: number }>();
  for (const task of visibleTasks) {
    const deps = (task.dependsOn as string[] | null | undefined) ?? [];
    for (const depId of deps) {
      const parent = taskById.get(depId);
      if (!parent || parent.agentType === task.agentType) continue;
      const key = `${parent.agentType}->${task.agentType}`;
      const existing = collaborationEdges.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        collaborationEdges.set(key, { from: parent.agentType, to: task.agentType, count: 1 });
      }
    }
  }

  const agentActivity = Object.keys(agentMeta).map((agentType) => {
    const tasks = visibleTasks.filter((task) => task.agentType === agentType);
    return {
      agentType,
      running: tasks.filter((task) => task.status === "running").length,
      completed: tasks.filter((task) => task.status === "completed").length,
      queued: tasks.filter((task) => task.status === "queued").length,
      total: tasks.length,
    };
  });

  const hasGraphData = visibleTasks.length > 0;

  return (
    <AgentLayout title="Dashboard" subtitle="Your AI agent command overview">
      <div className="p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Agent Sessions", value: totalSessions, icon: Brain, color: "text-primary" },
            { label: "Completed", value: completedSessions, icon: CheckCircle2, color: "text-green-400" },
            { label: "Active", value: activeSessions, icon: Zap, color: "text-amber-400" },
            { label: "Memory Entries", value: memory?.length ?? 0, icon: Database, color: "text-violet-400" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Sessions */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-primary" />
                    Real-time Agent Collaboration Graph
                  </span>
                  <Badge variant="outline" className="text-[10px] border-primary/20 bg-primary/10 text-primary">
                    live
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                {tasksLoading ? (
                  <div className="h-56 rounded-lg bg-secondary/40 animate-pulse" />
                ) : hasGraphData ? (
                  <>
                    <div className="rounded-lg border border-border bg-secondary/20 p-2 overflow-x-auto">
                      <svg viewBox="0 0 640 260" className="w-full min-w-[620px] h-[260px]">
                        {[...collaborationEdges.values()].map((edge) => {
                          const from = agentLayout[edge.from];
                          const to = agentLayout[edge.to];
                          if (!from || !to) return null;
                          return (
                            <g key={`${edge.from}-${edge.to}`}>
                              <line
                                x1={from.x}
                                y1={from.y + 18}
                                x2={to.x}
                                y2={to.y - 18}
                                stroke="rgba(148,163,184,0.45)"
                                strokeWidth={Math.min(4, 1 + edge.count)}
                                strokeDasharray="4 4"
                              />
                              <text
                                x={(from.x + to.x) / 2}
                                y={(from.y + to.y) / 2 - 4}
                                fill="rgba(148,163,184,0.9)"
                                fontSize="10"
                                textAnchor="middle"
                              >
                                {edge.count}
                              </text>
                            </g>
                          );
                        })}

                        {agentActivity.map((node) => {
                          const layout = agentLayout[node.agentType];
                          if (!layout) return null;
                          const meta = agentMeta[node.agentType];
                          const isActive = node.running > 0;
                          return (
                            <g key={node.agentType}>
                              {isActive && (
                                <circle
                                  cx={layout.x}
                                  cy={layout.y}
                                  r={24}
                                  fill={meta.color}
                                  opacity="0.18"
                                  className="animate-pulse"
                                />
                              )}
                              <circle
                                cx={layout.x}
                                cy={layout.y}
                                r={18}
                                fill="rgba(15,23,42,0.95)"
                                stroke={meta.color}
                                strokeWidth="2"
                              />
                              <text x={layout.x} y={layout.y + 3} fill={meta.color} fontSize="10" textAnchor="middle" fontWeight="700">
                                {meta.label.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                              </text>
                              <text x={layout.x} y={layout.y + 34} fill="rgba(203,213,225,0.95)" fontSize="10" textAnchor="middle">
                                {meta.label}
                              </text>
                              <text x={layout.x} y={layout.y + 46} fill="rgba(148,163,184,0.95)" fontSize="9" textAnchor="middle">
                                {node.running > 0 ? `${node.running} active` : `${node.completed} done`}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {agentActivity.filter((agent) => agent.total > 0).map((agent) => {
                        const meta = agentMeta[agent.agentType];
                        return (
                          <div key={agent.agentType} className={`rounded-lg border ${meta.border} ${meta.bg} px-2.5 py-2`}>
                            <p className="text-[10px] text-foreground font-medium truncate">{meta.label}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {agent.running} running · {agent.completed} completed · {agent.queued} queued
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Dependency links are inferred from task `dependsOn` relationships across agents and refresh every few seconds.
                    </p>
                  </>
                ) : (
                  <div className="text-center p-8 rounded-lg border border-dashed border-border">
                    <p className="text-xs text-muted-foreground">No agent task dependencies available yet. Start a new session to populate the collaboration graph.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Recent Agent Sessions</h2>
              <Link href="/agent">
                <Button size="sm" className="h-7 text-xs bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 gap-1">
                  <Plus className="w-3 h-3" />
                  New Session
                </Button>
              </Link>
            </div>

            {sessionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-lg bg-card border border-border animate-pulse" />
                ))}
              </div>
            ) : sessions && sessions.length > 0 ? (
              <div className="space-y-2">
                {sessions.map((session) => {
                  const progress = session.totalTasks
                    ? Math.round(((session.completedTasks ?? 0) / session.totalTasks) * 100)
                    : 0;
                  return (
                    <Link key={session.id} href={`/agent/session/${session.id}`}>
                      <div className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-card/80 transition-all cursor-pointer group">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {statusIcon(session.status)}
                            <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                              {session.title || session.goal.slice(0, 60)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 h-4 ${statusColor(session.status)}`}
                            >
                              {session.status}
                            </Badge>
                            <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                        {session.totalTasks && session.totalTasks > 0 && (
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-1 flex-1" />
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {session.completedTasks}/{session.totalTasks}
                            </span>
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 rounded-lg border border-dashed border-border text-center">
                <Brain className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">No agent sessions yet</p>
                <Link href="/agent">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1">
                    <Plus className="w-3 h-3" />
                    Start First Session
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Career Profile */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                  Career Profile
                  <Link href="/career-profile">
                    <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-primary">
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2">
                {profile ? (
                  <>
                    {profile.currentRole && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Current Role</span>
                        <span className="text-foreground font-medium truncate max-w-[120px]">{profile.currentRole}</span>
                      </div>
                    )}
                    {profile.targetRole && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Target Role</span>
                        <span className="text-primary font-medium truncate max-w-[120px]">{profile.targetRole}</span>
                      </div>
                    )}
                    {profile.displacementRisk !== null && profile.displacementRisk !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">AI Risk</span>
                          <span className={`font-medium ${profile.displacementRisk > 70 ? "text-destructive" : profile.displacementRisk > 40 ? "text-amber-400" : "text-green-400"}`}>
                            {profile.displacementRisk}%
                          </span>
                        </div>
                        <Progress value={profile.displacementRisk} className="h-1" />
                      </div>
                    )}
                    {!profile.currentRole && !profile.targetRole && (
                      <p className="text-xs text-muted-foreground">Profile incomplete</p>
                    )}
                  </>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-xs text-muted-foreground mb-2">No profile yet</p>
                    <Link href="/career-profile">
                      <Button size="sm" variant="outline" className="h-6 text-xs border-border">
                        Set Up Profile
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Agent Team */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-foreground">Agent Team</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-1">
                {agentCards.map((agent) => {
                  const Icon = agent.icon;
                  return (
                    <Link key={agent.href} href={agent.href}>
                      <div className={`flex items-center gap-3 p-2 rounded-lg ${agent.bg} border ${agent.border} hover:opacity-80 transition-opacity cursor-pointer`}>
                        <Icon className={`w-4 h-4 ${agent.color} shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium ${agent.color} truncate`}>{agent.label}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{agent.desc}</p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent Job Matches */}
            {jobs && jobs.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                    Job Matches
                    <Link href="/jobs">
                      <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-primary">
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-2">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{job.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{job.company}</p>
                      </div>
                      {job.matchScore && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-green-400/10 text-green-400 border-green-400/20 shrink-0">
                          {Math.round(job.matchScore)}%
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
