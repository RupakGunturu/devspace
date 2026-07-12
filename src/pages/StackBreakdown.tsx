import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { allStackBreakdowns } from "../data/stack-breakdowns";
import { CursorHover } from "../components/core/cursor-hover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";

const PRODUCT_COLORS: Record<string, string> = {
  instagram: "#E1306C",
  stripe: "#635BFF",
  uber: "#276EF1",
  amazon: "#FF9900",
  spotify: "#1DB954",
  netflix: "#E50914",
  whatsapp: "#25D366",
  zomato: "#E23744",
  swiggy: "#FC8019",
  discord: "#5865F2",
};

const ROTATIONS = [
  "-rotate-[1.5deg]",
  "rotate-[1deg]",
  "-rotate-[0.5deg]",
  "rotate-[1.5deg]",
  "-rotate-[1deg]",
  "rotate-[0.5deg]",
];

export default function StackBreakdownPage() {
  const breakdowns = allStackBreakdowns();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Stack Breakdown — DevSpace";
  }, []);

  const allTags = Array.from(
    new Set(breakdowns.flatMap((b) => b.tags))
  ).sort();

  const filtered = activeTag
    ? breakdowns.filter((b) => b.tags.includes(activeTag))
    : breakdowns;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
      <Link
        to="/"
        className="font-mono text-xs text-muted no-underline hover:text-yellow"
      >
        ← back to feed
      </Link>

      {/* Hero */}
      <div className="mt-8 mb-12">
        <div className="flex items-start gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-paper text-3xl"
            style={{ transform: "rotate(-6deg)" }}
          >
            🧱
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[11px] font-bold uppercase tracking-wide text-coral">
              Bi-weekly series
            </div>
            <h1 className="mt-1 font-display text-4xl font-extrabold sm:text-5xl">
              Stack Breakdown
            </h1>
            <p className="mt-3 max-w-2xl text-muted">
              A teardown of how a real product is built — the stack, the
              architecture decisions, and the trade-offs. Learn from the
              engineering behind the products you use every day.
            </p>
          </div>
        </div>
      </div>

      {/* Tag filter */}
      <div className="mb-8">
        <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-wide text-muted">
          Filter by tech
        </div>
        <Select value={activeTag ?? "all"} onValueChange={(v) => setActiveTag(v === "all" ? null : v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All tech" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tech</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b, i) => {
          const rot = ROTATIONS[i % ROTATIONS.length];
          return (
            <CursorHover label={b.productName} color={PRODUCT_COLORS[b.slug]} key={b.slug}>
              <Link
                to={`/stack-breakdown/${b.slug}`}
                className="group no-underline"
              >
                <div
                  className={`sticker sticker-hover rounded-md bg-paper p-6 ${rot}`}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper-dim overflow-hidden transition-transform group-hover:scale-110 group-hover:rotate-[8deg]"
                    >
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${b.faviconDomain}&sz=64`}
                        alt={b.productName}
                        className="h-8 w-8 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.textContent = b.icon;
                        }}
                      />
                    </div>
                    <h2 className="font-display text-xl font-bold text-foreground">
                      {b.productName}
                    </h2>
                  </div>
                  <p className="mb-4 text-[13px] leading-relaxed text-foreground/70">
                    {b.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {b.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line bg-background px-2 py-0.5 font-mono text-[10px] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </CursorHover>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-mono text-sm text-muted">
            No breakdowns match that filter. Try a different tag.
          </p>
        </div>
      )}
    </section>
  );
}
