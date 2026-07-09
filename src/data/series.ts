export type Series = {
  slug: string;
  label: string;
  icon: string;
  cadence: string;
  description: string;
};

export const SERIES: Series[] = [
  { slug: "changelog", label: "Changelog", icon: "📋", cadence: "Weekly", description: "What actually shipped on DevSpace this week — new tools, games, fixes, and behind-the-scenes build notes." },
  { slug: "resource-drop", label: "Resource Drop", icon: "📦", cadence: "Weekly", description: "Curated tools, cheatsheets, and links worth bookmarking — no fluff, no top-100-resources listicles." },
  { slug: "stack-breakdown", label: "Stack Breakdown", icon: "🧱", cadence: "Bi-weekly", description: "A teardown of how a real product is built — the stack, the architecture decisions, and the trade-offs." },
  { slug: "bug-of-the-week", label: "Bug of the Week", icon: "🐛", cadence: "Weekly", description: "A real bug, the debugging process, and the fix — so you recognize it faster next time." },
  { slug: "framework-wars", label: "Framework Wars", icon: "⚔️", cadence: "Bi-weekly", description: "Head-to-head comparisons, opinionated but backed by real trade-offs — not 'it depends' cop-outs." },
  { slug: "github-gems", label: "GitHub Gems", icon: "💎", cadence: "Weekly", description: "Underrated repos worth studying — for the code quality, not just the stars." },
  { slug: "dev-vocabulary", label: "Dev Vocabulary", icon: "📖", cadence: "Weekly", description: "One piece of jargon, explained simply — no circular definitions, no assuming you already know three other terms." },
  { slug: "behind-the-error", label: "Behind the Error", icon: "🔍", cadence: "Weekly", description: "Deconstructing a common error message — what it actually means, and what usually causes it." },
  { slug: "concept-in-60-seconds", label: "Concept in 60 Seconds", icon: "⏱️", cadence: "Weekly", description: "A CS/dev concept explained fast — the version you read on a coffee break." },
  { slug: "challenge-of-the-week", label: "Challenge of the Week", icon: "🏆", cadence: "Weekly", description: "A coding challenge with a discussion thread for solutions — practice with accountability." },
  { slug: "collab-corner", label: "Collab Corner", icon: "🤝", cadence: "Weekly", description: "Community shoutouts, pairing requests, and looking-for-a-teammate posts." },
  { slug: "code-roast", label: "Code Roast", icon: "🔥", cadence: "Bi-weekly", description: "Funny, cringe-worthy code snippets — reactions, not real names or real repos." },
  { slug: "the-rabbit-hole", label: "The Rabbit Hole", icon: "🐇", cadence: "Monthly", description: "A deep-dive on a tangent — the kind of research binge that starts with one Stack Overflow answer." },
  { slug: "killed-by-google", label: "Killed By Google", icon: "☠️", cadence: "Monthly", description: "A retrospective on a discontinued product — what it got right, and what the shutdown taught developers." },
  { slug: "tech-debt-diaries", label: "Tech Debt Diaries", icon: "💸", cadence: "Bi-weekly", description: "Real stories of refactoring legacy code — the mess, the fix, and what caused the mess in the first place." },
  { slug: "hot-take", label: "Hot Take", icon: "🌶️", cadence: "Weekly", description: "An opinion piece, deliberately spicy — meant to start a discussion, not settle one." },
  { slug: "ship-it-or-skip-it", label: "Ship It or Skip It", icon: "🚢", cadence: "Bi-weekly", description: "A verdict on a new tool, library, or framework — worth adopting now, or wait and see." },
  { slug: "the-interview-they-dont-show-you", label: "The Interview They Don't Show You", icon: "🎙️", cadence: "Monthly", description: "Unfiltered conversations with developers — the parts polished interviews usually cut." },
];

export const seriesBySlug = (slug: string) => SERIES.find((s) => s.slug === slug);
