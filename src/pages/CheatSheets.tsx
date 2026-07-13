import { useEffect, useState } from "react";
import { SectionHead, StickerCard } from "../components/site";
import { cheatSheets } from "../data/cheat-sheets";
import { ToolIcon } from "../components/tools/ToolIcon";
import { cn } from "@/lib/utils";
import { CursorHover } from "../components/core/cursor-hover";
import { usePagination } from "../hooks/use-pagination";
import { PaginationBar } from "../components/PaginationBar";

const COLOR_HEX: Record<string, string> = {
  "version-control": "#f97316",
  "css": "#3b82f6",
  "computer-science": "#a855f7",
  "javascript": "#eab308",
  "react": "#06b6d4",
  "devops": "#10b981",
  "typescript": "#6366f1",
  "backend": "#f43f5e",
  "python": "#22c55e",
  "database": "#d97706",
  "security": "#ef4444",
  "performance": "#84cc16",
  "productivity": "#ec4899",
  "accessibility": "#14b8a6",
};

const CATEGORY_COLORS: Record<string, { bg: string; darkBg: string; icon: string }> = {
  "version-control": { bg: "bg-orange-100", darkBg: "dark:bg-orange-900/30", icon: "text-orange-600 dark:text-orange-400" },
  "css": { bg: "bg-blue-100", darkBg: "dark:bg-blue-900/30", icon: "text-blue-600 dark:text-blue-400" },
  "computer-science": { bg: "bg-purple-100", darkBg: "dark:bg-purple-900/30", icon: "text-purple-600 dark:text-purple-400" },
  "javascript": { bg: "bg-yellow-100", darkBg: "dark:bg-yellow-900/30", icon: "text-yellow-600 dark:text-yellow-400" },
  "react": { bg: "bg-cyan-100", darkBg: "dark:bg-cyan-900/30", icon: "text-cyan-600 dark:text-cyan-400" },
  "devops": { bg: "bg-emerald-100", darkBg: "dark:bg-emerald-900/30", icon: "text-emerald-600 dark:text-emerald-400" },
  "typescript": { bg: "bg-indigo-100", darkBg: "dark:bg-indigo-900/30", icon: "text-indigo-600 dark:text-indigo-400" },
  "backend": { bg: "bg-rose-100", darkBg: "dark:bg-rose-900/30", icon: "text-rose-600 dark:text-rose-400" },
  "python": { bg: "bg-green-100", darkBg: "dark:bg-green-900/30", icon: "text-green-600 dark:text-green-400" },
  "database": { bg: "bg-amber-100", darkBg: "dark:bg-amber-900/30", icon: "text-amber-600 dark:text-amber-400" },
  "security": { bg: "bg-red-100", darkBg: "dark:bg-red-900/30", icon: "text-red-600 dark:text-red-400" },
  "performance": { bg: "bg-lime-100", darkBg: "dark:bg-lime-900/30", icon: "text-lime-600 dark:text-lime-400" },
  "productivity": { bg: "bg-pink-100", darkBg: "dark:bg-pink-900/30", icon: "text-pink-600 dark:text-pink-400" },
  "accessibility": { bg: "bg-teal-100", darkBg: "dark:bg-teal-900/30", icon: "text-teal-600 dark:text-teal-400" },
};

export default function CheatSheetsIndex() {
  useEffect(() => {
    document.title = "Cheat Sheets — DevSpace";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredSheets = cheatSheets.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const { page, totalPages, paginatedItems, goTo } = usePagination(filteredSheets);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
      <SectionHead idx="03" title="Cheat Sheets" />
      <p className="mb-6 max-w-xl text-sm text-muted">
        Quick references for every developer. Search, learn, copy.
      </p>

      <div className="mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search cheat sheets..."
          className="w-full max-w-md rounded-sm border-2 border-line bg-transparent px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted focus:border-yellow focus:outline-none"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {paginatedItems.map((s, i) => (
          <CursorHover label={s.title} color={COLOR_HEX[s.category]} key={s.id}>
            <StickerCard
              icon={
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  CATEGORY_COLORS[s.category]?.bg ?? "bg-zinc-100",
                  CATEGORY_COLORS[s.category]?.darkBg ?? "dark:bg-zinc-800",
                )}>
                  <ToolIcon name={s.icon} className={CATEGORY_COLORS[s.category]?.icon} />
                </div>
              }
              title={s.title}
              index={i}
              to={`/cheat-sheets/${s.id}`}
            >
              {s.description}
            </StickerCard>
          </CursorHover>
        ))}

        {filteredSheets.length === 0 && (
          <p className="col-span-full py-12 text-center font-mono text-sm text-muted">
            No cheat sheets match your search.
          </p>
        )}
      </div>
      <PaginationBar page={page} totalPages={totalPages} onPageChange={goTo} />
    </section>
  );
}
