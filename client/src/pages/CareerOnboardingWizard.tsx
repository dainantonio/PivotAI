import AgentLayout from "@/components/AgentLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Brain, CheckCircle2, Loader2, Sparkles, Target, User } from "lucide-react";

type WizardForm = {
  currentRole: string;
  industry: string;
  yearsExperience: number;
  targetRole: string;
  skills: string[];
  goals: string[];
  motivation: string;
};

const INITIAL_FORM: WizardForm = {
  currentRole: "",
  industry: "",
  yearsExperience: 0,
  targetRole: "",
  skills: [],
  goals: [],
  motivation: "",
};

const TOTAL_STEPS = 4;

export default function CareerOnboardingWizard() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<WizardForm>(INITIAL_FORM);
  const [newSkill, setNewSkill] = useState("");
  const [newGoal, setNewGoal] = useState("");

  const updateProfile = trpc.career.updateProfile.useMutation({
    onError: (e) => toast.error(e.message),
  });

  const addSkill = () => {
    const value = newSkill.trim();
    if (!value || form.skills.includes(value)) return;
    setForm((prev) => ({ ...prev, skills: [...prev.skills, value] }));
    setNewSkill("");
  };

  const addGoal = () => {
    const value = newGoal.trim();
    if (!value || form.goals.includes(value)) return;
    setForm((prev) => ({ ...prev, goals: [...prev.goals, value] }));
    setNewGoal("");
  };

  const canContinue =
    (step === 1 && form.currentRole.trim() && form.industry.trim() && form.yearsExperience >= 0) ||
    (step === 2 && form.targetRole.trim() && form.skills.length > 0) ||
    (step === 3 && form.goals.length > 0 && form.motivation.trim()) ||
    step === 4;

  const strategyPrompt = [
    "Build my personalized career strategy.",
    `Current role: ${form.currentRole}`,
    `Industry: ${form.industry}`,
    `Years of experience: ${form.yearsExperience}`,
    `Target role: ${form.targetRole}`,
    `Current skills: ${form.skills.join(", ")}`,
    `Career goals: ${form.goals.join(" | ")}`,
    `Motivation/context: ${form.motivation}`,
    "Please analyze automation risk, recommend pivot paths, and provide a prioritized 90-day action plan.",
  ].join("\n");

  const handleLaunch = async () => {
    await updateProfile.mutateAsync({
      currentRole: form.currentRole,
      industry: form.industry,
      yearsExperience: form.yearsExperience,
      targetRole: form.targetRole,
      skills: form.skills,
      goals: form.goals,
      careerData: {
        onboardingMotivation: form.motivation,
        completedAt: new Date().toISOString(),
      },
    });

    toast.success("Profile saved. Launching Career Strategist...");

    const params = new URLSearchParams({
      agent: "career_strategist",
      prompt: strategyPrompt,
      autostart: "1",
    });

    setLocation(`/agent?${params.toString()}`);
  };

  return (
    <AgentLayout title="Career Onboarding Wizard" subtitle="Set your baseline once, then kick off your Career Strategist plan">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Step {step} of {TOTAL_STEPS}
              </CardTitle>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/10">
                {Math.round((step / TOTAL_STEPS) * 100)}% complete
              </Badge>
            </div>
            <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-green-400" />
                  Current Career Snapshot
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Current Role</Label>
                    <Input
                      value={form.currentRole}
                      onChange={(e) => setForm((prev) => ({ ...prev, currentRole: e.target.value }))}
                      placeholder="e.g. Product Analyst"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Industry</Label>
                    <Input
                      value={form.industry}
                      onChange={(e) => setForm((prev) => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g. Healthcare"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs text-muted-foreground">Years of Experience</Label>
                    <Input
                      type="number"
                      min={0}
                      max={50}
                      value={form.yearsExperience}
                      onChange={(e) => setForm((prev) => ({ ...prev, yearsExperience: Number(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  Destination + Skill Baseline
                </h3>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Target Role</Label>
                  <Input
                    value={form.targetRole}
                    onChange={(e) => setForm((prev) => ({ ...prev, targetRole: e.target.value }))}
                    placeholder="e.g. Senior Product Manager"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Core Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill"
                    />
                    <Button type="button" onClick={addSkill} variant="outline">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer hover:border-destructive/40"
                        onClick={() => setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }))}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Goals + Motivation</h3>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Top Career Goals</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGoal())}
                      placeholder="Add a goal"
                    />
                    <Button type="button" onClick={addGoal} variant="outline">Add</Button>
                  </div>
                  <div className="space-y-2">
                    {form.goals.map((goal) => (
                      <div
                        key={goal}
                        className="text-xs border border-border rounded-lg bg-secondary/40 px-3 py-2 cursor-pointer hover:border-destructive/40"
                        onClick={() => setForm((prev) => ({ ...prev, goals: prev.goals.filter((g) => g !== goal) }))}
                      >
                        {goal}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">What is driving this transition now?</Label>
                  <Textarea
                    value={form.motivation}
                    onChange={(e) => setForm((prev) => ({ ...prev, motivation: e.target.value }))}
                    placeholder="Share urgency, constraints, preferences, salary goals, geography, or timeline..."
                    className="min-h-24"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Review & Launch Strategy Session
                </h3>
                <div className="space-y-3 text-xs">
                  <p><span className="text-muted-foreground">Current role:</span> {form.currentRole}</p>
                  <p><span className="text-muted-foreground">Target role:</span> {form.targetRole}</p>
                  <p><span className="text-muted-foreground">Skills:</span> {form.skills.join(", ")}</p>
                  <p><span className="text-muted-foreground">Goals:</span> {form.goals.join(" | ")}</p>
                  <p><span className="text-muted-foreground">Motivation:</span> {form.motivation}</p>
                </div>
                <div className="rounded-lg border border-green-400/20 bg-green-400/5 p-3 text-xs text-muted-foreground">
                  Clicking <span className="text-green-400 font-medium">Launch Career Strategist</span> will save your profile and automatically start a guided strategy session with the Career Strategist agent.
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                disabled={step === 1 || updateProfile.isPending}
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              {step < TOTAL_STEPS ? (
                <Button
                  disabled={!canContinue}
                  onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
                  className="gap-1"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleLaunch} disabled={updateProfile.isPending} className="gap-2">
                  {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                  Launch Career Strategist
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AgentLayout>
  );
}
