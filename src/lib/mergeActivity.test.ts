import { beforeEach, describe, it, expect, vi } from "vitest";
import { activityApi } from "./api";
import { hasLocalActivity, getLocalActivity, clearLocalActivity } from "./localActivity";
import { mergeLocalActivityToBackend } from "./mergeActivity";

vi.mock("./api", () => ({
  activityApi: {
    saveGameScore: vi.fn(),
    toggleFavorite: vi.fn(),
    toggleSavedTip: vi.fn(),
    logToolUse: vi.fn(),
  },
}));

vi.mock("./localActivity", () => ({
  hasLocalActivity: vi.fn(),
  getLocalActivity: vi.fn(),
  clearLocalActivity: vi.fn(),
}));

const mockedApi = vi.mocked(activityApi);
const mockedHas = vi.mocked(hasLocalActivity);
const mockedGet = vi.mocked(getLocalActivity);
const mockedClear = vi.mocked(clearLocalActivity);

const localActivity = {
  gameScores: [
    {
      gameSlug: "g1",
      score: 10,
      streak: 1,
      accuracy: 50,
      rank: "A",
      playedAt: "2024-01-01T00:00:00.000Z",
    },
    {
      gameSlug: "g2",
      score: 20,
      streak: 2,
      accuracy: 60,
      rank: "B",
      playedAt: "2024-01-01T00:00:00.000Z",
    },
  ],
  favorites: [{ type: "tool" as const, slug: "json", addedAt: "2024-01-01T00:00:00.000Z" }],
  savedTips: [{ tipId: "tip-1", savedAt: "2024-01-01T00:00:00.000Z" }],
  toolUsage: [{ toolSlug: "yaml", usedAt: "2024-01-01T00:00:00.000Z" }],
  recentlyUsed: [],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("mergeLocalActivityToBackend", () => {
  it("does nothing when there is no local activity", async () => {
    mockedHas.mockReturnValue(false);

    await mergeLocalActivityToBackend();

    expect(mockedGet).not.toHaveBeenCalled();
    expect(mockedClear).not.toHaveBeenCalled();
    expect(mockedApi.saveGameScore).not.toHaveBeenCalled();
  });

  it("syncs every local item to the backend", async () => {
    mockedHas.mockReturnValue(true);
    mockedGet.mockReturnValue(localActivity);
    mockedApi.saveGameScore.mockResolvedValue({ activity: localActivity });
    mockedApi.toggleFavorite.mockResolvedValue({ isFavorited: true, favorites: [] });
    mockedApi.toggleSavedTip.mockResolvedValue({ isSaved: true, savedTips: [] });
    mockedApi.logToolUse.mockResolvedValue({ message: "Usage logged" });

    await mergeLocalActivityToBackend();

    expect(mockedApi.saveGameScore).toHaveBeenCalledTimes(2);
    expect(mockedApi.saveGameScore).toHaveBeenCalledWith({
      gameSlug: "g1",
      score: 10,
      streak: 1,
      accuracy: 50,
      rank: "A",
    });
    expect(mockedApi.toggleFavorite).toHaveBeenCalledWith("tool", "json");
    expect(mockedApi.toggleSavedTip).toHaveBeenCalledWith("tip-1");
    expect(mockedApi.logToolUse).toHaveBeenCalledWith("yaml");
    expect(mockedClear).toHaveBeenCalledTimes(1);
  });

  it("clears local activity even when some items fail to sync", async () => {
    mockedHas.mockReturnValue(true);
    mockedGet.mockReturnValue(localActivity);
    mockedApi.saveGameScore.mockRejectedValue(new Error("network"));
    mockedApi.toggleFavorite.mockResolvedValue({ isFavorited: true, favorites: [] });
    mockedApi.toggleSavedTip.mockResolvedValue({ isSaved: true, savedTips: [] });
    mockedApi.logToolUse.mockRejectedValue(new Error("network"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await mergeLocalActivityToBackend();

    expect(mockedClear).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("does not throw when the whole merge fails unexpectedly", async () => {
    mockedHas.mockReturnValue(true);
    mockedGet.mockImplementation(() => {
      throw new Error("boom");
    });

    await expect(mergeLocalActivityToBackend()).resolves.toBeUndefined();
    expect(mockedClear).not.toHaveBeenCalled();
  });
});
