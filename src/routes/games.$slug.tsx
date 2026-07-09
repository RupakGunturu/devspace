import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { gameBySlug } from "../data/games";
import { BugFinder } from "../components/games/BugFinder";
import { DevWordle } from "../components/games/DevWordle";
import { DevTrivia } from "../components/games/DevTrivia";

const REGISTRY: Record<string, () => JSX.Element> = {
  "bug-finder": BugFinder,
  "devwordle": DevWordle,
  "dev-trivia": DevTrivia,
};

export const Route = createFileRoute("/games/$slug")({
  loader: ({ params }) => {
    const game = gameBySlug(params.slug);
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Game not found — DevSpace" }, { name: "robots", content: "noindex" }] };
    }
    const g = loaderData.game;
    return {
      meta: [
        { title: `${g.name} — DevSpace` },
        { name: "description", content: g.description },
        { property: "og:title", content: `${g.name} — DevSpace` },
        { property: "og:description", content: g.description },
      ],
    };
  },
  component: GamePage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Game not found</h1>
      <Link to="/games" className="mt-6 inline-block font-mono text-sm text-yellow">← back to games</Link>
    </div>
  ),
});

function GamePage() {
  const { game } = Route.useLoaderData();
  const Component = REGISTRY[game.slug];
  return (
    <section className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
      <Link to="/games" className="font-mono text-xs text-muted no-underline hover:text-yellow">
        ← all games
      </Link>
      <div className="mt-6 mb-8">
        <div className="text-4xl">{game.icon}</div>
        <h1 className="mt-3 font-display text-4xl font-extrabold">{game.name}</h1>
        <p className="mt-2 text-muted">{game.description}</p>
      </div>
      <div className="rounded-md border-2 border-line bg-paper p-6 text-ink">
        {Component ? <Component /> : <div className="text-muted">Coming soon.</div>}
      </div>
    </section>
  );
}
