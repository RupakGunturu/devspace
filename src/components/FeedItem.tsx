import { Link } from "react-router-dom";
import type { Post } from "../data/posts";
import { seriesBySlug } from "../data/series";

function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.max(0, Math.floor((now - then) / 86400000));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  return months <= 1 ? "1 month ago" : `${months} months ago`;
}

export function FeedItem({ post }: { post: Post }) {
  const series = seriesBySlug(post.series);
  return (
    <Link
      to={`/post/${post.slug}`}
      className="group flex gap-4 border-b-2 border-dashed border-line py-5 no-underline transition-transform hover:translate-x-1.5"
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-xl transition-transform"
        style={{ transform: "rotate(-6deg)" }}
      >
        <span className="transition-transform group-hover:scale-110 group-hover:rotate-[12deg]">
          {series?.icon ?? "📰"}
        </span>
      </div>
      <div className="min-w-0">
        <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-wide text-coral">
          {series?.label ?? post.series}
          <span className="mx-2 text-muted">•</span>
          <span className="font-normal text-muted">{timeAgo(post.publishedAt)}</span>
        </div>
        <h4 className="font-display text-lg font-bold text-text">{post.title}</h4>
        <p className="mt-1 text-[13px] text-muted">{post.excerpt}</p>
      </div>
    </Link>
  );
}
