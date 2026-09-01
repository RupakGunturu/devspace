import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, type Deployment } from "@/lib/adminApi";
import { FileText, Layers, CheckCircle2, Clock, History } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    total: number;
    published: number;
    drafts: number;
    deployments: number;
  } | null>(null);
  const [recent, setRecent] = useState<Deployment[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getStats()
      .then((data) => {
        setStats(data.stats);
        setRecent(data.recent);
      })
      .catch((e) => setError(e.message));
  }, []);

  const cards = [
    { label: "Total content", value: stats?.total ?? "—", icon: Layers },
    { label: "Published", value: stats?.published ?? "—", icon: CheckCircle2 },
    { label: "Drafts", value: stats?.drafts ?? "—", icon: FileText },
    { label: "Deployments", value: stats?.deployments ?? "—", icon: History },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted">Manage all content and code for DevSpace.</p>
      </div>

      {error && (
        <p className="rounded-sm bg-coral/10 p-2 font-mono text-[12px] text-coral">{error}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-line bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <card.icon className="mb-2 h-6 w-6 text-yellow" />
            <p className="font-display text-2xl font-extrabold text-foreground">{card.value}</p>
            <p className="text-sm text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-line bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-foreground">Recent deployments</h2>
          <Link
            to="/admin/deployments"
            className="font-mono text-[12px] text-yellow hover:underline"
          >
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-muted">No deployments yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((d) => (
              <li key={d._id} className="flex items-center justify-between py-2 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{d.contentSlug}</p>
                  <p className="font-mono text-[11px] text-muted">
                    {d.action} · v{d.version}
                  </p>
                </div>
                <span
                  className={`ml-3 shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                    d.overallStatus === "deployed" || d.overallStatus === "committed"
                      ? "bg-yellow text-ink"
                      : d.overallStatus === "failed"
                        ? "bg-coral text-ink"
                        : "bg-paper-dim text-muted"
                  }`}
                >
                  {d.overallStatus}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
