import { useEffect } from "react";
import { SectionHead, StickerCard } from "../components/site";
import { GAMES } from "../data/games";
import { CursorHover } from "../components/core/cursor-hover";

const GAME_COLORS: Record<string, string> = {
  "bug-finder": "#ef4444",
  "devwordle": "#3b82f6",
  "dev-trivia": "#8b5cf6",
};

export default function GamesIndex() {
  useEffect(() => {
    document.title = "Games — DevSpace";
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
      <SectionHead idx="02" title="All Games" />
      <p className="mb-10 max-w-xl text-sm text-muted">
        Five minutes, no signup, no leaderboard drama. Just you and the game.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {GAMES.map((g, i) => (
          <CursorHover label={g.name} color={GAME_COLORS[g.slug]} key={g.slug}>
            <StickerCard
              icon={g.icon}
              title={g.name}
              index={i}
              to={`/games/${g.slug}`}
            >
              {g.tagline}
            </StickerCard>
          </CursorHover>
        ))}
      </div>
    </section>
  );
}
