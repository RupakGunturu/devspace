import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { adminApi, type ContentType, type CodeFile } from "@/lib/adminApi";
import { CodeEditor } from "@/components/admin/CodeEditor";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { GAMES_REGISTRY } from "@/components/games/registry";
import { Copy, Check, ExternalLink, Play } from "lucide-react";

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
  series: "Series",
  "learning-resource": "Learning Resource",
};

const SERIES_OPTIONS = [
  "startup-terms",
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
  "learning-resource": "src/data/learning-resources",
  series: "src/data/series",
};

function toComponentName(s: string): string {
  return s
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
}

function GamePreview({ slug }: { slug: string }) {
  const Component = GAMES_REGISTRY[slug];
  if (!Component) {
    return (
      <p className="py-8 text-center font-mono text-[12px] text-muted">
        Live preview isn't available for this custom content yet.
        <br />
        Open it on the public site to play.
      </p>
    );
  }
  return <Component />;
}

function EditorSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-8 w-48 bg-line" />
      <Skeleton className="h-4 w-72 bg-line" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-20 bg-line" />
        <Skeleton className="h-20 bg-line" />
      </div>
      <Skeleton className="h-12 bg-line" />
      <Skeleton className="h-12 bg-line" />
      <Skeleton className="h-20 bg-line" />
      <Skeleton className="h-48 bg-line" />
    </div>
  );
}

export default function ContentEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const forcedType = searchParams.get("type") as ContentType | null;

  const [loading, setLoading] = useState(isEdit);
  const [type, setType] = useState<ContentType>(forcedType ?? "post");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [galleryInput, setGalleryInput] = useState("");
  const [series, setSeries] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imgPath, setImgPath] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
  const [isCode, setIsCode] = useState(forcedType === "game" || forcedType === "tool");

  const [codeMode, setCodeMode] = useState<"edit" | "source" | "preview">("edit");
  const [sourceContent, setSourceContent] = useState<string>("");
  const [sourcePath, setSourcePath] = useState<string>("");
  const [sourceLoading, setSourceLoading] = useState(false);
  const [sourceError, setSourceError] = useState("");
  const [copied, setCopied] = useState(false);

  const [category, setCategory] = useState("");
  const [icon, setIcon] = useState("");
  const [tagline, setTagline] = useState("");
  const [url, setUrl] = useState("");
  const [faviconDomain, setFaviconDomain] = useState("");
  const [productName, setProductName] = useState("");
  const [cadence, setCadence] = useState("");
  const [resourceCost, setResourceCost] = useState("");
  const [isListing, setIsListing] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    adminApi
      .getContent(id!)
      .then(({ item }) => {
        setType(item.type);
        setTitle(item.title);
        setSlug(item.slug);
        setDescription(item.description);
        setBody(item.body);
        setImage(item.image ?? "");
        setImages(item.images ?? []);
        setSeries(item.series ?? "");
        setTags(item.tags ?? []);
        setIsCode(item.type === "game" || item.type === "tool");
        setCodeFiles(item.codeFiles ?? []);
        setStatus(item.status);
        setCategory(item.category ?? "");
        setIcon(item.icon ?? "");
        setTagline(item.tagline ?? "");
        setUrl(item.url ?? "");
        setFaviconDomain(item.faviconDomain ?? "");
        setProductName(item.productName ?? "");
        setCadence(item.cadence ?? "");
        setResourceCost(item.resourceCost ?? "");
        setIsListing(item.isListing ?? false);

        if (item.type === "game" || item.type === "tool") {
          setSourceLoading(true);
          adminApi
            .getContentSource(id!)
            .then((src) => {
              setSourceContent(src.content ?? "");
              setSourcePath(src.path ?? "");
              if (src.source === "repo" && !src.exists)
                setSourceError("No matching source found in the repo.");
              if (src.exists && src.content) {
                const fallbackPath = `${CONTENT_DIRS[item.type] ?? ""}/${
                  toComponentName(item.title) || "NewComponent"
                }.tsx`;
                const path = src.path ?? fallbackPath;
                setCodeFiles((prev) =>
                  prev.length === 0
                    ? [{ path, content: src.content as string, isMain: true }]
                    : prev,
                );
              }
            })
            .catch((e) => setSourceError(e.message))
            .finally(() => setSourceLoading(false));
        }
      })
      .catch((e) => {
        setError(e.message);
        toast.danger("Failed to load content");
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const handleInsertImage = () => {
    const path = imgPath.trim();
    if (!path) return;
    setBody((b) => `${b}${b ? "\n\n" : ""}![image](${path})\n`);
    setImgPath("");
  };

  const handleCopySource = async () => {
    const text =
      sourceContent ||
      codeFiles
        .map((f) => (f.path ? `// ${f.path}\n${f.content}` : f.content))
        .filter(Boolean)
        .join("\n\n");
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.danger("Couldn't copy to clipboard");
    }
  };

  const dir = CONTENT_DIRS[type];
  const filePath = dir ? `${dir}/${toComponentName(title) || "NewComponent"}.tsx` : "";

  const handleSave = async (deployCode: boolean) => {
    setError("");
    setDeploying(true);
    try {
      if (isCode && deployCode) {
        const payload = {
          type,
          title,
          description,
          tags,
          files: codeFiles,
        };
        const res = await adminApi.submitCode(payload);
        toast.success(`Deployment started (${res.sessionId.slice(0, 8)}…)`);
        navigate("/admin/deployments");
      } else {
        if (isEdit) {
          await adminApi.updateContent(id!, {
            title,
            description,
            body,
            series,
            tags,
            status,
            image,
            images,
            category,
            icon,
            tagline,
            url,
            faviconDomain,
            productName,
            cadence,
            resourceCost,
            isListing,
          });
          toast.success("Content updated.");
        } else {
          const res = await adminApi.createContent({
            type,
            title,
            description,
            body,
            series: series || undefined,
            tags,
            status,
            image,
            images,
            codeFiles: isCode ? codeFiles : undefined,
            category,
            icon,
            tagline,
            url,
            faviconDomain,
            productName,
            cadence,
            resourceCost,
            isListing,
          });
          toast.success("Content created.");
          navigate(`/admin/content/${res.item._id}/edit`);
        }
      }
    } catch (e) {
      setError((e as Error).message);
      toast.danger((e as Error).message);
    } finally {
      setDeploying(false);
    }
  };

  if (loading) {
    return <EditorSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
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

      <label className="block">
        <span className="mb-1 block font-mono text-[12px] text-muted">Hero image URL</span>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="/content/images/hero.png or https://…"
          className="w-full rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
        />
        {image && (
          <img
            src={image}
            alt="Hero preview"
            onError={(e) => (e.currentTarget.style.display = "none")}
            className="mt-2 max-h-40 rounded-md border border-line object-cover"
          />
        )}
      </label>

      {/* Image gallery */}
      <div className="rounded-lg border border-line bg-card p-3">
        <span className="mb-2 flex items-center justify-between font-mono text-[12px] text-muted">
          <span>Image gallery</span>
          <span className="text-[10px] text-muted">
            {images.length} image{images.length === 1 ? "" : "s"}
          </span>
        </span>
        <div className="mb-2 flex items-center gap-2">
          <input
            value={galleryInput}
            onChange={(e) => setGalleryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const v = galleryInput.trim();
                if (v) setImages((prev) => [...prev, v]);
                setGalleryInput("");
              }
            }}
            placeholder="Add image URL + Enter"
            className="flex-1 rounded-md border border-line bg-input-bg px-2 py-1.5 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
          />
          <button
            type="button"
            onClick={() => {
              const v = galleryInput.trim();
              if (v) setImages((prev) => [...prev, v]);
              setGalleryInput("");
            }}
            disabled={!galleryInput.trim()}
            className="rounded-sm bg-paper-dim px-2 py-1 font-mono text-[11px] text-foreground hover:text-yellow disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add
          </button>
        </div>
        {images.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {images.map((src, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-md border border-line bg-paper-dim"
              >
                <img
                  src={src}
                  alt={`gallery ${i + 1}`}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, x) => x !== i))}
                  className="absolute right-0.5 top-0.5 rounded-sm bg-ink/80 px-1.5 font-mono text-[10px] text-coral opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-2 text-center font-mono text-[11px] text-muted">
            No gallery images yet. Add URLs above.
          </p>
        )}
      </div>

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

      {/* Type-specific fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-mono text-[12px] text-muted">Icon</span>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Emoji or icon name"
            className="w-full rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-mono text-[12px] text-muted">Tagline</span>
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Short one-liner"
            className="w-full rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
          />
        </label>
      </div>

      {(type === "tip" ||
        type === "cheat-sheet" ||
        type === "tool" ||
        type === "hidden-gem" ||
        type === "hiring" ||
        type === "mcp-skill" ||
        type === "learning-resource") && (
        <label className="block">
          <span className="mb-1 block font-mono text-[12px] text-muted">Category</span>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Learning, Productivity, Web"
            className="w-full rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
          />
        </label>
      )}

      {(type === "hidden-gem" ||
        type === "hiring" ||
        type === "mcp-skill" ||
        type === "learning-resource") && (
        <label className="block">
          <span className="mb-1 block font-mono text-[12px] text-muted">URL</span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            className="w-full rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
          />
        </label>
      )}

      {type === "stack-breakdown" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-[12px] text-muted">Product Name</span>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Netflix, Discord"
              className="w-full rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-[12px] text-muted">Favicon Domain</span>
            <input
              value={faviconDomain}
              onChange={(e) => setFaviconDomain(e.target.value)}
              placeholder="e.g. netflix.com"
              className="w-full rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
            />
          </label>
        </div>
      )}

      {type === "series" && (
        <label className="block">
          <span className="mb-1 block font-mono text-[12px] text-muted">Cadence</span>
          <input
            value={cadence}
            onChange={(e) => setCadence(e.target.value)}
            placeholder="e.g. weekly, daily"
            className="w-full rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
          />
        </label>
      )}

      {type === "learning-resource" && (
        <label className="block">
          <span className="mb-1 block font-mono text-[12px] text-muted">Cost</span>
          <select
            value={resourceCost}
            onChange={(e) => setResourceCost(e.target.value)}
            className="w-full rounded-md border border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
          >
            <option value="">Select…</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
          </select>
        </label>
      )}

      {type === "hiring" && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isListing}
            onChange={(e) => setIsListing(e.target.checked)}
            className="h-4 w-4 rounded border-line accent-yellow"
          />
          <span className="font-mono text-[12px] text-muted">This is a job listing</span>
        </label>
      )}

      {/* Body / Code */}
      {isCode ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="min-w-0 font-mono text-[12px] text-muted">
              Component path: <span className="break-all text-yellow">{filePath}</span>
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

          <div className="flex flex-wrap items-center gap-1">
            {(["edit", "source", "preview"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setCodeMode(m)}
                className={`rounded-sm px-3 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors ${
                  codeMode === m
                    ? "bg-yellow font-bold text-ink"
                    : "text-muted hover:bg-paper-dim hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
            {(codeMode === "source" || codeMode === "preview") && (
              <button
                type="button"
                onClick={handleCopySource}
                className="ml-auto flex items-center gap-1 rounded-sm bg-paper-dim px-2 py-1 font-mono text-[11px] text-foreground hover:text-yellow"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy code"}
              </button>
            )}
          </div>

          {codeMode === "edit" && (
            <>
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
                        f.path === "" && i === 0 && !codeFiles.some((x) => x.path)
                          ? filePath
                          : f.path
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
            </>
          )}

          {codeMode === "source" && (
            <div className="space-y-2">
              {sourceLoading ? (
                <Skeleton className="h-72 w-full bg-line" />
              ) : sourceError ? (
                <p className="rounded-sm bg-coral/10 p-2 font-mono text-[12px] text-coral">
                  Couldn't load source: {sourceError}
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-muted">
                      {sourcePath || filePath || "No file"} · read-only
                    </span>
                    <span className="font-mono text-[10px] text-muted">
                      {sourceContent.length.toLocaleString()} chars
                    </span>
                  </div>
                  <CodeEditor value={sourceContent} onChange={() => {}} readOnly height="380px" />
                </>
              )}
            </div>
          )}

          {codeMode === "preview" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
                <Play className="h-3.5 w-3.5" />
                Live preview
                <Link
                  to={`/games/${slug}`}
                  className="ml-auto flex items-center gap-1 text-yellow hover:underline"
                >
                  Open on site <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <div className="rounded-md border border-line bg-card p-4">
                <GamePreview slug={slug} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <span className="mb-1 block font-mono text-[12px] text-muted">Body (Markdown)</span>
          <div className="mb-2 flex items-center gap-2">
            <input
              value={imgPath}
              onChange={(e) => setImgPath(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleInsertImage();
                }
              }}
              placeholder="/content/images/… or https://…"
              className="flex-1 rounded-md border border-line bg-input-bg px-3 py-1.5 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
            />
            <button
              type="button"
              onClick={handleInsertImage}
              disabled={!imgPath.trim()}
              className="rounded-sm bg-paper-dim px-2 py-1 font-mono text-[11px] text-foreground hover:text-yellow disabled:cursor-not-allowed disabled:opacity-50"
            >
              Insert image
            </button>
          </div>
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
    </motion.div>
  );
}
