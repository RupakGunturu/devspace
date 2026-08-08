import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Activity } from "../models/Activity";

async function getActivity(userId: string) {
  let activity = await Activity.findOne({ userId });
  if (!activity) {
    activity = await Activity.create({ userId });
  }
  return activity;
}

export async function getActivityData(req: AuthRequest, res: Response) {
  try {
    const activity = await getActivity(req.user!._id.toString());
    res.json(activity);
  } catch {
    res.status(500).json({ error: "Failed to get activity" });
  }
}

export async function saveGameScore(req: AuthRequest, res: Response) {
  try {
    const { gameSlug, score, streak, accuracy, rank } = req.body;
    if (!gameSlug || score === undefined) {
      res.status(400).json({ error: "gameSlug and score are required" });
      return;
    }

    const activity = await getActivity(req.user!._id.toString());
    activity.gameScores.push({
      gameSlug,
      score,
      streak: streak || 0,
      accuracy: accuracy || 0,
      rank: rank || "",
      playedAt: new Date(),
    });

    // Keep only the newest 50 scores per game
    const gameSlugCount = activity.gameScores.reduce(
      (count, s) => (s.gameSlug === gameSlug ? count + 1 : count),
      0,
    );
    if (gameSlugCount > 50) {
      const excess = gameSlugCount - 50;
      let removed = 0;
      activity.gameScores = activity.gameScores.filter((s) => {
        if (s.gameSlug === gameSlug && removed < excess) {
          removed++;
          return false;
        }
        return true;
      });
    }

    await activity.save();
    res.json({ message: "Score saved", activity });
  } catch {
    res.status(500).json({ error: "Failed to save score" });
  }
}

export async function logToolUsage(req: AuthRequest, res: Response) {
  try {
    const { toolSlug } = req.body;
    if (!toolSlug) {
      res.status(400).json({ error: "toolSlug is required" });
      return;
    }

    const activity = await getActivity(req.user!._id.toString());
    activity.toolUsage.unshift({ toolSlug, usedAt: new Date() });

    // Keep only last 100
    if (activity.toolUsage.length > 100) {
      activity.toolUsage = activity.toolUsage.slice(0, 100);
    }

    // Update recently used
    activity.recentlyUsed = activity.recentlyUsed.filter(
      (r) => !(r.type === "tool" && r.slug === toolSlug),
    );
    activity.recentlyUsed.unshift({ type: "tool", slug: toolSlug, usedAt: new Date() });
    if (activity.recentlyUsed.length > 20) {
      activity.recentlyUsed = activity.recentlyUsed.slice(0, 20);
    }

    await activity.save();
    res.json({ message: "Usage logged" });
  } catch {
    res.status(500).json({ error: "Failed to log usage" });
  }
}

export async function toggleFavorite(req: AuthRequest, res: Response) {
  try {
    const { type, slug } = req.body;
    if (!type || !slug) {
      res.status(400).json({ error: "type and slug are required" });
      return;
    }

    const activity = await getActivity(req.user!._id.toString());
    const idx = activity.favorites.findIndex((f) => f.type === type && f.slug === slug);

    let isFavorited: boolean;
    if (idx >= 0) {
      activity.favorites.splice(idx, 1);
      isFavorited = false;
    } else {
      activity.favorites.push({ type, slug, addedAt: new Date() });
      isFavorited = true;
    }

    await activity.save();
    res.json({ isFavorited, favorites: activity.favorites });
  } catch {
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
}

export async function toggleSavedTip(req: AuthRequest, res: Response) {
  try {
    const { tipId } = req.body;
    if (!tipId) {
      res.status(400).json({ error: "tipId is required" });
      return;
    }

    const activity = await getActivity(req.user!._id.toString());
    const idx = activity.savedTips.findIndex((s) => s.tipId === tipId);

    let isSaved: boolean;
    if (idx >= 0) {
      activity.savedTips.splice(idx, 1);
      isSaved = false;
    } else {
      activity.savedTips.push({ tipId, savedAt: new Date() });
      isSaved = true;
    }

    await activity.save();
    res.json({ isSaved, savedTips: activity.savedTips });
  } catch {
    res.status(500).json({ error: "Failed to toggle saved tip" });
  }
}

export async function removeFavorite(req: AuthRequest, res: Response) {
  try {
    const { type, slug } = req.body;
    if (!type || !slug) {
      res.status(400).json({ error: "type and slug are required" });
      return;
    }

    const activity = await getActivity(req.user!._id.toString());
    activity.favorites = activity.favorites.filter((f) => !(f.type === type && f.slug === slug));
    await activity.save();

    res.json({ favorites: activity.favorites });
  } catch {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
}
