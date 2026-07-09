
# DevSpace — Build Plan

## Stack note
Your spec says "React Router," but this project is on **TanStack Start** (file-based routing under `src/routes/`). I'll use TanStack Router with the same URL structure — no functional difference for you. Everything else (React, TS, Tailwind, shadcn, static mock data, no backend) matches.

## Design system (src/styles.css)
Wire the palette as semantic tokens in oklch (ink navy bg, paper card surface, yellow, coral, line, muted). Add font families via `<link>` in `__root.tsx` head (Bricolage Grotesque, Inter, JetBrains Mono) and register `--font-display`, `--font-sans`, `--font-mono` in `@theme`. Add global paper-grain overlay, hard-shadow "sticker" card utility, `-rotate` variants, dashed feed divider, marquee keyframes.

## Shared layout
- `src/routes/__root.tsx`: fonts, head metadata (title "DevSpace — weekly dev zine", description, og tags), sticky header (logo `dev/space`, nav: Feed/Tools/Games/About, rotated "ISSUE №047" stamp), footer, `<Outlet />`.
- `src/components/Marquee.tsx`: coral rotated infinite-scroll banner.
- `src/components/StickerCard.tsx`: paper card with per-index rotation + hover straighten + hard shadow.
- `src/components/FeedItem.tsx`: rotated circular badge, meta line, dashed bottom border.
- `src/components/SeriesFilter.tsx`: pill filter row.
- `src/components/SectionHead.tsx`: yellow circular index + display h2.

## Routes
```
src/routes/
  __root.tsx
  index.tsx                 -> Home: hero + tools preview + games preview + filterable feed
  tools.tsx                 -> full tools grid
  tools.$slug.tsx           -> individual tool (renders the tool component by slug)
  games.tsx                 -> full games grid
  games.$slug.tsx           -> individual game
  feed.$series.tsx          -> posts filtered to one series
  post.$slug.tsx            -> single post article
  about.tsx
```
Each leaf sets its own `head()` (title/description/og). No og:image (root omits it too).

## Mock data (`src/data/`)
- `series.ts` — all 18 series with `{ slug, label, icon, cadence, description }`.
- `posts.ts` — 3–4 posts per series (~55 posts) with realistic student-voice titles/excerpts, short markdown `body`, ISO `publishedAt`, placeholder `coverImage` (unsplash or emoji block).
- `tools.ts` — 6 tools `{ slug, name, icon, tagline, description }`.
- `games.ts` — 3 games `{ slug, name, icon, tagline, description }`.

## Tools (all client-side, in `src/components/tools/`)
1. **JSONFormatter** — textarea → `JSON.parse` → pretty print with error line/col.
2. **RegexTester** — pattern + flags + test string, highlight matches, list groups.
3. **ContrastChecker** — two color inputs, compute contrast ratio, show AA/AAA pass/fail for normal + large text.
4. **MarkdownPreviewer** — `marked` + `DOMPurify` (add via `bun add`), split-pane editor/preview.
5. **Base64UrlCodec** — tabs: Base64 encode/decode, URL encode/decode.
6. **UuidHashGenerator** — `crypto.randomUUID()` + SHA-1/256/512 via `crypto.subtle`, input text + copy buttons.

`tools.$slug.tsx` maps slug → component via a registry.

## Games (`src/components/games/`)
1. **BugFinder** — pool of ~8 snippets with a labeled buggy line index; render as clickable lines, 30s timer, score++.
2. **DevWordle** — 6-guess grid over a small dictionary of 5-letter dev terms (REACT, ASYNC, MERGE, BUILD…), keyboard + on-screen tiles, color feedback.
3. **DevTrivia** — 15-question MCQ pool, 4 choices, running score, next-question button, final result.
All state in `useState` only.

## Home (`index.tsx`)
- Hero: giant outlined "047" numeral, coral kicker, big display headline with yellow highlight span, subhead, two CTAs.
- Coral rotated marquee.
- Section 01 "Tools" — preview 3 sticker cards linking to `/tools`.
- Section 02 "Games" — preview 3 sticker cards linking to `/games`.
- Section 03 "This Week's Feed" — series filter pills (client `useState`) + full posts list sorted desc, each item linking to `/post/$slug`.

## Individual pages
- `/tools/$slug`, `/games/$slug`: paper-card frame, title, description, then the interactive component.
- `/feed/$series`: series header (icon, label, cadence) + FeedItem list scoped to that series.
- `/post/$slug`: back link, series badge + date, big display title, cover image, markdown body rendered with `marked`.
- `/about`: short zine-voice mission page.

## Dependencies to add
`bun add marked dompurify` (+ `@types/dompurify`). No other new deps — Tailwind, shadcn, TanStack Router already present.

## Out of scope (for this pass)
Persistence, auth, real CMS, sharing, comments, search. Everything renders from the static data files.

I'll build in this order: design tokens + fonts + root layout → shared components → home page → tools list + 6 tool components + tool detail → games list + 3 games + game detail → feed/post/about routes.
