import { useMemo, useState, useEffect } from "react";
import { SectionHead, StickerCard } from "../components/site";
import { TOOLS, CATEGORY_COLORS } from "../data/tools";
import { ToolIcon } from "../components/tools/ToolIcon";
import ToolSearchBar from "../components/ToolSearchBar";
import { cn } from "@/lib/utils";
import { CursorHover } from "../components/core/cursor-hover";
import { usePagination } from "../hooks/use-pagination";
import { PaginationBar } from "../components/PaginationBar";
import BookmarkButton from "../components/BookmarkButton";
import { useAuth } from "@/components/AuthProvider";
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  branding: "#0284c7",
  design: "#e11d48",
  content: "#9333ea",
  career: "#0891b2",
  learning: "#65a30d",
  marketing: "#10b981",
  ecommerce: "#d97706",
  finance: "#16a34a",
  hr: "#3b82f6",
  legal: "#52525b",
  "real-estate": "#14b8a6",
  photography: "#8b5cf6",
  health: "#ef4444",
  fitness: "#f97316",
  writing: "#6366f1",
  media: "#d946ef",
  education: "#0ea5e9",
  sales: "#84cc16",
  events: "#ec4899",
  "no-code": "#78716c",
};

export default function ToolsIndex() {
  useEffect(() => {
    document.title = "Tools — DevSpace";
  }, []);

  const { user } = useAuth();
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
        Everything runs in your browser. Some tools require a free account — look for the 🔒 badge.
      </p>
      <ToolSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {paginatedItems.map((t, i) => {
          const isLocked = t.requiresAuth && !user;
          return (
            <CursorHover label={t.name} color={COLOR_HEX[t.category]} key={t.slug}>
              <StickerCard
                icon={
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      CATEGORY_COLORS[t.category]?.bg ?? "bg-zinc-100",
                      CATEGORY_COLORS[t.category]?.darkBg ?? "dark:bg-zinc-800",
                    )}
                  >
                    <ToolIcon name={t.icon} className={CATEGORY_COLORS[t.category]?.icon} />
                  </div>
                }
                title={t.name}
                index={i}
                to={isLocked ? `/login?redirect=/tools/${t.slug}` : `/tools/${t.slug}`}
                actions={
                  <div className="flex items-center gap-1">
                    {isLocked && (
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="rounded-full bg-yellow/90 p-1.5 text-ink shadow-sm cursor-help">
                              <Lock className="h-3 w-3" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Sign in to access this tool</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <BookmarkButton type="tool" slug={t.slug} />
                  </div>
                }
              >
                {t.tagline}
              </StickerCard>
            </CursorHover>
          );
        })}
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
