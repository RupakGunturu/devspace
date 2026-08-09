import { beforeEach, describe, it, expect } from "vitest";
import { saveLastAccount, getLastAccount, clearLastAccount } from "./rememberAccount";

beforeEach(() => {
  localStorage.clear();
});

describe("rememberAccount", () => {
  it("returns null when nothing is stored", () => {
    expect(getLastAccount()).toBeNull();
  });

  it("round-trips a stored account", () => {
    saveLastAccount({
      name: "Ada",
      email: "ada@dev.space",
      avatar: "data:img",
      provider: "google",
    });

    expect(getLastAccount()).toEqual({
      name: "Ada",
      email: "ada@dev.space",
      avatar: "data:img",
      provider: "google",
    });
  });

  it("tolerates a missing avatar and provider", () => {
    saveLastAccount({ name: "Ada", email: "ada@dev.space" });

    expect(getLastAccount()).toEqual({
      name: "Ada",
      email: "ada@dev.space",
      avatar: undefined,
      provider: undefined,
    });
  });

  it("returns null for corrupted JSON", () => {
    localStorage.setItem("ds_last_user", "{not valid json");
    expect(getLastAccount()).toBeNull();
  });

  it("returns null for a malformed shape", () => {
    localStorage.setItem("ds_last_user", JSON.stringify({ name: "Ada" }));
    expect(getLastAccount()).toBeNull();
  });

  it("clears the stored account", () => {
    saveLastAccount({ name: "Ada", email: "ada@dev.space" });
    clearLastAccount();
    expect(getLastAccount()).toBeNull();
  });

  it("clears the stored account when saving null", () => {
    saveLastAccount({ name: "Ada", email: "ada@dev.space" });
    saveLastAccount(null);
    expect(getLastAccount()).toBeNull();
  });
});
