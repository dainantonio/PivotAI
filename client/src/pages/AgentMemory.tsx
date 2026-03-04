import AgentLayout from "@/components/AgentLayout";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Loader2, Brain, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const memoryTypeColors: Record<string, string> = {
  episodic: "bg-primary/10 text-primary border-primary/20",
  semantic: "bg-green-400/10 text-green-400 border-green-400/20",
  procedural: "bg-violet-400/10 text-violet-400 border-violet-400/20",
  working: "bg-amber-400/10 text-amber-400 border-amber-400/20",
};

export default function AgentMemory() {
  const { data: memory, isLoading } = trpc.agent.getMemory.useQuery({ limit: 50 });
  const { data: context } = trpc.agent.getMemoryContext.useQuery();

  const grouped = memory?.reduce((acc, m) => {
    const type = m.memoryType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(m);
    return acc;
  }, {} as Record<string, typeof memory>) ?? {};

  return (
    <AgentLayout title="Agent Memory" subtitle="Persistent context storage across all agent sessions">
      <div className="p-6 space-y-6 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["episodic", "semantic", "procedural", "working"].map((type) => (
            <Card key={type} className="bg-card border-border">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground capitalize mb-1">{type}</p>
                <p className="text-2xl font-black text-foreground">{grouped[type]?.length ?? 0}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Memory context summary */}
        {context && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                Active Memory Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-secondary/50 p-3 rounded-lg overflow-auto max-h-40">
                {typeof context === "string" ? context : JSON.stringify(context, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Memory entries */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : memory && memory.length > 0 ? (
          <div className="space-y-4">
            {Object.entries(grouped).map(([type, entries]) => (
              <div key={type}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 capitalize">
                  {type} Memory ({entries?.length})
                </h3>
                <div className="space-y-2">
                  {entries?.map((entry) => (
                    <div key={entry.id} className="p-3 rounded-lg border border-border bg-card">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 ${memoryTypeColors[entry.memoryType] || ""}`}>
                            {entry.memoryType}
                          </Badge>
                          <span className="text-xs font-medium text-foreground">{entry.key}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                          <Clock className="w-2.5 h-2.5" />
                          {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{entry.value}</p>
                      {entry.importance !== null && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="h-0.5 flex-1 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(entry.importance ?? 0) * 100}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-muted-foreground">
                            {Math.round((entry.importance ?? 0) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center">
              <Database className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-semibold text-foreground mb-1">No Memory Entries Yet</h3>
              <p className="text-xs text-muted-foreground">
                Agent memory is populated as you interact with agents across sessions.
              </p>
            </div>
          </div>
        )}
      </div>
    </AgentLayout>
  );
}
