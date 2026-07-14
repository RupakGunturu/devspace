import { activityApi, type ActivityData, type Favorite, type SavedTip } from "./api";
import * as local from "./localActivity";

function isLoggedIn(): boolean {
  return !!localStorage.getItem("ds_token");
}

export const userActivity = {
  async get(): Promise<ActivityData> {
    if (isLoggedIn()) {
      return activityApi.get();
    }
    return local.getLocalActivity();
  },

  async saveGameScore(
    gameSlug: string,
    score: number,
    streak: number,
    accuracy: number,
    rank: string,
  ): Promise<void> {
    if (isLoggedIn()) {
      await activityApi.saveGameScore({ gameSlug, score, streak, accuracy, rank });
    } else {
      local.saveLocalGameScore(gameSlug, score, streak, accuracy, rank);
    }
  },

  async toggleFavorite(
    type: string,
    slug: string,
  ): Promise<{ isFavorited: boolean; favorites: Favorite[] }> {
    if (isLoggedIn()) {
      return activityApi.toggleFavorite(type, slug);
    }
    return local.toggleLocalFavorite(type, slug);
  },

  isFavorited(type: string, slug: string): boolean {
    if (isLoggedIn()) {
      return false;
    }
    return local.isLocalFavorited(type, slug);
  },

  async toggleSavedTip(
    tipId: string,
  ): Promise<{ isSaved: boolean; savedTips: SavedTip[] }> {
    if (isLoggedIn()) {
      return activityApi.toggleSavedTip(tipId);
    }
    return local.toggleLocalSavedTip(tipId);
  },

  isTipSaved(tipId: string): boolean {
    if (isLoggedIn()) {
      return false;
    }
    return local.isLocalTipSaved(tipId);
  },

  async logToolUse(toolSlug: string): Promise<void> {
    if (isLoggedIn()) {
      await activityApi.logToolUse(toolSlug);
    } else {
      local.logLocalToolUse(toolSlug);
    }
  },
};
