import AgentLayout from "@/components/AgentLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { Target, Plus, X, Loader2, Save, TrendingUp, Zap, Brain } from "lucide-react";

export default function CareerProfile() {
  const { data: profile, isLoading, refetch } = trpc.career.getProfile.useQuery();
  const updateProfile = trpc.career.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Career profile updated");
      refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const [form, setForm] = useState({
    currentRole: "",
    industry: "",
    targetRole: "",
    yearsExperience: 0,
    skills: [] as string[],
    goals: [] as string[],
  });
  const [newSkill, setNewSkill] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (profile && !initialized) {
    setForm({
      currentRole: profile.currentRole || "",
      industry: profile.industry || "",
      targetRole: profile.targetRole || "",
      yearsExperience: profile.yearsExperience || 0,
      skills: (profile.skills as string[]) || [],
      goals: (profile.goals as string[]) || [],
    });
    setInitialized(true);
  }

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm((f) => ({ ...f, skills: [...f.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  const removeSkill = (s: string) => setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) }));

  const addGoal = () => {
    if (newGoal.trim() && !form.goals.includes(newGoal.trim())) {
      setForm((f) => ({ ...f, goals: [...f.goals, newGoal.trim()] }));
      setNewGoal("");
    }
  };

  const removeGoal = (g: string) => setForm((f) => ({ ...f, goals: f.goals.filter((x) => x !== g) }));

  const handleSave = () => {
    updateProfile.mutate(form);
  };

  const riskColor = (risk: number) =>
    risk > 70 ? "text-destructive" : risk > 40 ? "text-amber-400" : "text-green-400";

  return (
    <AgentLayout title="Career Strategist" subtitle="AI displacement risk analysis & career pivot planning">
      <div className="p-6 space-y-6 max-w-4xl">
        {/* Risk overview */}
        {profile && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">AI Displacement Risk</p>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                {profile.displacementRisk !== null && profile.displacementRisk !== undefined ? (
                  <>
                    <p className={`text-3xl font-black ${riskColor(profile.displacementRisk)}`}>
                      {Math.round(profile.displacementRisk)}%
                    </p>
                    <Progress value={profile.displacementRisk} className="h-1 mt-2" />
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Not analyzed</p>
                )}
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">Career Match</p>
                  <Target className="w-4 h-4 text-green-400" />
                </div>
                {profile.matchPercentage !== null && profile.matchPercentage !== undefined ? (
                  <>
                    <p className="text-3xl font-black text-green-400">{Math.round(profile.matchPercentage)}%</p>
                    <Progress value={profile.matchPercentage} className="h-1 mt-2" />
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Not analyzed</p>
                )}
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">Skills Mapped</p>
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <p className="text-3xl font-black text-primary">{form.skills.length}</p>
                <p className="text-xs text-muted-foreground mt-1">skills in profile</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile form */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" />
              Career Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Current Role</Label>
                    <Input
                      value={form.currentRole}
                      onChange={(e) => setForm((f) => ({ ...f, currentRole: e.target.value }))}
                      placeholder="e.g. Senior Software Engineer"
                      className="bg-input border-border text-foreground text-sm h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Industry</Label>
                    <Input
                      value={form.industry}
                      onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                      placeholder="e.g. Technology, Finance"
                      className="bg-input border-border text-foreground text-sm h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Target Role</Label>
                    <Input
                      value={form.targetRole}
                      onChange={(e) => setForm((f) => ({ ...f, targetRole: e.target.value }))}
                      placeholder="e.g. AI/ML Engineer"
                      className="bg-input border-border text-foreground text-sm h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Years of Experience</Label>
                    <Input
                      type="number"
                      value={form.yearsExperience}
                      onChange={(e) => setForm((f) => ({ ...f, yearsExperience: parseInt(e.target.value) || 0 }))}
                      min={0}
                      max={50}
                      className="bg-input border-border text-foreground text-sm h-9"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Current Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                      placeholder="Add a skill..."
                      className="bg-input border-border text-foreground text-sm h-9 flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={addSkill}
                      className="h-9 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {form.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {form.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="border-primary/30 text-primary bg-primary/10 text-xs gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                          onClick={() => removeSkill(skill)}
                        >
                          {skill}
                          <X className="w-2.5 h-2.5" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Goals */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Career Goals</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addGoal()}
                      placeholder="Add a career goal..."
                      className="bg-input border-border text-foreground text-sm h-9 flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={addGoal}
                      className="h-9 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {form.goals.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      {form.goals.map((goal) => (
                        <div
                          key={goal}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-secondary border border-border text-xs text-foreground"
                        >
                          <span>{goal}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-5 h-5 text-muted-foreground hover:text-destructive"
                            onClick={() => removeGoal(goal)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={updateProfile.isPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  >
                    {updateProfile.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Profile
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Profile is used by all agents for personalization
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Agent CTA */}
        <div className="p-5 rounded-xl border border-green-400/20 bg-green-400/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-400/10 border border-green-400/20 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-green-400 mb-1">Career Strategist Agent</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Ask the Career Strategist to analyze your displacement risk, identify pivot opportunities, and build a personalized career roadmap.
              </p>
              <Button
                size="sm"
                className="bg-green-400/10 text-green-400 hover:bg-green-400/20 border border-green-400/20 gap-1 text-xs"
                onClick={() => (window.location.href = "/career-onboarding")}
              >
                <Brain className="w-3.5 h-3.5" />
                Start Onboarding Wizard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
