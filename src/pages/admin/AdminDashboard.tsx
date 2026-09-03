import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, type ContentType, type Deployment } from "@/lib/adminApi";
import {
  FileText,
  Layers,
  CheckCircle2,
  History,
  Home,
  Package,
  Wrench,
  Gamepad2,
  Lightbulb,
  BookOpen,
  Boxes,
  Briefcase,
  Bot,
  Rocket,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/admin/EmptyState";
import { motion } from "motion/react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer } from "recharts";

type Stats = {
  total: number;
  published: number;
  drafts: number;
  deployments: number;
  types: Record<ContentType, number>;
};

const TYPE_META: { type: ContentType; label: string; icon: IconComponent }[] = [
  { type: "post", label: "Posts", icon: FileText },
  { type: "series", label: "Series", icon: Boxes },
  { type: "game", label: "Games", icon: Gamepad2 },
  { type: "tool", label: "Tools", icon: Wrench },
  { type: "tip", label: "Tips", icon: Lightbulb },
  { type: "cheat-sheet", label: "Cheat Sheets", icon: BookOpen },
  { type: "stack-breakdown", label: "Stack Breakdowns", icon: Layers },
  { type: "hidden-gem", label: "Hidden Gems", icon: Sparkles },
  { type: "hiring", label: "Hiring", icon: Briefcase },
  { type: "mcp-skill", label: "MCP Skills", icon: Bot },
  { type: "startup-term", label: "Startup Terms", icon: Rocket },
  { type: "learning-resource", label: "Resources", icon: GraduationCap },
];

const BAR_COLORS = [
  "#f4d922",
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#06b6d4",
  "#ef4444",
  "#ec4899",
  "#84cc16",
  "#8b5cf6",
  "#f59e0b",
  "#14b8a6",
];

type IconProps = { className?: string; style?: React.CSSProperties };
type IconComponent = React.ComponentType<IconProps>;

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getStats()
      .then((data) => {
        setStats(data.stats);
        setRecent(data.recent);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total content", value: stats?.total ?? "—", icon: Layers, accent: "border-t-yellow" },
    {
      label: "Published",
      value: stats?.published ?? "—",
      icon: CheckCircle2,
      accent: "border-t-emerald-500",
    },
    { label: "Drafts", value: stats?.drafts ?? "—", icon: FileText, accent: "border-t-sky-500" },
    {
      label: "Deployments",
      value: stats?.deployments ?? "—",
      icon: History,
      accent: "border-t-coral",
    },
  ];

  const emptyTypes: Record<ContentType, number> = {
    post: 0,
    series: 0,
    game: 0,
    tool: 0,
    tip: 0,
    "cheat-sheet": 0,
    "stack-breakdown": 0,
    "hidden-gem": 0,
    hiring: 0,
    "mcp-skill": 0,
    "startup-term": 0,
    "learning-resource": 0,
  };
  const types = stats?.types ?? emptyTypes;

  const chartData = TYPE_META.map((m, i) => ({
    type: m.type,
    label: m.label,
    count: types[m.type] ?? 0,
    color: BAR_COLORS[i % BAR_COLORS.length],
  }));

  const chartConfig: ChartConfig = Object.fromEntries(
    TYPE_META.map((m) => [m.type, { label: m.label, color: "#f4d922" }]),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display text-2xl font-extrabold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted">Manage all content and code for DevSpace.</p>
      </div>

      {error && (
        <p className="rounded-sm bg-coral/10 p-2 font-mono text-[12px] text-coral">{error}</p>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-line bg-card p-4 shadow-sm">
                <Skeleton className="mb-2 h-6 w-6 bg-line" />
                <Skeleton className="mb-1 h-7 w-16 bg-line" />
                <Skeleton className="h-4 w-24 bg-line" />
              </div>
            ))
          : cards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className={`rounded-lg border border-line border-t-4 bg-card p-4 shadow-sm transition-shadow hover:shadow-md ${card.accent}`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <card.icon className="h-5 w-5 text-muted" style={{ color: "var(--muted)" }} />
                  <span className="font-mono text-[10px] text-muted uppercase tracking-wide">
                    {card.label}
                  </span>
                </div>
                <p className="font-display text-3xl font-extrabold text-foreground">{card.value}</p>
              </motion.div>
            ))}
      </div>

      {/* Chart + sections */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Content by type chart */}
        <div className="rounded-lg border border-line bg-card p-4 lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-foreground">Content by type</h2>
            <span className="font-mono text-[11px] text-muted">
              {stats ? `${stats.total} total` : "…"}
            </span>
          </div>
          {loading ? (
            <Skeleton className="h-64 w-full bg-line" />
          ) : (
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: -18 }}>
                <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="type"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip
                  cursor={{ fill: "var(--paper-dim)", opacity: 0.4 }}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((d) => (
                    <Cell key={d.type} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </div>

        {/* Sections with counts */}
        <div className="rounded-lg border border-line bg-card p-4 lg:col-span-2">
          <h2 className="mb-3 font-display text-base font-bold text-foreground">Sections</h2>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full bg-line" />
              ))}
            </div>
          ) : (
            <ul className="space-y-1.5">
              {TYPE_META.map((m, i) => {
                const Icon = m.icon;
                const count = types[m.type] ?? 0;
                return (
                  <li
                    key={m.type}
                    className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-paper-dim"
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${BAR_COLORS[i % BAR_COLORS.length]}22` }}
                    >
                      <Icon
                        className="h-3.5 w-3.5"
                        style={{ color: BAR_COLORS[i % BAR_COLORS.length] }}
                      />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                      {m.label}
                    </span>
                    <span className="font-mono text-sm font-bold text-yellow">{count}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Recent deployments */}
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
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <Skeleton className="h-4 w-40 bg-line" />
                <Skeleton className="h-5 w-20 rounded-full bg-line" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <EmptyState
            icon={<History className="h-8 w-8" />}
            title="No deployments yet"
            description="When you deploy games or tools, they'll show up here."
          />
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
    </motion.div>
  );
}
