import AgentLayout from "@/components/AgentLayout";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Map, BookOpen, BarChart3 } from "lucide-react";

const features = [
  { icon: BarChart3, label: "Skill Gap Analysis", desc: "Compare your current skills against target role requirements with precision scoring" },
  { icon: Map, label: "Learning Roadmap", desc: "Personalized step-by-step learning path with curated courses, projects, and milestones" },
  { icon: BookOpen, label: "Resource Curation", desc: "Hand-picked courses, books, and projects from top platforms for each skill gap" },
  { icon: TrendingUp, label: "Progress Tracking", desc: "Track skill acquisition over time with visual progress indicators and milestone alerts" },
];

export default function SkillAnalyst() {
  return (
    <AgentLayout title="Skill Analyst" subtitle="Deep skill gap analysis & personalized learning roadmaps">
      <div className="p-6 space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="p-5 rounded-xl border border-pink-400/20 bg-pink-400/5">
                <div className="w-9 h-9 rounded-lg bg-pink-400/10 border border-pink-400/20 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-pink-400 mb-1">{f.label}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="p-6 rounded-xl border border-pink-400/20 bg-pink-400/5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-pink-400/10 border border-pink-400/20 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-7 h-7 text-pink-400" />
          </div>
          <h3 className="text-base font-semibold text-pink-400 mb-2">Skill Analyst Agent</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Tell the Skill Analyst your current skills and target role. The agent will identify gaps, score each skill, and build a personalized learning roadmap.
          </p>
          <Button
            className="bg-pink-400/10 text-pink-400 hover:bg-pink-400/20 border border-pink-400/20 gap-2"
            onClick={() => (window.location.href = "/agent")}
          >
            <Brain className="w-4 h-4" />
            Analyze My Skills
          </Button>
        </div>
      </div>
    </AgentLayout>
  );
}
