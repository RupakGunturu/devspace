import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Check, Copy, ChevronRight, Hash, Layers } from "lucide-react";
import { cheatSheets } from "../data/cheat-sheets";

const CATEGORY_ACCENT: Record<string, string> = {
  "version-control": "#f97316",
  "css": "#3b82f6",
  "computer-science": "#a855f7",
  "javascript": "#eab308",
  "react": "#06b6d4",
  "devops": "#10b981",
  "typescript": "#6366f1",
  "backend": "#f43f5e",
  "python": "#22c55e",
  "database": "#d97706",
  "security": "#ef4444",
  "performance": "#84cc16",
  "productivity": "#ec4899",
  "accessibility": "#14b8a6",
};

function sheetById(id: string) {
  return cheatSheets.find((s) => s.id === id);
}

function CopyBtn({ text, accent }: { text: string; accent: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handle}
      aria-label="Copy to clipboard"
      className="shrink-0 flex items-center gap-1 rounded-sm border-2 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide transition-colors"
      style={{
        borderColor: copied ? accent : "var(--line)",
        backgroundColor: copied ? `${accent}15` : undefined,
        color: copied ? accent : "var(--muted-foreground)",
      }}
      onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; } }}
      onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.color = "var(--muted-foreground)"; } }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "copied" : "copy"}
    </button>
  );
}

export default function CheatSheetPage() {
  const { id } = useParams<{ id: string }>();
  const sheet = sheetById(id!);

  useEffect(() => {
    document.title = sheet ? `${sheet.title} — DevSpace` : "Not found — DevSpace";
  }, [sheet]);

  if (!sheet) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-md border-2 border-line bg-paper-dim/40 font-mono text-2xl text-muted">
          ?
        </div>
        <h1 className="font-display text-3xl font-bold">Cheat sheet not found</h1>
        <p className="mt-2 text-sm text-muted">
          It may have been moved, renamed, or never existed.
        </p>
        <Link
          to="/cheat-sheets"
          className="mt-6 inline-flex items-center gap-1 font-mono text-sm text-foreground no-underline hover:underline"
        >
          ← back to cheat sheets
        </Link>
      </div>
    );
  }

  const accent = CATEGORY_ACCENT[sheet.category] ?? "#e8c81c";
  const totalItems = sheet.content.reduce((n, s) => n + s.items.length, 0);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
      <Link
        to="/cheat-sheets"
        className="inline-flex items-center gap-1 font-mono text-xs text-muted no-underline transition-colors hover:text-foreground"
      >
        ← all cheat sheets
      </Link>

      {/* Header */}
      <div className="mt-6 mb-10 border-b-2 border-line pb-8">
        <div className="flex flex-wrap items-center gap-2">
          {sheet.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border-2 border-line px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
          {sheet.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {sheet.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-wide text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Layers size={13} style={{ color: accent }} />
            {sheet.content.length} sections
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Hash size={13} style={{ color: accent }} />
            {totalItems} entries
          </span>
        </div>
      </div>

      <div className="lg:flex lg:items-start lg:gap-10">
        {/* Section nav — sticky on desktop, horizontal scroll on mobile */}
        <nav className="mb-8 lg:sticky lg:top-8 lg:mb-0 lg:w-56 lg:shrink-0">
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
            On this page
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {sheet.content.map((section, si) => (
              <a
                key={si}
                href={`#section-${si}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`section-${si}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm border-2 border-line px-3 py-1.5 font-mono text-xs text-muted no-underline transition-colors hover:text-foreground lg:w-full lg:whitespace-normal lg:border-0 lg:border-l-2 lg:rounded-none lg:px-3 lg:py-1"
                style={{ ["--accent" as string]: accent }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.color = ""; }}
              >
                <ChevronRight size={12} className="hidden shrink-0 lg:block" />
                {section.title}
              </a>
            ))}
          </div>
        </nav>

        {/* Sections */}
        <div className="min-w-0 flex-1 space-y-6">
          {sheet.content.map((section, si) => (
            <div
              key={si}
              id={`section-${si}`}
              className="scroll-mt-8 rounded-md border-2 border-line bg-paper"
            >
              <div className="flex items-center gap-2 border-b-2 border-line bg-paper-dim/50 px-5 py-3">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 font-mono text-[10px] font-bold"
                  style={{ borderColor: accent, color: accent }}
                >
                  {si + 1}
                </span>
                <span
                  className="font-mono text-xs font-bold uppercase tracking-wider"
                  style={{ color: accent }}
                >
                  {section.title}
                </span>
                <span className="ml-auto font-mono text-[10px] text-muted">
                  {section.items.length} item{section.items.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
                {section.items.map((item, ii) => (
                  <div
                    key={ii}
                    className="flex flex-col gap-2 rounded-sm border-2 border-line/50 bg-paper-dim/30 p-3 transition-colors hover:border-line"
                  >
                    <span className="font-mono text-sm font-bold text-foreground">
                      {item.label}
                    </span>

                    {item.code && (
                      <div className="flex items-center gap-2">
                        <code
                          className="min-w-0 flex-1 break-all rounded-sm bg-paper-dim/50 px-2 py-1 font-mono text-xs"
                          style={{ color: accent }}
                        >
                          {item.code}
                        </code>
                        <CopyBtn text={item.code} accent={accent} />
                      </div>
                    )}

                    <p className="text-xs leading-relaxed text-muted">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}