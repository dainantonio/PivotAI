import AgentLayout from "@/components/AgentLayout";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Star, Mic, BookOpen, Target } from "lucide-react";

const features = [
  { icon: Star, label: "STAR Story Builder", desc: "Craft compelling behavioral stories using the Situation-Task-Action-Result framework" },
  { icon: Mic, label: "Mock Interview Simulator", desc: "Practice with realistic interview questions and get instant AI feedback" },
  { icon: BookOpen, label: "Question Bank", desc: "500+ curated questions for technical, behavioral, and situational interviews" },
  { icon: Target, label: "Weakness Elimination", desc: "Identify and reframe weak answers into confident, compelling responses" },
];

export default function InterviewCoach() {
  return (
    <AgentLayout title="Interview Coach" subtitle="STAR story building, mock interviews & answer optimization">
      <div className="p-6 space-y-6 max-w-4xl">
        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="p-5 rounded-xl border border-amber-400/20 bg-amber-400/5">
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-sm font-semibold text-amber-400 mb-1">{f.label}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Agent CTA */}
        <div className="p-6 rounded-xl border border-amber-400/20 bg-amber-400/5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-7 h-7 text-amber-400" />
          </div>
          <h3 className="text-base font-semibold text-amber-400 mb-2">Coach Atlas — Interview Agent</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Tell Coach Atlas your target role and interview type. The agent will run a full mock interview, score your answers, and build your STAR story library.
          </p>
          <Button
            className="bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 border border-amber-400/20 gap-2"
            onClick={() => (window.location.href = "/agent")}
          >
            <Brain className="w-4 h-4" />
            Start Interview Prep
          </Button>
        </div>
      </div>
    </AgentLayout>
  );
}
