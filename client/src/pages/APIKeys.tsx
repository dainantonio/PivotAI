import AgentLayout from "@/components/AgentLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { ExternalLink, KeyRound, Loader2, PlugZap, ShieldCheck, Unplug } from "lucide-react";

type Provider = {
  id: "openai" | "anthropic";
  label: string;
  memoryKey: string;
  docsUrl: string;
  placeholder: string;
  helpText: string;
};

const providers: Provider[] = [
  {
    id: "openai",
    label: "OpenAI",
    memoryKey: "provider_openai_api_key",
    docsUrl: "https://platform.openai.com/api-keys",
    placeholder: "sk-...",
    helpText: "Used for GPT models and OpenAI-native workflows.",
  },
  {
    id: "anthropic",
    label: "Anthropic",
    memoryKey: "provider_anthropic_api_key",
    docsUrl: "https://console.anthropic.com/settings/keys",
    placeholder: "sk-ant-...",
    helpText: "Used for Claude models and Anthropic-native workflows.",
  },
];

function maskKey(value: string) {
  if (!value) return "";
  if (value.length <= 8) return "••••••••";
  return `${value.slice(0, 4)}••••••••${value.slice(-4)}`;
}

export default function APIKeys() {
  const { data: memory, refetch } = trpc.agent.getMemory.useQuery({ limit: 100 });
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const writeMemory = trpc.memory.write.useMutation({
    onError: (e) => toast.error(e.message),
  });

  const keyState = useMemo(() => {
    const memoryMap = new Map((memory ?? []).map((entry) => [entry.key, entry.value]));
    const state: Record<string, { connected: boolean; masked: string }> = {};

    for (const provider of providers) {
      const raw = String(memoryMap.get(provider.memoryKey) ?? "");
      const connected = Boolean(raw && raw !== "__DISCONNECTED__");
      state[provider.memoryKey] = {
        connected,
        masked: connected ? maskKey(raw) : "",
      };
    }

    return state;
  }, [memory]);

  const connectKey = async (provider: Provider) => {
    const raw = (drafts[provider.memoryKey] ?? "").trim();
    if (!raw) {
      toast.error(`Enter a ${provider.label} API key first.`);
      return;
    }

    await writeMemory.mutateAsync({
      key: provider.memoryKey,
      value: raw,
      memoryType: "semantic",
      importance: 95,
    });

    toast.success(`${provider.label} API key connected.`);
    setDrafts((prev) => ({ ...prev, [provider.memoryKey]: "" }));
    refetch();
  };

  const disconnectKey = async (provider: Provider) => {
    await writeMemory.mutateAsync({
      key: provider.memoryKey,
      value: "__DISCONNECTED__",
      memoryType: "semantic",
      importance: 80,
    });

    toast.success(`${provider.label} API key disconnected.`);
    refetch();
  };

  return (
    <AgentLayout title="API Providers" subtitle="Connect your own model provider keys for OpenAI and Anthropic">
      <div className="p-6 max-w-4xl space-y-5">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-xs text-muted-foreground flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>
              Manage external provider credentials in one place. Connected keys are masked in the UI.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((provider) => {
            const state = keyState[provider.memoryKey] ?? { connected: false, masked: "" };

            return (
              <Card key={provider.id} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-primary" />
                      {provider.label}
                    </span>
                    <Badge
                      variant="outline"
                      className={state.connected ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-muted text-muted-foreground"}
                    >
                      {state.connected ? "Connected" : "Not connected"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">{provider.helpText}</p>

                  {state.connected && (
                    <div className="rounded-lg border border-green-400/20 bg-green-400/5 px-3 py-2">
                      <p className="text-[11px] text-green-400 font-medium">Current key</p>
                      <p className="text-xs text-foreground font-mono">{state.masked}</p>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{state.connected ? "Replace API key" : "API key"}</Label>
                    <Input
                      type="password"
                      value={drafts[provider.memoryKey] ?? ""}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [provider.memoryKey]: e.target.value }))}
                      placeholder={provider.placeholder}
                      className="font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      onClick={() => connectKey(provider)}
                      disabled={writeMemory.isPending}
                      className="gap-1"
                    >
                      {writeMemory.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlugZap className="w-3.5 h-3.5" />}
                      {state.connected ? "Update key" : "Connect key"}
                    </Button>

                    {state.connected && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => disconnectKey(provider)}
                        disabled={writeMemory.isPending}
                        className="gap-1"
                      >
                        <Unplug className="w-3.5 h-3.5" />
                        Disconnect
                      </Button>
                    )}

                    <a href={provider.docsUrl} target="_blank" rel="noreferrer" className="ml-auto">
                      <Button size="sm" variant="ghost" className="h-8 text-xs gap-1 text-muted-foreground hover:text-primary">
                        Get key
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AgentLayout>
  );
}
