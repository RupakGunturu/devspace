import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { SERIES, seriesBySlug } from "../data/series";
import { postsBySeries, type Post } from "../data/posts";
import { FeedItem } from "../components/FeedItem";

export default function SeriesPage() {
  const { series: seriesSlug } = useParams<{ series: string }>();
  const series = seriesBySlug(seriesSlug!);
  const posts = series ? postsBySeries(series.slug) : [];

  useEffect(() => {
    document.title = series ? `${series.label} — DevSpace` : "Series not found — DevSpace";
  }, [series]);

  if (!series) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Series not found</h1>
        <Link to="/" className="mt-6 inline-block font-mono text-sm text-yellow">← back to feed</Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16">
      <Link to="/" className="font-mono text-xs text-muted no-underline hover:text-yellow">
        ← the whole feed
      </Link>
      <div className="mt-6 mb-8 flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-paper text-2xl"
          style={{ transform: "rotate(-6deg)" }}
        >
          {series.icon}
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wide text-coral">
            {series.cadence} series
          </div>
          <h1 className="mt-1 font-display text-4xl font-extrabold">{series.label}</h1>
          <p className="mt-2 text-muted">{series.description}</p>
        </div>
      </div>
      <h2 className="mb-4 font-display text-lg font-bold text-muted">Also in this series →</h2>
      <div className="mb-8 flex flex-wrap gap-2">
        {SERIES.filter((s) => s.slug !== series.slug).slice(0, 6).map((s) => (
          <Link
            key={s.slug}
            to={`/feed/${s.slug}`}
            className="rounded-full border-2 border-line px-3 py-1 font-mono text-[11px] text-muted no-underline hover:border-yellow hover:text-yellow"
          >
            {s.icon} {s.label}
          </Link>
        ))}
      </div>
      <div>
        {posts.length === 0 ? (
          <p className="py-12 text-center font-mono text-sm text-muted">Nothing in this series yet.</p>
        ) : (
          (posts as Post[]).map((p) => <FeedItem key={p.id} post={p} />)
        )}
      </div>
    </section>
  );
}
