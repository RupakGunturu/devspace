import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, type ContentItem } from "@/lib/adminApi";
import { toast } from "@/components/ui/toaster";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminCardSkeleton } from "@/components/admin/AdminCardSkeleton";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { PaginationBar } from "@/components/PaginationBar";
import { motion } from "motion/react";

const PAGE_SIZES = [10, 20, 30];

export default function ToolsManager() {
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
    const params: Record<string, string> = {
      type: "tool",
      limit: String(perPage),
      page: String(page),
    };
    if (query) params.q = query;
    adminApi
      .listContent(params)
      .then((d) => {
        setItems(d.items);
        setTotal(d.total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page, perPage, query]);

  useEffect(() => {
    load();
  }, [load]);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">Tools</h1>
          <p className="text-sm text-muted">{total} tools managed by the dashboard.</p>
        </div>
        <Link
          to="/admin/tools/new"
          className="flex items-center gap-1 rounded-md bg-yellow px-3 py-2 font-mono text-[12px] font-bold text-ink hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New Tool
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AdminSearchBar
          placeholder="Search tools…"
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
          icon={<Wrench className="h-8 w-8" />}
          title={query ? "No matching tools." : "No tools yet."}
          description={
            query
              ? "Try a different search term."
              : "Create your first tool with code verification."
          }
          action={
            !query ? (
              <Link
                to="/admin/tools/new"
                className="inline-flex items-center gap-1 rounded-md bg-yellow px-3 py-2 font-mono text-[12px] font-bold text-ink hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> New Tool
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="rounded-lg border border-line bg-card p-4 transition-shadow hover:shadow-md"
              >
                <div className="mb-1 flex items-start justify-between">
                  <h3 className="font-display font-bold text-foreground">{t.title}</h3>
                  <span className="shrink-0 flex items-center gap-1.5">
                    <span
                      title={t.status}
                      className={`h-2 w-2 rounded-full ${
                        t.status === "published" ? "bg-emerald-500" : "bg-muted"
                      }`}
                    />
                    <span className="rounded-full bg-paper-dim px-2 py-0.5 font-mono text-[10px] font-bold text-muted">
                      v{t.version}
                    </span>
                  </span>
                </div>
                <p className="mb-3 line-clamp-2 text-sm text-muted">{t.description}</p>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/content/${t._id}/edit`}
                    className="flex items-center gap-1 rounded-sm bg-paper-dim px-2 py-1 font-mono text-[11px] text-foreground hover:text-yellow"
                  >
                    <Pencil className="h-3 w-3" /> Edit / Rewrite
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(t)}
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
        title="Delete tool"
        danger
        confirmLabel="Delete"
        descriptions={[`This will permanently delete "${deleteTarget?.title}".`]}
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
