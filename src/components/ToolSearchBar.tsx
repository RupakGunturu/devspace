import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search, Send, Wrench } from "lucide-react";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { TOOLS, CATEGORY_COLORS } from "@/data/tools";
import type { Tool } from "@/types";
import { ToolIcon, ToolIconDisplay } from "@/components/tools/ToolIcon";
import { cn } from "@/lib/utils";

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

const CATEGORIES: { slug: string; label: string; icon: string }[] = [
  { slug: "css", label: "CSS", icon: "PaintBucket" },
  { slug: "color", label: "Color", icon: "SwatchBook" },
  { slug: "dev-utilities", label: "Dev Utilities", icon: "Wrench" },
  { slug: "text-content", label: "Text & Content", icon: "FileText" },
  { slug: "converters", label: "Converters", icon: "ArrowLeftRight" },
  { slug: "ai", label: "AI", icon: "Brain" },
  { slug: "seo", label: "SEO", icon: "Search" },
  { slug: "security", label: "Security", icon: "Shield" },
  { slug: "image", label: "Image", icon: "Image" },
  { slug: "code-tools", label: "Code Tools", icon: "Code" },
  { slug: "typography", label: "Typography", icon: "Font" },
  { slug: "math", label: "Math", icon: "Calculator" },
  { slug: "productivity", label: "Productivity", icon: "Timer" },
  { slug: "fun", label: "Fun", icon: "Gamepad2" },
];

interface ToolSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
}

export default function ToolSearchBar({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}: ToolSearchBarProps) {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 150);

  const filteredTools = useMemo(() => {
    let result = TOOLS;
    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [activeCategory, debouncedQuery]);

  const displayTools = useMemo(() => {
    if (debouncedQuery.trim()) return filteredTools;
    return filteredTools.slice(0, 4);
  }, [filteredTools, debouncedQuery]);

  const showDropdown = isFocused && displayTools.length > 0;

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
      if (!displayTools.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < displayTools.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayTools.length - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && displayTools[activeIndex]) {
            setSelectedId(displayTools[activeIndex].slug);
            navigate(`/tools/${displayTools[activeIndex].slug}`);
            setIsFocused(false);
          }
          break;
        case "Escape":
          setIsFocused(false);
          setActiveIndex(-1);
          break;
      }
    },
    [displayTools, activeIndex, navigate],
  );

  const handleResultClick = useCallback(
    (tool: Tool) => {
      setSelectedId(tool.slug);
      navigate(`/tools/${tool.slug}`);
      setIsFocused(false);
    },
    [navigate],
  );

  const activeCategoryData = activeCategory
    ? CATEGORIES.find((c) => c.slug === activeCategory)
    : null;

  return (
    <div className="w-full max-w-xl">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            aria-activedescendant={
              activeIndex >= 0 ? `tool-result-${displayTools[activeIndex]?.slug}` : undefined
            }
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            autoComplete="off"
            className="h-9 rounded-lg py-1.5 pr-9 pl-3 text-sm focus-visible:ring-offset-0"
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onChange={handleInputChange}
            onFocus={() => { setIsFocused(true); setSelectedId(null); }}
            onKeyDown={handleKeyDown}
            placeholder="Search tools…"
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
                <Wrench className="h-3.5 w-3.5" />
              )}
              <span>{activeCategoryData?.label ?? "All tools"}</span>
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
                  <Wrench className="h-3.5 w-3.5" />
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">All tools</span>
              </button>
            </DropdownMenuItem>
            {CATEGORIES.map((c) => (
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
                    CATEGORY_COLORS[c.slug]?.bg ?? "bg-zinc-100",
                    CATEGORY_COLORS[c.slug]?.darkBg ?? "dark:bg-zinc-800",
                  )}>
                    <ToolIcon name={c.icon} className={cn("h-3.5 w-3.5", CATEGORY_COLORS[c.slug]?.icon)} />
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{c.label}</span>
                </button>
              </DropdownMenuItem>
            ))}
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
                {displayTools.map((tool, i) => (
                  <motion.li
                    aria-selected={activeIndex === i}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 px-3.5 py-2.5 transition-colors",
                      activeIndex === i
                        ? "bg-zinc-100 dark:bg-zinc-800"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60",
                      selectedId === tool.slug && "opacity-50",
                    )}
                    id={`tool-result-${tool.slug}`}
                    key={tool.slug}
                    layout
                    onClick={() => handleResultClick(tool)}
                    role="option"
                    variants={ANIMATION_VARIANTS.item}
                  >
                    <ToolIconDisplay name={tool.icon} size="sm" category={tool.category} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {tool.name}
                      </div>
                      <div className="truncate text-xs text-zinc-400 dark:text-zinc-500">
                        {tool.tagline}
                      </div>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium capitalize text-zinc-400 dark:text-zinc-500">
                      {tool.category.replace("-", " ")}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
              {debouncedQuery.trim() ? (
                <div className="border-t border-zinc-100 px-3.5 py-2 dark:border-zinc-800">
                  <p className="text-[11px] text-zinc-400">
                    {filteredTools.length} result{filteredTools.length !== 1 ? "s" : ""}
                    {activeIndex >= 0 ? " · Press Enter to view" : ""}
                  </p>
                </div>
              ) : filteredTools.length > 4 && (
                <div className="border-t border-zinc-100 px-3.5 py-2 dark:border-zinc-800">
                  <p className="text-[11px] text-zinc-400">
                    +{filteredTools.length - 4} more — type to search
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
