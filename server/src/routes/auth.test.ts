import { beforeAll, afterAll, beforeEach, describe, it, expect, vi } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import crypto from "crypto";
import app from "../app";
import { User } from "../models/User";

vi.mock("../utils/email", () => ({
  sendResetEmail: vi.fn().mockResolvedValue(undefined),
  sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
}));

let mongod: MongoMemoryServer;

async function clearCollections() {
  const db = mongoose.connection.db;
  if (!db) return;
  await Promise.all([
    db.collection("users").deleteMany({}),
    db.collection("activities").deleteMany({}),
  ]);
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({ instance: { launchTimeout: 30000 } });
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await clearCollections();
});

describe("GET /api/health", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("POST /api/auth/signup", () => {
  it("rejects requests missing required fields", async () => {
    const res = await request(app).post("/api/auth/signup").send({ email: "a@b.c" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Name, email, and password are required");
  });

  it("rejects short passwords", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ name: "A", email: "a@b.c", password: "12345" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Password must be at least 6 characters");
  });

  it("creates a user and returns a token", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ name: "Alice", email: "alice@example.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toMatchObject({
      name: "Alice",
      email: "alice@example.com",
      provider: "local",
    });
    expect(res.body.user.id).toBeDefined();
  });

  it("normalizes the email to lowercase", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ name: "Bob", email: "BoB@Example.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("bob@example.com");
  });

  it("rejects a duplicate email", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({ name: "Alice", email: "alice@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/auth/signup")
      .send({ name: "Alice2", email: "ALICE@example.com", password: "password123" });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Email already in use");
  });
});

describe("POST /api/auth/login", () => {
  it("rejects an unknown email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ghost@example.com", password: "password123" });

    expect(res.status).toBe(401);
  });

  it("rejects a wrong password", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({ name: "Alice", email: "alice@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "alice@example.com", password: "wrongpass" });

    expect(res.status).toBe(401);
  });

  it("returns a token for valid credentials", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({ name: "Alice", email: "alice@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "alice@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("alice@example.com");
  });
});

describe("GET /api/auth/me", () => {
  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("rejects an invalid token", async () => {
    const res = await request(app).get("/api/auth/me").set("Authorization", "Bearer not-a-token");
    expect(res.status).toBe(401);
  });

  it("returns the current user with a valid token", async () => {
    const signup = await request(app)
      .post("/api/auth/signup")
      .send({ name: "Alice", email: "alice@example.com", password: "password123" });
    const token = signup.body.token;

    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("alice@example.com");
  });
});

describe("PUT /api/auth/me", () => {
  it("rejects unauthenticated requests", async () => {
    const res = await request(app).put("/api/auth/me").send({ name: "New" });
    expect(res.status).toBe(401);
  });

  it("updates the user name", async () => {
    const signup = await request(app)
      .post("/api/auth/signup")
      .send({ name: "Alice", email: "alice@example.com", password: "password123" });
    const token = signup.body.token;

    const res = await request(app)
      .put("/api/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "  Alicia  " });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe("Alicia");
  });

  it("updates the avatar", async () => {
    const signup = await request(app)
      .post("/api/auth/signup")
      .send({ name: "Alice", email: "alice@example.com", password: "password123" });
    const token = signup.body.token;

    const res = await request(app)
      .put("/api/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ avatar: "https://example.com/avatar.png" });

    expect(res.status).toBe(200);
    expect(res.body.user.avatar).toBe("https://example.com/avatar.png");
  });
});

describe("POST /api/auth/forgot-password", () => {
  it("rejects requests without an email", async () => {
    const res = await request(app).post("/api/auth/forgot-password").send({});
    expect(res.status).toBe(400);
  });

  it("does not reveal whether an account exists", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "ghost@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("If an account exists, a reset email was sent");
  });

  it("returns the generic message for an existing account", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({ name: "Alice", email: "alice@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "alice@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("If an account exists, a reset email was sent");
  });
});

describe("POST /api/auth/reset-password", () => {
  it("rejects requests missing token or password", async () => {
    const res = await request(app).post("/api/auth/reset-password").send({ token: "x" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Token and password are required");
  });

  it("rejects short passwords", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: "x", password: "12345" });
    expect(res.status).toBe(400);
  });

  it("rejects an invalid or expired token", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: "not-real", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid or expired reset token");
  });

  it("resets the password and allows login with the new one", async () => {
    const token = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    await User.create({
      name: "Alice",
      email: "alice@example.com",
      passwordHash: "oldpassword",
      provider: "local",
      resetPasswordToken: hash,
      resetPasswordExpiry: new Date(Date.now() + 60 * 60 * 1000),
    });

    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token, password: "newpassword123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();

    const oldLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "alice@example.com", password: "oldpassword" });
    expect(oldLogin.status).toBe(401);

    const newLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "alice@example.com", password: "newpassword123" });
    expect(newLogin.status).toBe(200);
  });
});
