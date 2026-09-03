import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import type { Post } from "../data/posts";
import { useSeriesBySlug, usePosts, useSeriesList } from "../lib/contentStore";
import { FeedItem } from "../components/FeedItem";
import { ToolIcon } from "../components/tools/ToolIcon";

export default function SeriesPage() {
  const { series: seriesSlug } = useParams<{ series: string }>();
  const allPosts = usePosts();
  const allSeries = useSeriesList();
  const series = useSeriesBySlug(seriesSlug!);
  const posts = series
    ? allPosts
        .filter((p) => p.series === series.slug)
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    : [];

  useEffect(() => {
    document.title = series ? `${series.label} — DevSpace` : "Series not found — DevSpace";
  }, [series]);

  if (!series) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Series not found</h1>
        <Link to="/" className="mt-6 inline-block font-mono text-sm text-yellow">
          ← back to feed
        </Link>
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
          <ToolIcon name={series.icon} className="h-6 w-6" />
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
        {allSeries
          .filter((s) => s.slug !== series.slug)
          .slice(0, 6)
          .map((s) => (
            <Link
              key={s.slug}
              to={`/feed/${s.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-line px-3 py-1 font-mono text-[11px] text-muted no-underline hover:border-yellow hover:text-yellow"
            >
              <ToolIcon name={s.icon} className="h-3 w-3" />
              {s.label}
            </Link>
          ))}
      </div>
      <div>
        {posts.length === 0 ? (
          <p className="py-12 text-center font-mono text-sm text-muted">
            Nothing in this series yet.
          </p>
        ) : (
          (posts as Post[]).map((p) => <FeedItem key={p.id} post={p} />)
        )}
      </div>
    </section>
  );
}
