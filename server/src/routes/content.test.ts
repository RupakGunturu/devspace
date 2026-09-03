import { beforeAll, afterAll, describe, it, expect, vi } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "../app";
import { ContentItem } from "../models/ContentItem";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

vi.mock("../utils/email", () => ({
  sendResetEmail: vi.fn().mockResolvedValue(undefined),
  sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
}));

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({ instance: { launchTimeout: 30000 } });
  await mongoose.connect(mongod.getUri());

  const seedFile = path.resolve(__dirname, "../../content-seed.json");
  const data = JSON.parse(fs.readFileSync(seedFile, "utf8"));
  const rows = Object.values(data).flat() as Record<string, unknown>[];
  for (const row of rows) {
    const { type, slug, ...rest } = row as { type: string; slug: string };
    await ContentItem.findOneAndUpdate(
      { type, slug },
      { $set: { ...rest, type, status: "published" } },
      { upsert: true, new: true },
    );
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("Content seed + public API", () => {
  it("seeds all content types", async () => {
    const counts = await ContentItem.aggregate([{ $group: { _id: "$type", n: { $sum: 1 } } }]);
    const map = Object.fromEntries(counts.map((c) => [c._id, c.n]));
    expect(map.post).toBe(88);
    expect(map["startup-term"]).toBe(20);
    expect(map.tool).toBe(381);
    expect(map.tip).toBe(229);
    expect(map.game).toBe(7);
    expect(map["cheat-sheet"]).toBe(23);
    expect(map.series).toBe(18);
  });

  it("GET /api/content returns published items without auth", async () => {
    const res = await request(app).get("/api/content").query({ type: "game" });
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(7);
  });

  it("GET /api/content/:slug returns a single post body", async () => {
    const res = await request(app).get("/api/content/shipped-regex-tester");
    expect(res.status).toBe(200);
    expect(res.body.item.title).toContain("Regex Tester");
    expect(res.body.item.body.length).toBeGreaterThan(50);
  });

  it("GET /api/content excludes drafts", async () => {
    const res = await request(app).get("/api/content").query({ type: "tool" });
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(381);
    const drafts = res.body.items.filter((i: { status: string }) => i.status !== "published");
    expect(drafts.length).toBe(0);
  });

  it("GET /api/content exposes codeAvailable registry field", async () => {
    await ContentItem.findOneAndUpdate(
      { type: "game", slug: "registry-probe" },
      {
        $set: {
          type: "game",
          title: "Registry Probe",
          description: "probe",
          body: "",
          name: "Registry Probe",
          status: "published",
          codeAvailable: true,
          codeDeployedAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );

    const res = await request(app).get("/api/content").query({ type: "game" });
    const probe = res.body.items.find((i: { slug: string }) => i.slug === "registry-probe") as {
      codeAvailable: boolean;
    };
    expect(probe).toBeDefined();
    expect(probe.codeAvailable).toBe(true);

    const single = await request(app).get("/api/content/registry-probe");
    expect(single.status).toBe(200);
    expect(single.body.item.codeAvailable).toBe(true);
  });
});
