import { beforeEach, describe, it, expect, vi } from "vitest";
import { activityApi } from "./api";
import * as local from "./localActivity";
import { userActivity } from "./userActivity";

vi.mock("./api", () => ({
  activityApi: {
    get: vi.fn(),
    saveGameScore: vi.fn(),
    toggleFavorite: vi.fn(),
    toggleSavedTip: vi.fn(),
    logToolUse: vi.fn(),
  },
}));

vi.mock("./localActivity", () => ({
  getLocalActivity: vi.fn(),
  saveLocalGameScore: vi.fn(),
  logLocalToolUse: vi.fn(),
}));

const mockedApi = vi.mocked(activityApi);
const mockedLocal = vi.mocked(local);

function setLoggedIn(loggedIn: boolean) {
  if (loggedIn) localStorage.setItem("ds_token", "token");
  else localStorage.removeItem("ds_token");
}

const emptyActivity = {
  gameScores: [],
  toolUsage: [],
  savedTips: [],
  favorites: [],
  recentlyUsed: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  setLoggedIn(false);
});

describe("userActivity.get", () => {
  it("reads from the backend when logged in", async () => {
    setLoggedIn(true);
    mockedApi.get.mockResolvedValueOnce(emptyActivity);

    await userActivity.get();

    expect(mockedApi.get).toHaveBeenCalledTimes(1);
    expect(mockedLocal.getLocalActivity).not.toHaveBeenCalled();
  });

  it("reads local activity with empty bookmarks when logged out", async () => {
    const localData = {
      ...emptyActivity,
      favorites: [{ type: "tool" as const, slug: "json", addedAt: "2024-01-01T00:00:00.000Z" }],
      savedTips: [{ tipId: "tip-1", savedAt: "2024-01-01T00:00:00.000Z" }],
    };
    mockedLocal.getLocalActivity.mockReturnValueOnce(localData);

    const result = await userActivity.get();

    expect(mockedLocal.getLocalActivity).toHaveBeenCalledTimes(1);
    expect(mockedApi.get).not.toHaveBeenCalled();
    expect(result.favorites).toEqual([]);
    expect(result.savedTips).toEqual([]);
  });
});

describe("userActivity.saveGameScore", () => {
  it("calls the backend when logged in", async () => {
    setLoggedIn(true);
    mockedApi.saveGameScore.mockResolvedValueOnce({ activity: emptyActivity });

    await userActivity.saveGameScore("g", 10, 2, 50, "A");

    expect(mockedApi.saveGameScore).toHaveBeenCalledWith({
      gameSlug: "g",
      score: 10,
      streak: 2,
      accuracy: 50,
      rank: "A",
    });
    expect(mockedLocal.saveLocalGameScore).not.toHaveBeenCalled();
  });

  it("saves locally when logged out", async () => {
    await userActivity.saveGameScore("g", 10, 2, 50, "A");

    expect(mockedLocal.saveLocalGameScore).toHaveBeenCalledWith("g", 10, 2, 50, "A");
    expect(mockedApi.saveGameScore).not.toHaveBeenCalled();
  });
});

describe("userActivity.toggleFavorite", () => {
  it("calls the backend when logged in", async () => {
    setLoggedIn(true);
    mockedApi.toggleFavorite.mockResolvedValueOnce({ isFavorited: true, favorites: [] });

    await userActivity.toggleFavorite("tool", "slug");

    expect(mockedApi.toggleFavorite).toHaveBeenCalledWith("tool", "slug");
  });

  it("throws when logged out", async () => {
    await expect(userActivity.toggleFavorite("tool", "slug")).rejects.toThrow(
      "Please sign in to bookmark items",
    );
    expect(mockedApi.toggleFavorite).not.toHaveBeenCalled();
  });
});

describe("userActivity.toggleSavedTip", () => {
  it("calls the backend when logged in", async () => {
    setLoggedIn(true);
    mockedApi.toggleSavedTip.mockResolvedValueOnce({ isSaved: true, savedTips: [] });

    await userActivity.toggleSavedTip("tip-1");

    expect(mockedApi.toggleSavedTip).toHaveBeenCalledWith("tip-1");
  });

  it("throws when logged out", async () => {
    await expect(userActivity.toggleSavedTip("tip-1")).rejects.toThrow(
      "Please sign in to save tips",
    );
    expect(mockedApi.toggleSavedTip).not.toHaveBeenCalled();
  });
});

describe("userActivity.logToolUse", () => {
  it("calls the backend when logged in", async () => {
    setLoggedIn(true);
    mockedApi.logToolUse.mockResolvedValueOnce({ message: "Usage logged" });

    await userActivity.logToolUse("json");

    expect(mockedApi.logToolUse).toHaveBeenCalledWith("json");
    expect(mockedLocal.logLocalToolUse).not.toHaveBeenCalled();
  });

  it("logs locally when logged out", async () => {
    await userActivity.logToolUse("json");

    expect(mockedLocal.logLocalToolUse).toHaveBeenCalledWith("json");
    expect(mockedApi.logToolUse).not.toHaveBeenCalled();
  });
});
