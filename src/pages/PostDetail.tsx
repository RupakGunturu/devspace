import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { usePostBySlug, useSeriesBySlug } from "../lib/contentStore";
import { ToolIcon } from "../components/tools/ToolIcon";

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = usePostBySlug(slug!);
  const series = post ? useSeriesBySlug(post.series) : undefined;

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
      <style>{`
        .prose-devspace p { margin: 0 0 1.1rem; line-height: 1.7; }
        .prose-devspace img {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 1.5rem auto;
          border: 2px solid var(--line);
          border-radius: 6px;
        }
        .prose-devspace strong { color: var(--yellow); }
        .prose-devspace em { font-style: italic; color: var(--muted); }
        .prose-devspace code { font-family: var(--font-mono); background: var(--line); padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
        .prose-devspace h2 { margin: 2.5rem 0 0.8rem; font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; }
        .prose-devspace h3 { margin: 2rem 0 0.6rem; font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; }
        .prose-devspace h4 { margin: 1.5rem 0 0.5rem; font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; }

        .prose-devspace a { color: var(--yellow); text-decoration: underline; text-underline-offset: 2px; transition: color 0.2s; }
        .prose-devspace a:hover { color: var(--coral); }

        .prose-devspace ul, .prose-devspace ol { margin: 0 0 1.1rem; padding-left: 1.5rem; }
        .prose-devspace li { margin-bottom: 0.35rem; line-height: 1.7; }
        .prose-devspace li::marker { color: var(--yellow); }

        .prose-devspace blockquote {
          margin: 1.5rem 0;
          border-left: 4px solid var(--yellow);
          background: color-mix(in srgb, var(--yellow) 6%, transparent);
          padding: 1rem 1.25rem;
          border-radius: 0 6px 6px 0;
          font-style: italic;
          color: var(--muted);
        }
        .prose-devspace blockquote p:last-child { margin-bottom: 0; }

        .prose-devspace hr {
          border: none;
          border-top: 2px dashed var(--line);
          margin: 2rem 0;
        }

        .prose-devspace table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.9em;
          overflow-x: auto;
          display: block;
        }
        .prose-devspace thead { background: var(--paper); }
        .prose-devspace th {
          border: 2px solid var(--line);
          padding: 0.75rem 1rem;
          text-align: left;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.85em;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .prose-devspace td {
          border: 2px solid var(--line);
          padding: 0.65rem 1rem;
          vertical-align: top;
        }
        .prose-devspace tbody tr:nth-child(even) {
          background: color-mix(in srgb, var(--paper) 50%, transparent);
        }
        .prose-devspace tbody tr:hover {
          background: color-mix(in srgb, var(--yellow) 6%, transparent);
        }

        .prose-devspace details {
          margin: 1.5rem 0;
          border: 2px solid var(--line);
          border-radius: 6px;
          overflow: hidden;
        }
        .prose-devspace details[open] {
          border-color: var(--yellow);
        }
        .prose-devspace summary {
          cursor: pointer;
          padding: 0.75rem 1rem;
          background: var(--paper);
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.95em;
          list-style: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          user-select: none;
          transition: background 0.2s;
        }
        .prose-devspace summary:hover {
          background: color-mix(in srgb, var(--yellow) 8%, var(--paper));
        }
        .prose-devspace summary::before {
          content: "▸";
          font-size: 0.8em;
          color: var(--yellow);
          transition: transform 0.2s;
        }
        .prose-devspace details[open] > summary::before {
          transform: rotate(90deg);
        }
        .prose-devspace summary::-webkit-details-marker { display: none; }
        .prose-devspace details > *:not(summary) {
          padding: 0 1.25rem;
        }
        .prose-devspace details > *:not(summary):first-of-type {
          padding-top: 1rem;
        }
        .prose-devspace details > *:not(summary):last-child {
          padding-bottom: 1rem;
        }

        .prose-devspace pre {
          background: var(--ink);
          color: var(--text);
          border: 2px solid var(--line);
          border-radius: 6px;
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
          font-size: 0.85em;
          line-height: 1.6;
        }
        .prose-devspace pre code {
          background: none;
          padding: 0;
          border-radius: 0;
          color: inherit;
        }

        @media (max-width: 640px) {
          .prose-devspace table { font-size: 0.8em; }
          .prose-devspace th, .prose-devspace td { padding: 0.5rem 0.6rem; }
          .prose-devspace h2 { font-size: 1.3rem; }
          .prose-devspace h3 { font-size: 1.1rem; }
        }
      `}</style>
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
