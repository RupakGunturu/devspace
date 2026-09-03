import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { adminApi, type ContentItem } from "@/lib/adminApi";
import { toast } from "@/components/ui/toaster";
import {
  Plus,
  Pencil,
  Trash2,
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
  GraduationCap,
} from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminCardSkeleton } from "@/components/admin/AdminCardSkeleton";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { PaginationBar } from "@/components/PaginationBar";
import { usePagination } from "@/hooks/use-pagination";
import { motion } from "motion/react";

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
  "learning-resource": { label: "Learning", singular: "Learning Resource", icon: GraduationCap },
};

const TYPE_ORDER = Object.keys(TYPE_META);
const PAGE_SIZES = [10, 20, 30];

export default function ContentManager() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") ?? "post";
  const meta = TYPE_META[type] ?? TYPE_META.post;

  const [items, setItems] = useState<ContentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const load = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = { type, limit: String(perPage), page: String(page) };
    if (query) params.q = query;
    adminApi
      .listContent(params)
      .then((d) => {
        setItems(d.items);
        setTotal(d.total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [type, page, perPage, query]);

  useEffect(() => {
    setPage(1);
  }, [type]);

  useEffect(load, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteContent(deleteTarget._id);
      setDeleteTarget(null);
      toast.success(`Deleted "${deleteTarget.title}"`);
      load();
    } catch (e) {
      toast.danger((e as Error).message);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const EmptyIcon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">{meta.label}</h1>
          <p className="text-sm text-muted">
            {total} {meta.label.toLowerCase()} via the content manager.
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

        <AdminSearchBar
          placeholder={`Search ${meta.label.toLowerCase()}…`}
          value={query}
          onChange={setQuery}
          className="relative flex-1 min-w-[200px]"
        />

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
      </div>

      {error && (
        <p className="rounded-sm bg-coral/10 p-2 font-mono text-[12px] text-coral">{error}</p>
      )}

      {loading ? (
        <AdminCardSkeleton count={perPage} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<EmptyIcon className="h-8 w-8" />}
          title={query ? "No matching items." : `No ${meta.label.toLowerCase()} yet.`}
          description={query ? "Try a different search term." : undefined}
          action={
            !query ? (
              <Link
                to={`/admin/content/new?type=${type}`}
                className="inline-flex items-center gap-1 rounded-md bg-yellow px-3 py-2 font-mono text-[12px] font-bold text-ink hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Create first {meta.singular.toLowerCase()}
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="rounded-lg border border-line bg-card p-4 transition-shadow hover:shadow-md"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="min-w-0 truncate font-display font-bold text-foreground">
                    {item.title}
                  </h3>
                  <span className="shrink-0 flex items-center gap-1.5">
                    <span
                      title={item.status}
                      className={`h-2 w-2 rounded-full ${
                        item.status === "published" ? "bg-emerald-500" : "bg-muted"
                      }`}
                    />
                    <span className="rounded-full bg-paper-dim px-2 py-0.5 font-mono text-[10px] font-bold text-muted">
                      v{item.version}
                    </span>
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
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] text-muted">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
            </p>
            <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
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
    </motion.div>
  );
}
