import { beforeEach, describe, it, expect, vi } from "vitest";
import {
  getLocalActivity,
  hasLocalActivity,
  saveLocalGameScore,
  logLocalToolUse,
  clearLocalActivity,
} from "./localActivity";

beforeEach(() => {
  localStorage.clear();
  vi.useRealTimers();
});

describe("getLocalActivity", () => {
  it("returns an empty activity structure when nothing is stored", () => {
    expect(getLocalActivity()).toEqual({
      gameScores: [],
      toolUsage: [],
      savedTips: [],
      favorites: [],
      recentlyUsed: [],
    });
  });

  it("returns stored data", () => {
    const stored = {
      gameScores: [
        {
          gameSlug: "g",
          score: 5,
          streak: 1,
          accuracy: 80,
          rank: "A",
          playedAt: "2024-01-01T00:00:00.000Z",
        },
      ],
    };
    localStorage.setItem("ds_activity", JSON.stringify(stored));

    expect(getLocalActivity().gameScores).toHaveLength(1);
  });

  it("fills missing keys from partial stored data", () => {
    localStorage.setItem(
      "ds_activity",
      JSON.stringify({ toolUsage: [{ toolSlug: "x", usedAt: "2024-01-01T00:00:00.000Z" }] }),
    );

    const data = getLocalActivity();
    expect(data.toolUsage).toHaveLength(1);
    expect(data.gameScores).toEqual([]);
    expect(data.favorites).toEqual([]);
    expect(data.savedTips).toEqual([]);
    expect(data.recentlyUsed).toEqual([]);
  });

  it("returns an empty structure when stored JSON is corrupted", () => {
    localStorage.setItem("ds_activity", "{not valid json");
    expect(getLocalActivity()).toEqual({
      gameScores: [],
      toolUsage: [],
      savedTips: [],
      favorites: [],
      recentlyUsed: [],
    });
  });
});

describe("hasLocalActivity", () => {
  it("is false when nothing is stored", () => {
    expect(hasLocalActivity()).toBe(false);
  });

  it("is true when game scores exist", () => {
    saveLocalGameScore("g", 10, 1, 50, "A");
    expect(hasLocalActivity()).toBe(true);
  });

  it("is true when tool usage exists", () => {
    logLocalToolUse("slug");
    expect(hasLocalActivity()).toBe(true);
  });

  it("is false when only favorites exist", () => {
    localStorage.setItem(
      "ds_activity",
      JSON.stringify({ favorites: [{ type: "tool", slug: "x" }] }),
    );
    expect(hasLocalActivity()).toBe(false);
  });

  it("is false when only saved tips exist", () => {
    localStorage.setItem("ds_activity", JSON.stringify({ savedTips: [{ tipId: "tip-1" }] }));
    expect(hasLocalActivity()).toBe(false);
  });
});

describe("saveLocalGameScore", () => {
  it("adds a score with a playedAt timestamp", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-05-01T12:00:00.000Z"));

    const data = saveLocalGameScore("game-a", 120, 3, 90, "S");

    expect(data.gameScores).toHaveLength(1);
    expect(data.gameScores[0]).toMatchObject({
      gameSlug: "game-a",
      score: 120,
      streak: 3,
      accuracy: 90,
      rank: "S",
    });
    expect(data.gameScores[0].playedAt).toBe("2024-05-01T12:00:00.000Z");
  });

  it("caps scores at 50 per game", () => {
    for (let i = 1; i <= 55; i++) saveLocalGameScore("game-a", i, 0, 0, "");
    const data = getLocalActivity();
    expect(data.gameScores).toHaveLength(50);
    // Keeps the newest scores
    expect(data.gameScores[data.gameScores.length - 1].score).toBe(55);
  });

  it("keeps scores from different games independent", () => {
    for (let i = 1; i <= 55; i++) saveLocalGameScore("game-a", i, 0, 0, "");
    saveLocalGameScore("game-b", 7, 0, 0, "");

    const data = getLocalActivity();
    expect(data.gameScores).toHaveLength(51);
    expect(data.gameScores.filter((s) => s.gameSlug === "game-a")).toHaveLength(50);
    expect(data.gameScores.filter((s) => s.gameSlug === "game-b")).toHaveLength(1);
  });

  it("persists across calls", () => {
    saveLocalGameScore("g", 1, 0, 0, "");
    expect(getLocalActivity().gameScores).toHaveLength(1);
  });
});

describe("logLocalToolUse", () => {
  it("adds tool usage to the front of the list", () => {
    logLocalToolUse("a");
    logLocalToolUse("b");
    const data = getLocalActivity();
    expect(data.toolUsage.map((t) => t.toolSlug)).toEqual(["b", "a"]);
  });

  it("caps tool usage at 100", () => {
    for (let i = 1; i <= 105; i++) logLocalToolUse(`tool-${i}`);
    expect(getLocalActivity().toolUsage).toHaveLength(100);
  });

  it("updates recentlyUsed with the tool at the front", () => {
    logLocalToolUse("json");
    const data = getLocalActivity();
    expect(data.recentlyUsed[0]).toMatchObject({ type: "tool", slug: "json" });
  });

  it("dedupes recentlyUsed entries for the same tool", () => {
    logLocalToolUse("json");
    logLocalToolUse("yaml");
    logLocalToolUse("json");
    const data = getLocalActivity();
    expect(data.recentlyUsed).toHaveLength(2);
    expect(data.recentlyUsed.map((r) => r.slug)).toEqual(["json", "yaml"]);
  });

  it("caps recentlyUsed at 20", () => {
    for (let i = 1; i <= 25; i++) logLocalToolUse(`tool-${i}`);
    expect(getLocalActivity().recentlyUsed).toHaveLength(20);
  });
});

describe("clearLocalActivity", () => {
  it("removes stored activity", () => {
    saveLocalGameScore("g", 1, 0, 0, "");
    clearLocalActivity();
    expect(hasLocalActivity()).toBe(false);
  });
});
