import { beforeEach, describe, it, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import type { Response } from "express";
import { authenticate, AuthRequest } from "./auth";
import { User } from "../models/User";

vi.mock("jsonwebtoken", () => ({
  default: { verify: vi.fn() },
}));

vi.mock("../models/User", () => ({
  User: { findById: vi.fn() },
}));

const verifyMock = vi.mocked(jwt.verify);
const findByIdMock = vi.mocked(User.findById);

function mockResponse() {
  const res = {} as Response;
  const status = vi.fn().mockReturnValue(res);
  const json = vi.fn().mockReturnValue(res);
  res.status = status as unknown as Response["status"];
  res.json = json as unknown as Response["json"];
  return res;
}

function mockRequest(headers: Record<string, string> = {}): Partial<AuthRequest> {
  return { headers };
}

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authenticate", () => {
  it("returns 401 when no Authorization header is present", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = vi.fn();

    authenticate(req as AuthRequest, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when the header does not use Bearer scheme", async () => {
    const req = mockRequest({ authorization: "Basic abc" });
    const res = mockResponse();
    const next = vi.fn();

    authenticate(req as AuthRequest, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when the token is invalid", async () => {
    verifyMock.mockImplementation(() => {
      throw new Error("invalid");
    });
    const req = mockRequest({ authorization: "Bearer not-a-token" });
    const res = mockResponse();
    const next = vi.fn();

    authenticate(req as AuthRequest, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when the token is valid but the user no longer exists", async () => {
    verifyMock.mockReturnValue({ userId: "u1" });
    findByIdMock.mockResolvedValue(null);
    const req = mockRequest({ authorization: "Bearer valid-token" });
    const res = mockResponse();
    const next = vi.fn();

    authenticate(req as AuthRequest, res, next);

    await flush();

    expect(findByIdMock).toHaveBeenCalledWith("u1");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches the user and calls next on a valid token", async () => {
    const fakeUser = { _id: "u1", name: "Test" } as unknown as Awaited<
      ReturnType<typeof User.findById>
    >;
    verifyMock.mockReturnValue({ userId: "u1" });
    findByIdMock.mockResolvedValue(fakeUser);
    const req = mockRequest({ authorization: "Bearer valid-token" });
    const res = mockResponse();
    const next = vi.fn();

    authenticate(req as AuthRequest, res, next);

    await flush();

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toBe(fakeUser);
    expect(res.status).not.toHaveBeenCalled();
  });
});
