export type Post = {
  id: string;
  slug: string;
  title: string;
  series: string; // series slug
  excerpt: string;
  body: string; // markdown
  publishedAt: string; // ISO date
};

// Helper to make bodies short and voicey without repeating boilerplate
const b = (s: string) => s.trim();

export const POSTS: Post[] = [
  // Changelog
  { id: "p1", slug: "vite-7-lands", title: "Vite 7 lands and it is very fast, again", series: "changelog", excerpt: "Startup time drops another 20%, and the plugin API only broke a little.", body: b(`Vite 7 shipped this week. The headline is a **20% cold-start improvement** on medium projects. The fine print is that a couple of plugin hooks moved around — if you maintain one, check the migration notes.`), publishedAt: "2026-07-07" },
  { id: "p2", slug: "node-24-lts", title: "Node 24 goes LTS", series: "changelog", excerpt: "Native fetch is stable, the test runner grew up, and require(esm) actually works now.", body: b(`Node 24 hit LTS. The three things worth knowing: **stable fetch**, a much better built-in test runner, and \`require(esm)\` no longer feels like a hack.`), publishedAt: "2026-07-03" },
  { id: "p3", slug: "react-19-2", title: "React 19.2 quietly ships better error boundaries", series: "changelog", excerpt: "The new owner stacks make async component errors readable for once.", body: b(`19.2 isn't flashy but the new **owner stacks** finally make it possible to debug an error thrown inside an async component without crying.`), publishedAt: "2026-06-28" },

  // Resource Drop
  { id: "p4", slug: "typescript-cheatsheet-drop", title: "Six TypeScript cheat sheets worth bookmarking", series: "resource-drop", excerpt: "Utility types, generics, and the one about mapped types you'll actually use.", body: b(`Rounding up the six cheat sheets we keep in a tab. Mostly utility types and the one great **mapped types** poster.`), publishedAt: "2026-07-05" },
  { id: "p5", slug: "free-icon-libraries", title: "The free icon libraries that don't feel free", series: "resource-drop", excerpt: "Beyond Lucide: five libraries with actual character.", body: b(`Everyone reaches for Lucide. Here are five that also feel designed, not defaulted.`), publishedAt: "2026-06-30" },
  { id: "p6", slug: "postgres-learning-path", title: "A Postgres learning path that isn't 400 hours", series: "resource-drop", excerpt: "Four resources, in order, that took us from SELECT * to writing our own indexes.", body: b(`Skip the 12-hour course. This ordered list of four resources gets you productive in Postgres without pretending you're a DBA.`), publishedAt: "2026-06-22" },

  // Stack Breakdown
  { id: "p7", slug: "how-linear-loads-fast", title: "How Linear feels instant: a stack breakdown", series: "stack-breakdown", excerpt: "Optimistic UI, local-first data, and a sync engine that doesn't apologize.", body: b(`Linear feels instant because it lies to you responsibly. Here's the layered breakdown.`), publishedAt: "2026-07-01" },
  { id: "p8", slug: "vercel-edge-anatomy", title: "The anatomy of a Vercel edge deploy", series: "stack-breakdown", excerpt: "What actually happens between git push and a user hitting your route.", body: b(`Between \`git push\` and the user's request there are about 11 things happening. Here they are, in order.`), publishedAt: "2026-06-20" },
  { id: "p9", slug: "supabase-under-the-hood", title: "Supabase, under the hood", series: "stack-breakdown", excerpt: "PostgREST, PgBouncer, and why row-level security is doing more than you think.", body: b(`Supabase looks like magic. It's actually four well-known Postgres tools stacked with taste.`), publishedAt: "2026-06-10" },

  // Bug of the Week
  { id: "p10", slug: "off-by-one-pagination", title: "The off-by-one error that broke pagination in prod", series: "bug-of-the-week", excerpt: "A walkthrough of the fix, and the test that should've caught it.", body: b(`Classic off-by-one. \`page * limit\` vs \`(page - 1) * limit\`. Cost us three hours and one dashboard.`), publishedAt: "2026-07-05" },
  { id: "p11", slug: "timezone-monday", title: "The timezone bug that only fired on Mondays", series: "bug-of-the-week", excerpt: "UTC weeks start on Monday. Your users don't.", body: b(`If you ever schedule anything weekly, read this before your Monday-only bug.`), publishedAt: "2026-06-27" },
  { id: "p12", slug: "flaky-e2e", title: "Why the flaky test wasn't flaky", series: "bug-of-the-week", excerpt: "It was a race condition. It's always a race condition.", body: b(`The test wasn't flaky. Your component was doing two things at once.`), publishedAt: "2026-06-15" },

  // Framework Wars
  { id: "p13", slug: "next-vs-remix-2026", title: "Next vs Remix, 2026 edition", series: "framework-wars", excerpt: "One shipped a router, the other rewrote their data layer. Both are fine.", body: b(`Fine, we'll do it. Next vs Remix, again, with the receipts from 2026.`), publishedAt: "2026-07-02" },
  { id: "p14", slug: "svelte-5-vs-solid", title: "Svelte 5 vs Solid: who won the reactivity war?", series: "framework-wars", excerpt: "Signals everywhere, but the DX diverged hard.", body: b(`Both bet on signals. Only one is fun to write.`), publishedAt: "2026-06-18" },
  { id: "p15", slug: "htmx-vs-react", title: "HTMX vs React: is the pendulum swinging?", series: "framework-wars", excerpt: "Server-rendered HTML is back and it's smug.", body: b(`Not a rage post. A real comparison of two very different bets.`), publishedAt: "2026-05-30" },

  // GitHub Gems
  { id: "p16", slug: "clipanion-gem", title: "A 200-star repo that solves CLI arg parsing better than most", series: "github-gems", excerpt: "Underrated, well-documented, and worth stealing patterns from.", body: b(`Clipanion has fewer stars than it deserves. The type inference for commands is genuinely elegant.`), publishedAt: "2026-06-30" },
  { id: "p17", slug: "kysely-gem", title: "This tiny query builder is the SQL DX we deserved", series: "github-gems", excerpt: "Types that actually track your schema without a codegen step.", body: b(`Kysely. Look at it. Read the source. It's small and correct.`), publishedAt: "2026-06-11" },
  { id: "p18", slug: "zod-alternatives", title: "Three zod alternatives that are actually different", series: "github-gems", excerpt: "Not \"zod but with slightly different syntax\" — actually different.", body: b(`Valibot, arktype, effect/schema. What each one is actually for.`), publishedAt: "2026-05-25" },

  // Dev Vocabulary
  { id: "p19", slug: "vocab-idempotent", title: "\"Idempotent\", finally explained", series: "dev-vocabulary", excerpt: "Call it once. Call it twice. Same result. Here's why that matters.", body: b(`Idempotent means calling something twice does the same thing as calling it once. That's the whole vocab card.`), publishedAt: "2026-07-04" },
  { id: "p20", slug: "vocab-cardinality", title: "What \"cardinality\" actually means in databases", series: "dev-vocabulary", excerpt: "It's about how many. Not what. Just how many.", body: b(`Cardinality is a fancy word for \"how many distinct values\". That's it. That's the term.`), publishedAt: "2026-06-24" },
  { id: "p21", slug: "vocab-hoisting", title: "Hoisting: not what your bootcamp told you", series: "dev-vocabulary", excerpt: "The compiler doesn't move anything. It just knew already.", body: b(`Nothing gets \"moved to the top\". The parser just scans declarations first. Big difference.`), publishedAt: "2026-06-05" },

  // Behind the Error
  { id: "p22", slug: "cors-error-story", title: "The real reason CORS keeps yelling at you", series: "behind-the-error", excerpt: "It's not the server. It's not the browser. It's a 30-year-old compromise.", body: b(`CORS isn't hostile. It's a very old handshake trying to keep you safe.`), publishedAt: "2026-06-29" },
  { id: "p23", slug: "econnreset", title: "ECONNRESET: what your server is trying to tell you", series: "behind-the-error", excerpt: "Someone hung up. The question is who.", body: b(`Half the time it's a load balancer. The other half it's your keep-alive settings.`), publishedAt: "2026-06-08" },
  { id: "p24", slug: "hydration-mismatch", title: "\"Hydration mismatch\": a debugging playbook", series: "behind-the-error", excerpt: "Nine causes, ranked by how often we hit them in prod.", body: b(`A ranked list. If it's not #1, it's probably #2.`), publishedAt: "2026-05-18" },

  // Concept in 60
  { id: "p25", slug: "concept-debounce-throttle", title: "Debounce vs throttle in 60 seconds", series: "concept-in-60", excerpt: "One waits for the end. The other paces the middle.", body: b(`Debounce waits. Throttle paces. Sixty seconds, gone.`), publishedAt: "2026-07-06" },
  { id: "p26", slug: "concept-eventual-consistency", title: "Eventual consistency, in 60 seconds", series: "concept-in-60", excerpt: "It's not a bug. It's a promise with a delay.", body: b(`Your data will get there. Just not right now.`), publishedAt: "2026-06-25" },
  { id: "p27", slug: "concept-monad", title: "Monads in 60 seconds (we tried)", series: "concept-in-60", excerpt: "A value with a way of chaining. That's the vibe.", body: b(`You wrap a value. You get a nicer way to chain. That's most of it.`), publishedAt: "2026-06-02" },

  // Challenge of the Week
  { id: "p28", slug: "challenge-parser", title: "Challenge: write a mini expression parser", series: "challenge-of-the-week", excerpt: "One weekend. No libraries. Just tokens and a Pratt parser.", body: b(`Build \`eval("1 + 2 * (3 - 4)")\` from scratch. No regex tricks.`), publishedAt: "2026-07-01" },
  { id: "p29", slug: "challenge-rate-limiter", title: "Challenge: build a token-bucket rate limiter", series: "challenge-of-the-week", excerpt: "Fifty lines or less. Bonus: make it distributed.", body: b(`Token buckets. Fifty lines. Go.`), publishedAt: "2026-06-14" },
  { id: "p30", slug: "challenge-lru", title: "Challenge: implement an LRU cache with O(1) ops", series: "challenge-of-the-week", excerpt: "Doubly linked list + map. You know you want to.", body: b(`Every interview loves this one. Now you'll know why.`), publishedAt: "2026-05-20" },

  // Collab Corner
  { id: "p31", slug: "collab-openbookclub", title: "OpenBookClub is looking for a frontend contributor", series: "collab-corner", excerpt: "Student-run reading tracker. Next.js, Postgres, and a friendly issue tracker.", body: b(`If you want a low-stakes way to ship real PRs, this is it.`), publishedAt: "2026-06-26" },
  { id: "p32", slug: "collab-devschool-cli", title: "DevSchool CLI needs a plugin architect", series: "collab-corner", excerpt: "Node, TypeScript, and one very opinionated maintainer.", body: b(`A neat project, a real problem, and someone who'll actually review your PR.`), publishedAt: "2026-05-28" },
  { id: "p33", slug: "collab-a11y-audit", title: "Free a11y audits for student projects", series: "collab-corner", excerpt: "We'll audit five projects this month. Sign up.", body: b(`If your side project has never been screen-readered, now's the time.`), publishedAt: "2026-05-05" },

  // Code Roast
  { id: "p34", slug: "roast-500-line-usecallback", title: "Roast: the 500-line component with 12 useCallbacks", series: "code-roast", excerpt: "Every callback was memoized. None of them needed to be.", body: b(`We looked. We cried. We refactored.`), publishedAt: "2026-06-19" },
  { id: "p35", slug: "roast-any-type", title: "Roast: the codebase where every type is `any`", series: "code-roast", excerpt: "Technically TypeScript. Spiritually vibes.", body: b(`\`any\` isn't a type. It's a shrug.`), publishedAt: "2026-05-31" },
  { id: "p36", slug: "roast-god-controller", title: "Roast: the 2000-line controller that does everything", series: "code-roast", excerpt: "Auth, payments, image resizing, and a cron job. In one file.", body: b(`A tour of one heroic, tragic file.`), publishedAt: "2026-05-12" },

  // Rabbit Hole
  { id: "p37", slug: "rabbit-utf8", title: "Down the UTF-8 rabbit hole", series: "rabbit-hole", excerpt: "Why your emoji renders as boxes and what that has to do with 1993.", body: b(`This one gets weird. Bring snacks.`), publishedAt: "2026-06-15" },
  { id: "p38", slug: "rabbit-time-zones", title: "Time zones: a rabbit hole with no bottom", series: "rabbit-hole", excerpt: "The IANA database, half-hour offsets, and Samoa's missing day.", body: b(`Yes, Samoa really did skip December 30, 2011.`), publishedAt: "2026-05-22" },
  { id: "p39", slug: "rabbit-random", title: "How random is Math.random, actually?", series: "rabbit-hole", excerpt: "Spoiler: enough for games, not for tokens.", body: b(`A tour through PRNGs, CSPRNGs, and why crypto matters.`), publishedAt: "2026-04-28" },

  // Killed By Google
  { id: "p40", slug: "kbg-google-domains", title: "Remembering Google Domains", series: "killed-by-google", excerpt: "A retrospective on what it got right — and where the migration left people stuck.", body: b(`Google Domains was quietly great. Then it wasn't.`), publishedAt: "2026-06-21" },
  { id: "p41", slug: "kbg-stadia", title: "Stadia: the eulogy nobody wrote", series: "killed-by-google", excerpt: "The tech was real. The commitment was not.", body: b(`Streaming games worked. Google's attention span didn't.`), publishedAt: "2026-05-14" },
  { id: "p42", slug: "kbg-jamboard", title: "Jamboard is dead. Long live the whiteboard.", series: "killed-by-google", excerpt: "Every classroom that bought one has a story.", body: b(`RIP to a product that was, briefly, everywhere.`), publishedAt: "2026-04-10" },

  // Tech Debt Diaries
  { id: "p43", slug: "debt-shipping-in-jquery", title: "We're still shipping jQuery in 2026", series: "tech-debt-diaries", excerpt: "It works. It's fine. Please stop asking.", body: b(`A confession from a codebase that pays the bills.`), publishedAt: "2026-06-16" },
  { id: "p44", slug: "debt-untyped-api", title: "The untyped API that runs the business", series: "tech-debt-diaries", excerpt: "500 endpoints. Zero contracts. All the money.", body: b(`Sometimes technical debt is just gravity.`), publishedAt: "2026-05-29" },
  { id: "p45", slug: "debt-migration", title: "Six months into a migration that was supposed to take one", series: "tech-debt-diaries", excerpt: "The estimate was optimistic. The users were not.", body: b(`A field report from month six of one month.`), publishedAt: "2026-04-19" },

  // Hot Take
  { id: "p46", slug: "hot-typescript-strict", title: "TypeScript strict mode should be on by default", series: "hot-take", excerpt: "Every \"it slows me down\" argument falls apart at 10k lines.", body: b(`Turn it on. Turn it on now. Thank us at 10,000 lines.`), publishedAt: "2026-07-07" },
  { id: "p47", slug: "hot-css-in-js", title: "CSS-in-JS peaked in 2021 and that's fine", series: "hot-take", excerpt: "The trade-offs weren't worth it. Tailwind won for a reason.", body: b(`A eulogy, not a takedown.`), publishedAt: "2026-06-12" },
  { id: "p48", slug: "hot-microservices", title: "You didn't need microservices", series: "hot-take", excerpt: "You needed a monolith and a nap.", body: b(`Say it with us: a majestic monolith is fine.`), publishedAt: "2026-05-17" },

  // Ship It or Skip It
  { id: "p49", slug: "ship-bun-1-3", title: "Ship it or skip it: Bun 1.3", series: "ship-it-or-skip-it", excerpt: "Ship it — for CLIs and scripts. Skip for prod servers, still.", body: b(`Verdict: partial ship. Details inside.`), publishedAt: "2026-07-04" },
  { id: "p50", slug: "ship-htmx-2", title: "Ship it or skip it: HTMX 2", series: "ship-it-or-skip-it", excerpt: "Ship it if your app is really pages. Skip if it's really an app.", body: b(`Simple test: are you rendering pages or an application?`), publishedAt: "2026-06-23" },
  { id: "p51", slug: "ship-astro-db", title: "Ship it or skip it: Astro DB", series: "ship-it-or-skip-it", excerpt: "Cute API. Skip for anything you care about — yet.", body: b(`The DX is great. The lock-in is loud.`), publishedAt: "2026-06-01" },

  // The Interview
  { id: "p52", slug: "interview-first-junior-job", title: "The junior dev who negotiated 30% at their first offer", series: "the-interview", excerpt: "How they did it, what they wish they knew, and the awkward part.", body: b(`No, they didn't have five offers. They had one email and nerves.`), publishedAt: "2026-06-27" },
  { id: "p53", slug: "interview-bootcamp-to-staff", title: "Bootcamp to staff engineer in seven years", series: "the-interview", excerpt: "The unglamorous parts nobody puts on LinkedIn.", body: b(`Seven years, a lot of learning in public, and one very good manager.`), publishedAt: "2026-05-24" },
  { id: "p54", slug: "interview-quit-faang", title: "\"I quit FAANG and I'm happier now\"", series: "the-interview", excerpt: "The salary drop was smaller than expected. The joy jump wasn't.", body: b(`One person's story. Take what's useful.`), publishedAt: "2026-04-30" },
];

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);
export const postsBySeries = (seriesSlug: string) =>
  POSTS.filter((p) => p.series === seriesSlug).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
export const allPostsSorted = () =>
  [...POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
