import { beforeEach, describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { userActivity } from "@/lib/userActivity";
import { useSaveGameScore } from "./useSaveGameScore";

vi.mock("@/lib/userActivity", () => ({
  userActivity: {
    saveGameScore: vi.fn(),
  },
}));

const mockedSave = vi.mocked(userActivity.saveGameScore);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useSaveGameScore", () => {
  it("exposes a save function and canSave flag", () => {
    const { result } = renderHook(() => useSaveGameScore());

    expect(result.current.canSave).toBe(true);
    expect(typeof result.current.save).toBe("function");
  });

  it("saves the game score with provided args and defaults", () => {
    mockedSave.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSaveGameScore());

    act(() => {
      result.current.save("game-a", 100, 4);
    });

    expect(mockedSave).toHaveBeenCalledTimes(1);
    expect(mockedSave).toHaveBeenCalledWith("game-a", 100, 4, 0, "");
  });

  it("passes through accuracy and rank", () => {
    mockedSave.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSaveGameScore());

    act(() => {
      result.current.save("game-a", 100, 4, 92, "S");
    });

    expect(mockedSave).toHaveBeenCalledWith("game-a", 100, 4, 92, "S");
  });

  it("only saves once even when called repeatedly", () => {
    mockedSave.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSaveGameScore());

    act(() => {
      result.current.save("game-a", 100, 4);
      result.current.save("game-a", 200, 8);
      result.current.save("game-b", 300, 2);
    });

    expect(mockedSave).toHaveBeenCalledTimes(1);
  });

  it("swallows backend failures so the caller is not thrown", async () => {
    mockedSave.mockRejectedValue(new Error("network"));
    const { result } = renderHook(() => useSaveGameScore());

    await act(async () => {
      result.current.save("game-a", 100, 4);
    });

    expect(mockedSave).toHaveBeenCalledTimes(1);
  });
});
