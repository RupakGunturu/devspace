import { useEffect, useState } from "react";
import { adminApi, type Deployment } from "@/lib/adminApi";
import { VerificationProgress } from "@/components/admin/VerificationProgress";
import { RefreshCw } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  deployed: "bg-yellow text-ink",
  committed: "bg-yellow text-ink",
  passed: "bg-yellow text-ink",
  failed: "bg-coral text-ink",
  rolled_back: "bg-paper-dim text-muted",
};

export default function DeploymentLog() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = async (background = false) => {
    if (background) setRefreshing(true);
    try {
      const data = await adminApi.listDeployments();
      setDeployments(data.items);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      if (background) setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Poll every 3s for any in-progress deployment
  useEffect(() => {
    const hasActive = deployments.some(
      (d) => d.overallStatus === "verifying" || d.overallStatus === "pending",
    );
    if (!hasActive) return;
    const t = setInterval(() => load(true), 3000);
    return () => clearInterval(t);
  }, [deployments]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">Deploy Log</h1>
          <p className="text-sm text-muted">
            Every code/content change with verification status and version.
          </p>
        </div>
        <button
          onClick={() => load(true)}
          className="flex items-center gap-1 rounded-md bg-paper-dim px-3 py-2 font-mono text-[12px] text-foreground hover:text-yellow"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error && (
        <p className="rounded-sm bg-coral/10 p-2 font-mono text-[12px] text-coral">{error}</p>
      )}

      {deployments.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line p-8 text-center text-muted">
          No deployments logged yet. Deploy a game or tool to see history here.
        </p>
      ) : (
        <div className="space-y-4">
          {deployments.map((d) => (
            <div key={d._id} className="rounded-lg border border-line bg-card p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-display font-bold text-foreground">{d.contentSlug}</p>
                  <p className="font-mono text-[11px] text-muted">
                    {d.action} · v{d.version} · {d.sessionId}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                    STATUS_COLORS[d.overallStatus] ?? "bg-paper-dim text-muted"
                  }`}
                >
                  {d.overallStatus}
                </span>
              </div>

              <VerificationProgress phases={d.phases} />

              {d.deploymentErrors && d.deploymentErrors.length > 0 && (
                <ul className="mt-2 space-y-1 rounded-sm bg-coral/10 p-2 font-mono text-[11px] text-coral">
                  {d.deploymentErrors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              )}

              {d.commitUrl && (
                <a
                  href={d.commitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block font-mono text-[11px] text-yellow hover:underline"
                >
                  View commit PR →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
