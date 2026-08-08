import { beforeEach, describe, it, expect, vi } from "vitest";

const { mockSend, mockResend } = vi.hoisted(() => {
  const mockSend = vi.fn();
  class mockResend {
    emails = { send: mockSend };
  }
  return { mockSend, mockResend };
});

vi.mock("resend", () => ({ Resend: mockResend }));

import { sendResetEmail, sendWelcomeEmail } from "./email";

beforeEach(() => {
  mockSend.mockReset();
});

describe("sendResetEmail", () => {
  it("sends a reset email containing the reset link token", async () => {
    await sendResetEmail("user@example.com", "abc123");

    expect(mockSend).toHaveBeenCalledTimes(1);
    const payload = mockSend.mock.calls[0][0];
    expect(payload.to).toBe("user@example.com");
    expect(payload.subject).toContain("Reset");
    expect(payload.html).toContain("/reset-password?token=abc123");
  });

  it("sends the email from the DevSpace onboarding address", async () => {
    await sendResetEmail("user@example.com", "abc123");

    const payload = mockSend.mock.calls[0][0];
    expect(payload.from).toContain("DevSpace");
  });
});

describe("sendWelcomeEmail", () => {
  it("sends a welcome email addressed to the new user", async () => {
    await sendWelcomeEmail("user@example.com", "Alice");

    expect(mockSend).toHaveBeenCalledTimes(1);
    const payload = mockSend.mock.calls[0][0];
    expect(payload.to).toBe("user@example.com");
    expect(payload.subject).toContain("Welcome");
    expect(payload.html).toContain("Alice");
  });
});
