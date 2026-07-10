import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search, Send } from "lucide-react";
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
import { allPostsSorted, type Post } from "@/data/posts";
import { SERIES, seriesBySlug } from "@/data/series";
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

interface FeedSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeSeries: string | null;
  onSeriesChange: (slug: string | null) => void;
}

export default function FeedSearchBar({
  searchQuery,
  onSearchChange,
  activeSeries,
  onSeriesChange,
}: FeedSearchBarProps) {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [seriesOpen, setSeriesOpen] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 150);
  const allPosts = useMemo(() => allPostsSorted(), []);

  const filteredPosts = useMemo(() => {
    let result = allPosts;
    if (activeSeries) {
      result = result.filter((p) => p.series === activeSeries);
    }
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [activeSeries, debouncedQuery, allPosts]);

  const displayPosts = useMemo(() => {
    if (debouncedQuery.trim()) return filteredPosts;
    return filteredPosts.slice(0, 4);
  }, [filteredPosts, debouncedQuery]);

  const showDropdown = isFocused && displayPosts.length > 0;

  useEffect(() => {
    if (!isFocused) {
      setActiveIndex(-1);
    }
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
      if (!displayPosts.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < displayPosts.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : displayPosts.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && displayPosts[activeIndex]) {
            setSelectedId(displayPosts[activeIndex].id);
            navigate(`/post/${displayPosts[activeIndex].slug}`);
            setIsFocused(false);
          }
          break;
        case "Escape":
          setIsFocused(false);
          setActiveIndex(-1);
          break;
      }
    },
    [displayPosts, activeIndex, navigate],
  );

  const handleResultClick = useCallback(
    (post: Post) => {
      setSelectedId(post.id);
      navigate(`/post/${post.slug}`);
      setIsFocused(false);
    },
    [navigate],
  );

  const activeSeriesData = activeSeries ? SERIES.find((s) => s.slug === activeSeries) : null;

  return (
    <div className="mb-6 w-full max-w-xl">
      <div className="flex items-center gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <Input
            aria-activedescendant={
              activeIndex >= 0 ? `feed-result-${displayPosts[activeIndex]?.id}` : undefined
            }
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            autoComplete="off"
            className="h-9 rounded-lg py-1.5 pr-9 pl-3 text-sm focus-visible:ring-offset-0"
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onChange={handleInputChange}
            onFocus={() => { setIsFocused(true); setSelectedId(null); }}
            onKeyDown={handleKeyDown}
            placeholder="Search feed…"
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

          {/* Series filter dropdown */}
          <DropdownMenu onOpenChange={setSeriesOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-medium transition-all duration-200",
                  activeSeries === null
                    ? "border-zinc-200/60 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700/60 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/60"
                    : "border-zinc-200/60 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700/60 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/60",
                  seriesOpen && "border-zinc-300 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800/60",
                )}
                type="button"
              >
                <span>{activeSeriesData?.icon ?? "📰"}</span>
                <span>{activeSeriesData?.label ?? "All series"}</span>
                <ChevronDown className={cn(
                  "h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 dark:text-zinc-500",
                  seriesOpen && "rotate-180",
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
                  onClick={() => onSeriesChange(null)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2 rounded-lg border border-transparent p-2 text-sm transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/60",
                    activeSeries === null && "bg-zinc-100 dark:bg-zinc-800/60",
                  )}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs dark:bg-zinc-800">📰</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">All series</span>
                </button>
              </DropdownMenuItem>
              {SERIES.map((s) => (
                <DropdownMenuItem asChild key={s.slug}>
                  <button
                    onClick={() => onSeriesChange(s.slug)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-2 rounded-lg border border-transparent p-2 text-sm transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/60",
                      activeSeries === s.slug && "bg-zinc-100 dark:bg-zinc-800/60",
                    )}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs dark:bg-zinc-800">{s.icon}</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{s.label}</span>
                  </button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Animated dropdown */}
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
                {displayPosts.map((post, i) => {
                  const series = seriesBySlug(post.series);
                  return (
                    <motion.li
                      aria-selected={activeIndex === i}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 px-3.5 py-2.5 transition-colors",
                        activeIndex === i
                          ? "bg-zinc-100 dark:bg-zinc-800"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60",
                        selectedId === post.id && "opacity-50",
                      )}
                      id={`feed-result-${post.id}`}
                      key={post.id}
                      layout
                      onClick={() => handleResultClick(post)}
                      role="option"
                      variants={ANIMATION_VARIANTS.item}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm dark:bg-zinc-800">
                        {series?.icon ?? "📰"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {post.title}
                        </div>
                        <div className="truncate text-xs text-zinc-400 dark:text-zinc-500">
                          {post.excerpt}
                        </div>
                      </div>
                      <span className="shrink-0 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                        {series?.label ?? post.series}
                      </span>
                    </motion.li>
                  );
                })}
              </motion.ul>
              {debouncedQuery.trim() ? (
                <div className="border-t border-zinc-100 px-3.5 py-2 dark:border-zinc-800">
                  <p className="text-[11px] text-zinc-400">
                    {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""}
                    {activeIndex >= 0 ? " · Press Enter to view" : ""}
                  </p>
                </div>
              ) : filteredPosts.length > 4 && (
                <div className="border-t border-zinc-100 px-3.5 py-2 dark:border-zinc-800">
                  <p className="text-[11px] text-zinc-400">
                    +{filteredPosts.length - 4} more — type to search
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
