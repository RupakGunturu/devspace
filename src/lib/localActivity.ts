import type { ActivityData, GameScore, Favorite, SavedTip } from "./api";

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
  return (
    data.gameScores.length > 0 ||
    data.favorites.length > 0 ||
    data.savedTips.length > 0 ||
    data.toolUsage.length > 0
  );
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

  const gameCounts: Record<string, number> = {};
  data.gameScores = data.gameScores.filter((s) => {
    gameCounts[s.gameSlug] = (gameCounts[s.gameSlug] || 0) + 1;
    return gameCounts[s.gameSlug] <= 50;
  });

  save(data);
  return data;
}

export function toggleLocalFavorite(type: string, slug: string): { isFavorited: boolean; favorites: Favorite[] } {
  const data = load();
  const idx = data.favorites.findIndex((f) => f.type === type && f.slug === slug);

  let isFavorited: boolean;
  if (idx >= 0) {
    data.favorites.splice(idx, 1);
    isFavorited = false;
  } else {
    data.favorites.push({ type: type as Favorite["type"], slug, addedAt: new Date().toISOString() });
    isFavorited = true;
  }

  save(data);
  return { isFavorited, favorites: data.favorites };
}

export function isLocalFavorited(type: string, slug: string): boolean {
  return load().favorites.some((f) => f.type === type && f.slug === slug);
}

export function toggleLocalSavedTip(tipId: string): { isSaved: boolean; savedTips: SavedTip[] } {
  const data = load();
  const idx = data.savedTips.findIndex((s) => s.tipId === tipId);

  let isSaved: boolean;
  if (idx >= 0) {
    data.savedTips.splice(idx, 1);
    isSaved = false;
  } else {
    data.savedTips.push({ tipId, savedAt: new Date().toISOString() });
    isSaved = true;
  }

  save(data);
  return { isSaved, savedTips: data.savedTips };
}

export function isLocalTipSaved(tipId: string): boolean {
  return load().savedTips.some((s) => s.tipId === tipId);
}

export function logLocalToolUse(toolSlug: string): ActivityData {
  const data = load();
  data.toolUsage.unshift({ toolSlug, usedAt: new Date().toISOString() });

  if (data.toolUsage.length > 100) {
    data.toolUsage = data.toolUsage.slice(0, 100);
  }

  data.recentlyUsed = data.recentlyUsed.filter(
    (r) => !(r.type === "tool" && r.slug === toolSlug),
  );
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
