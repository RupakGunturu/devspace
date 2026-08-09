import type { ActivityData } from "./api";

const STORAGE_KEY = "ds_activity";

function empty(): ActivityData {
  return {
    gameScores: [],
    toolUsage: [],
    savedTips: [],
    favorites: [],
    recentlyUsed: [],
  };
}

function load(): ActivityData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw);
    return { ...empty(), ...parsed };
  } catch {
    return empty();
  }
}

function save(data: ActivityData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLocalActivity(): ActivityData {
  return load();
}

export function hasLocalActivity(): boolean {
  const data = load();
  return data.gameScores.length > 0 || data.toolUsage.length > 0;
}

export function saveLocalGameScore(
  gameSlug: string,
  score: number,
  streak: number,
  accuracy: number,
  rank: string,
): ActivityData {
  const data = load();
  data.gameScores.push({
    gameSlug,
    score,
    streak,
    accuracy,
    rank,
    playedAt: new Date().toISOString(),
  });

  // Keep only the newest 50 scores per game
  const gameSlugCount = data.gameScores.reduce(
    (count, s) => (s.gameSlug === gameSlug ? count + 1 : count),
    0,
  );
  if (gameSlugCount > 50) {
    const excess = gameSlugCount - 50;
    let removed = 0;
    data.gameScores = data.gameScores.filter((s) => {
      if (s.gameSlug === gameSlug && removed < excess) {
        removed++;
        return false;
      }
      return true;
    });
  }

  save(data);
  return data;
}

export function logLocalToolUse(toolSlug: string): ActivityData {
  const data = load();
  data.toolUsage.unshift({ toolSlug, usedAt: new Date().toISOString() });

  if (data.toolUsage.length > 100) {
    data.toolUsage = data.toolUsage.slice(0, 100);
  }

  data.recentlyUsed = data.recentlyUsed.filter((r) => !(r.type === "tool" && r.slug === toolSlug));
  data.recentlyUsed.unshift({ type: "tool", slug: toolSlug, usedAt: new Date().toISOString() });
  if (data.recentlyUsed.length > 20) {
    data.recentlyUsed = data.recentlyUsed.slice(0, 20);
  }

  save(data);
  return data;
}

export function clearLocalActivity() {
  localStorage.removeItem(STORAGE_KEY);
}
