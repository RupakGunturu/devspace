import { useEffect } from "react";
import { SectionHead, StickerCard } from "../components/site";
import { GAMES } from "../data/games";

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
          <StickerCard
            key={g.slug}
            icon={g.icon}
            title={g.name}
            index={i}
            to={`/games/${g.slug}`}
          >
            {g.tagline}
          </StickerCard>
        ))}
      </div>
    </section>
  );
}
