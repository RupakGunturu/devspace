import { createFileRoute } from "@tanstack/react-router";
import { SectionHead, StickerCard } from "../components/site";
import { GAMES } from "../data/games";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Games — DevSpace" },
      { name: "description", content: "Short, single-session games that teach dev concepts." },
      { property: "og:title", content: "Games — DevSpace" },
      { property: "og:description", content: "Bug Finder, DevWordle, Dev Trivia. Playable in a browser." },
    ],
  }),
  component: GamesIndex,
});

function GamesIndex() {
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
            to="/games/$slug"
            params={{ slug: g.slug }}
          >
            {g.tagline}
          </StickerCard>
        ))}
      </div>
    </section>
  );
}
