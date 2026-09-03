import { Router } from "express";
import { ContentItem } from "../models/ContentItem";

const router = Router();

/**
 * Public content API — no auth. Only returns published items.
 */

// GET /api/content?type=&shuffle=&limit=&q=
router.get("/", async (req, res) => {
  try {
    const { type, shuffle, limit = "500", q } = req.query as {
      type?: string;
      shuffle?: string;
      limit?: string;
      q?: string;
    };

    const filter: Record<string, unknown> = { status: "published" };
    if (type) filter.type = type;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }

    const max = Math.min(parseInt(limit, 10) || 500, 1000);
    let items = await ContentItem.find(filter).sort({ updatedAt: -1 }).limit(max).lean();

    if (shuffle === "true") {
      items = items
        .map((v) => ({ v, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map(({ v }) => v);
    }

    res.json({ items, total: items.length });
  } catch (err) {
    res.status(500).json({ error: (err as Error)?.message ?? "Failed to load content" });
  }
});

// GET /api/content/types — list all available types with counts
router.get("/types", async (_req, res) => {
  try {
    const counts = await ContentItem.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);
    res.json({ types: counts });
  } catch (err) {
    res.status(500).json({ error: (err as Error)?.message ?? "Failed to load types" });
  }
});

// GET /api/content/:idOrSlug
router.get("/:idOrSlug", async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const item = isObjectId
      ? await ContentItem.findOne({ _id: idOrSlug, status: "published" }).lean()
      : await ContentItem.findOne({ slug: idOrSlug, status: "published" }).lean();

    if (!item) {
      res.status(404).json({ error: "Content not found" });
      return;
    }
    res.json({ item });
  } catch (err) {
    res.status(500).json({ error: (err as Error)?.message ?? "Failed to load content" });
  }
});

export default router;
