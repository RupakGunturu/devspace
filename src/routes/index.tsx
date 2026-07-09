import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Marquee, SectionHead, StickerCard } from "../components/site";
import { FeedItem } from "../components/FeedItem";
import { SeriesFilter } from "../components/SeriesFilter";
import { TOOLS } from "../data/tools";
import { GAMES } from "../data/games";
import { allPostsSorted } from "../data/posts";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  const posts = useMemo(() => {
    const all = allPostsSorted();
    return activeSeries ? all.filter((p) => p.series === activeSeries) : all;
  }, [activeSeries]);

  const featuredTools = TOOLS.slice(0, 3);
  const featuredGames = GAMES;

  return (
    <>
      {/* HERO */}
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
            <span
              className="inline-block bg-yellow px-3 text-ink"
              style={{ transform: "rotate(-1deg)" }}
            >
              Learn faster.
            </span>
          </h1>
          <p className="mt-7 max-w-lg text-base text-muted sm:text-lg">
            Dev tools that don't get in your way, games that teach faster than lectures, and
            a weekly zine of dev culture — bugs, hot takes, and repos worth stealing from.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/feed/$series"
              params={{ series: "hot-take" }}
              className="rounded-sm border-2 border-yellow bg-yellow px-6 py-3 font-mono text-[13px] font-bold text-ink no-underline transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ boxShadow: "4px 4px 0 var(--coral)" }}
            >
              Read Issue №047 →
            </Link>
            <Link
              to="/games"
              className="rounded-sm border-2 border-line px-6 py-3 font-mono text-[13px] font-bold text-text no-underline transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-text"
            >
              Play a Game
            </Link>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          "Bug of the Week",
          "Hot Take",
          "GitHub Gems",
          "Killed By Google",
          "Code Roast",
          "Ship It or Skip It",
        ]}
      />

      {/* TOOLS */}
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
              icon={t.icon}
              title={t.name}
              index={i}
              to="/tools/$slug"
              params={{ slug: t.slug }}
            >
              {t.tagline}
            </StickerCard>
          ))}
        </div>
      </section>

      {/* GAMES */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex items-center justify-between">
          <SectionHead idx="02" title="Games" />
          <Link to="/games" className="font-mono text-xs text-muted no-underline hover:text-yellow">
            all games →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {featuredGames.map((g, i) => (
            <StickerCard
              key={g.slug}
              icon={g.icon}
              title={g.name}
              index={i + 1}
              to="/games/$slug"
              params={{ slug: g.slug }}
            >
              {g.tagline}
            </StickerCard>
          ))}
        </div>
      </section>

      {/* FEED */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <SectionHead idx="03" title="This Week's Feed" />
        <SeriesFilter active={activeSeries} onChange={setActiveSeries} />
        <div>
          {posts.length === 0 ? (
            <p className="py-12 text-center font-mono text-sm text-muted">
              Nothing in this series yet. Check back next week.
            </p>
          ) : (
            posts.map((p) => <FeedItem key={p.id} post={p} />)
          )}
        </div>
      </section>
    </>
  );
}
