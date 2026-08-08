import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { authApi, activityApi } from "./api";

const BASE = "http://localhost:2000";

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as unknown as Response;
}

describe("api request layer", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts signup with JSON body and parses response", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        token: "abc",
        user: { id: "1", name: "A", email: "a@b.c", provider: "local" },
      }),
    );

    const res = await authApi.signup("A", "a@b.c", "secret123");

    expect(res.token).toBe("abc");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BASE}/api/auth/signup`);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ name: "A", email: "a@b.c", password: "secret123" });
    expect(init.headers["Content-Type"]).toBe("application/json");
  });

  it("attaches Authorization header when a token exists", async () => {
    localStorage.setItem("ds_token", "token-123");
    fetchMock.mockResolvedValueOnce(jsonResponse({ status: "ok" }));

    await activityApi.logToolUse("json");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers["Authorization"]).toBe("Bearer token-123");
  });

  it("sends no Authorization header when no token is stored", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ status: "ok" }));

    await activityApi.logToolUse("json");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers["Authorization"]).toBeUndefined();
  });

  it("throws the server error message on non-ok responses", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: "Email already in use" }, false, 409));

    await expect(authApi.signup("A", "a@b.c", "secret123")).rejects.toThrow("Email already in use");
  });

  it("throws a generic message when the server sends no error body", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}, false, 500));

    await expect(authApi.login("a@b.c", "secret123")).rejects.toThrow("Request failed");
  });

  it("throws a friendly error when the backend is unreachable", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(authApi.login("a@b.c", "secret123")).rejects.toThrow(
      "Backend server is not reachable. Please make sure the server is running.",
    );
  });

  it("activity api hits the correct endpoints and methods", async () => {
    const activity = {
      gameScores: [],
      toolUsage: [],
      savedTips: [],
      favorites: [],
      recentlyUsed: [],
    };
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ activity }))
      .mockResolvedValueOnce(jsonResponse({ message: "Usage logged" }))
      .mockResolvedValueOnce(jsonResponse({ isFavorited: true, favorites: [] }))
      .mockResolvedValueOnce(jsonResponse({ isSaved: true, savedTips: [] }))
      .mockResolvedValueOnce(jsonResponse({ favorites: [] }))
      .mockResolvedValueOnce(jsonResponse(activity));

    await activityApi.get();
    await activityApi.logToolUse("slug");
    await activityApi.toggleFavorite("tool", "slug");
    await activityApi.toggleSavedTip("tip-1");
    await activityApi.removeFavorite("tool", "slug");
    await activityApi.saveGameScore({
      gameSlug: "g",
      score: 10,
      streak: 1,
      accuracy: 50,
      rank: "B",
    });

    expect(fetchMock.mock.calls.map(([url, init]) => [url, init?.method ?? "GET"])).toEqual([
      [`${BASE}/api/activity`, "GET"],
      [`${BASE}/api/activity/tool-use`, "POST"],
      [`${BASE}/api/activity/favorite`, "POST"],
      [`${BASE}/api/activity/saved-tip`, "POST"],
      [`${BASE}/api/activity/favorite`, "DELETE"],
      [`${BASE}/api/activity/game-score`, "POST"],
    ]);
  });
});
