import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePagination } from "./use-pagination";

const items = Array.from({ length: 25 }, (_, i) => i + 1);

describe("usePagination", () => {
  it("starts on page 1 with correct totals", () => {
    const { result } = renderHook(() => usePagination(items, 10));

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.total).toBe(25);
    expect(result.current.paginatedItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("navigates to the next page", () => {
    const { result } = renderHook(() => usePagination(items, 10));

    act(() => result.current.next());
    expect(result.current.page).toBe(2);
    expect(result.current.paginatedItems).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

    act(() => result.current.next());
    expect(result.current.page).toBe(3);
    expect(result.current.paginatedItems).toEqual([21, 22, 23, 24, 25]);
  });

  it("clamps next at the last page", () => {
    const { result } = renderHook(() => usePagination(items, 10));

    act(() => result.current.goTo(3));
    act(() => result.current.next());
    expect(result.current.page).toBe(3);
  });

  it("clamps prev at the first page", () => {
    const { result } = renderHook(() => usePagination(items, 10));

    act(() => result.current.prev());
    expect(result.current.page).toBe(1);
  });

  it("goTo clamps out-of-range pages", () => {
    const { result } = renderHook(() => usePagination(items, 10));

    act(() => result.current.goTo(99));
    expect(result.current.page).toBe(3);

    act(() => result.current.goTo(-5));
    expect(result.current.page).toBe(1);
  });

  it("handles empty item lists", () => {
    const { result } = renderHook(() => usePagination([], 10));

    expect(result.current.total).toBe(0);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.page).toBe(1);
    expect(result.current.paginatedItems).toEqual([]);
  });

  it("uses a single page when items fit", () => {
    const { result } = renderHook(() => usePagination([1, 2, 3], 10));

    expect(result.current.totalPages).toBe(1);
    act(() => result.current.next());
    expect(result.current.page).toBe(1);
  });

  it("honors a custom perPage", () => {
    const { result } = renderHook(() => usePagination(items, 5));

    expect(result.current.totalPages).toBe(5);
    expect(result.current.paginatedItems).toEqual([1, 2, 3, 4, 5]);
    act(() => result.current.goTo(5));
    expect(result.current.paginatedItems).toEqual([21, 22, 23, 24, 25]);
  });
});
