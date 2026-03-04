import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Brain,
  Zap,
  Target,
  FileText,
  Briefcase,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Shield,
  Clock,
  Users,
} from "lucide-react";

const agents = [
  {
    icon: Target,
    name: "Career Strategist",
    description: "Analyzes AI displacement risk, identifies pivot opportunities, and crafts personalized career roadmaps",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
  {
    icon: FileText,
    name: "Resume Expert",
    description: "Rewrites bullets with power verbs, injects ATS keywords, and boosts your resume score",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    icon: MessageSquare,
    name: "Coach Atlas",
    description: "Elite interview coach that builds STAR stories, simulates interviews, and eliminates weak answers",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    icon: TrendingUp,
    name: "Skill Analyst",
    description: "Performs deep skill gap analysis and generates personalized learning roadmaps with curated resources",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
  },
  {
    icon: Briefcase,
    name: "Job Matcher",
    description: "Finds and scores job opportunities with market intelligence, salary data, and application strategy",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
];

const features = [
  {
    icon: Brain,
    title: "Plan-Execute-Reflect Loop",
    description: "Agents autonomously decompose your goal, execute multi-step tasks, and reflect to improve results",
  },
  {
    icon: Shield,
    title: "Persistent Agent Memory",
    description: "Episodic, semantic, and procedural memory ensures agents learn your preferences across sessions",
  },
  {
    icon: Zap,
    title: "Real-Time Streaming",
    description: "Watch agents think, plan, and execute in real-time with visible reasoning and intermediate results",
  },
  {
    icon: Users,
    title: "Multi-Agent Collaboration",
    description: "Specialized agents work together, passing context and building on each other's outputs",
  },
  {
    icon: Clock,
    title: "Task Queue Management",
    description: "Priority-based task queue with parallel execution, dependency tracking, and progress monitoring",
  },
  {
    icon: Sparkles,
    title: "Autonomous Execution",
    description: "Describe your goal in plain language — the orchestrator handles the rest automatically",
  },
];

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(oklch(0.22 0.02 240 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.22 0.02 240 / 0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="font-bold text-foreground">PivotAI</span>
              <span className="text-muted-foreground text-sm ml-1">Agentic</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!loading && (
              isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Brain className="w-4 h-4" />
                    Open Dashboard
                  </Button>
                </Link>
              ) : (
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => (window.location.href = getLoginUrl())}
                >
                  Get Started Free
                </Button>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge
            variant="outline"
            className="border-primary/40 text-primary bg-primary/10 px-4 py-1.5 text-xs font-medium"
          >
            <Sparkles className="w-3 h-3 mr-1.5" />
            Multi-Agent AI Career Platform
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
            <span className="text-foreground">Your Career.</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.72 0.19 195), oklch(0.65 0.22 280))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Powered by Agents.
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A team of 5 specialized AI agents that autonomously plan, execute, and reflect on every aspect of your career transformation — from resume to offer letter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/agent">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8 h-12 text-base font-semibold">
                  <Brain className="w-5 h-5" />
                  Launch Agent Center
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8 h-12 text-base font-semibold"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                <Brain className="w-5 h-5" />
                Start Your Transformation
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary gap-2 px-8 h-12 text-base"
              >
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-4">
            {[
              { value: "5", label: "Specialized Agents" },
              { value: "8+", label: "AI Tools" },
              { value: "∞", label: "Career Goals" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Team */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Your AI Agent Team</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Five specialized agents, each an expert in their domain, collaborating to achieve your career goals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.name}
                  className={`p-5 rounded-xl border ${agent.border} ${agent.bg} backdrop-blur-sm hover:scale-[1.02] transition-transform cursor-default`}
                >
                  <div className={`w-10 h-10 rounded-lg ${agent.bg} border ${agent.border} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${agent.color}`} />
                  </div>
                  <h3 className={`font-semibold ${agent.color} mb-2`}>{agent.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{agent.description}</p>
                </div>
              );
            })}

            {/* Orchestrator card */}
            <div className="p-5 rounded-xl border border-primary/30 bg-primary/10 backdrop-blur-sm sm:col-span-2 lg:col-span-1 hover:scale-[1.02] transition-transform cursor-default">
              <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-primary mb-2">Master Orchestrator</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Coordinates all agents using the Plan-Execute-Reflect loop, decomposes complex goals, and synthesizes results into actionable career plans
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-20 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Agentic Architecture</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built on cutting-edge agentic AI patterns for autonomous, reliable career development
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-4 border-t border-border/50">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-black text-foreground">
            Ready to pivot?
          </h2>
          <p className="text-muted-foreground text-lg">
            Describe your career goal and watch your AI team get to work immediately.
          </p>
          {isAuthenticated ? (
            <Link href="/agent">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-10 h-12 text-base font-semibold">
                <Zap className="w-5 h-5" />
                Launch Agent Center
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-10 h-12 text-base font-semibold"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              <Zap className="w-5 h-5" />
              Get Started Free
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8 px-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">PivotAI Agentic Platform</span>
          </div>
          <p className="text-xs text-muted-foreground">Powered by multi-agent AI orchestration</p>
        </div>
      </footer>
    </div>
  );
}
