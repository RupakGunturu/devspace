import { useEffect, useState } from "react";
import { adminApi, type Deployment } from "@/lib/adminApi";
import { VerificationProgress } from "@/components/admin/VerificationProgress";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminCardSkeleton } from "@/components/admin/AdminCardSkeleton";
import { PaginationBar } from "@/components/PaginationBar";
import { RefreshCw, History } from "lucide-react";
import { motion } from "motion/react";

const STATUS_COLORS: Record<string, string> = {
  deployed: "bg-yellow text-ink",
  committed: "bg-yellow text-ink",
  passed: "bg-yellow text-ink",
  failed: "bg-coral text-ink",
  rolled_back: "bg-paper-dim text-muted",
};

const PAGE_SIZES = [10, 20, 30];

export default function DeploymentLog() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const load = async (background = false) => {
    if (background) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await adminApi.listDeployments();
      setDeployments(data.items);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const hasActive = deployments.some(
      (d) => d.overallStatus === "verifying" || d.overallStatus === "pending",
    );
    if (!hasActive) return;
    const t = setInterval(() => load(true), 3000);
    return () => clearInterval(t);
  }, [deployments]);

  const totalPages = Math.max(1, Math.ceil(deployments.length / perPage));
  const paginated = deployments.slice((page - 1) * perPage, page * perPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">Deploy Log</h1>
          <p className="text-sm text-muted">
            Every code/content change with verification status and version.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
          <button
            onClick={() => load(true)}
            className="flex items-center gap-1 rounded-md bg-paper-dim px-3 py-2 font-mono text-[12px] text-foreground hover:text-yellow"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-sm bg-coral/10 p-2 font-mono text-[12px] text-coral">{error}</p>
      )}

      {loading ? (
        <AdminCardSkeleton count={perPage} />
      ) : deployments.length === 0 ? (
        <EmptyState
          icon={<History className="h-8 w-8" />}
          title="No deployments yet."
          description="Deploy a game or tool to see history here."
        />
      ) : (
        <>
          <div className="space-y-4">
            {paginated.map((d, i) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="rounded-lg border border-line bg-card p-4"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-display font-bold text-foreground">
                      {d.contentSlug}
                    </p>
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
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] text-muted">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, deployments.length)} of{" "}
              {deployments.length}
            </p>
            <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </motion.div>
  );
}
