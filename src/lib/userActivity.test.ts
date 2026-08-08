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
  toggleLocalFavorite: vi.fn(),
  isLocalFavorited: vi.fn(),
  toggleLocalSavedTip: vi.fn(),
  isLocalTipSaved: vi.fn(),
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

  it("reads from local storage when logged out", async () => {
    mockedLocal.getLocalActivity.mockReturnValueOnce(emptyActivity);

    await userActivity.get();

    expect(mockedLocal.getLocalActivity).toHaveBeenCalledTimes(1);
    expect(mockedApi.get).not.toHaveBeenCalled();
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
    expect(mockedLocal.toggleLocalFavorite).not.toHaveBeenCalled();
  });

  it("toggles locally when logged out", async () => {
    mockedLocal.toggleLocalFavorite.mockReturnValueOnce({ isFavorited: true, favorites: [] });

    await userActivity.toggleFavorite("tool", "slug");

    expect(mockedLocal.toggleLocalFavorite).toHaveBeenCalledWith("tool", "slug");
    expect(mockedApi.toggleFavorite).not.toHaveBeenCalled();
  });
});

describe("userActivity.isFavorited", () => {
  it("always reads locally", () => {
    mockedLocal.isLocalFavorited.mockReturnValueOnce(true);
    expect(userActivity.isFavorited("tool", "slug")).toBe(true);
  });
});

describe("userActivity.toggleSavedTip", () => {
  it("calls the backend when logged in", async () => {
    setLoggedIn(true);
    mockedApi.toggleSavedTip.mockResolvedValueOnce({ isSaved: true, savedTips: [] });

    await userActivity.toggleSavedTip("tip-1");

    expect(mockedApi.toggleSavedTip).toHaveBeenCalledWith("tip-1");
    expect(mockedLocal.toggleLocalSavedTip).not.toHaveBeenCalled();
  });

  it("toggles locally when logged out", async () => {
    mockedLocal.toggleLocalSavedTip.mockReturnValueOnce({ isSaved: true, savedTips: [] });

    await userActivity.toggleSavedTip("tip-1");

    expect(mockedLocal.toggleLocalSavedTip).toHaveBeenCalledWith("tip-1");
    expect(mockedApi.toggleSavedTip).not.toHaveBeenCalled();
  });
});

describe("userActivity.isTipSaved", () => {
  it("always reads locally", () => {
    mockedLocal.isLocalTipSaved.mockReturnValueOnce(true);
    expect(userActivity.isTipSaved("tip-1")).toBe(true);
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
