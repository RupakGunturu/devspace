import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { gameBySlug } from "../data/games";
import { useAuth } from "../components/AuthProvider";
import { activityApi } from "../lib/api";
import { BugFinder } from "../components/games/BugFinder";
import { DevWordle } from "../components/games/DevWordle";
import { DevTrivia } from "../components/games/DevTrivia";
import { TechMemory } from "../components/games/TechMemory";
import { StackMatcher } from "../components/games/StackMatcher";
import { HttpRoulette } from "../components/games/HttpRoulette";
import { BinaryRace } from "../components/games/BinaryRace";
import { toast } from "@/components/ui/toaster";

const REGISTRY: Record<string, React.ComponentType> = {
  "bug-finder": BugFinder,
  devwordle: DevWordle,
  "dev-trivia": DevTrivia,
  "tech-memory": TechMemory,
  "stack-matcher": StackMatcher,
  "http-roulette": HttpRoulette,
  "binary-race": BinaryRace,
};

export default function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  const game = gameBySlug(slug!);
  const Component = game ? REGISTRY[game.slug] : undefined;
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    document.title = game ? `${game.name} — DevSpace` : "Game not found — DevSpace";
  }, [game]);

  useEffect(() => {
    if (!user || !game) return;
    activityApi
      .get()
      .then((data) => {
        setIsFav(data.favorites.some((f) => f.type === "game" && f.slug === game.slug));
      })
      .catch(() => {});
  }, [user, game]);

  const toggleFav = async () => {
    if (!user || !game) return;
    try {
      await activityApi.toggleFavorite("game", game.slug);
      setIsFav((f) => !f);
      toast.success(isFav ? "Removed from favorites" : "Added to favorites");
    } catch {
      toast.danger("Failed to update favorite");
    }
  };

  if (!game) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Game not found</h1>
        <Link to="/games" className="mt-6 inline-block font-mono text-sm text-yellow">
          ← back to games
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
      <Link to="/games" className="font-mono text-xs text-muted no-underline hover:text-yellow">
        ← all games
      </Link>
      <div className="mt-6 mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="text-4xl">{game.icon}</div>
          <h1 className="mt-3 font-display text-4xl font-extrabold">{game.name}</h1>
          <p className="mt-2 text-muted">{game.description}</p>
        </div>
        {user && (
          <button
            onClick={toggleFav}
            className={`mt-2 shrink-0 rounded-md border-[1.5px] px-3 py-1.5 text-xs font-semibold transition-all ${
              isFav
                ? "border-coral bg-coral/10 text-coral"
                : "border-line bg-paper-dim text-muted hover:border-yellow hover:text-yellow"
            }`}
          >
            {isFav ? "★ Saved" : "☆ Save"}
          </button>
        )}
      </div>
      <div className="rounded-md border-2 border-line bg-paper p-6 text-foreground">
        {Component ? <Component /> : <div className="text-muted">Coming soon.</div>}
      </div>
    </section>
  );
}
