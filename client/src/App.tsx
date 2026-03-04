import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AgentCommandCenter from "./pages/AgentCommandCenter";
import AgentSession from "./pages/AgentSession";
import CareerProfile from "./pages/CareerProfile";
import CareerOnboardingWizard from "./pages/CareerOnboardingWizard";
import ResumeExpert from "./pages/ResumeExpert";
import JobMatcher from "./pages/JobMatcher";
import InterviewCoach from "./pages/InterviewCoach";
import SkillAnalyst from "./pages/SkillAnalyst";
import AgentMemory from "./pages/AgentMemory";
import APIKeys from "./pages/APIKeys";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/agent" component={AgentCommandCenter} />
      <Route path="/agent/session/:sessionId" component={AgentSession} />
      <Route path="/career-profile" component={CareerProfile} />
      <Route path="/career-onboarding" component={CareerOnboardingWizard} />
      <Route path="/resume" component={ResumeExpert} />
      <Route path="/jobs" component={JobMatcher} />
      <Route path="/interview" component={InterviewCoach} />
      <Route path="/skills" component={SkillAnalyst} />
      <Route path="/memory" component={AgentMemory} />
      <Route path="/settings/api-keys" component={APIKeys} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster theme="dark" position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
