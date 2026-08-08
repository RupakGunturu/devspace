import { beforeAll, afterAll, beforeEach, describe, it, expect, vi } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import { config } from "../config/env";
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

async function createAuthedUser(email: string): Promise<string> {
  const user = await User.create({ name: "Test", email, provider: "local" });
  return jwt.sign({ userId: user._id.toString() }, config.jwtSecret, { expiresIn: "1d" });
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

function authed(token: string) {
  return { Authorization: `Bearer ${token}` };
}

describe("GET /api/activity", () => {
  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/api/activity");
    expect(res.status).toBe(401);
  });

  it("returns an empty activity for a new user", async () => {
    const token = await createAuthedUser("user@example.com");

    const res = await request(app).get("/api/activity").set(authed(token));

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      gameScores: [],
      toolUsage: [],
      savedTips: [],
      favorites: [],
      recentlyUsed: [],
    });
  });

  it("returns the same activity document for repeated reads", async () => {
    const token = await createAuthedUser("user@example.com");

    await request(app).get("/api/activity").set(authed(token));
    const res = await request(app).get("/api/activity").set(authed(token));

    expect(res.status).toBe(200);
    expect(res.body.gameScores).toEqual([]);
  });
});

describe("POST /api/activity/game-score", () => {
  it("rejects requests missing gameSlug", async () => {
    const token = await createAuthedUser("user@example.com");

    const res = await request(app)
      .post("/api/activity/game-score")
      .set(authed(token))
      .send({ score: 100 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("gameSlug and score are required");
  });

  it("rejects requests missing score", async () => {
    const token = await createAuthedUser("user@example.com");

    const res = await request(app)
      .post("/api/activity/game-score")
      .set(authed(token))
      .send({ gameSlug: "game-a" });

    expect(res.status).toBe(400);
  });

  it("saves a game score with defaults for optional fields", async () => {
    const token = await createAuthedUser("user@example.com");

    const res = await request(app)
      .post("/api/activity/game-score")
      .set(authed(token))
      .send({ gameSlug: "game-a", score: 120 });

    expect(res.status).toBe(200);
    expect(res.body.activity.gameScores).toHaveLength(1);
    expect(res.body.activity.gameScores[0]).toMatchObject({
      gameSlug: "game-a",
      score: 120,
      streak: 0,
      accuracy: 0,
      rank: "",
    });
  });

  it("keeps only the newest 50 scores per game", async () => {
    const token = await createAuthedUser("user@example.com");

    for (let i = 1; i <= 55; i++) {
      await request(app)
        .post("/api/activity/game-score")
        .set(authed(token))
        .send({ gameSlug: "game-a", score: i, streak: i, accuracy: 50, rank: "A" });
    }

    const res = await request(app).get("/api/activity").set(authed(token));

    expect(res.body.gameScores).toHaveLength(50);
    const scores = res.body.gameScores.map((s: { score: number }) => s.score);
    expect(scores).toContain(55);
    expect(scores).toContain(6);
    expect(scores).not.toContain(5);
  });

  it("does not mix scores across games", async () => {
    const token = await createAuthedUser("user@example.com");

    for (let i = 1; i <= 55; i++) {
      await request(app)
        .post("/api/activity/game-score")
        .set(authed(token))
        .send({ gameSlug: "game-a", score: i, streak: 0, accuracy: 0, rank: "" });
    }
    await request(app)
      .post("/api/activity/game-score")
      .set(authed(token))
      .send({ gameSlug: "game-b", score: 7, streak: 0, accuracy: 0, rank: "" });

    const res = await request(app).get("/api/activity").set(authed(token));

    expect(res.body.gameScores).toHaveLength(51);
    expect(
      res.body.gameScores.filter((s: { gameSlug: string }) => s.gameSlug === "game-a"),
    ).toHaveLength(50);
  });
});

describe("POST /api/activity/tool-use", () => {
  it("rejects requests missing toolSlug", async () => {
    const token = await createAuthedUser("user@example.com");

    const res = await request(app).post("/api/activity/tool-use").set(authed(token)).send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("toolSlug is required");
  });

  it("logs tool usage and updates recently used", async () => {
    const token = await createAuthedUser("user@example.com");

    await request(app).post("/api/activity/tool-use").set(authed(token)).send({ toolSlug: "json" });

    const res = await request(app).get("/api/activity").set(authed(token));

    expect(res.body.toolUsage).toHaveLength(1);
    expect(res.body.toolUsage[0].toolSlug).toBe("json");
    expect(res.body.recentlyUsed[0]).toMatchObject({ type: "tool", slug: "json" });
  });

  it("caps tool usage at 100 and recently used at 20", async () => {
    const token = await createAuthedUser("user@example.com");

    for (let i = 1; i <= 105; i++) {
      await request(app)
        .post("/api/activity/tool-use")
        .set(authed(token))
        .send({ toolSlug: `tool-${i}` });
    }

    const res = await request(app).get("/api/activity").set(authed(token));

    expect(res.body.toolUsage).toHaveLength(100);
    expect(res.body.recentlyUsed).toHaveLength(20);
  });

  it("dedupes recently used entries for the same tool", async () => {
    const token = await createAuthedUser("user@example.com");

    for (const slug of ["json", "yaml", "json"]) {
      await request(app).post("/api/activity/tool-use").set(authed(token)).send({ toolSlug: slug });
    }

    const res = await request(app).get("/api/activity").set(authed(token));

    expect(res.body.recentlyUsed).toHaveLength(2);
    expect(res.body.recentlyUsed.map((r: { slug: string }) => r.slug)).toEqual(["json", "yaml"]);
  });
});

describe("POST /api/activity/favorite", () => {
  it("rejects requests missing type or slug", async () => {
    const token = await createAuthedUser("user@example.com");

    const res = await request(app)
      .post("/api/activity/favorite")
      .set(authed(token))
      .send({ type: "tool" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("type and slug are required");
  });

  it("toggles a favorite on and off", async () => {
    const token = await createAuthedUser("user@example.com");

    const on = await request(app)
      .post("/api/activity/favorite")
      .set(authed(token))
      .send({ type: "tool", slug: "json" });
    expect(on.status).toBe(200);
    expect(on.body.isFavorited).toBe(true);
    expect(on.body.favorites).toHaveLength(1);

    const off = await request(app)
      .post("/api/activity/favorite")
      .set(authed(token))
      .send({ type: "tool", slug: "json" });
    expect(off.status).toBe(200);
    expect(off.body.isFavorited).toBe(false);
    expect(off.body.favorites).toHaveLength(0);
  });
});

describe("DELETE /api/activity/favorite", () => {
  it("removes an existing favorite", async () => {
    const token = await createAuthedUser("user@example.com");

    await request(app)
      .post("/api/activity/favorite")
      .set(authed(token))
      .send({ type: "tool", slug: "json" });

    const res = await request(app)
      .delete("/api/activity/favorite")
      .set(authed(token))
      .send({ type: "tool", slug: "json" });

    expect(res.status).toBe(200);
    expect(res.body.favorites).toHaveLength(0);
  });

  it("is idempotent for favorites that do not exist", async () => {
    const token = await createAuthedUser("user@example.com");

    const res = await request(app)
      .delete("/api/activity/favorite")
      .set(authed(token))
      .send({ type: "tool", slug: "ghost" });

    expect(res.status).toBe(200);
    expect(res.body.favorites).toHaveLength(0);
  });
});

describe("POST /api/activity/saved-tip", () => {
  it("rejects requests missing tipId", async () => {
    const token = await createAuthedUser("user@example.com");

    const res = await request(app).post("/api/activity/saved-tip").set(authed(token)).send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("tipId is required");
  });

  it("toggles a saved tip on and off", async () => {
    const token = await createAuthedUser("user@example.com");

    const on = await request(app)
      .post("/api/activity/saved-tip")
      .set(authed(token))
      .send({ tipId: "tip-1" });
    expect(on.status).toBe(200);
    expect(on.body.isSaved).toBe(true);
    expect(on.body.savedTips).toHaveLength(1);

    const off = await request(app)
      .post("/api/activity/saved-tip")
      .set(authed(token))
      .send({ tipId: "tip-1" });
    expect(off.status).toBe(200);
    expect(off.body.isSaved).toBe(false);
    expect(off.body.savedTips).toHaveLength(0);
  });
});

describe("activity persistence", () => {
  it("persists combined activity for a user", async () => {
    const token = await createAuthedUser("user@example.com");

    await request(app)
      .post("/api/activity/game-score")
      .set(authed(token))
      .send({ gameSlug: "game-a", score: 10, streak: 1, accuracy: 50, rank: "B" });
    await request(app)
      .post("/api/activity/favorite")
      .set(authed(token))
      .send({ type: "tool", slug: "json" });
    await request(app).post("/api/activity/saved-tip").set(authed(token)).send({ tipId: "tip-1" });
    await request(app).post("/api/activity/tool-use").set(authed(token)).send({ toolSlug: "yaml" });

    const res = await request(app).get("/api/activity").set(authed(token));

    expect(res.body.gameScores).toHaveLength(1);
    expect(res.body.favorites).toHaveLength(1);
    expect(res.body.savedTips).toHaveLength(1);
    expect(res.body.toolUsage).toHaveLength(1);
  });
});
