export type Post = {
  id: string;
  slug: string;
  title: string;
  series: string;
  excerpt: string;
  body: string;
  publishedAt: string;
};

const b = (s: string) => s.trim();

export const POSTS: Post[] = [
  // ── Changelog ──────────────────────────────────────────────
  {
    id: "p1",
    slug: "shipped-regex-tester",
    title: "Shipped: the Regex Tester tool",
    series: "changelog",
    excerpt: "Live match highlighting, common pattern presets, and zero backend calls.",
    body: b(`Added the Regex Tester this week — type a pattern, see matches highlighted live in your test string. Includes a preset dropdown for common patterns (email, URL, phone number) so you're not googling regex at 1am. Fully client-side, nothing leaves your browser.`),
    publishedAt: "2026-07-07",
  },
  {
    id: "p2",
    slug: "fixed-devwordle-guesses",
    title: "Fixed: DevWordle accepting invalid guesses",
    series: "changelog",
    excerpt: "A dictionary bug let \"asdfg\" count as a valid guess. Rookie mistake, now fixed.",
    body: b(`Someone (me) forgot to validate guesses against the word list before this week. If you were getting free wins by typing keyboard mash, sorry — that loophole's closed now.`),
    publishedAt: "2026-07-03",
  },
  {
    id: "p3",
    slug: "dark-only-theme",
    title: "New: dark-only theme locked in",
    series: "changelog",
    excerpt: "Skipped the light mode toggle on purpose — here's the reasoning.",
    body: b(`Decided against a light mode for launch. The whole visual identity — paper cards, ink background — is built around that contrast. Adding light mode would mean designing a second brand. Maybe later, not now.`),
    publishedAt: "2026-06-28",
  },

  // ── Resource Drop ──────────────────────────────────────────
  {
    id: "p4",
    slug: "three-cheatsheets",
    title: "3 cheatsheets I actually keep open while coding",
    series: "resource-drop",
    excerpt: "Git, regex, and HTTP status codes — bookmarked, not memorized.",
    body: b(`Stopped pretending I have git rebase memorized. These three references live in a pinned tab: a git command cheatsheet, a regex quick reference, and an HTTP status code table. Nobody memorizes this stuff, they just know where to look.`),
    publishedAt: "2026-07-05",
  },
  {
    id: "p5",
    slug: "free-api-list",
    title: "A free API list that doesn't require a credit card",
    series: "resource-drop",
    excerpt: "For practicing fetch requests without hitting a paywall on request #11.",
    body: b(`Found a public API directory that filters by \"no auth required\" — perfect for practicing fetch/axios calls in a portfolio project without signing up for six different dashboards.`),
    publishedAt: "2026-06-30",
  },
  {
    id: "p6",
    slug: "vscode-extension-pack",
    title: "The VS Code extension pack I install on every new laptop",
    series: "resource-drop",
    excerpt: "Five extensions, zero bloat, installed in under two minutes.",
    body: b(`After reinstalling my dev environment for the third time this year, here's the exact extension list I no longer question: an ESLint/Prettier combo, a git lens, a color highlighter, an icon theme, and a REST client. That's it.`),
    publishedAt: "2026-06-22",
  },

  // ── Stack Breakdown ────────────────────────────────────────
  {
    id: "p7",
    slug: "food-delivery-tracking",
    title: "How a food delivery app handles real-time order tracking",
    series: "stack-breakdown",
    excerpt: "WebSockets, not polling — and why that decision matters at scale.",
    body: b(`Order tracking that updates live isn't magic — it's a WebSocket connection between the driver's app and yours, with a fallback to polling if the socket drops. The interesting part is how they handle reconnection without losing your place in the queue.`),
    publishedAt: "2026-07-01",
  },
  {
    id: "p8",
    slug: "postgres-over-mongodb",
    title: "Why a small SaaS chose Postgres over MongoDB",
    series: "stack-breakdown",
    excerpt: "Relational data won out once the reporting requirements got real.",
    body: b(`Started on MongoDB for speed of prototyping, migrated to Postgres eight months in. The trigger was reporting — joins across users, subscriptions, and usage events got painful without a relational model. A good reminder that \"what's fastest to start with\" and \"what scales with your actual queries\" are different questions.`),
    publishedAt: "2026-06-18",
  },
  {
    id: "p9",
    slug: "sign-in-with-google-flow",
    title: "The auth flow behind \"Sign in with Google\" — traced end to end",
    series: "stack-breakdown",
    excerpt: "OAuth2, redirect URIs, and the token exchange nobody explains clearly.",
    body: b(`Traced what actually happens when you click \"Sign in with Google\": a redirect to Google's consent screen, an authorization code sent back to your app, then a server-side exchange for an access token. The part most tutorials skip is why that exchange has to happen server-side.`),
    publishedAt: "2026-06-08",
  },

  // ── Bug of the Week ────────────────────────────────────────
  {
    id: "p10",
    slug: "off-by-one-pagination",
    title: "The off-by-one error that broke pagination in prod",
    series: "bug-of-the-week",
    excerpt: "`page * limit` vs `(page - 1) * limit` — one character, one skipped row.",
    body: b(`Pagination was silently skipping the first item on every page after page 1. The culprit: an offset calculation using \`page * limit\` instead of \`(page - 1) * limit\`. One character difference, and it only showed up once real data had more than one page.`),
    publishedAt: "2026-07-04",
  },
  {
    id: "p11",
    slug: "useeffect-infinite-loop",
    title: "A useEffect with a missing dependency caused an infinite loop",
    series: "bug-of-the-week",
    excerpt: "React's dependency array isn't a suggestion — here's what happens when you ignore it.",
    body: b(`A \`useEffect\` was updating state that it also depended on, but the dependency array was empty. Worked fine locally with slow re-renders masking it, then melted the browser tab in production. The fix was one line; finding it took two hours.`),
    publishedAt: "2026-06-25",
  },
  {
    id: "p12",
    slug: "z-index-stacking-context",
    title: "CSS z-index war: why a modal kept appearing behind the nav",
    series: "bug-of-the-week",
    excerpt: "Stacking contexts are not just \"higher number wins.\"",
    body: b(`A modal with \`z-index: 9999\` was still rendering behind the header. Turns out a parent element had \`transform: translateZ(0)\` on it, which creates a new stacking context — so the modal's z-index was only being compared within that context, not globally. z-index math is relative, not absolute.`),
    publishedAt: "2026-06-11",
  },

  // ── Framework Wars ─────────────────────────────────────────
  {
    id: "p13",
    slug: "vite-vs-cra",
    title: "Vite vs Create React App — there's no debate left",
    series: "framework-wars",
    excerpt: "CRA is effectively unmaintained. Here's what that means for a new project today.",
    body: b(`If you're starting a React project in 2026, Vite isn't just faster — it's the actively maintained option. CRA's dev server cold-start times alone are enough to switch, but the real issue is the ecosystem has moved on and tutorials assuming CRA are increasingly stale.`),
    publishedAt: "2026-07-02",
  },
  {
    id: "p14",
    slug: "tailwind-vs-plain-css",
    title: "Tailwind vs plain CSS — the real cost isn't what people argue about",
    series: "framework-wars",
    excerpt: "It's not \"utility classes are ugly,\" it's onboarding speed for a team.",
    body: b(`The Tailwind debate usually gets stuck on aesthetics. The actual trade-off is onboarding: a new dev can style a component without learning your naming conventions or hunting through separate CSS files. That's worth more than \"cleaner HTML\" arguments in either direction.`),
    publishedAt: "2026-06-16",
  },
  {
    id: "p15",
    slug: "rest-vs-graphql",
    title: "REST vs GraphQL for a student project — just use REST",
    series: "framework-wars",
    excerpt: "GraphQL solves a scaling problem you probably don't have yet.",
    body: b(`GraphQL's pitch is avoiding over-fetching and under-fetching across many clients. A solo project with one frontend doesn't have that problem. REST is faster to reason about, easier to debug in the browser, and every tutorial assumes it. Save GraphQL for when you actually feel the pain it solves.`),
    publishedAt: "2026-05-28",
  },

  // ── GitHub Gems ────────────────────────────────────────────
  {
    id: "p16",
    slug: "200-star-cli-parser",
    title: "A 200-star CLI parser that handles edge cases most libraries miss",
    series: "github-gems",
    excerpt: "Small repo, exceptional test coverage, worth reading the source top to bottom.",
    body: b(`Found a command-line argument parser with under 300 stars but near-100% test coverage and genuinely readable source. Worth cloning just to see how they structured error messages for malformed flags — most larger libraries handle this worse.`),
    publishedAt: "2026-06-28",
  },
  {
    id: "p17",
    slug: "single-file-state-manager",
    title: "A single-file React state manager under 200 lines",
    series: "github-gems",
    excerpt: "No dependencies, fully typed, and a great read for understanding how state libraries work internally.",
    body: b(`This repo implements a Redux-like store in under 200 lines of TypeScript with zero dependencies. Reading it end to end taught me more about how state management actually works than any tutorial — it's small enough to hold the whole thing in your head.`),
    publishedAt: "2026-06-14",
  },
  {
    id: "p18",
    slug: "readme-generator",
    title: "A README generator that writes better docs than most humans",
    series: "github-gems",
    excerpt: "Analyzes your repo structure and package.json to draft a real README, not a template.",
    body: b(`Instead of a generic README template, this tool actually parses your \`package.json\`, scripts, and folder structure to draft sections that match your project. Not perfect out of the box, but a much better starting point than a blank file.`),
    publishedAt: "2026-05-30",
  },

  // ── Dev Vocabulary ─────────────────────────────────────────
  {
    id: "p19",
    slug: "idempotent-explained",
    title: "What \"idempotent\" actually means",
    series: "dev-vocabulary",
    excerpt: "Running it once or five times gives you the same result. That's it.",
    body: b(`An idempotent operation produces the same result no matter how many times you run it. \`PUT /user/5 {name: \"Alex\"}\` is idempotent — run it once or ten times, the user's name ends up \"Alex\" either way. \`POST /orders\` isn't — run it twice, you get two orders.`),
    publishedAt: "2026-07-03",
  },
  {
    id: "p20",
    slug: "race-condition",
    title: "What a \"race condition\" is, without the textbook definition",
    series: "dev-vocabulary",
    excerpt: "Two things happening at once, and the outcome depends on which one finishes first.",
    body: b(`A race condition happens when two operations depend on shared data and the result changes based on timing — which one finishes first. Classic example: two requests both read a bank balance of $100, both subtract $50, both write back $50 — instead of the balance correctly ending at $0.`),
    publishedAt: "2026-06-22",
  },
  {
    id: "p21",
    slug: "memoization",
    title: "\"Memoization\" isn't as scary as the word sounds",
    series: "dev-vocabulary",
    excerpt: "Caching a function's result so you don't recompute it for the same input.",
    body: b(`Memoization just means: if a function was already called with these exact arguments, return the saved answer instead of recalculating. React's \`useMemo\` does exactly this — skips expensive recalculation if the inputs haven't changed since last render.`),
    publishedAt: "2026-06-05",
  },

  // ── Behind the Error ───────────────────────────────────────
  {
    id: "p22",
    slug: "cannot-read-properties",
    title: "\"Cannot read properties of undefined\" — decoded",
    series: "behind-the-error",
    excerpt: "You're trying to access something on a value that doesn't exist yet.",
    body: b(`This error means you tried to do \`something.property\` where \`something\` was \`undefined\`. Usually it's data that hasn't loaded yet (an API response you're reading before the fetch resolves) or a typo in an object key. Check what's actually in that variable right before the failing line.`),
    publishedAt: "2026-06-29",
  },
  {
    id: "p23",
    slug: "cors-policy-explained",
    title: "\"CORS policy: No 'Access-Control-Allow-Origin'\" — what's really happening",
    series: "behind-the-error",
    excerpt: "It's not your code that's broken — it's the server's permission list.",
    body: b(`This error fires when your frontend (on one origin) requests data from a backend (on another origin) that hasn't explicitly allowed it. The fix lives on the server, not the client — you add your frontend's URL to the server's allowed origins. No amount of frontend code will fix a CORS error alone.`),
    publishedAt: "2026-06-12",
  },
  {
    id: "p24",
    slug: "maximum-call-stack",
    title: "\"Maximum call stack size exceeded\" — your function is calling itself forever",
    series: "behind-the-error",
    excerpt: "Usually a recursive function missing its base case.",
    body: b(`This means a function kept calling itself (directly or indirectly) until it ran out of stack space. Almost always a recursive function without a proper base case, or a base case that's never actually reached because of a logic error in how the input shrinks each call.`),
    publishedAt: "2026-05-25",
  },

  // ── Concept in 60 Seconds ──────────────────────────────────
  {
    id: "p25",
    slug: "big-o-in-a-paragraph",
    title: "Big O notation, in one paragraph",
    series: "concept-in-60-seconds",
    excerpt: "It describes how your code slows down as input grows — not exact speed.",
    body: b(`Big O describes how an algorithm's runtime grows as input size grows, not its exact speed. O(n) means double the input, roughly double the time. O(n²) means double the input, quadruple the time. It's about the shape of the slowdown, not the actual seconds on the clock.`),
    publishedAt: "2026-07-06",
  },
  {
    id: "p26",
    slug: "closure-in-a-paragraph",
    title: "What a closure is, in one paragraph",
    series: "concept-in-60-seconds",
    excerpt: "A function that remembers the variables around it, even after that scope is gone.",
    body: b(`A closure is a function that keeps access to variables from where it was created, even after that outer function has finished running. It's how a counter function can remember its count between calls without a global variable.`),
    publishedAt: "2026-06-24",
  },
  {
    id: "p27",
    slug: "hoisting-in-a-paragraph",
    title: "What \"hoisting\" means in JavaScript, in one paragraph",
    series: "concept-in-60-seconds",
    excerpt: "Declarations get moved to the top of their scope before your code actually runs.",
    body: b(`JavaScript processes variable and function declarations before executing code line by line — so a \`function\` declaration can be called before it appears in the file. \`var\` declarations get hoisted too, but only the declaration, not the value — which is why accessing a \`var\` before its line gives \`undefined\`, not an error.`),
    publishedAt: "2026-06-03",
  },

  // ── Challenge of the Week ──────────────────────────────────
  {
    id: "p28",
    slug: "reverse-linked-list",
    title: "Reverse a linked list — iterative and recursive",
    series: "challenge-of-the-week",
    excerpt: "Classic interview question. Post your solution in both styles.",
    body: b(`This week: reverse a singly linked list. Solve it iteratively first (three-pointer technique), then try it recursively. Drop your solution and Big O analysis — bonus points if you can do the iterative version in-place with O(1) space.`),
    publishedAt: "2026-07-01",
  },
  {
    id: "p29",
    slug: "debounce-from-scratch",
    title: "Build a debounce function from scratch",
    series: "challenge-of-the-week",
    excerpt: "No libraries. Just setTimeout and clearTimeout.",
    body: b(`Implement a debounce function without using Lodash or any library — just \`setTimeout\` and \`clearTimeout\`. Test it on a search input. This one shows up in frontend interviews more than people expect.`),
    publishedAt: "2026-06-15",
  },
  {
    id: "p30",
    slug: "find-missing-number",
    title: "Find the missing number in an array of 1 to N",
    series: "challenge-of-the-week",
    excerpt: "Three ways to solve it — sorting, hashing, and math. Which is fastest?",
    body: b(`Given an array containing numbers 1 to N with one missing, find it. Solve it three ways: sort and scan, use a hash set, and use the sum formula. Compare their time and space complexity — the \"best\" answer depends on what you're optimizing for.`),
    publishedAt: "2026-05-22",
  },

  // ── Collab Corner ──────────────────────────────────────────
  {
    id: "p31",
    slug: "hackathon-frontend-partner",
    title: "Looking for a frontend partner for a hackathon project",
    series: "collab-corner",
    excerpt: "Backend's covered — need someone comfortable with React and fast UI iteration.",
    body: b(`Have a backend mostly built for a weekend hackathon idea (event check-in app), need a frontend partner comfortable with React who can move fast on UI. Drop a comment if you're free this weekend.`),
    publishedAt: "2026-06-26",
  },
  {
    id: "p32",
    slug: "readers-first-pr-merged",
    title: "Shoutout: a reader's open-source contribution got merged",
    series: "collab-corner",
    excerpt: "First PR to a real project — a small docs fix that mattered.",
    body: b(`One of you submitted your first open-source PR this week — a documentation fix to a moderately popular npm package — and it got merged within a day. Small contribution, real milestone. That's exactly how the first one is supposed to go.`),
    publishedAt: "2026-05-29",
  },
  {
    id: "p33",
    slug: "system-design-study-group",
    title: "Study group forming for system design basics",
    series: "collab-corner",
    excerpt: "Weekly call, working through load balancing, caching, and database scaling together.",
    body: b(`A few readers are starting a weekly study group to work through system design fundamentals — load balancers, caching strategies, database scaling. Casual, no pressure, just people learning out loud together. Reach out if you want in.`),
    publishedAt: "2026-05-08",
  },

  // ── Code Roast ─────────────────────────────────────────────
  {
    id: "p34",
    slug: "47-line-if-else",
    title: "A 47-line if/else chain that could've been a switch statement",
    series: "code-roast",
    excerpt: "Every branch checking the same variable. We've all written this once.",
    body: b(`Found a 47-line chain of \`if/else if\` all checking the same \`status\` variable, that could've been a single switch statement or, honestly, an object lookup. Not shaming — everyone's written this exact thing before learning better patterns exist.`),
    publishedAt: "2026-06-19",
  },
  {
    id: "p35",
    slug: "vague-variable-names",
    title: "Variable names so vague the code needs a translator",
    series: "code-roast",
    excerpt: "`data2`, `temp3`, `thing`, `stuff2` — a greatest hits collection.",
    body: b(`A function with variables named \`data\`, \`data2\`, \`temp\`, \`temp2\`, and — the crown jewel — \`thing\`. Not mocking the person, just appreciating how universally relatable \"I'll name it properly later\" is.`),
    publishedAt: "2026-06-01",
  },
  {
    id: "p36",
    slug: "fifteen-nested-ternaries",
    title: "15 nested ternaries in a single return statement",
    series: "code-roast",
    excerpt: "Technically valid JavaScript. Emotionally, a war crime.",
    body: b(`Found a return statement with 15 nested ternary operators determining a single CSS class name. It runs. It works. Reading it requires a flowchart. A gentle reminder that \"it works\" and \"someone else can maintain this\" are different bars to clear.`),
    publishedAt: "2026-05-14",
  },

  // ── The Rabbit Hole ────────────────────────────────────────
  {
    id: "p37",
    slug: "null-vs-undefined",
    title: "Why does JavaScript have both `null` and `undefined`?",
    series: "the-rabbit-hole",
    excerpt: "A history lesson that starts in 1995 and ends with a design regret its creator has talked about publicly.",
    body: b(`\`undefined\` means a variable was declared but never assigned. \`null\` means a value was explicitly set to \"nothing.\" JavaScript's creator has said in interviews that having both was a mistake he'd fix given the chance — most languages just pick one. This is why \`typeof null === \"object\"\` is a famous, permanent bug that can never be fixed without breaking the web.`),
    publishedAt: "2026-06-20",
  },
  {
    id: "p38",
    slug: "autocomplete-prediction",
    title: "How does autocomplete actually predict your next word?",
    series: "the-rabbit-hole",
    excerpt: "From simple n-gram models to the transformer architecture your phone quietly runs.",
    body: b(`Early autocomplete used n-gram models — literally counting which words commonly followed other words in a dataset. Modern keyboard autocomplete increasingly uses small transformer models, similar in concept (not size) to the architecture behind large language models, running directly on your device.`),
    publishedAt: "2026-05-26",
  },
  {
    id: "p39",
    slug: "computer-clock-accuracy",
    title: "Why is your computer's clock never perfectly accurate?",
    series: "the-rabbit-hole",
    excerpt: "A rabbit hole into NTP, drift, and why \"just check the time\" is harder than it sounds.",
    body: b(`Computer clocks drift — quartz crystal oscillators aren't perfectly consistent, and small errors accumulate. That's why your system periodically syncs with NTP (Network Time Protocol) servers. This also explains why distributed systems can't just \"check the time\" to order events — clocks across machines are never perfectly in sync.`),
    publishedAt: "2026-05-02",
  },

  // ── Killed By Google ───────────────────────────────────────
  {
    id: "p40",
    slug: "remembering-google-domains",
    title: "Remembering Google Domains",
    series: "killed-by-google",
    excerpt: "A genuinely good domain registrar, shut down anyway.",
    body: b(`Google Domains had one of the cleanest registrar UIs around and was migrated to Squarespace in 2023. The lesson for developers: even a well-built, well-liked product isn't safe if it doesn't fit a company's core strategy. Worth remembering before building critical infrastructure on any single vendor.`),
    publishedAt: "2026-06-21",
  },
  {
    id: "p41",
    slug: "google-reader-rss",
    title: "Google Reader's shutdown, and why RSS never fully recovered",
    series: "killed-by-google",
    excerpt: "Killed in 2013, and the open web arguably still hasn't found a real replacement.",
    body: b(`Google Reader was the default way millions of people followed blogs via RSS. Its 2013 shutdown fragmented RSS reader users across smaller apps, and many sites simply stopped prioritizing RSS feeds afterward. A reminder that one company's product decision can quietly reshape an entire open standard's adoption.`),
    publishedAt: "2026-05-18",
  },
  {
    id: "p42",
    slug: "stadia-postmortem",
    title: "Google Stadia — what killed a cloud gaming platform with real technical merit",
    series: "killed-by-google",
    excerpt: "The tech worked. The business model and library didn't.",
    body: b(`Stadia's underlying streaming technology was genuinely well-reviewed — the failure was strategic, not technical: a thin game library, unclear pricing, and requiring people to abandon existing libraries on Steam or consoles. A case study in how solid engineering doesn't guarantee product-market fit.`),
    publishedAt: "2026-04-28",
  },

  // ── Tech Debt Diaries ──────────────────────────────────────
  {
    id: "p43",
    slug: "untangling-2000-line-component",
    title: "Untangling a 2,000-line component that did everything",
    series: "tech-debt-diaries",
    excerpt: "Fetching, form state, validation, and rendering — all in one file.",
    body: b(`Inherited a single React component handling API calls, form state, validation, and rendering for an entire dashboard — over 2,000 lines. Split it into a custom hook for data fetching, a separate validation module, and five smaller presentational components. Took three days; every future change to this feature is now measured in minutes, not hours.`),
    publishedAt: "2026-06-16",
  },
  {
    id: "p44",
    slug: "forty-nullable-columns",
    title: "The database table with 40 nullable columns",
    series: "tech-debt-diaries",
    excerpt: "Years of \"just add a column for this one feature\" finally caught up.",
    body: b(`Found a \`users\` table with 40 columns, most nullable, representing features that were added and later abandoned. Nobody knew which columns were still read anywhere in the codebase. The fix started with grepping the entire repo for each column name before touching the schema — tedious, but the only safe way to know what's actually dead.`),
    publishedAt: "2026-05-28",
  },
  {
    id: "p45",
    slug: "migrating-auth-library",
    title: "Migrating off a deprecated auth library, one route at a time",
    series: "tech-debt-diaries",
    excerpt: "Couldn't do a big-bang rewrite — had to run two systems in parallel for a month.",
    body: b(`A deprecated auth package needed replacing, but rewriting everything at once risked breaking login for every user. Instead, both auth systems ran side by side behind a feature flag, migrating routes one at a time and monitoring error rates before flipping the next one. Slower, but nobody got locked out.`),
    publishedAt: "2026-04-22",
  },

  // ── Hot Take ───────────────────────────────────────────────
  {
    id: "p46",
    slug: "typescript-strict-default",
    title: "TypeScript strict mode should be on by default",
    series: "hot-take",
    excerpt: "Every \"it slows me down\" argument falls apart at 10k lines of code.",
    body: b(`Turning off strict mode to move faster early on just means paying the type-safety cost later, at a worse exchange rate, once the codebase is bigger and the bugs are harder to trace back. Strict mode from day one feels slower for the first week and faster for every week after.`),
    publishedAt: "2026-07-07",
  },
  {
    id: "p47",
    slug: "teach-debugging-first",
    title: "Tutorials should teach debugging before they teach syntax",
    series: "hot-take",
    excerpt: "Nobody's first real skill should be copying code that already works.",
    body: b(`Most tutorials hand you working code and explain syntax. But the actual daily skill of being a developer is reading broken code and figuring out why. Teaching debugging — reading stack traces, using breakpoints, forming hypotheses — earlier would produce more confident beginners than another \"build a todo app\" walkthrough.`),
    publishedAt: "2026-06-12",
  },
  {
    id: "p48",
    slug: "leetcode-vs-real-project",
    title: "LeetCode streaks are a worse signal than one real project",
    series: "hot-take",
    excerpt: "300 days of easy problems teaches pattern matching, not building.",
    body: b(`A long LeetCode streak proves consistency, which matters — but a single deployed project with real users, real bugs, and real deployment headaches teaches things algorithm grinding never will: how systems fail, how requirements change, how to finish something. Both have value; only one gets talked about like it's the whole job.`),
    publishedAt: "2026-05-17",
  },

  // ── Ship It or Skip It ─────────────────────────────────────
  {
    id: "p49",
    slug: "bun-package-manager",
    title: "Bun as your package manager — ship it",
    series: "ship-it-or-skip-it",
    excerpt: "The install speed alone is worth the switch for most projects.",
    body: b(`Bun's install speed is a genuine, immediately noticeable upgrade over npm for most projects, and its compatibility with the existing Node ecosystem has matured enough that it's a low-risk swap for package management specifically, even if you're not ready to run your whole app on the Bun runtime yet.`),
    publishedAt: "2026-07-04",
  },
  {
    id: "p50",
    slug: "rewrite-new-framework",
    title: "Rewriting your app in a new framework because it's trending — skip it",
    series: "ship-it-or-skip-it",
    excerpt: "\"New\" isn't a business requirement. Ship the feature instead.",
    body: b(`A framework being new and exciting isn't a reason to rewrite a working app. Migration cost is real time not spent shipping features, and most \"the old framework is holding us back\" claims don't survive being written down as a specific, measurable problem.`),
    publishedAt: "2026-06-23",
  },
  {
    id: "p51",
    slug: "state-management-too-early",
    title: "Adding a state management library before you've felt the pain — skip it",
    series: "ship-it-or-skip-it",
    excerpt: "Prop drilling three levels deep isn't a crisis yet.",
    body: b(`Reaching for Redux or Zustand before your app's state complexity actually demands it adds a dependency, a mental model, and boilerplate for a problem you might not have. React's built-in state and context handle more than people assume — reach for a library once you've actually felt the specific pain it solves.`),
    publishedAt: "2026-06-01",
  },

  // ── The Interview They Don't Show You ──────────────────────
  {
    id: "p52",
    slug: "failed-four-interviews",
    title: "\"I failed four technical interviews before I understood why\"",
    series: "the-interview-they-dont-show-you",
    excerpt: "A conversation about what actually changed between the fourth rejection and the offer.",
    body: b(`Talked to a recent grad about four failed technical interviews in a row. The turning point wasn't more LeetCode — it was learning to narrate their thinking out loud instead of solving silently, since interviewers are evaluating the process, not just the final answer.`),
    publishedAt: "2026-06-27",
  },
  {
    id: "p53",
    slug: "first-job-wordpress",
    title: "\"My first job wasn't at a startup, it was fixing WordPress sites for $15/hour\"",
    series: "the-interview-they-dont-show-you",
    excerpt: "An honest conversation about the unglamorous first rung of a dev career.",
    body: b(`Not every first dev job is a shiny startup role. A conversation about starting out fixing WordPress plugin conflicts freelance, and how that unglamorous, low-paying work still taught real client communication and debugging skills that a polished bootcamp project never could.`),
    publishedAt: "2026-05-24",
  },
  {
    id: "p54",
    slug: "panicked-about-docker",
    title: "\"I got the job and then panicked because I didn't know Docker\"",
    series: "the-interview-they-dont-show-you",
    excerpt: "What it's actually like to learn a required skill after being hired, not before.",
    body: b(`A candid talk about getting hired despite gaps in the required stack, then spending the first two weeks quietly learning Docker fundamentals at night. A reminder that job postings list an idealized candidate, and most people who get hired are still learning parts of the stack on the job.`),
    publishedAt: "2026-04-30",
  },
];

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);
export const postsBySeries = (seriesSlug: string) =>
  POSTS.filter((p) => p.series === seriesSlug).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
export const allPostsSorted = () =>
  [...POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
