import { activityApi } from "./api";
import { hasLocalActivity, getLocalActivity, clearLocalActivity } from "./localActivity";

export async function mergeLocalActivityToBackend(): Promise<void> {
  if (!hasLocalActivity()) return;

  const local = getLocalActivity();

  try {
    const results = await Promise.allSettled([
      ...local.gameScores.map((score) =>
        activityApi.saveGameScore({
          gameSlug: score.gameSlug,
          score: score.score,
          streak: score.streak,
          accuracy: score.accuracy,
          rank: score.rank,
        }),
      ),
      ...local.favorites.map((fav) => activityApi.toggleFavorite(fav.type, fav.slug)),
      ...local.savedTips.map((tip) => activityApi.toggleSavedTip(tip.tipId)),
      ...local.toolUsage.map((tool) => activityApi.logToolUse(tool.toolSlug)),
    ]);

    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      console.warn(`Activity merge: ${failures.length}/${results.length} items failed to sync`);
    }

    clearLocalActivity();
  } catch {
    // Best-effort merge — don't block login if merge fails
  }
}
