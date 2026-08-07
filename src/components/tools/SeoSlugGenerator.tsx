import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

export function SeoSlugGenerator() {
  const [title, setTitle] = useState("");
  const [includeDate, setIncludeDate] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [trailingSlash, setTrailingSlash] = useState(false);
  const { color } = useToolAccent();

  const slug = useMemo(() => {
    if (!title.trim()) return "";
    let s = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (includeDate) {
      const now = new Date();
      const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
      s = `${dateStr}/${s}`;
    }

    if (prefix.trim()) {
      const p = prefix.trim().toLowerCase().replace(/[^a-z0-9]/g, "").replace(/\s+/g, "-");
      if (p) s = `${p}/${s}`;
    }

    if (trailingSlash && !s.endsWith("/")) s += "/";

    return s;
  }, [title, includeDate, prefix, trailingSlash]);

  const fullUrl = useMemo(() => {
    if (!slug) return "";
    return `https://yoursite.com/${slug}`;
  }, [slug]);

  const inputCls =
    "w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted";

  const toggleCls = (active: boolean) =>
    `rounded-md border-2 px-4 py-2.5 font-mono text-xs font-medium transition-all ${
      active
        ? ""
        : "border-line bg-transparent text-muted hover:text-foreground"
    }`;

  return (
    <ToolLayout id="seo-slug-generator">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Title or Page Name
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. How to Build a React App in 2024"
          className={inputCls}
          onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = ""; }}
        />
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          URL Prefix (optional)
        </label>
        <input
          type="text"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          placeholder="e.g. blog, guides, docs"
          className={inputCls}
          onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = ""; }}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setIncludeDate(!includeDate)}
          className={toggleCls(includeDate)}
          style={
            includeDate
              ? { borderColor: color, backgroundColor: color, color: "#1a1a2e" }
              : undefined
          }
        >
          {includeDate ? "✓ " : ""}Include Date
        </button>
        <button
          onClick={() => setTrailingSlash(!trailingSlash)}
          className={toggleCls(trailingSlash)}
          style={
            trailingSlash
              ? { borderColor: color, backgroundColor: color, color: "#1a1a2e" }
              : undefined
          }
        >
          {trailingSlash ? "✓ " : ""}Trailing Slash
        </button>
      </div>

      {slug && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Generated Slug
            </span>
            <CopyButton text={slug} />
          </div>
          <p className="break-all font-mono text-sm font-medium" style={{ color }}>
            /{slug}
          </p>
          <div className="mt-1 font-mono text-[10px] text-muted">
            {slug.length} characters
          </div>
        </div>
      )}

      {fullUrl && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Full URL Preview
            </span>
            <CopyButton text={fullUrl} />
          </div>
          <p className="break-all font-mono text-sm text-foreground">{fullUrl}</p>
          <div className="mt-1 font-mono text-[10px] text-muted">
            {fullUrl.length} characters total
          </div>
        </div>
      )}

      {slug && (
        <div className="flex justify-end">
          <ToolButton onClick={() => navigator.clipboard.writeText(fullUrl)}>
            Copy Full URL
          </ToolButton>
        </div>
      )}

      {!title.trim() && (
        <div className="rounded-md border-2 border-dashed border-line p-6 text-center">
          <p className="font-mono text-sm text-muted">
            Enter a title above to generate an SEO-friendly slug
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
