export type Series = {
  slug: string;
  label: string;
  icon: string;
  cadence: string;
  description: string;
};

export const SERIES: Series[] = [
  { slug: "changelog", label: "Changelog", icon: "📋", cadence: "Weekly", description: "What shipped this week across the tools you actually use." },
  { slug: "resource-drop", label: "Resource Drop", icon: "📦", cadence: "Weekly", description: "A curated bundle of links, docs, and cheat sheets." },
  { slug: "stack-breakdown", label: "Stack Breakdown", icon: "🧱", cadence: "Biweekly", description: "How real apps are wired, layer by layer." },
  { slug: "bug-of-the-week", label: "Bug of the Week", icon: "🐛", cadence: "Weekly", description: "One bug, one root cause, one fix — all in five minutes." },
  { slug: "framework-wars", label: "Framework Wars", icon: "⚔️", cadence: "Monthly", description: "Head-to-head on the frameworks you keep arguing about." },
  { slug: "github-gems", label: "GitHub Gems", icon: "💎", cadence: "Weekly", description: "Small, under-starred repos worth stealing patterns from." },
  { slug: "dev-vocabulary", label: "Dev Vocabulary", icon: "📖", cadence: "Weekly", description: "One term you keep nodding along to, actually explained." },
  { slug: "behind-the-error", label: "Behind the Error", icon: "🔍", cadence: "Biweekly", description: "The story behind that cryptic stack trace." },
  { slug: "concept-in-60", label: "Concept in 60 Seconds", icon: "⏱️", cadence: "Weekly", description: "A core idea, distilled. Read it on the bus." },
  { slug: "challenge-of-the-week", label: "Challenge of the Week", icon: "🏆", cadence: "Weekly", description: "A small prompt to sharpen a skill you keep dodging." },
  { slug: "collab-corner", label: "Collab Corner", icon: "🤝", cadence: "Monthly", description: "Student projects looking for hands and heads." },
  { slug: "code-roast", label: "Code Roast", icon: "🔥", cadence: "Biweekly", description: "We roast one snippet. Lovingly. Sort of." },
  { slug: "rabbit-hole", label: "The Rabbit Hole", icon: "🐇", cadence: "Monthly", description: "A long read that goes somewhere weird." },
  { slug: "killed-by-google", label: "Killed By Google", icon: "☠️", cadence: "Monthly", description: "Products that got sunset and what we lost." },
  { slug: "tech-debt-diaries", label: "Tech Debt Diaries", icon: "💸", cadence: "Biweekly", description: "Confessions from codebases that shipped anyway." },
  { slug: "hot-take", label: "Hot Take", icon: "🌶️", cadence: "Weekly", description: "An opinion strong enough to start a thread." },
  { slug: "ship-it-or-skip-it", label: "Ship It or Skip It", icon: "🚢", cadence: "Weekly", description: "Should you adopt this? A verdict in under 300 words." },
  { slug: "the-interview", label: "The Interview They Don't Show You", icon: "🎙️", cadence: "Monthly", description: "Devs talking about the parts nobody puts on LinkedIn." },
];

export const seriesBySlug = (slug: string) => SERIES.find((s) => s.slug === slug);
