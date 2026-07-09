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
  { slug: "dev-trivia", name: "Dev Trivia", icon: "🧠", tagline: "Rapid-fire questions across stacks.", description: "Fifteen questions, four choices each, one final score. No pressure." },
];

export const gameBySlug = (slug: string) => GAMES.find((g) => g.slug === slug);
