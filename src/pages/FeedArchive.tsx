import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { FeedItem } from "../components/FeedItem";
import { allPostsSorted } from "../data/posts";
import { RESOURCE_DROP_ITEMS } from "../data/resourcedrop";
import FeedSearchBar from "../components/FeedSearchBar";

export default function FeedArchive() {
  useEffect(() => {
    document.title = "All feed — DevSpace";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSeries, setActiveSeries] = useState<string | null>(null);

  const isResourceDrop = activeSeries === "resource-drop";

  const posts = useMemo(() => {
    let result = allPostsSorted();
    if (activeSeries) {
      result = result.filter((p) => p.series === activeSeries);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [activeSeries, searchQuery]);

  const filteredResources = useMemo(() => {
    if (!isResourceDrop) return [];
    if (!searchQuery.trim()) return RESOURCE_DROP_ITEMS;
    const q = searchQuery.toLowerCase();
    return RESOURCE_DROP_ITEMS.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q),
    );
  }, [isResourceDrop, searchQuery]);

  return (
    <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16">
      <Link to="/" className="font-mono text-xs text-muted no-underline hover:text-yellow">
        ← the week's feed
      </Link>
      <h1 className="mt-6 mb-2 font-display text-4xl font-extrabold">Archive</h1>
      <p className="mb-8 text-muted">Every post from every series, all in one place.</p>

      <FeedSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeSeries={activeSeries}
        onSeriesChange={setActiveSeries}
      />
      <div>
        {isResourceDrop ? (
          filteredResources.length === 0 ? (
            <p className="py-12 text-center font-mono text-sm text-muted">
              Nothing matches your search.
            </p>
          ) : (
            <div className="mt-6 space-y-2">
              {filteredResources.map((r, i) => (
                <div key={r.label} className="stagger-item" style={{ animationDelay: `${i * 0.04}s` }}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-transparent p-3 text-sm transition-all hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/60"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm dark:bg-zinc-800">
                      {r.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">{r.label}</div>
                      <div className="truncate text-xs text-zinc-400 dark:text-zinc-500">{r.desc}</div>
                    </div>
                    <span className="shrink-0 text-xs text-zinc-400">↗</span>
                  </a>
                </div>
              ))}
              {searchQuery.trim() && (
                <p className="pt-2 text-center text-[11px] text-zinc-400">
                  {filteredResources.length} result{filteredResources.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          )
        ) : posts.length === 0 ? (
          <p className="py-12 text-center font-mono text-sm text-muted">
            Nothing matches your search. Try a different series or query.
          </p>
        ) : (
          posts.map((p, i) => (
            <div key={p.id} className="stagger-item" style={{ animationDelay: `${i * 0.04}s` }}>
              <FeedItem post={p} />
            </div>
          ))
        )}
      </div>

      <style>{`
        .stagger-item {
          animation: fade-up 0.35s ease both;
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
