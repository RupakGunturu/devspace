import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins simple class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters falsy values", () => {
    expect(cn("a", undefined, null, false, "", "b")).toBe("a b");
  });

  it("accepts objects of class names", () => {
    expect(cn("a", { b: true, c: false })).toBe("a b");
  });

  it("accepts arrays of class names", () => {
    expect(cn(["a", "b"], ["c"])).toBe("a b c");
  });

  it("lets the last conflicting tailwind utility win", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("handles no arguments", () => {
    expect(cn()).toBe("");
  });
});
