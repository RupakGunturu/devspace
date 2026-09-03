import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import {
  Bug,
  LetterText,
  Brain,
  Layers,
  Building2,
  Globe,
  Binary,
  ChevronDown,
} from "lucide-react";
import { Marquee, SectionHead, StickerCard } from "../components/site";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { FeedItem } from "../components/FeedItem";
import {
  useGames,
  useTools,
  useTips,
  useCheatSheets,
  useSeriesList,
  usePosts,
} from "../lib/contentStore";
import { CATEGORY_COLORS as TIP_CATEGORY_COLORS } from "./Tips";
import Shuffle from "../components/ui/shuffle/Shuffle";
import { Accordion05 } from "../components/ui/accordion-05";
import { NeuFollowButton } from "../components/ui/neu-follow-button";
import { LineSidebar } from "../components/ui/line-sidebar/LineSidebar";
import { ToolIcon } from "../components/tools/ToolIcon";
import { CATEGORY_COLORS } from "../data/tools";
import { cn } from "@/lib/utils";
import BookmarkButton from "../components/BookmarkButton";

const SHEET_COLORS: Record<string, { bg: string; darkBg: string; icon: string; hex: string }> = {
  "version-control": {
    bg: "bg-orange-100",
    darkBg: "dark:bg-orange-900/30",
    icon: "text-orange-600 dark:text-orange-400",
    hex: "#f97316",
  },
  css: {
    bg: "bg-blue-100",
    darkBg: "dark:bg-blue-900/30",
    icon: "text-blue-600 dark:text-blue-400",
    hex: "#3b82f6",
  },
  "computer-science": {
    bg: "bg-purple-100",
    darkBg: "dark:bg-purple-900/30",
    icon: "text-purple-600 dark:text-purple-400",
    hex: "#a855f7",
  },
  javascript: {
    bg: "bg-yellow-100",
    darkBg: "dark:bg-yellow-900/30",
    icon: "text-yellow-600 dark:text-yellow-400",
    hex: "#eab308",
  },
  react: {
    bg: "bg-cyan-100",
    darkBg: "dark:bg-cyan-900/30",
    icon: "text-cyan-600 dark:text-cyan-400",
    hex: "#06b6d4",
  },
  devops: {
    bg: "bg-emerald-100",
    darkBg: "dark:bg-emerald-900/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    hex: "#10b981",
  },
  typescript: {
    bg: "bg-indigo-100",
    darkBg: "dark:bg-indigo-900/30",
    icon: "text-indigo-600 dark:text-indigo-400",
    hex: "#6366f1",
  },
  backend: {
    bg: "bg-rose-100",
    darkBg: "dark:bg-rose-900/30",
    icon: "text-rose-600 dark:text-rose-400",
    hex: "#f43f5e",
  },
  python: {
    bg: "bg-green-100",
    darkBg: "dark:bg-green-900/30",
    icon: "text-green-600 dark:text-green-400",
    hex: "#22c55e",
  },
  database: {
    bg: "bg-amber-100",
    darkBg: "dark:bg-amber-900/30",
    icon: "text-amber-600 dark:text-amber-400",
    hex: "#d97706",
  },
  security: {
    bg: "bg-red-100",
    darkBg: "dark:bg-red-900/30",
    icon: "text-red-600 dark:text-red-400",
    hex: "#ef4444",
  },
  performance: {
    bg: "bg-lime-100",
    darkBg: "dark:bg-lime-900/30",
    icon: "text-lime-600 dark:text-lime-400",
    hex: "#84cc16",
  },
  productivity: {
    bg: "bg-pink-100",
    darkBg: "dark:bg-pink-900/30",
    icon: "text-pink-600 dark:text-pink-400",
    hex: "#ec4899",
  },
  accessibility: {
    bg: "bg-teal-100",
    darkBg: "dark:bg-teal-900/30",
    icon: "text-teal-600 dark:text-teal-400",
    hex: "#14b8a6",
  },
};

const GAME_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "bug-finder": Bug,
  devwordle: LetterText,
  "dev-trivia": Brain,
  "tech-memory": Layers,
  "stack-matcher": Building2,
  "http-roulette": Globe,
  "binary-race": Binary,
};

const HIDDEN_SERIES = ["bug-of-the-week", "framework-wars", "behind-the-error", "changelog"];

function shufflePick<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export default function Home() {
  useEffect(() => {
    document.title = "DevSpace — From rookie commit to production hit.";
  }, []);

  const [activeSeries, setActiveSeries] = useState<string | null>(null);

  const allSeries = useSeriesList();
  const allPosts = usePosts();
  const TOOLS = useTools();
  const GAMES = useGames();
  const tips = useTips();
  const cheatSheets = useCheatSheets();

  const visibleSeries = useMemo(
    () => allSeries.filter((s) => !HIDDEN_SERIES.includes(s.slug)),
    [allSeries],
  );

  const posts = useMemo(() => {
    const all = [...allPosts].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
    const filtered = activeSeries ? all.filter((p) => p.series === activeSeries) : all;
    return filtered.slice(0, 5);
  }, [activeSeries, allPosts]);

  const featuredTools = TOOLS.filter((t) => t.popular).slice(0, 3);
  const featuredGames = useMemo(() => shufflePick(GAMES, 3), [GAMES]);
  const featuredTips = tips.slice(0, 3);
  const featuredSheets = cheatSheets.slice(0, 3);

  return (
    <>
      <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 sm:px-8 sm:pt-24 sm:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-4 right-4 hidden select-none font-display text-[240px] font-extrabold leading-none opacity-50 sm:block"
          style={{ WebkitTextStroke: "1px var(--line)", color: "transparent" }}
        >
          047
        </div>
        <div className="relative z-[1]">
          <div className="mb-5 font-mono text-xs uppercase tracking-widest text-coral">
            ▸ for devs who actually ship
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-5xl md:text-6xl">
            Build stuff.
            <br />
            Break stuff.
            <br />
            <Shuffle
              text="Learn faster."
              tag="span"
              className="inline-block bg-yellow px-2 text-ink sm:px-3"
              style={{ transform: "rotate(-1deg)" }}
              shuffleDirection="right"
              duration={0.35}
              animationMode="random"
              maxDelay={0.3}
              shuffleTimes={1}
              ease="power3.out"
              loop
              loopDelay={4}
              threshold={0.1}
              respectReducedMotion
            />
          </h1>
          <p className="mt-7 max-w-lg text-base text-muted sm:text-lg">
            Built by a developer who was tired of bloated tools, boring tutorials, and content that
            never gets to the point. DevSpace gives you tools that just work, games that teach by
            doing, and real talk about the code we actually write.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <NeuFollowButton label="Level Up" hoverLabel="Let's go" to="/feed/hot-take" />
            <Link
              to="/games"
              className="flex h-12 items-center rounded-sm border-2 border-line px-6 font-mono text-sm font-bold text-foreground no-underline transition-all hover:border-foreground"
            >
              Play a Game
            </Link>
          </div>
        </div>
      </section>

      <div className="overflow-hidden">
        <Marquee
          items={[
            "Resource Drop",
            "Stack Breakdown",
            "Dev Vocabulary",
            "Concept in 60 Seconds",
            "Challenge of the Week",
            "Collab Corner",
            "The Rabbit Hole",
            "Tech Debt Diaries",
            "The Interview They Don't Show You",
            "Hot Take",
            "GitHub Gems",
            "Killed By Google",
            "Code Roast",
            "Ship It or Skip It",
          ]}
        />
      </div>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <SectionHead idx="01" title="Tools" />
          <Link
            to="/tools"
            className="ml-auto whitespace-nowrap font-mono text-xs text-muted no-underline hover:text-yellow"
          >
            all tools →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {featuredTools.map((t, i) => (
            <StickerCard
              key={t.slug}
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
              to={`/tools/${t.slug}`}
              actions={<BookmarkButton type="tool" slug={t.slug} />}
            >
              {t.tagline}
            </StickerCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <SectionHead idx="02" title="Games" color="coral" />
          <Link
            to="/games"
            className="ml-auto whitespace-nowrap font-mono text-xs text-muted no-underline hover:text-yellow"
          >
            all games →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {featuredGames.map((g, i) => {
            const Icon = GAME_ICONS[g.slug];
            return (
              <StickerCard
                key={g.slug}
                icon={
                  Icon ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/10">
                      <Icon className="h-5 w-5 text-coral" />
                    </div>
                  ) : (
                    g.icon
                  )
                }
                title={g.name}
                index={i + 1}
                to={`/games/${g.slug}`}
              >
                {g.tagline}
              </StickerCard>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <SectionHead idx="03" title="Tips" />
          <Link
            to="/tips"
            className="ml-auto whitespace-nowrap font-mono text-xs text-muted no-underline hover:text-yellow"
          >
            all tips →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {featuredTips.map((tip, i) => {
            const colors = TIP_CATEGORY_COLORS[tip.category];
            return (
              <StickerCard
                key={tip.id}
                icon={
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      colors?.bg ?? "bg-zinc-100",
                      colors?.darkBg ?? "dark:bg-zinc-800",
                    )}
                  >
                    <ToolIcon
                      name={tip.icon}
                      className={cn("h-5 w-5", colors?.icon ?? "text-zinc-600")}
                    />
                  </div>
                }
                title={tip.title}
                index={i}
                to="/tips"
                actions={<BookmarkButton type="tip" slug={tip.id} />}
              >
                {tip.content.slice(0, 100)}…
              </StickerCard>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <SectionHead idx="04" title="Cheat Sheets" />
          <Link
            to="/cheat-sheets"
            className="ml-auto whitespace-nowrap font-mono text-xs text-muted no-underline hover:text-yellow"
          >
            all sheets →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {featuredSheets.map((s, i) => {
            const colors = SHEET_COLORS[s.category];
            return (
              <StickerCard
                key={s.id}
                icon={
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      colors?.bg ?? "bg-zinc-100",
                      colors?.darkBg ?? "dark:bg-zinc-800",
                    )}
                  >
                    <ToolIcon
                      name={s.icon}
                      className={cn("h-5 w-5", colors?.icon ?? "text-zinc-600")}
                    />
                  </div>
                }
                title={s.title}
                index={i}
                to={`/cheat-sheets/${s.id}`}
                actions={<BookmarkButton type="cheatsheet" slug={s.id} />}
              >
                {s.description}
              </StickerCard>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <SectionHead idx="05" title="This Week's Feed" color="coral" />
          <Link
            to="/feed"
            className="ml-auto whitespace-nowrap font-mono text-xs text-muted no-underline hover:text-coral"
          >
            view feed →
          </Link>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="hidden shrink-0 lg:block">
            <LineSidebar
              items={visibleSeries.map((s) => ({ label: s.label, slug: s.slug, icon: s.icon }))}
              activeIndex={
                activeSeries != null ? visibleSeries.findIndex((s) => s.slug === activeSeries) : -1
              }
              onItemClick={(_i, slug) => setActiveSeries(slug === activeSeries ? null : slug)}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="lg:hidden">
              <SeriesFilterDropdown
                series={visibleSeries}
                active={activeSeries}
                onChange={setActiveSeries}
              />
            </div>
            <div>
              {posts.length === 0 ? (
                <p className="py-12 text-center font-mono text-sm text-muted">
                  Nothing in this series yet. Check back next week.
                </p>
              ) : (
                posts.map((p) => <FeedItem key={p.id} post={p} />)
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <SectionHead idx="06" title="Q&A" />
        <Accordion05 />
      </section>
    </>
  );
}

function SeriesFilterDropdown({
  series,
  active,
  onChange,
}: {
  series: ReturnType<typeof useSeriesList>;
  active: string | null;
  onChange: (v: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const activeData = active ? series.find((s) => s.slug === active) : null;
  const select = (v: string | null) => {
    onChange(v);
    setOpen(false);
  };
  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="mb-6 inline-flex items-center gap-1.5 rounded-full border-2 border-line px-3 py-1 font-mono text-[11px] text-muted transition-colors hover:border-yellow hover:text-yellow"
        >
          <ToolIcon name={activeData?.icon ?? "Newspaper"} className="h-3.5 w-3.5" />
          <span>{activeData?.label ?? "all series"}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85dvh]">
        <DrawerHeader className="border-b-2 border-dashed border-line pb-4 text-left">
          <DrawerTitle className="font-display text-xl font-extrabold">Filter the feed</DrawerTitle>
          <DrawerDescription>Pick a series to narrow down this week's posts.</DrawerDescription>
        </DrawerHeader>
        <div className="hide-scrollbar max-h-[65dvh] overflow-y-auto px-3 py-3">
          <button
            type="button"
            onClick={() => select(null)}
            className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-mono text-[13px] transition-colors ${
              active === null ? "bg-yellow text-ink" : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            <ToolIcon name="Newspaper" className="h-4 w-4 shrink-0" />
            <span>all series</span>
          </button>
          {series.map((s) => (
            <button
              type="button"
              key={s.slug}
              onClick={() => select(s.slug)}
              className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-mono text-[13px] transition-colors ${
                active === s.slug
                  ? "bg-yellow text-ink"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              <ToolIcon name={s.icon} className="h-4 w-4 shrink-0" />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
