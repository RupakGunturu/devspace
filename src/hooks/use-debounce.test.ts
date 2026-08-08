import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useDebounce from "./use-debounce";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebounce", () => {
  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("updates the value after the delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "first" },
    });

    rerender({ value: "second" });
    expect(result.current).toBe("first");

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("second");
  });

  it("does not update before the delay elapses", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "first" },
    });

    rerender({ value: "second" });
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("first");
  });

  it("debounces rapid successive updates", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "a" },
    });

    rerender({ value: "b" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: "c" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: "d" });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // 300ms total elapsed but the timer kept resetting — only the last value lands
    expect(result.current).toBe("a");
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("d");
  });

  it("works with a changing delay", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "a", delay: 100 },
    });

    rerender({ value: "b", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("b");
  });
});
