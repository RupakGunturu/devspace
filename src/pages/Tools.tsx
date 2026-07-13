import { useMemo, useState, useEffect } from "react";
import { SectionHead, StickerCard } from "../components/site";
import { TOOLS, CATEGORY_COLORS } from "../data/tools";
import { ToolIcon } from "../components/tools/ToolIcon";
import ToolSearchBar from "../components/ToolSearchBar";
import { cn } from "@/lib/utils";
import { CursorHover } from "../components/core/cursor-hover";
import { usePagination } from "../hooks/use-pagination";
import { PaginationBar } from "../components/PaginationBar";

const COLOR_HEX: Record<string, string> = {
  css: "#3b82f6",
  color: "#ec4899",
  "dev-utilities": "#64748b",
  "text-content": "#d97706",
  converters: "#14b8a6",
  ai: "#8b5cf6",
  seo: "#22c55e",
  security: "#ef4444",
  image: "#d946ef",
  "code-tools": "#6366f1",
  typography: "#78716c",
  math: "#10b981",
  productivity: "#eab308",
  fun: "#f97316",
};

export default function ToolsIndex() {
  useEffect(() => {
    document.title = "Tools — DevSpace";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    let result = TOOLS;
    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  const { page, totalPages, paginatedItems, goTo } = usePagination(filteredTools);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
      <SectionHead idx="01" title="All Tools" />
      <p className="mb-6 max-w-xl text-sm text-muted">
        Everything runs in your browser. No accounts, no uploads, no wait.
      </p>
      <ToolSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {paginatedItems.map((t, i) => (
          <CursorHover label={t.name} color={COLOR_HEX[t.category]} key={t.slug}>
            <StickerCard
              icon={
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  CATEGORY_COLORS[t.category]?.bg ?? "bg-zinc-100",
                  CATEGORY_COLORS[t.category]?.darkBg ?? "dark:bg-zinc-800",
                )}>
                  <ToolIcon name={t.icon} className={CATEGORY_COLORS[t.category]?.icon} />
                </div>
              }
              title={t.name}
              index={i}
              to={`/tools/${t.slug}`}
            >
              {t.tagline}
            </StickerCard>
          </CursorHover>
        ))}
        {filteredTools.length === 0 && (
          <p className="col-span-full py-12 text-center font-mono text-sm text-muted">
            No tools match your search.
          </p>
        )}
      </div>
      <PaginationBar page={page} totalPages={totalPages} onPageChange={goTo} />
    </section>
  );
}
