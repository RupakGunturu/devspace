import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { usePostBySlug, useSeriesBySlug } from "../lib/contentStore";
import { ToolIcon } from "../components/tools/ToolIcon";

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = usePostBySlug(slug!);
  const series = useSeriesBySlug(post?.series ?? "");

  const visitUrl = post?.externalUrl;

  useEffect(() => {
    document.title = post ? `${post.title} — DevSpace` : "Post not found — DevSpace";
  }, [post]);

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Post not found</h1>
        <Link to="/" className="mt-6 inline-block font-mono text-sm text-yellow">
          ← back to feed
        </Link>
      </div>
    );
  }

  const rawHtml = marked.parse(post.body, { async: false }) as string;
  const html =
    typeof window !== "undefined"
      ? DOMPurify.sanitize(rawHtml, { ADD_TAGS: ["details", "summary"] })
      : rawHtml;
  const date = new Date(post.publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
      <Link to="/" className="font-mono text-xs text-muted no-underline hover:text-yellow">
        ← the whole feed
      </Link>
      <div className="mt-8 flex items-center gap-3">
        {series && (
          <Link
            to={`/feed/${series.slug}`}
            className="inline-flex items-center gap-2 rounded-full border-2 border-line px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide text-coral no-underline hover:border-yellow"
          >
            <span>
              <ToolIcon name={series.icon} className="h-3.5 w-3.5" />
            </span>
            <span>{series.label}</span>
          </Link>
        )}
        <span className="font-mono text-[11px] text-muted">{date}</span>
      </div>
      {visitUrl && (
        <a
          href={visitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-sm border-2 border-yellow bg-yellow px-4 py-2 font-mono text-[13px] font-bold text-ink no-underline transition-all hover:bg-yellow/90"
          style={{ boxShadow: "3px 3px 0 var(--coral)" }}
        >
          Visit ↗
        </a>
      )}
      <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
      {post.image && (
        <div className="my-8 flex justify-center">
          <img
            src={post.image}
            alt={post.title}
            className="max-h-[420px] w-full max-w-2xl rounded-md border-2 border-line object-cover"
          />
        </div>
      )}
      <div
        className="prose-devspace mt-10 text-foreground"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      
      <div className="mt-16 border-t-2 border-dashed border-line pt-8 text-center">
        <Link
          to="/"
          className="inline-block rounded-sm border-2 border-yellow bg-yellow px-6 py-3 font-mono text-[13px] font-bold text-ink no-underline"
          style={{ boxShadow: "4px 4px 0 var(--coral)" }}
        >
          more from the space →
        </Link>
      </div>
    </article>
  );
}
