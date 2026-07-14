export type Game = {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
};

export const GAMES: Game[] = [
  { slug: "bug-finder", name: "Bug Finder", icon: "🐛", tagline: "Spot the bug before the clock runs out.", description: "You get a snippet and 30 seconds. Click the line that's broken. Miss and lose points. Rack up a streak." },
  { slug: "devwordle", name: "DevWordle", icon: "🔤", tagline: "Guess the CS term in six tries.", description: "A five-letter dev word. Six guesses. Colored feedback. You know the drill." },
  { slug: "dev-trivia", name: "Dev Trivia", icon: "🧠", tagline: "Rapid-fire questions across stacks.", description: "Ten questions, four choices each, one final score. Difficulty selector, streak multiplier, speed bonus. See how you rank." },
  { slug: "tech-memory", name: "Tech Memory", icon: "🃏", tagline: "Match the logo to the name.", description: "Flip cards to find matching pairs — each tech logo has a name card. Remember positions, make fewer moves, finish faster. Three difficulty levels." },
  { slug: "stack-matcher", name: "Stack Matcher", icon: "🏢", tagline: "Match the company to the tech stack that actually powers it.", description: "Every app you use daily is built on a specific set of technologies. Some choices will surprise you. 12 companies, 25 seconds each, streak multiplier, and a ranking system." },
  { slug: "http-roulette", name: "HTTP Roulette", icon: "🎰", tagline: "A status code spins in. You pick what it means.", description: "An HTTP status code appears. Pick the correct definition from 4 options. The fakes are written to confuse you. Family color coding, streak multiplier, speed bonus." },
  { slug: "binary-race", name: "Binary Race", icon: "⚡", tagline: "Convert decimals to binary before time runs out.", description: "A decimal number appears. You type its binary equivalent. Accuracy and speed both count — build a streak for bonus multipliers. Gets harder: 4-bit → 6-bit → 8-bit." },
];

export const gameBySlug = (slug: string) => GAMES.find((g) => g.slug === slug);
