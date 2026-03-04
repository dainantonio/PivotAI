import AgentLayout from "@/components/AgentLayout";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Briefcase, MapPin, DollarSign, ExternalLink, Loader2 } from "lucide-react";

export default function JobMatcher() {
  const { data: jobs, isLoading } = trpc.jobs.getMatches.useQuery({ limit: 20 });

  return (
    <AgentLayout title="Job Matcher" subtitle="AI-powered job matching with market intelligence">
      <div className="p-6 space-y-6 max-w-4xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Card key={job.id} className="bg-card border-border hover:border-blue-400/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground">{job.title}</h3>
                        {job.matchScore && (
                          <Badge variant="outline" className="text-[10px] bg-green-400/10 text-green-400 border-green-400/20">
                            {Math.round(job.matchScore)}% match
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {job.company && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {job.company}
                          </span>
                        )}
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                        )}
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {job.salary}
                          </span>
                        )}
                      </div>
                      {(job.skills as string[] | null)?.length ? (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(job.skills as string[]).slice(0, 5).map((s) => (
                            <Badge key={s} variant="outline" className="text-[9px] border-border text-muted-foreground">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    {job.applyUrl && (
                      <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="h-7 text-xs border-border gap-1 shrink-0">
                          <ExternalLink className="w-3 h-3" />
                          Apply
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-semibold text-foreground mb-1">No Job Matches Yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Ask the Job Matcher agent to find opportunities matching your career profile.
              </p>
            </div>
            <Button
              size="sm"
              className="bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 border border-blue-400/20 gap-1"
              onClick={() => (window.location.href = "/agent")}
            >
              <Brain className="w-3.5 h-3.5" />
              Find Job Matches
            </Button>
          </div>
        )}
      </div>
    </AgentLayout>
  );
}
