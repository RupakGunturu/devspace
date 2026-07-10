import { Link } from "react-router-dom";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export default function About() {
  useEffect(() => {
    document.title = "About — DevSpace";
  }, []);

  const releases = [
    {
      id: "v130",
      version: "v1.3.0", date: "July 2026", latest: true,
      groups: [
        { type: "New", accent: "text-green-600 dark:text-green-400", items: [
          "Changelog on this page",
          "Lucide SVG icons for all 284 tools — unique per tool, colored by category",
          "Tool search bar with animated FeedSearchBar-style filter and category dropdown",
          "Shuffle component — randomized letter animation on hero text",
        ]},
        { type: "Improved", accent: "text-sky-600 dark:text-sky-400", items: [
          "Tools page now randomized so CSS tools aren't all grouped together",
          "Feed search with height/opacity animation, keyboard nav, 4-result cap",
          "StickerCard accepts Lucide icons in colored badge or emoji strings",
        ]},
        { type: "Fixed", accent: "text-orange-600 dark:text-orange-400", items: [
          "Invalid Lucide names — Shadow/Height/Eyedropper replaced with valid ones",
          "Build warnings — removed leftover references from tools.ts",
        ]},
      ],
    },
    {
      id: "v120",
      version: "v1.2.0", date: "June 2026",
      groups: [
        { type: "New", accent: "text-green-600 dark:text-green-400", items: [
          "FeedArchive page at /feed with staggered animation and search",
          "FeedSearchBar animated dropdown with series filter and keyboard nav",
          "useDebounce hook (150ms) for search inputs across the site",
        ]},
        { type: "Improved", accent: "text-sky-600 dark:text-sky-400", items: [
          'Home page layout — "view all feed" now inline with SectionHead',
          "Home feed with LineSidebar on desktop, SeriesFilter pills on mobile",
        ]},
      ],
    },
    {
      id: "v110",
      version: "v1.1.0", date: "May 2026",
      groups: [
        { type: "New", accent: "text-green-600 dark:text-green-400", items: [
          "Initial launch — Home, Tools, Games, Cheat Sheets, and About pages",
          "200+ developer tools across 14 categories",
          "Dark/light theme toggle with system preference",
          "Feed section with weekly dev zine posts across 7 series",
        ]},
      ],
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="flex gap-20 max-lg:flex-col max-lg:gap-12">
        <aside className="w-44 shrink-0 max-lg:hidden">
          <div className="sticky top-28">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted">
              On this page
            </p>
            <nav className="flex flex-col gap-0.5">
              <a
                href="#colophon"
                className="group flex items-center gap-2 py-1.5 font-mono text-sm text-muted transition-colors hover:text-foreground"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-muted" />
                Colophon
              </a>
              <span className="my-2 font-mono text-[10px] uppercase tracking-widest text-muted/50 pl-[18px]">
                Releases
              </span>
              {releases.map((r) => (
                <a
                  key={r.id}
                  href={`#${r.id}`}
                  className="group flex items-center gap-2 py-1.5 font-mono text-sm text-muted transition-colors hover:text-foreground"
                >
                  {r.latest ? (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-yellow" />
                  ) : (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-muted" />
                  )}
                  {r.version}
                </a>
              ))}
            </nav>

            <div className="my-6 h-px bg-line" />

            <div className="space-y-3">
              {[
                { n: "3", label: "releases" },
                { n: releases.reduce((s, r) => s + r.groups.reduce((c, g) => c + g.items.length, 0), 0) + "+", label: "changes" },
                { n: releases.reduce((s, r) => s + r.groups.filter((g) => g.type === "Fixed").reduce((c, g) => c + g.items.length, 0), 0).toString(), label: "bugs fixed" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5 leading-none">
                  <span className="font-mono text-xl font-bold text-yellow">{stat.n}</span>
                  <span className="font-mono text-[11px] text-muted">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 max-w-2xl" id="colophon">
          <div className="mb-4 font-mono text-xs uppercase tracking-widest text-coral">▸ colophon</div>
          <h1 className="font-display text-5xl font-extrabold leading-tight">
            A zine, some tools,
            <br />
            <span className="inline-block bg-yellow px-2 text-ink" style={{ transform: "rotate(-1deg)" }}>
              three tiny games.
            </span>
          </h1>
          <div className="mt-10 space-y-5 text-lg text-muted">
            <p>
              DevSpace is a weekly, student-built zine for people who are still figuring this
              whole "software" thing out. That includes us.
            </p>
            <p>
              Every issue mixes a few things: a set of{" "}
              <Link to="/tools" className="text-yellow no-underline">tools</Link>{" "}
              that run entirely in your browser, a few{" "}
              <Link to="/games" className="text-yellow no-underline">games</Link>{" "}
              that pretend to be fun and secretly teach you things, and a feed of short posts
              across a handful of{" "}
              <Link to="/feed/bug-of-the-week" className="text-yellow no-underline">
                recurring series
              </Link>
              .
            </p>
            <p>
              It's rookie-learning-out-loud, not corporate. No newsletter popup, no cookie
              banner drama, no "unlock this article." Just a zine.
            </p>
            <p className="font-mono text-sm">
              If you want to write for it, ship a game, or fix our typos — the whole thing is
              the point.
            </p>
          </div>
          <div className="mt-12 border-t-2 border-dashed border-line pt-6" id="colophon-details">
            <div className="font-mono text-xs text-muted">Colophon</div>
            <div className="mt-2 grid grid-cols-2 gap-4 font-mono text-sm">
              <div>
                <div className="text-muted">Display type</div>
                <div className="font-display font-bold">Bricolage Grotesque</div>
              </div>
              <div>
                <div className="text-muted">Body type</div>
                <div>Inter</div>
              </div>
              <div>
                <div className="text-muted">Mono / tags</div>
                <div>JetBrains Mono</div>
              </div>
              <div>
                <div className="text-muted">Issue</div>
                <div>№047</div>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t-2 border-dashed border-line pt-10">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-yellow">▸ what's new</div>
            <div className="space-y-10">
              {releases.map((release) => (
                <div key={release.id} id={release.id} className="scroll-mt-24">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="font-mono text-xl font-bold text-foreground">{release.version}</span>
                    <span className="font-mono text-xs text-muted">{release.date}</span>
                    {release.latest && (
                      <span className="rounded-full border border-yellow/30 bg-yellow/10 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-yellow">
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="space-y-3 pl-4 border-l-2 border-line">
                    {release.groups.map((group) => (
                      <div key={group.type}>
                        <span className={cn("font-mono text-[11px] font-bold uppercase tracking-wider", group.accent)}>
                          {group.type}
                        </span>
                        <ul className="mt-1 space-y-1">
                          {group.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted">
                              <span className="mt-[0.45em] h-[5px] w-[5px] shrink-0 rounded-full bg-muted/50" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
