import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { postBySlug } from "../data/posts";
import { seriesBySlug } from "../data/series";

export const Route = createFileRoute("/post/$slug")({
  loader: ({ params }) => {
    const post = postBySlug(params.slug);
    if (!post) throw notFound();
    return { post, series: seriesBySlug(post.series) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Post not found — DevSpace" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.post;
    return {
      meta: [
        { title: `${p.title} — DevSpace` },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Post not found</h1>
      <Link to="/" className="mt-6 inline-block font-mono text-sm text-yellow">← back to feed</Link>
    </div>
  ),
});

function PostPage() {
  const { post, series } = Route.useLoaderData();
  const rawHtml = marked.parse(post.body, { async: false }) as string;
  const html = typeof window !== "undefined" ? DOMPurify.sanitize(rawHtml) : rawHtml;
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
            to="/feed/$series"
            params={{ series: series.slug }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-line px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide text-coral no-underline hover:border-yellow"
          >
            <span>{series.icon}</span>
            <span>{series.label}</span>
          </Link>
        )}
        <span className="font-mono text-[11px] text-muted">{date}</span>
      </div>
      <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
      <div
        className="prose-devspace mt-10 text-text"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <style>{`
        .prose-devspace p { margin: 0 0 1.1rem; line-height: 1.7; }
        .prose-devspace strong { color: var(--yellow); }
        .prose-devspace code { font-family: var(--font-mono); background: var(--line); padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
        .prose-devspace h2, .prose-devspace h3 { margin: 2rem 0 0.8rem; font-family: var(--font-display); }
      `}</style>
      <div className="mt-16 border-t-2 border-dashed border-line pt-8 text-center">
        <Link
          to="/"
          className="inline-block rounded-sm border-2 border-yellow bg-yellow px-6 py-3 font-mono text-[13px] font-bold text-ink no-underline"
          style={{ boxShadow: "4px 4px 0 var(--coral)" }}
        >
          more from the zine →
        </Link>
      </div>
    </article>
  );
}
