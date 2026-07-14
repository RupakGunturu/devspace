import { useEffect } from "react";
import { Bug, LetterText, Brain, Layers, Building2, Globe, Binary } from "lucide-react";
import { SectionHead, StickerCard } from "../components/site";
import { GAMES } from "../data/games";
import { CursorHover } from "../components/core/cursor-hover";

const GAME_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "bug-finder": Bug,
  devwordle: LetterText,
  "dev-trivia": Brain,
  "tech-memory": Layers,
  "stack-matcher": Building2,
  "http-roulette": Globe,
  "binary-race": Binary,
};

const GAME_COLORS: Record<string, string> = {
  "bug-finder": "#ef4444",
  devwordle: "#3b82f6",
  "dev-trivia": "#8b5cf6",
  "tech-memory": "#f59e0b",
  "stack-matcher": "#10b981",
  "http-roulette": "#06b6d4",
  "binary-race": "#8b5cf6",
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
        {GAMES.map((g, i) => {
          const Icon = GAME_ICONS[g.slug];
          return (
            <CursorHover label={g.name} color={GAME_COLORS[g.slug]} key={g.slug}>
              <StickerCard
                icon={
                  Icon ? (
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ background: `${GAME_COLORS[g.slug]}18` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: GAME_COLORS[g.slug] }} />
                    </div>
                  ) : (
                    g.icon
                  )
                }
                title={g.name}
                index={i}
                to={`/games/${g.slug}`}
              >
                {g.tagline}
              </StickerCard>
            </CursorHover>
          );
        })}
      </div>
    </section>
  );
}
