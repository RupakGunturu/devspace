import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionHead } from "../components/site";
import { tips, TIP_CATEGORIES } from "../data/tips";
import { ToolIcon } from "../components/tools/ToolIcon";
import TipSearchBar from "../components/TipSearchBar";
import { cn } from "@/lib/utils";
import { CursorHover } from "../components/core/cursor-hover";
import { usePagination } from "../hooks/use-pagination";
import { PaginationBar } from "../components/PaginationBar";
import { userActivity } from "../lib/userActivity";
import { toast } from "@/components/ui/toaster";
import { Bookmark } from "lucide-react";

const COLOR_HEX: Record<string, string> = {
  "Coding Tips": "#3b82f6",
  "🚀 Productivity": "#eab308",
  "📚 Student Tips": "#22c55e",
  "💼 Career Tips": "#6366f1",
  "🧠 Learning Hacks": "#a855f7",
  "🔥 Git & GitHub": "#f97316",
  "🌐 Web Development": "#06b6d4",
  "🔒 Cybersecurity": "#ef4444",
  "🤖 AI Tips": "#8b5cf6",
  "⚡ VS Code Tips": "#0ea5e9",
  "🖥️ Windows/Mac/Linux": "#71717a",
  "🎯 DSA Tips": "#10b981",
  "🏗️ System Design": "#d97706",
  "📱 Mobile Development": "#14b8a6",
  "🎨 UI/UX": "#ec4899",
  "🛠️ Developer Toolbox": "#78716c",
  "💰 Freelancing": "#84cc16",
  "🌱 Personal Growth": "#d946ef",
  "🧩 Micro Life Hacks": "#f43f5e",
};

export const CATEGORY_COLORS: Record<string, { bg: string; darkBg: string; icon: string }> = {
  "Coding Tips": { bg: "bg-blue-100", darkBg: "dark:bg-blue-900/30", icon: "text-blue-600 dark:text-blue-400" },
  "🚀 Productivity": { bg: "bg-yellow-100", darkBg: "dark:bg-yellow-900/30", icon: "text-yellow-600 dark:text-yellow-400" },
  "📚 Student Tips": { bg: "bg-green-100", darkBg: "dark:bg-green-900/30", icon: "text-green-600 dark:text-green-400" },
  "💼 Career Tips": { bg: "bg-indigo-100", darkBg: "dark:bg-indigo-900/30", icon: "text-indigo-600 dark:text-indigo-400" },
  "🧠 Learning Hacks": { bg: "bg-purple-100", darkBg: "dark:bg-purple-900/30", icon: "text-purple-600 dark:text-purple-400" },
  "🔥 Git & GitHub": { bg: "bg-orange-100", darkBg: "dark:bg-orange-900/30", icon: "text-orange-600 dark:text-orange-400" },
  "🌐 Web Development": { bg: "bg-cyan-100", darkBg: "dark:bg-cyan-900/30", icon: "text-cyan-600 dark:text-cyan-400" },
  "🔒 Cybersecurity": { bg: "bg-red-100", darkBg: "dark:bg-red-900/30", icon: "text-red-600 dark:text-red-400" },
  "🤖 AI Tips": { bg: "bg-violet-100", darkBg: "dark:bg-violet-900/30", icon: "text-violet-600 dark:text-violet-400" },
  "⚡ VS Code Tips": { bg: "bg-sky-100", darkBg: "dark:bg-sky-900/30", icon: "text-sky-600 dark:text-sky-400" },
  "🖥️ Windows/Mac/Linux": { bg: "bg-zinc-100", darkBg: "dark:bg-zinc-800/50", icon: "text-zinc-600 dark:text-zinc-400" },
  "🎯 DSA Tips": { bg: "bg-emerald-100", darkBg: "dark:bg-emerald-900/30", icon: "text-emerald-600 dark:text-emerald-400" },
  "🏗️ System Design": { bg: "bg-amber-100", darkBg: "dark:bg-amber-900/30", icon: "text-amber-600 dark:text-amber-400" },
  "📱 Mobile Development": { bg: "bg-teal-100", darkBg: "dark:bg-teal-900/30", icon: "text-teal-600 dark:text-teal-400" },
  "🎨 UI/UX": { bg: "bg-pink-100", darkBg: "dark:bg-pink-900/30", icon: "text-pink-600 dark:text-pink-400" },
  "🛠️ Developer Toolbox": { bg: "bg-stone-100", darkBg: "dark:bg-stone-800/50", icon: "text-stone-600 dark:text-stone-400" },
  "💰 Freelancing": { bg: "bg-lime-100", darkBg: "dark:bg-lime-900/30", icon: "text-lime-600 dark:text-lime-400" },
  "🌱 Personal Growth": { bg: "bg-fuchsia-100", darkBg: "dark:bg-fuchsia-900/30", icon: "text-fuchsia-600 dark:text-fuchsia-400" },
  "🧩 Micro Life Hacks": { bg: "bg-rose-100", darkBg: "dark:bg-rose-900/30", icon: "text-rose-600 dark:text-rose-400" },
};

function TipCard({ tip }: { tip: typeof tips[0] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(() => userActivity.isTipSaved(tip.id));
  const colors = CATEGORY_COLORS[tip.category];

  const toggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await userActivity.toggleSavedTip(tip.id);
      setIsSaved(result.isSaved);
      toast.success(result.isSaved ? "Tip saved" : "Tip removed");
    } catch {
      toast.danger("Failed to save tip");
    }
  };

  return (
    <CursorHover label={tip.title} color={COLOR_HEX[tip.category]}>
      <motion.div
        layout
        onClick={() => setIsExpanded((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsExpanded((prev) => !prev); }}
        className={cn(
          "sticker block w-full rounded-md bg-paper p-5 text-left transition-shadow hover:shadow-md cursor-pointer",
          isExpanded && "ring-2 ring-yellow",
        )}
        animate={{ height: isExpanded ? "auto" : 160 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="mb-3 flex items-start gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              colors?.bg ?? "bg-zinc-100",
              colors?.darkBg ?? "dark:bg-zinc-800",
            )}
          >
            <ToolIcon
              name={tip.icon}
              className={cn("h-4 w-4", colors?.icon ?? "text-zinc-600")}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-sm font-bold leading-snug">
              {tip.title}
            </h3>
            <span className="font-mono text-[10px] text-muted">
              {tip.category}
            </span>
          </div>
          <button
            onClick={toggleSave}
            className="shrink-0 rounded p-1 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            type="button"
          >
            <Bookmark
              className={cn(
                "h-4 w-4 transition-colors",
                isSaved
                  ? "fill-yellow text-yellow"
                  : "text-muted hover:text-yellow",
              )}
            />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.p
              key="full"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="text-[13px] leading-relaxed text-foreground/80"
            >
              {tip.content}
            </motion.p>
          ) : (
            <motion.p
              key="clamped"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="line-clamp-2 text-[13px] leading-relaxed text-foreground/60"
            >
              {tip.content}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </CursorHover>
  );
}

export default function TipsIndex() {
  useEffect(() => {
    document.title = "Tips — DevSpace";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredTips = useMemo(() => {
    let result = tips;
    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q),
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  const { page, totalPages, paginatedItems, goTo } = usePagination(filteredTips);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
      <SectionHead idx="04" title="All Tips" />
      <p className="mb-6 max-w-xl text-sm text-muted">
        Bite-sized wisdom across {TIP_CATEGORIES.length} categories. Click to expand.
      </p>

      <div className="mb-8">
        <TipSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {paginatedItems.map((tip) => (
          <TipCard key={tip.id} tip={tip} />
        ))}

        {filteredTips.length === 0 && (
          <p className="col-span-full py-12 text-center font-mono text-sm text-muted">
            No tips match your search.
          </p>
        )}
      </div>
      <PaginationBar page={page} totalPages={totalPages} onPageChange={goTo} />
    </section>
  );
}
