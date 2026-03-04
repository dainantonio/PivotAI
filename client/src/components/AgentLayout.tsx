import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Brain,
  FileText,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Database,
  User,
  LogOut,
  Zap,
  ChevronRight,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    group: "Command",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", color: "text-cyan-400" },
      { href: "/agent", icon: Brain, label: "Agent Center", color: "text-purple-400", badge: "AI" },
    ],
  },
  {
    group: "Agents",
    items: [
      { href: "/career-profile", icon: User, label: "Career Strategist", color: "text-green-400" },
      { href: "/resume", icon: FileText, label: "Resume Expert", color: "text-violet-400" },
      { href: "/interview", icon: MessageSquare, label: "Interview Coach", color: "text-amber-400" },
      { href: "/skills", icon: TrendingUp, label: "Skill Analyst", color: "text-pink-400" },
      { href: "/jobs", icon: Briefcase, label: "Job Matcher", color: "text-blue-400" },
    ],
  },
  {
    group: "System",
    items: [
      { href: "/memory", icon: Database, label: "Agent Memory", color: "text-slate-400" },
      { href: "/settings/api-keys", icon: KeyRound, label: "API Keys", color: "text-cyan-400" },
    ],
  },
];

interface AgentLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AgentLayout({ children, title, subtitle }: AgentLayoutProps) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">Initializing agents...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Authentication Required</h2>
            <p className="text-muted-foreground mt-2">Sign in to access your AI agent team</p>
          </div>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            Sign In to PivotAI
          </Button>
        </div>
      </div>
    );
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AI";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-sidebar transition-all duration-300 shrink-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-sm truncate">PivotAI</p>
              <p className="text-[10px] text-muted-foreground truncate">Agentic Platform</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronRight className={cn("w-3 h-3 transition-transform", collapsed ? "" : "rotate-180")} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
          {navItems.map((group) => (
            <div key={group.group}>
              {!collapsed && (
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">
                  {group.group}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location === item.href || location.startsWith(item.href + "/");
                  const Icon = item.icon;

                  const navLink = (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-all group",
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive ? "text-primary" : item.color
                        )}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <Badge className="text-[9px] px-1 py-0 h-4 bg-primary/20 text-primary border-primary/30">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    );
                  }

                  return navLink;
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-sidebar-border">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full h-8 text-muted-foreground hover:text-destructive"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign Out</TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar className="w-7 h-7 shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{user?.name || "User"}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email || ""}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-muted-foreground hover:text-destructive shrink-0"
                onClick={logout}
              >
                <LogOut className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        {(title || subtitle) && (
          <header className="h-16 border-b border-border flex items-center px-6 gap-4 shrink-0">
            <div className="flex-1 min-w-0">
              {title && <h1 className="text-lg font-semibold text-foreground truncate">{title}</h1>}
              {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
            </div>
          </header>
        )}

        {/* Page content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
