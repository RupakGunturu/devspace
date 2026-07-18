import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { marked, Renderer } from "marked";
import DOMPurify from "dompurify";
import { stackBreakdownBySlug } from "../data/stack-breakdowns";

type TocItem = { id: string; text: string; level: number };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractHeadings(md: string): TocItem[] {
  const headings: TocItem[] = [];
  const lines = md.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.*)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      headings.push({ id: slugify(text), text, level });
    }
  }
  return headings;
}

const SECTION_ICONS: Record<string, string> = {
  "Product Overview": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>`,
  "Frontend Stack": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>`,
  "Backend Stack": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>`,
  "Database": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  "Infrastructure": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
  "APIs & Services": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8z"/></svg>`,
  "Scaling Techniques": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  "Security & Reliability": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  "Performance Optimizations": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  "Engineering Challenges": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>`,
  "Infrastructure Cost Considerations": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  "Student Version": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  "Technologies Used": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>`,
  "Engineering Lessons": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  "References": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
};

export default function StackBreakdownDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = stackBreakdownBySlug(slug!);
  const [activeId, setActiveId] = useState<string>("");
  const [tocOpen, setTocOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.title = item ? `${item.title} — DevSpace` : "Not found — DevSpace";
  }, [item]);

  const headings = useMemo(
    () => (item ? extractHeadings(item.body) : []),
    [item]
  );

  const setupObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { root: scrollRef.current, rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observerRef.current.observe(el);
    }
  }, [headings]);

  useEffect(() => {
    const timer = setTimeout(setupObserver, 300);
    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [setupObserver, item?.body]);

  const html = useMemo(() => {
    if (!item) return "";
    const renderer = new Renderer();
    renderer.heading = function ({ tokens, depth }: { tokens: any[]; depth: number }) {
      const content = this.parser.parseInline(tokens) as string;
      const plainText = content.replace(/<[^>]+>/g, "").trim();
      const id = slugify(plainText);
      const icon = depth === 2 ? SECTION_ICONS[plainText] : null;
      const iconHtml = icon ? `<span class="sb-section-icon">${icon}</span>` : "";
      return `<h${depth} id="${id}">${iconHtml}${content}</h${depth}>`;
    };
    const raw = marked.parse(item.body, { async: false, renderer }) as string;
    return typeof window !== "undefined"
      ? DOMPurify.sanitize(raw)
      : raw;
  }, [item]);

  if (!item) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">
          Breakdown not found
        </h1>
        <Link
          to="/stack-breakdown"
          className="mt-6 inline-block font-mono text-sm text-yellow no-underline"
        >
          ← all breakdowns
        </Link>
      </div>
    );
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    const container = scrollRef.current;
    if (el && container) {
      const elTop = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
      container.scrollTo({ top: elTop - 24, behavior: "smooth" });
      setActiveId(id);
      setTocOpen(false);
    }
  };

  return (
    <section className="mx-auto flex h-dvh max-w-7xl flex-col overflow-hidden px-4 pt-4 pb-4 sm:px-6 sm:pt-12 sm:pb-8 md:px-8 md:pt-16 md:pb-10">
      <Link
        to="/stack-breakdown"
        className="font-mono text-xs text-muted no-underline hover:text-yellow"
      >
        ← all breakdowns
      </Link>

      {/* Product hero card */}
      <div className="mt-3 mb-3 flex flex-col gap-4 sm:mt-6 sm:mb-6 sm:gap-6 sm:flex-row sm:items-start">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-paper shadow-[4px_4px_0_var(--line)] overflow-hidden sm:h-20 sm:w-20"
          style={{ transform: "rotate(-4deg)" }}
        >
          <img
            src={`https://www.google.com/s2/favicons?domain=${item.faviconDomain}&sz=128`}
            alt={item.productName}
            className="h-8 w-8 rounded sm:h-12 sm:w-12"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.textContent = item.icon;
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] font-bold uppercase tracking-wide text-coral sm:text-[11px]">
            🧱 Stack Breakdown
          </div>
          <h1 className="mt-1 font-display text-xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
            {item.productName}
          </h1>
          <p className="mt-1 text-sm text-muted sm:mt-2 sm:text-base">{item.description}</p>
          <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border-2 border-line bg-paper px-2 py-0.5 font-mono text-[10px] font-bold text-muted sm:px-3 sm:py-1 sm:text-[11px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile TOC toggle */}
      <div className="mb-2 lg:hidden">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="flex w-full items-center justify-between rounded-md border-2 border-line bg-paper px-3 py-2 font-mono text-[12px] font-bold text-foreground transition-colors hover:border-yellow sm:px-4 sm:py-3"
        >
          <span>Table of Contents</span>
          <svg
            className={`h-4 w-4 transition-transform ${tocOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {tocOpen && (
          <nav className="mt-2 rounded-md border-2 border-line bg-paper p-4">
            {headings.map((h) => (
              <button
                key={h.id}
                onClick={() => scrollTo(h.id)}
                className={`block w-full text-left transition-colors ${
                  h.level === 3 ? "pl-4" : ""
                } ${
                  activeId === h.id
                    ? "text-yellow"
                    : "text-muted hover:text-yellow"
                } py-1 font-mono text-[12px]`}
              >
                {h.text}
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Main content area */}
      <div className="flex min-h-0 flex-1 gap-6 sm:gap-8 lg:gap-10">
        {/* Desktop TOC sidebar — OUTSIDE scroll container, sticks to viewport */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">
            <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-wide text-muted">
              On this page
            </div>
            <nav className="space-y-0.5">
              {headings.map((h) => (
                <button
                  key={h.id}
                  onClick={() => scrollTo(h.id)}
                  className={`block w-full text-left transition-colors ${
                    h.level === 3 ? "pl-4" : ""
                  } ${
                    activeId === h.id
                      ? "border-l-2 border-yellow pl-3 text-yellow"
                      : "border-l-2 border-transparent pl-3 text-muted hover:text-yellow hover:border-line"
                  } py-1 font-mono text-[12px]`}
                >
                  {h.text}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Scroll container — only the article scrolls */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          {/* Rendered markdown content */}
          <article className="min-w-0">
          <div
            className="prose-stackbreakdown text-foreground"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Footer CTA */}
          <div className="mt-16 border-t-2 border-dashed border-line pt-8 text-center">
            <Link
              to="/stack-breakdown"
              className="inline-block rounded-sm border-2 border-yellow bg-yellow px-6 py-3 font-mono text-[13px] font-bold text-ink no-underline"
              style={{ boxShadow: "4px 4px 0 var(--coral)" }}
            >
              more breakdowns →
            </Link>
          </div>
        </article>
        </div>
      </div>

      {/* Rich prose styles */}
      <style>{`
        .prose-stackbreakdown h2 {
          margin: 3rem 0 1rem;
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          padding-left: 1rem;
          border-left: 4px solid var(--coral);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .sb-section-icon {
          display: inline-flex;
          align-items: center;
          color: var(--coral);
          flex-shrink: 0;
        }
        .sb-section-icon svg {
          width: 20px;
          height: 20px;
        }
        .prose-stackbreakdown h3 {
          margin: 2rem 0 0.8rem;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
        }
        .prose-stackbreakdown p {
          margin: 0 0 1.1rem;
          line-height: 1.75;
        }
        .prose-stackbreakdown strong {
          color: var(--yellow);
          font-weight: 700;
        }
        .prose-stackbreakdown em {
          color: var(--muted);
        }
        .prose-stackbreakdown code {
          font-family: var(--font-mono);
          background: var(--line);
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.85em;
        }
        .prose-stackbreakdown pre {
          background: var(--paper);
          border: 2px solid var(--line);
          border-radius: 6px;
          padding: 1rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .prose-stackbreakdown pre code {
          background: none;
          padding: 0;
          font-size: 0.82em;
        }
        .prose-stackbreakdown blockquote {
          margin: 1.5rem 0;
          border-left: 4px solid var(--yellow);
          background: color-mix(in srgb, var(--yellow) 6%, transparent);
          padding: 1rem 1.25rem;
          border-radius: 0 6px 6px 0;
          font-style: italic;
          color: var(--muted);
        }
        .prose-stackbreakdown blockquote p {
          margin: 0;
        }
        .prose-stackbreakdown ul,
        .prose-stackbreakdown ol {
          margin: 0.5rem 0 1.25rem;
          padding-left: 1.5rem;
        }
        .prose-stackbreakdown li {
          margin-bottom: 0.4rem;
          line-height: 1.7;
        }
        .prose-stackbreakdown li::marker {
          color: var(--coral);
        }
        .prose-stackbreakdown hr {
          border: none;
          border-top: 2px dashed var(--line);
          margin: 2.5rem 0;
        }
        .prose-stackbreakdown a {
          color: var(--yellow);
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.15s;
        }
        .prose-stackbreakdown a:hover {
          color: var(--coral);
        }
        .prose-stackbreakdown cite {
          display: inline;
          background: color-mix(in srgb, var(--coral) 12%, transparent);
          color: var(--coral);
          font-style: normal;
          font-size: 0.85em;
          font-weight: 600;
          padding: 1px 8px;
          border-radius: 999px;
          font-family: var(--font-mono);
          vertical-align: baseline;
        }
        .prose-stackbreakdown table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.9em;
          overflow-x: auto;
          display: block;
        }
        .prose-stackbreakdown thead {
          background: var(--paper);
        }
        .prose-stackbreakdown th {
          border: 2px solid var(--line);
          padding: 0.75rem 1rem;
          text-align: left;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.85em;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: var(--foreground);
          white-space: nowrap;
        }
        .prose-stackbreakdown td {
          border: 2px solid var(--line);
          padding: 0.65rem 1rem;
          vertical-align: top;
        }
        .prose-stackbreakdown tbody tr:nth-child(even) {
          background: color-mix(in srgb, var(--paper) 50%, transparent);
        }
        .prose-stackbreakdown tbody tr:hover {
          background: color-mix(in srgb, var(--yellow) 6%, transparent);
        }
        .prose-stackbreakdown > :first-child {
          margin-top: 0;
        }
        @media (max-width: 640px) {
          .prose-stackbreakdown p {
            font-size: 1.05rem;
            line-height: 1.85;
          }
          .prose-stackbreakdown code {
            font-size: 0.92em;
          }
          .prose-stackbreakdown pre code {
            font-size: 0.88em;
          }
          .prose-stackbreakdown table {
            font-size: 1em;
          }
          .prose-stackbreakdown th {
            font-size: 0.92em;
            padding: 0.65rem 0.75rem;
          }
          .prose-stackbreakdown td {
            padding: 0.55rem 0.75rem;
          }
          .prose-stackbreakdown cite {
            font-size: 0.92em;
          }
          .prose-stackbreakdown pre {
            padding: 0.75rem;
            margin: 1rem 0;
          }
          .prose-stackbreakdown li {
            margin-bottom: 0.5rem;
            line-height: 1.8;
          }
        }
      `}</style>
    </section>
  );
}
