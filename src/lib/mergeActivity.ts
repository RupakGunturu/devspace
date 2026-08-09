import { activityApi } from "./api";
import { hasLocalActivity, getLocalActivity, clearLocalActivity } from "./localActivity";

export async function mergeLocalActivityToBackend(): Promise<void> {
  if (!hasLocalActivity()) return;

  try {
    const local = getLocalActivity();

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
