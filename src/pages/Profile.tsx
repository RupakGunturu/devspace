import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { activityApi, type ActivityData, type Favorite } from "@/lib/api";
import { gameBySlug } from "@/data/games";
import { toast } from "@/components/ui/toaster";

function getFavoriteHref(f: Favorite): string {
  switch (f.type) {
    case "tool": return `/tools/${f.slug}`;
    case "tip": return "/tips";
    case "cheatsheet": return `/cheat-sheets/${f.slug}`;
    case "game": return `/games/${f.slug}`;
    case "stack-breakdown": return `/stack-breakdown/${f.slug}`;
    default: return "#";
  }
}

function getFavoriteLabel(f: Favorite): string {
  switch (f.type) {
    case "tool": return f.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    case "tip": return f.slug.toUpperCase();
    case "cheatsheet": return f.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    case "game": return gameBySlug(f.slug)?.name ?? f.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    case "stack-breakdown": return f.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    default: return f.slug;
  }
}

function getFavoriteIcon(type: string): string {
  switch (type) {
    case "tool": return "🛠️";
    case "tip": return "💡";
    case "cheatsheet": return "📋";
    case "game": return "🎮";
    case "stack-breakdown": return "🧱";
    default: return "🔖";
  }
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    activityApi
      .get()
      .then(setActivity)
      .catch(() => toast.danger("Failed to load activity"))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/");
  };

  // Aggregate game scores
  const gameStats: Record<string, { best: number; total: number; games: number; bestStreak: number }> = {};
  activity?.gameScores.forEach((s) => {
    if (!gameStats[s.gameSlug]) {
      gameStats[s.gameSlug] = { best: 0, total: 0, games: 0, bestStreak: 0 };
    }
    const g = gameStats[s.gameSlug];
    g.total += s.score;
    g.games++;
    if (s.score > g.best) g.best = s.score;
    if (s.streak > g.bestStreak) g.bestStreak = s.streak;
  });

  const totalGames = activity?.gameScores.length ?? 0;
  const totalScore = activity?.gameScores.reduce((a, s) => a + s.score, 0) ?? 0;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
      {/* Header */}
      <div className="mb-10 flex items-center gap-5">
        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-green/10 font-display text-2xl font-bold text-green">
          {user.avatar ? (
            <>
              <img
                src={user.avatar}
                alt=""
                className="absolute inset-0 h-full w-full rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <span className="hidden">{user.name.charAt(0).toUpperCase()}</span>
            </>
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted">{user.email}</p>
          <p className="mt-0.5 text-xs text-muted">
            Signed in with {user.provider === "google" ? "Google" : "Email"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-md border-[1.5px] border-line px-4 py-2 text-xs font-semibold text-muted transition-all hover:border-coral hover:text-coral"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-muted">Loading your activity...</div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { val: String(totalGames), lbl: "Games Played" },
              { val: String(totalScore), lbl: "Total Score" },
              { val: String(activity?.favorites.length ?? 0), lbl: "Bookmarks" },
            ].map((s) => (
              <div
                key={s.lbl}
                className="rounded-md border border-line bg-paper p-4 text-center"
              >
                <div className="text-[10px] uppercase tracking-wider text-muted">{s.lbl}</div>
                <div className="mt-1 font-mono text-xl font-bold text-foreground">{s.val}</div>
              </div>
            ))}
          </div>

          {/* Game Stats */}
          {Object.keys(gameStats).length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 font-display text-lg font-bold">Game Stats</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(gameStats).map(([slug, stats]) => {
                  const game = gameBySlug(slug);
                  return (
                    <Link
                      key={slug}
                      to={`/games/${slug}`}
                      className="rounded-md border border-line bg-paper p-4 no-underline transition-all hover:border-green"
                    >
                      <div className="mb-2 font-display text-sm font-bold text-foreground">
                        {game?.name ?? slug}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-[9px] uppercase text-muted">Best</div>
                          <div className="font-mono text-xs font-bold text-green">{stats.best}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase text-muted">Played</div>
                          <div className="font-mono text-xs font-bold text-foreground">{stats.games}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase text-muted">Streak</div>
                          <div className="font-mono text-xs font-bold text-[var(--yellow)]">
                            {stats.bestStreak}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Favorites */}
          {activity && activity.favorites.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 font-display text-lg font-bold">Bookmarks</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {activity.favorites.map((f) => {
                  const href = getFavoriteHref(f);
                  const label = getFavoriteLabel(f);
                  const icon = getFavoriteIcon(f.type);
                  return (
                    <Link
                      key={`${f.type}-${f.slug}`}
                      to={href}
                      className="flex items-center gap-3 rounded-md border border-line bg-paper px-4 py-3 no-underline transition-all hover:border-yellow"
                    >
                      <span className="text-base">{icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-foreground">{label}</div>
                        <div className="text-[10px] uppercase tracking-wider text-muted">{f.type}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Recently Used */}
          {activity && activity.recentlyUsed.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 font-display text-lg font-bold">Recently Used</h2>
              <div className="flex flex-col gap-2">
                {activity.recentlyUsed.slice(0, 10).map((r, i) => (
                  <div
                    key={`${r.type}-${r.slug}-${i}`}
                    className="flex items-center justify-between rounded-md border border-line bg-paper px-4 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted">{r.type}</span>
                      <span className="text-sm font-semibold text-foreground">{r.slug}</span>
                    </div>
                    <span className="text-[10px] text-muted">
                      {new Date(r.usedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {totalGames === 0 &&
            (activity?.favorites.length ?? 0) === 0 &&
            (activity?.recentlyUsed.length ?? 0) === 0 && (
              <div className="rounded-md border-2 border-dashed border-line py-16 text-center">
                <div className="mb-3 text-4xl">🎮</div>
                <h3 className="mb-1 font-display text-lg font-bold">No activity yet</h3>
                <p className="mb-4 text-sm text-muted">Play some games and explore tools to see your stats here.</p>
                <Link
                  to="/games"
                  className="inline-block rounded-md border-0 bg-green px-6 py-2.5 text-sm font-bold text-ink no-underline transition-all hover:opacity-85"
                >
                  Play a Game
                </Link>
              </div>
            )}
        </>
      )}
    </div>
  );
}
