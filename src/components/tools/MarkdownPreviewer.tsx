import { useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const SAMPLE = `# Hello, DevSpace

**Markdown** in, HTML out. Runs entirely in your browser.

- Fast
- Sanitized with DOMPurify
- No accounts, no server

\`\`\`js
console.log("ship it");
\`\`\`

> Even the blockquotes work.
`;

export function MarkdownPreviewer() {
  const [text, setText] = useState(SAMPLE);
  const html = useMemo(() => {
    const raw = marked.parse(text, { async: false }) as string;
    if (typeof window === "undefined") return raw;
    return DOMPurify.sanitize(raw);
  }, [text]);

  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2">
      <div>
        <div className="mb-2 font-mono text-xs text-muted">markdown</div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          className="h-96 w-full resize-none rounded-sm border-2 border-line bg-ink p-3 font-mono text-sm text-text outline-none focus:border-yellow"
        />
      </div>
      <div>
        <div className="mb-2 font-mono text-xs text-muted">preview</div>
        <div
          className="md-preview h-96 overflow-auto rounded-sm border-2 border-line bg-paper p-4 text-ink"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <style>{`
          .md-preview h1 { font-family: var(--font-display); font-weight: 800; font-size: 1.75rem; margin: 0 0 .8rem; }
          .md-preview h2 { font-family: var(--font-display); font-weight: 700; font-size: 1.35rem; margin: 1rem 0 .5rem; }
          .md-preview p { margin: 0 0 .8rem; line-height: 1.6; }
          .md-preview ul { margin: 0 0 .8rem 1.2rem; list-style: disc; }
          .md-preview code { font-family: var(--font-mono); background: rgba(0,0,0,.08); padding: 1px 5px; border-radius: 3px; }
          .md-preview pre { background: var(--ink); color: var(--text); padding: .8rem; border-radius: 4px; overflow: auto; }
          .md-preview pre code { background: transparent; padding: 0; }
          .md-preview blockquote { border-left: 3px solid var(--coral); padding-left: .8rem; color: rgba(0,0,0,.7); margin: 0 0 .8rem; }
        `}</style>
      </div>
    </div>
  );
}
