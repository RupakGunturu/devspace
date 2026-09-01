import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { adminApi, type ContentType, type CodeFile } from "@/lib/adminApi";
import { CodeEditor } from "@/components/admin/CodeEditor";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

const TYPE_LABELS: Record<ContentType, string> = {
  post: "Post",
  "stack-breakdown": "Stack Breakdown",
  "startup-term": "Startup Term",
  tool: "Tool",
  game: "Game",
  tip: "Tip",
  "cheat-sheet": "Cheat Sheet",
  "hidden-gem": "Hidden Gem",
  hiring: "Hiring",
  "mcp-skill": "MCP Skill",
};

const SERIES_OPTIONS = [
  "hot-take",
  "react-101",
  "stack-deep-dive",
  "toolbox",
  "dev-tip",
  "startup-fundamentals",
];

const CONTENT_DIRS: Partial<Record<ContentType, string>> = {
  post: "src/data/posts",
  "stack-breakdown": "src/data/stackbreakdowns",
  "startup-term": "src/data/startup-terms",
  tool: "src/components/tools",
  game: "src/components/games",
  tip: "src/data/tips",
  "cheat-sheet": "src/data/cheat-sheets",
  "hidden-gem": "src/data/hidden-gems",
  hiring: "src/data/hiring",
  "mcp-skill": "src/data/mcp-skills",
};

function toComponentName(s: string): string {
  return s
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
}

export default function ContentEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const forcedType = searchParams.get("type") as ContentType | null;

  const [type, setType] = useState<ContentType>(forcedType ?? "post");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [series, setSeries] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
  const [isCode, setIsCode] = useState(forcedType === "game" || forcedType === "tool");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    adminApi
      .getContent(id!)
      .then(({ item }) => {
        setType(item.type);
        setTitle(item.title);
        setDescription(item.description);
        setBody(item.body);
        setSeries(item.series ?? "");
        setTags(item.tags);
        setIsCode(item.type === "game" || item.type === "tool");
        setCodeFiles(item.codeFiles ?? []);
        setStatus(item.status);
      })
      .catch((e) => setError(e.message));
  }, [id, isEdit]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const dir = CONTENT_DIRS[type];
  const filePath = dir ? `${dir}/${toComponentName(title) || "NewComponent"}.tsx` : "";

  const handleSave = async (deployCode: boolean) => {
    setError("");
    setMessage("");
    setDeploying(true);
    try {
      if (isCode && deployCode) {
        const payload = {
          type,
          title,
          description,
          tags,
          files: codeFiles,
          existingSlug: isEdit ? undefined : undefined,
        };
        const res = await adminApi.submitCode(payload);
        setMessage(`Deployment started (${res.sessionId}). Track it in Deploy Log.`);
        navigate("/admin/deployments");
      } else {
        if (isEdit) {
          await adminApi.updateContent(id!, { title, description, body, series, tags, status });
          setMessage("Content updated.");
        } else {
          const res = await adminApi.createContent({
            type,
            title,
            description,
            body,
            series: series || undefined,
            tags,
            status,
            codeFiles: isCode ? codeFiles : undefined,
          });
          setMessage("Content created.");
          navigate(`/admin/content/${res.item._id}/edit`);
        }
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-foreground">
          {isEdit ? "Edit content" : "New content"}
        </h1>
        <p className="text-sm text-muted">
          {isCode
            ? "Provides code verification + auto-deploy."
            : "Text/markdown content stored in MongoDB."}
        </p>
      </div>

      {error && (
        <p className="rounded-sm bg-coral/10 p-2 font-mono text-[12px] text-coral">{error}</p>
      )}
      {message && (
        <p className="rounded-sm bg-yellow/20 p-2 font-mono text-[12px] text-ink">{message}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-mono text-[12px] text-muted">Type</span>
          <select
            value={type}
            disabled={isEdit}
            onChange={(e) => {
              const t = e.target.value as ContentType;
              setType(t);
              setIsCode(t === "game" || t === "tool");
            }}
            className="w-full rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
          >
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block font-mono text-[12px] text-muted">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="w-full rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-mono text-[12px] text-muted">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
        />
      </label>

      {type === "post" && (
        <label className="block">
          <span className="mb-1 block font-mono text-[12px] text-muted">Series</span>
          <select
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            className="w-full rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
          >
            <option value="">None</option>
            {SERIES_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="block">
        <span className="mb-1 block font-mono text-[12px] text-muted">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
        />
      </label>

      {/* Tags */}
      <div>
        <span className="mb-1 block font-mono text-[12px] text-muted">Tags</span>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 rounded-full bg-paper-dim px-2 py-0.5 font-mono text-[11px] text-foreground"
            >
              {t}
              <button
                type="button"
                onClick={() => setTags(tags.filter((x) => x !== t))}
                className="text-muted hover:text-coral"
              >
                ×
              </button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add tag + Enter"
            className="rounded-md border border-line bg-input-bg px-2 py-1 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
          />
        </div>
      </div>

      {/* Body / Code */}
      {isCode ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[12px] text-muted">
              Component path: <span className="text-yellow">{filePath}</span>
            </span>
            <button
              type="button"
              onClick={() =>
                setCodeFiles([
                  ...codeFiles,
                  { path: "", content: "", isMain: codeFiles.length === 0 },
                ])
              }
              className="rounded-sm bg-paper-dim px-2 py-1 font-mono text-[11px] text-muted hover:text-yellow"
            >
              + Add file
            </button>
          </div>

          {codeFiles.length === 0 && !isEdit && (
            <button
              type="button"
              onClick={() => setCodeFiles([{ path: filePath, content: "", isMain: true }])}
              className="rounded-md border border-dashed border-line p-4 text-sm text-muted hover:border-yellow hover:text-yellow"
            >
              + Add main component file
            </button>
          )}

          {codeFiles.map((f, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  value={
                    f.path === "" && i === 0 && !codeFiles.some((x) => x.path) ? filePath : f.path
                  }
                  onChange={(e) => {
                    const next = [...codeFiles];
                    next[i] = { ...next[i], path: e.target.value };
                    setCodeFiles(next);
                  }}
                  placeholder={filePath || "src/components/.../File.tsx"}
                  className="flex-1 rounded-md border border-line bg-input-bg px-3 py-1.5 font-mono text-[12px] text-input-text outline-none focus:ring-2 focus:ring-yellow"
                />
                <label className="flex items-center gap-1 font-mono text-[11px] text-muted">
                  <input
                    type="checkbox"
                    checked={f.isMain}
                    onChange={(e) => {
                      const next = codeFiles.map((x, xi) =>
                        xi === i ? { ...x, isMain: e.target.checked } : x,
                      );
                      setCodeFiles(next);
                    }}
                  />
                  main
                </label>
                <button
                  type="button"
                  onClick={() => setCodeFiles(codeFiles.filter((_, xi) => xi !== i))}
                  className="text-muted hover:text-coral"
                >
                  ×
                </button>
              </div>
              <CodeEditor
                value={f.content}
                onChange={(v) => {
                  const next = [...codeFiles];
                  next[i] = { ...next[i], content: v };
                  setCodeFiles(next);
                }}
                placeholder={`// ${new Intl.NumberFormat("en", { notation: "compact" }).format(0)}...`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <span className="mb-1 block font-mono text-[12px] text-muted">Body (Markdown)</span>
          <MarkdownEditor value={body} onChange={setBody} />
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={deploying || (isCode && codeFiles.length === 0)}
          className="rounded-md bg-yellow px-4 py-2 font-mono text-[12px] font-bold text-ink transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCode ? "Verify & Deploy" : isEdit ? "Save Changes" : "Create"}
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={
          isCode
            ? isEdit
              ? "Confirm Rewrite"
              : "Confirm Deploy"
            : isEdit
              ? "Confirm Update"
              : "Confirm Create"
        }
        danger={isEdit}
        confirmLabel={isCode ? "Verify & Deploy" : isEdit ? "Save Changes" : "Create"}
        descriptions={
          isCode
            ? [
                isEdit
                  ? "You are about to OVERWRITE the existing component."
                  : `A new ${type} will be created.`,
                ...codeFiles.map((f) => `• ${f.path}`),
                "Code goes through TypeScript → ESLint → tests → build. It is committed only if all pass.",
              ]
            : [
                `Create ${isEdit ? "an edited version of" : "a new"} ${type}: "${title}".`,
                isEdit
                  ? "The version number will be incremented (v+1)."
                  : "You can publish it later.",
              ]
        }
        onConfirm={() => handleSave(true)}
      />
    </div>
  );
}
