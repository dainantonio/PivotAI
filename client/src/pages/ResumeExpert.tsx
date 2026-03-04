import AgentLayout from "@/components/AgentLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useState } from "react";
import { FileText, Loader2, Save, Brain } from "lucide-react";

export default function ResumeExpert() {
  const { data: versions, refetch } = trpc.resume.getVersions.useQuery();
  const saveVersion = trpc.resume.saveVersion.useMutation({
    onSuccess: () => {
      toast.success("Resume version saved");
      refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");

  const latestVersion = versions?.[0];

  return (
    <AgentLayout title="Resume Expert" subtitle="ATS optimization, keyword injection & power-verb rewriting">
      <div className="p-6 space-y-6 max-w-4xl">
        {latestVersion && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">ATS Score</p>
                {latestVersion.atsScore ? (
                  <>
                    <p className="text-3xl font-black text-primary">{latestVersion.atsScore}%</p>
                    <Progress value={latestVersion.atsScore} className="h-1 mt-2" />
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Not scored</p>
                )}
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Keywords Injected</p>
                <p className="text-3xl font-black text-green-400">
                  {(latestVersion.injectedKeywords as string[] | null)?.length ?? 0}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Versions Saved</p>
                <p className="text-3xl font-black text-violet-400">{versions?.length ?? 0}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-400" />
              Resume Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Target Role</Label>
              <Input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Product Manager"
                className="bg-input border-border text-foreground text-sm h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Paste Your Resume</Label>
              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your current resume text here..."
                className="min-h-[200px] bg-input border-border text-foreground text-sm resize-none"
              />
            </div>
            <Button
              onClick={() => saveVersion.mutate({ originalText: resumeText, targetRole })}
              disabled={!resumeText.trim() || saveVersion.isPending}
              className="bg-violet-400/10 text-violet-400 hover:bg-violet-400/20 border border-violet-400/20 gap-2"
            >
              {saveVersion.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Version
            </Button>
          </CardContent>
        </Card>

        {versions && versions.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-foreground">Resume Versions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {versions.map((v) => (
                <div key={v.id} className="p-3 rounded-lg border border-border bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-foreground">Version {v.version}</p>
                    {v.atsScore && (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-primary/10 text-primary border-primary/20"
                      >
                        ATS {v.atsScore}%
                      </Badge>
                    )}
                  </div>
                  {v.targetRole && (
                    <p className="text-[10px] text-muted-foreground">Target: {v.targetRole}</p>
                  )}
                  {(v.injectedKeywords as string[] | null)?.length ? (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(v.injectedKeywords as string[]).slice(0, 5).map((kw) => (
                        <Badge
                          key={kw}
                          variant="outline"
                          className="text-[9px] border-green-400/20 text-green-400 bg-green-400/10"
                        >
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="p-5 rounded-xl border border-violet-400/20 bg-violet-400/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-violet-400/10 border border-violet-400/20 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-violet-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-violet-400 mb-1">Resume Expert Agent</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Let the Resume Expert analyze your resume, inject ATS keywords, rewrite weak bullets with power
                verbs, and boost your score.
              </p>
              <Button
                size="sm"
                className="bg-violet-400/10 text-violet-400 hover:bg-violet-400/20 border border-violet-400/20 gap-1 text-xs"
                onClick={() => (window.location.href = "/agent")}
              >
                <Brain className="w-3.5 h-3.5" />
                Launch Resume Expert
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
