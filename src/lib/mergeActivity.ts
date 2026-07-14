import { activityApi } from "./api";
import { hasLocalActivity, getLocalActivity, clearLocalActivity } from "./localActivity";

export async function mergeLocalActivityToBackend(): Promise<void> {
  if (!hasLocalActivity()) return;

  const local = getLocalActivity();

  try {
    for (const score of local.gameScores) {
      await activityApi.saveGameScore({
        gameSlug: score.gameSlug,
        score: score.score,
        streak: score.streak,
        accuracy: score.accuracy,
        rank: score.rank,
      });
    }

    for (const fav of local.favorites) {
      await activityApi.toggleFavorite(fav.type, fav.slug);
    }

    for (const tip of local.savedTips) {
      await activityApi.toggleSavedTip(tip.tipId);
    }

    for (const tool of local.toolUsage) {
      await activityApi.logToolUse(tool.toolSlug);
    }

    clearLocalActivity();
  } catch {
    // Best-effort merge — don't block login if merge fails
  }
}
