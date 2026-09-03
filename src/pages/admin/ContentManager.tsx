import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { adminApi, type ContentItem } from "@/lib/adminApi";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FileText,
  Gamepad2,
  Wrench,
  Lightbulb,
  FileClock,
  LayoutList,
  Sparkles,
  Briefcase,
  Bot,
  Layers,
  Rocket,
} from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

const TYPE_META: Record<string, { label: string; singular: string; icon: React.ElementType }> = {
  post: { label: "Posts", singular: "Post", icon: FileText },
  series: { label: "Series", singular: "Series", icon: FileClock },
  game: { label: "Games", singular: "Game", icon: Gamepad2 },
  tool: { label: "Tools", singular: "Tool", icon: Wrench },
  tip: { label: "Tips", singular: "Tip", icon: Lightbulb },
  "cheat-sheet": { label: "Cheat Sheets", singular: "Cheat Sheet", icon: LayoutList },
  "stack-breakdown": { label: "Stack Breakdowns", singular: "Stack Breakdown", icon: Layers },
  "hidden-gem": { label: "Hidden Gems", singular: "Hidden Gem", icon: Sparkles },
  hiring: { label: "Hiring", singular: "Hiring", icon: Briefcase },
  "mcp-skill": { label: "MCP Skills", singular: "MCP Skill", icon: Bot },
  "startup-term": { label: "Startup Terms", singular: "Startup Term", icon: Rocket },
};

const TYPE_ORDER = Object.keys(TYPE_META);

export default function ContentManager() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") ?? "post";
  const meta = TYPE_META[type] ?? TYPE_META.post;

  const [items, setItems] = useState<ContentItem[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);

  const load = () => {
    adminApi
      .listContent({ type, limit: "500" })
      .then((d) => setItems(d.items))
      .catch((e) => setError(e.message));
  };

  useEffect(load, [type]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.slug.toLowerCase().includes(q) ||
        (i.description ?? "").toLowerCase().includes(q),
    );
  }, [items, query]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteContent(deleteTarget._id);
      setDeleteTarget(null);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const EmptyIcon = meta.icon;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">{meta.label}</h1>
          <p className="text-sm text-muted">
            {items.length} {meta.label.toLowerCase()} via the content manager.
          </p>
        </div>
        <Link
          to={`/admin/content/new?type=${type}`}
          className="flex items-center gap-1 rounded-md bg-yellow px-3 py-2 font-mono text-[12px] font-bold text-ink hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New {meta.singular}
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={type}
          onChange={(e) => {
            const next = e.target.value;
            const sp = new URLSearchParams(searchParams);
            sp.set("type", next);
            window.history.replaceState(null, "", `/admin/content?${sp.toString()}`);
            setQuery("");
          }}
          className="rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
        >
          {TYPE_ORDER.map((t) => (
            <option key={t} value={t}>
              {TYPE_META[t].label}
            </option>
          ))}
        </select>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${meta.label.toLowerCase()}…`}
            className="w-full rounded-md border border-line bg-input-bg py-2 pr-3 pl-9 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-sm bg-coral/10 p-2 font-mono text-[12px] text-coral">{error}</p>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line p-10 text-center">
          <EmptyIcon className="mb-2 h-8 w-8 text-muted" />
          <p className="text-muted">
            {query ? "No matching items." : `No ${meta.label.toLowerCase()} yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="rounded-lg border border-line bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="min-w-0 truncate font-display font-bold text-foreground">
                  {item.title}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                    item.status === "published" ? "bg-yellow text-ink" : "bg-paper-dim text-muted"
                  }`}
                >
                  {item.status === "published" ? "pub" : "draft"} · v{item.version}
                </span>
              </div>
              {item.series && (
                <div className="mb-1 font-mono text-[11px] text-muted">series: {item.series}</div>
              )}
              <p className="mb-3 line-clamp-2 text-sm text-muted">{item.description}</p>
              <div className="flex items-center gap-2">
                <Link
                  to={`/admin/content/${item._id}/edit`}
                  className="flex items-center gap-1 rounded-sm bg-paper-dim px-2 py-1 font-mono text-[11px] text-foreground hover:text-yellow"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Link>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="flex items-center gap-1 rounded-sm bg-paper-dim px-2 py-1 font-mono text-[11px] text-foreground hover:text-coral"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={`Delete ${meta.singular.toLowerCase()}`}
        danger
        confirmLabel="Delete"
        descriptions={[
          `This will permanently delete "${deleteTarget?.title}" and remove it from the site.`,
        ]}
        onConfirm={handleDelete}
      />
    </div>
  );
}
