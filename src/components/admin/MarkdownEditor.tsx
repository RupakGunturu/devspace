import { useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export function MarkdownEditor({ value, onChange, height = "320px" }: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);

  const html = useMemo(() => {
    const raw = marked.parse(value || "", { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [value]);

  return (
    <div className="overflow-hidden rounded-md border border-line bg-card">
      <div className="flex items-center gap-2 border-b border-line bg-paper-dim px-3 py-2">
        <button
          type="button"
          onClick={() => setPreview(false)}
          className={`rounded-sm px-2 py-1 font-mono text-[12px] transition-colors ${
            !preview ? "bg-yellow font-bold text-ink" : "text-muted hover:text-yellow"
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setPreview(true)}
          className={`rounded-sm px-2 py-1 font-mono text-[12px] transition-colors ${
            preview ? "bg-yellow font-bold text-ink" : "text-muted hover:text-yellow"
          }`}
        >
          Preview
        </button>
      </div>

      {preview ? (
        <div className="prose prose-sm max-w-none p-4" style={{ minHeight: height }}>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ minHeight: height }}
          className="w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none"
          placeholder="# Write your markdown here..."
          spellCheck={false}
        />
      )}
    </div>
  );
}
