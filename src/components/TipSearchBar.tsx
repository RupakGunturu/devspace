import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search, Send, Lightbulb } from "lucide-react";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { tips, TIP_CATEGORIES, TIP_CATEGORY_ICONS } from "@/data/tips";
import { ToolIcon } from "@/components/tools/ToolIcon";
import { cn } from "@/lib/utils";
import type { Tip } from "@/types/tips";

const CATEGORY_COLORS: Record<string, { bg: string; darkBg: string; icon: string }> = {
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

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        height: { duration: 0.4 },
        staggerChildren: 0.04,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.25 },
        opacity: { duration: 0.15 },
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25 },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: { duration: 0.15 },
    },
  },
} as const;

const CATEGORIES: { slug: string; label: string; icon: string }[] = TIP_CATEGORIES.map((cat) => ({
  slug: cat,
  label: cat,
  icon: TIP_CATEGORY_ICONS[cat] ?? "Lightbulb",
}));

interface TipSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
}

export default function TipSearchBar({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}: TipSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 150);

  const filteredTips = useMemo(() => {
    let result = tips;
    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q),
      );
    }
    return result;
  }, [activeCategory, debouncedQuery]);

  const displayTips = useMemo(() => {
    if (debouncedQuery.trim()) return filteredTips;
    return filteredTips.slice(0, 4);
  }, [filteredTips, debouncedQuery]);

  const showDropdown = isFocused && displayTips.length > 0;

  useEffect(() => {
    if (!isFocused) setActiveIndex(-1);
  }, [isFocused]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
      setActiveIndex(-1);
    },
    [onSearchChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!displayTips.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < displayTips.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayTips.length - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && displayTips[activeIndex]) {
            setSelectedId(displayTips[activeIndex].id);
            setIsFocused(false);
          }
          break;
        case "Escape":
          setIsFocused(false);
          setActiveIndex(-1);
          break;
      }
    },
    [displayTips, activeIndex],
  );

  const handleResultClick = useCallback(
    (tip: Tip) => {
      setSelectedId(tip.id);
      setIsFocused(false);
    },
    [],
  );

  const activeCategoryData = activeCategory
    ? CATEGORIES.find((c) => c.slug === activeCategory)
    : null;

  const activeColors = activeCategory
    ? CATEGORY_COLORS[activeCategory]
    : null;

  return (
    <div className="w-full max-w-xl">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            aria-activedescendant={
              activeIndex >= 0 ? `tip-result-${displayTips[activeIndex]?.id}` : undefined
            }
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            autoComplete="off"
            className="h-9 rounded-lg py-1.5 pr-9 pl-3 text-sm focus-visible:ring-offset-0"
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onChange={handleInputChange}
            onFocus={() => { setIsFocused(true); setSelectedId(null); }}
            onKeyDown={handleKeyDown}
            placeholder="Search tips…"
            role="combobox"
            type="text"
            value={searchQuery}
          />
          <div className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2">
            <AnimatePresence mode="popLayout">
              {searchQuery.length > 0 ? (
                <motion.div
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  initial={{ y: -20, opacity: 0 }}
                  key="send"
                  transition={{ duration: 0.2 }}
                >
                  <Send className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                </motion.div>
              ) : (
                <motion.div
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  initial={{ y: -20, opacity: 0 }}
                  key="search"
                  transition={{ duration: 0.2 }}
                >
                  <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <DropdownMenu onOpenChange={setCategoryOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-medium transition-all duration-200",
                activeCategory === null
                  ? "border-zinc-200/60 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700/60 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/60"
                  : "border-zinc-200/60 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700/60 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/60",
                categoryOpen && "border-zinc-300 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800/60",
              )}
              type="button"
            >
              {activeCategoryData ? (
                <ToolIcon name={activeCategoryData.icon} className="h-3.5 w-3.5" />
              ) : (
                <Lightbulb className="h-3.5 w-3.5" />
              )}
              <span>{activeCategoryData?.label ?? "All tips"}</span>
              <ChevronDown className={cn(
                "h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 dark:text-zinc-500",
                categoryOpen && "rotate-180",
              )} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="hide-scrollbar w-56 origin-top-right rounded-xl border border-zinc-200/60 bg-white/95 p-1.5 shadow-xl shadow-zinc-900/5 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/95 dark:shadow-zinc-950/20 overflow-y-auto"
            sideOffset={4}
          >
            <DropdownMenuItem asChild>
              <button
                onClick={() => onCategoryChange(null)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded-lg border border-transparent p-2 text-sm transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/60",
                  activeCategory === null && "bg-zinc-100 dark:bg-zinc-800/60",
                )}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs dark:bg-zinc-800">
                  <Lightbulb className="h-3.5 w-3.5" />
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">All tips</span>
              </button>
            </DropdownMenuItem>
            {CATEGORIES.map((c) => {
              const colors = CATEGORY_COLORS[c.slug];
              return (
                <DropdownMenuItem asChild key={c.slug}>
                  <button
                    onClick={() => onCategoryChange(c.slug)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-2 rounded-lg border border-transparent p-2 text-sm transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/60",
                      activeCategory === c.slug && "bg-zinc-100 dark:bg-zinc-800/60",
                    )}
                  >
                    <span className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full",
                      colors?.bg ?? "bg-zinc-100",
                      colors?.darkBg ?? "dark:bg-zinc-800",
                    )}>
                      <ToolIcon name={c.icon} className={cn("h-3.5 w-3.5", colors?.icon)} />
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{c.label}</span>
                  </button>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative z-10">
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              animate="show"
              aria-label="Search results"
              className="absolute mt-1.5 w-full overflow-clip rounded-lg border bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              exit="exit"
              initial="hidden"
              role="listbox"
              variants={ANIMATION_VARIANTS.container}
            >
              <motion.ul role="none">
                {displayTips.map((tip, i) => {
                  const colors = CATEGORY_COLORS[tip.category];
                  return (
                    <motion.li
                      aria-selected={activeIndex === i}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 px-3.5 py-2.5 transition-colors",
                        activeIndex === i
                          ? "bg-zinc-100 dark:bg-zinc-800"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60",
                        selectedId === tip.id && "opacity-50",
                      )}
                      id={`tip-result-${tip.id}`}
                      key={tip.id}
                      layout
                      onClick={() => handleResultClick(tip)}
                      role="option"
                      variants={ANIMATION_VARIANTS.item}
                    >
                      <span className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                        colors?.bg ?? "bg-zinc-100",
                        colors?.darkBg ?? "dark:bg-zinc-800",
                      )}>
                        <ToolIcon name={tip.icon} className={cn("h-3.5 w-3.5", colors?.icon ?? "text-zinc-600")} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {tip.title}
                        </div>
                        <div className="truncate text-xs text-zinc-400 dark:text-zinc-500">
                          {tip.content.slice(0, 80)}…
                        </div>
                      </div>
                      <span className="shrink-0 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                        {tip.category}
                      </span>
                    </motion.li>
                  );
                })}
              </motion.ul>
              {debouncedQuery.trim() ? (
                <div className="border-t border-zinc-100 px-3.5 py-2 dark:border-zinc-800">
                  <p className="text-[11px] text-zinc-400">
                    {filteredTips.length} result{filteredTips.length !== 1 ? "s" : ""}
                    {activeIndex >= 0 ? " · Press Enter to expand" : ""}
                  </p>
                </div>
              ) : filteredTips.length > 4 && (
                <div className="border-t border-zinc-100 px-3.5 py-2 dark:border-zinc-800">
                  <p className="text-[11px] text-zinc-400">
                    +{filteredTips.length - 4} more — type to search
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
