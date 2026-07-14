import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { Bug, LetterText, Brain, Layers, Building2, Globe, Binary } from "lucide-react";
import { Marquee, SectionHead, StickerCard } from "../components/site";
import { FeedItem } from "../components/FeedItem";
import { TOOLS } from "../data/tools";
import { GAMES } from "../data/games";
import { tips } from "../data/tips";
import { CATEGORY_COLORS as TIP_CATEGORY_COLORS } from "./Tips";
import { SERIES } from "../data/series";
import { allPostsSorted } from "../data/posts";
import Shuffle from "../components/ui/shuffle/Shuffle";
import { Accordion05 } from "../components/ui/accordion-05";
import { NeuFollowButton } from "../components/ui/neu-follow-button";
import { LineSidebar } from "../components/ui/line-sidebar/LineSidebar";
import { ToolIcon } from "../components/tools/ToolIcon";
import { CATEGORY_COLORS } from "../data/tools";
import { cn } from "@/lib/utils";

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
    document.title = "DevSpace — From First Line of Code to Production";
  }, []);

  const [activeSeries, setActiveSeries] = useState<string | null>(null);

  const visibleSeries = useMemo(() => SERIES.filter((s) => !HIDDEN_SERIES.includes(s.slug)), []);

  const posts = useMemo(() => {
    const all = allPostsSorted();
    const filtered = activeSeries ? all.filter((p) => p.series === activeSeries) : all;
    return filtered.slice(0, 5);
  }, [activeSeries]);

  const featuredTools = TOOLS.slice(0, 3);
  const featuredGames = useMemo(() => shufflePick(GAMES, 3), []);
  const featuredTips = tips.slice(0, 3);

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
            ▸ weekly dev zine — student built
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl md:text-7xl">
            Build stuff.
            <br />
            Break stuff.
            <br />
            <Shuffle
              text="Learn faster."
              tag="span"
              className="inline-block bg-yellow px-3 text-ink"
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

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex items-center justify-between">
          <SectionHead idx="01" title="Tools" />
          <Link to="/tools" className="font-mono text-xs text-muted no-underline hover:text-yellow">
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
            >
              {t.tagline}
            </StickerCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex items-center justify-between">
          <SectionHead idx="02" title="Games" color="coral" />
          <Link to="/games" className="font-mono text-xs text-muted no-underline hover:text-yellow">
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
        <div className="flex items-center justify-between">
          <SectionHead idx="03" title="Tips" />
          <Link to="/tips" className="font-mono text-xs text-muted no-underline hover:text-yellow">
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
              >
                {tip.content.slice(0, 100)}…
              </StickerCard>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex items-center justify-between">
          <SectionHead idx="04" title="This Week's Feed" color="coral" />
          <Link to="/feed" className="font-mono text-xs text-muted no-underline hover:text-coral">
            view all feed →
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
              <SeriesFilter
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
        <SectionHead idx="05" title="Q&A" />
        <Accordion05 />
      </section>
    </>
  );
}

function SeriesFilter({
  series,
  active,
  onChange,
}: {
  series: typeof SERIES;
  active: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`rounded-full border-2 px-3 py-1 font-mono text-[11px] ${
          active === null
            ? "border-yellow bg-yellow text-ink"
            : "border-line text-muted hover:border-yellow"
        }`}
      >
        all
      </button>
      {series.map((s) => (
        <button
          key={s.slug}
          onClick={() => onChange(s.slug)}
          className={`rounded-full border-2 px-3 py-1 font-mono text-[11px] ${
            active === s.slug
              ? "border-yellow bg-yellow text-ink"
              : "border-line text-muted hover:border-yellow"
          }`}
        >
          {s.icon} {s.label}
        </button>
      ))}
    </div>
  );
}
