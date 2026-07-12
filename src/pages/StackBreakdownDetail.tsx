import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { marked } from "marked";
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
      const text = match[2]
        .replace(/[📖🖥️⚙️🗄️🔌📈🔒⚡📊💰🎯📚💡🔗]/g, "")
        .trim();
      headings.push({ id: slugify(text), text, level });
    }
  }
  return headings;
}

export default function StackBreakdownDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = stackBreakdownBySlug(slug!);
  const [activeId, setActiveId] = useState<string>("");
  const [tocOpen, setTocOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

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
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
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
    const raw = marked.parse(item.body, { async: false }) as string;
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
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
      setTocOpen(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16">
      <Link
        to="/stack-breakdown"
        className="font-mono text-xs text-muted no-underline hover:text-yellow"
      >
        ← all breakdowns
      </Link>

      {/* Product hero card */}
      <div className="mt-8 mb-10 flex flex-col gap-6 sm:flex-row sm:items-start">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-paper shadow-[4px_4px_0_var(--line)] overflow-hidden"
          style={{ transform: "rotate(-4deg)" }}
        >
          <img
            src={`https://www.google.com/s2/favicons?domain=${item.faviconDomain}&sz=128`}
            alt={item.productName}
            className="h-12 w-12 rounded"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.textContent = item.icon;
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wide text-coral">
            🧱 Stack Breakdown
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            {item.productName}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">{item.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border-2 border-line bg-paper px-3 py-1 font-mono text-[11px] font-bold text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile TOC toggle */}
      <div className="mb-6 lg:hidden">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="flex w-full items-center justify-between rounded-md border-2 border-line bg-paper px-4 py-3 font-mono text-[12px] font-bold text-foreground transition-colors hover:border-yellow"
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
      <div className="flex gap-10">
        {/* Desktop TOC sidebar */}
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

        {/* Rendered markdown content */}
        <article className="min-w-0 flex-1">
          <div
            className="prose-stackbreakdown text-foreground"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </div>

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

      {/* Rich prose styles */}
      <style>{`
        .prose-stackbreakdown h2 {
          margin: 3rem 0 1rem;
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          padding-left: 1rem;
          border-left: 4px solid var(--coral);
          scroll-margin-top: 6rem;
        }
        .prose-stackbreakdown h3 {
          margin: 2rem 0 0.8rem;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          scroll-margin-top: 6rem;
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
      `}</style>
    </section>
  );
}
