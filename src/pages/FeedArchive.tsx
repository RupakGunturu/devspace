import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { FeedItem } from "../components/FeedItem";
import { allPostsSorted } from "../data/posts";
import FeedSearchBar from "../components/FeedSearchBar";

export default function FeedArchive() {
  useEffect(() => {
    document.title = "All feed — DevSpace";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSeries, setActiveSeries] = useState<string | null>(null);

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
        {posts.length === 0 ? (
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
