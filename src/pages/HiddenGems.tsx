import { useMemo, useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { SectionHead, StickerCard } from "../components/site";
import { HIDDEN_GEMS, GEM_CATEGORIES, GEM_CATEGORY_COLORS } from "../data/hidden-gems";
import { cn } from "@/lib/utils";
import { CursorHover } from "../components/core/cursor-hover";
import { usePagination } from "../hooks/use-pagination";
import { PaginationBar } from "../components/PaginationBar";

export default function HiddenGems() {
  useEffect(() => {
    document.title = "Hidden Gems — DevSpace";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredGems = useMemo(() => {
    let result = HIDDEN_GEMS;
    if (activeCategory) {
      result = result.filter((g) => g.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  const { page, totalPages, paginatedItems, goTo } = usePagination(filteredGems);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
      <SectionHead idx="03" title="Hidden Gems" />
      <p className="mb-6 max-w-xl text-sm text-muted">
        Rare, useful websites most devs don't know about. Every link opens in a new tab — go down
        the rabbit hole.
      </p>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search gems, tags..."
          className="w-full rounded-sm border-2 border-line bg-transparent px-4 py-2 font-mono text-sm text-foreground placeholder:text-muted focus:border-yellow focus:outline-none sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={cn(
              "rounded-full border-2 px-3 py-1 font-mono text-[11px] font-bold transition-colors",
              activeCategory === null
                ? "border-yellow bg-yellow text-ink"
                : "border-line text-muted hover:border-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {Object.entries(GEM_CATEGORIES).map(([key, { label, color }]) => (
            <button
              type="button"
              key={key}
              onClick={() => setActiveCategory(activeCategory === key ? null : key)}
              className={cn(
                "rounded-full border-2 px-3 py-1 font-mono text-[11px] font-bold transition-colors",
                activeCategory === key
                  ? "text-ink"
                  : "border-line text-muted hover:text-foreground",
              )}
              style={
                activeCategory === key ? { borderColor: color, backgroundColor: color } : undefined
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {paginatedItems.map((gem, i) => {
          const colors = GEM_CATEGORY_COLORS[gem.category];
          return (
            <CursorHover label={gem.name} color={GEM_CATEGORIES[gem.category]?.color} key={gem.id}>
              <a href={gem.url} target="_blank" rel="noopener noreferrer" className="no-underline">
                <StickerCard
                  icon={
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        colors?.bg ?? "bg-zinc-100",
                        colors?.darkBg ?? "dark:bg-zinc-800",
                      )}
                    >
                      <span className={cn("text-sm font-bold", colors?.icon ?? "text-zinc-600")}>
                        {gem.name.charAt(0)}
                      </span>
                    </div>
                  }
                  title={gem.name}
                  index={i}
                  actions={<ExternalLink className="h-4 w-4 shrink-0 text-muted" />}
                >
                  <span className="block">{gem.description}</span>
                  <span
                    className={cn(
                      "mt-2 inline-block rounded-full px-2 py-0.5 font-mono text-[10px] font-bold",
                      colors?.bg ?? "bg-zinc-100",
                      colors?.darkBg ?? "dark:bg-zinc-800",
                      colors?.icon ?? "text-zinc-600",
                    )}
                  >
                    {GEM_CATEGORIES[gem.category]?.label}
                  </span>
                </StickerCard>
              </a>
            </CursorHover>
          );
        })}
        {filteredGems.length === 0 && (
          <p className="col-span-full py-12 text-center font-mono text-sm text-muted">
            No hidden gems match your search.
          </p>
        )}
      </div>
      <PaginationBar page={page} totalPages={totalPages} onPageChange={goTo} />
    </section>
  );
}
