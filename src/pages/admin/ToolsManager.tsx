import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, type ContentItem } from "@/lib/adminApi";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export default function ToolsManager() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);

  const load = () => {
    adminApi
      .listContent({ type: "tool", limit: "100" })
      .then((d) => setItems(d.items))
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">Tools</h1>
          <p className="text-sm text-muted">{items.length} tools managed by the dashboard.</p>
        </div>
        <Link
          to="/admin/tools/new"
          className="flex items-center gap-1 rounded-md bg-yellow px-3 py-2 font-mono text-[12px] font-bold text-ink hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New Tool
        </Link>
      </div>

      {error && (
        <p className="rounded-sm bg-coral/10 p-2 font-mono text-[12px] text-coral">{error}</p>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line p-10 text-center">
          <Wrench className="mb-2 h-8 w-8 text-muted" />
          <p className="text-muted">No tools yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <div
              key={t._id}
              className="rounded-lg border border-line bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className="mb-1 flex items-start justify-between">
                <h3 className="font-display font-bold text-foreground">{t.title}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                    t.status === "published" ? "bg-yellow text-ink" : "bg-paper-dim text-muted"
                  }`}
                >
                  v{t.version}
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
            </div>
          ))}
        </div>
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
    </div>
  );
}
