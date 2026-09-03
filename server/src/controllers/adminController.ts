import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ContentItem } from "../models/ContentItem";
import { Deployment } from "../models/Deployment";
import { githubService } from "../services/githubService";
import { startVerification, pollVerification } from "../services/verificationService";

const CONTENT_DIRS: Record<string, string> = {
  game: "src/components/games",
  tool: "src/components/tools",
  post: "src/data/posts",
  "stack-breakdown": "src/data/stackbreakdowns",
  "startup-term": "src/data/startup-terms",
  tip: "src/data/tips",
  "cheat-sheet": "src/data/cheat-sheets",
  "hidden-gem": "src/data/hidden-gems",
  hiring: "src/data/hiring",
  "mcp-skill": "src/data/mcp-skills",
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// ─── Content CRUD ────────────────────────────────────────────────

export async function listContent(req: AuthRequest, res: Response) {
  const { type, status, series, q, page = "1", limit = "50" } = req.query as Record<string, string>;

  const query: Record<string, unknown> = {};
  if (type) query.type = type;
  if (status) query.status = status;
  if (series) query.series = series;
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: "i" } },
      { slug: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));

  const [items, total] = await Promise.all([
    ContentItem.find(query)
      .sort({ updatedAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    ContentItem.countDocuments(query),
  ]);

  res.json({ items, total, page: pageNum, limit: limitNum });
}

export async function getContent(req: AuthRequest, res: Response) {
  const item = await ContentItem.findById(req.params.id).lean();
  if (!item) {
    res.status(404).json({ error: "Content not found" });
    return;
  }
  res.json({ item });
}

/** Normalize a name/slug for case-insensitive matching (e.g. BugFinder.tsx -> bugfinder) */
function normalizeCodeName(s: string): string {
  return s
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Fetch a content item's real source from the GitHub repo.
 * Games/tools live in src/components/{games|tools}/<Component>.tsx; we locate
 * the file by matching the item's slug against the repo directory listing, then
 * read its committed content. Falls back to the stored codeFiles if the repo
 * read fails or no matching file exists.
 */
export async function getContentSource(req: AuthRequest, res: Response) {
  const item = await ContentItem.findById(req.params.id).lean();
  if (!item) {
    res.status(404).json({ error: "Content not found" });
    return;
  }

  const dir = CONTENT_DIRS[item.type as string];
  if (!dir) {
    res.json({ path: null, content: null, exists: false, source: "db" });
    return;
  }

  const slugNorm = normalizeCodeName(String(item.slug ?? ""));

  try {
    const entries = await githubService.listDir(dir);
    const match = entries.find((e) => e.type === "file" && normalizeCodeName(e.name) === slugNorm);
    if (match) {
      const path = `${dir}/${match.name}`;
      const { content } = await githubService.getFile(path);
      res.json({ path, content, exists: true, source: "repo" });
      return;
    }

    const files = Array.isArray((item as { codeFiles?: unknown }).codeFiles)
      ? ((item as { codeFiles: { path: string; content: string }[] }).codeFiles ?? [])
      : [];
    if (files.length > 0) {
      res.json({ path: files[0].path, content: files[0].content, exists: true, source: "db" });
      return;
    }

    res.json({ path: null, content: null, exists: false, source: "none" });
  } catch {
    const files = Array.isArray((item as { codeFiles?: unknown }).codeFiles)
      ? ((item as { codeFiles: { path: string; content: string }[] }).codeFiles ?? [])
      : [];
    if (files.length > 0) {
      res.json({ path: files[0].path, content: files[0].content, exists: true, source: "db" });
      return;
    }
    res.json({ path: null, content: null, exists: false, source: "none" });
  }
}

export async function createContent(req: AuthRequest, res: Response) {
  const {
    type,
    series,
    title,
    description = "",
    body = "",
    image,
    images = [],
    tags = [],
    status = "draft",
    slug: slugParam,
    category,
    icon,
    tagline,
    url,
    faviconDomain,
    productName,
    cadence,
    resourceCost,
    isListing,
    codeFiles = [],
  } = req.body;

  if (!type || !title) {
    res.status(400).json({ error: "type and title are required" });
    return;
  }

  const slug = slugParam || slugify(title);
  const existing = await ContentItem.findOne({ slug });
  if (existing) {
    res.status(409).json({ error: `Slug already in use: ${slug}` });
    return;
  }

  const item = await ContentItem.create({
    slug,
    type,
    series,
    title,
    description,
    body,
    image,
    images,
    tags,
    status,
    version: 1,
    lastEditedBy: req.user!._id.toString(),
    publishedAt: status === "published" ? new Date() : undefined,
    category,
    icon,
    tagline,
    url,
    faviconDomain,
    productName,
    cadence,
    resourceCost,
    isListing,
    codeFiles,
  });

  res.status(201).json({ item });
}

export async function updateContent(req: AuthRequest, res: Response) {
  const item = await ContentItem.findById(req.params.id);
  if (!item) {
    res.status(404).json({ error: "Content not found" });
    return;
  }

  const allowed = [
    "title",
    "description",
    "body",
    "image",
    "images",
    "tags",
    "status",
    "series",
    "codeAvailable",
    "codeFiles",
    "category",
    "icon",
    "tagline",
    "url",
    "faviconDomain",
    "productName",
    "cadence",
    "resourceCost",
    "isListing",
  ];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      (item as unknown as Record<string, unknown>)[key] = req.body[key];
    }
  }

  if (req.body.status === "published" && !item.publishedAt) {
    item.publishedAt = new Date();
  }

  item.version += 1;
  item.lastEditedBy = req.user!._id.toString();
  await item.save();

  res.json({ item });
}

export async function deleteContent(req: AuthRequest, res: Response) {
  const item = await ContentItem.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404).json({ error: "Content not found" });
    return;
  }
  res.json({ deleted: true, slug: item.slug });
}

// ─── Code deployment ─────────────────────────────────────────────

export async function submitCode(req: AuthRequest, res: Response) {
  const { type, title, description = "", tags = [], files = [], existingSlug } = req.body;

  if (!type || !title || !Array.isArray(files) || files.length === 0) {
    res.status(400).json({ error: "type, title and files are required" });
    return;
  }

  const adminId = req.user!._id.toString();
  const slug = existingSlug || slugify(title);

  const dir = CONTENT_DIRS[type as string];
  if (!dir) {
    res.status(400).json({ error: `Unsupported content type for code: ${type}` });
    return;
  }

  const allowedPrefix = "src/components/";
  for (const f of files as { path?: string; content?: string }[]) {
    if (!f.path || !f.content) {
      res.status(400).json({ error: "Each file needs a path and content" });
      return;
    }
    const normalized = f.path.replace(/\\/g, "/");
    if (normalized.startsWith("../") || normalized.includes("..")) {
      res.status(400).json({ error: `Invalid path: ${f.path}` });
      return;
    }
    if (!normalized.startsWith(allowedPrefix)) {
      res.status(400).json({ error: `File path must be under ${allowedPrefix}: ${f.path}` });
      return;
    }
    if (Buffer.byteLength(f.content, "utf-8") > 500 * 1024) {
      res.status(400).json({ error: `File too large (>500KB): ${f.path}` });
      return;
    }
  }

  const blacklist = ["process.env", "eval(", "localStorage.setItem", "import('http"];
  for (const f of files as { path?: string; content?: string }[]) {
    for (const b of blacklist) {
      if (f.content!.includes(b)) {
        res.status(400).json({
          error: `Blacklisted pattern "${b}" found in ${f.path}. Remove it and resubmit.`,
        });
        return;
      }
    }
  }

  const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const branchName = `preview/${sessionId}`;

  const mainFile = files.find((f: { isMain?: boolean }) => f.isMain) || files[0];

  const deployment = await Deployment.create({
    sessionId,
    contentType: type,
    contentSlug: slug,
    action: existingSlug ? "update" : "create",
    files: files.map((f: { path: string }) => ({
      path: f.path,
      action: existingSlug ? "update" : "create",
      status: "pending",
    })),
    phases: ["typescript", "eslint", "tests", "build"].map((name) => ({
      name,
      status: "pending",
    })),
    overallStatus: "pending",
    branchName,
    triggeredBy: adminId,
    version: 1,
  });

  const commitMessage = `${existingSlug ? "feat: update" : "feat: add"} ${title} (${type})`;

  try {
    await githubService.createBranchFromMain(branchName);
    await githubService.pushFiles(
      branchName,
      files.map((f: { path: string; content: string }) => ({
        path: f.path,
        content: f.content,
        message: commitMessage,
      })),
      commitMessage,
    );

    const codeFiles = files.map((f: { path: string; content: string; isMain?: boolean }) => ({
      path: f.path,
      content: f.content,
      isMain: Boolean(f.isMain),
    }));
    await ContentItem.findOneAndUpdate(
      { type, slug },
      {
        $set: {
          type,
          slug,
          title,
          description,
          tags,
          codeFiles,
          status: "published",
          codeAvailable: true,
          codeDeployedAt: new Date(),
        },
        $setOnInsert: { version: 1 },
      },
      { upsert: true, new: true },
    );

    deployment.overallStatus = "verifying";
    await deployment.save();

    const { runId, started, error } = await startVerification(branchName);
    if (error) {
      deployment.overallStatus = "failed";
      deployment.deploymentErrors = [error];
      await deployment.save();
      res.status(500).json({ error, sessionId });
      return;
    }
    if (runId) deployment.runId = runId;
    await deployment.save();

    res.status(202).json({ sessionId, status: "verifying", runId, mainFile: mainFile.path });
  } catch (err) {
    deployment.overallStatus = "failed";
    deployment.deploymentErrors = [(err as Error)?.message ?? "Deployment failed"];
    await deployment.save();
    res.status(500).json({ error: (err as Error)?.message ?? "Deployment failed", sessionId });
  }
}

export async function getDeployStatus(req: AuthRequest, res: Response) {
  const deployment = await Deployment.findOne({ sessionId: req.params.sessionId }).lean();
  if (!deployment) {
    res.status(404).json({ error: "Deployment not found" });
    return;
  }

  if (deployment.runId && deployment.overallStatus === "verifying") {
    const result = await pollVerification(deployment.runId);

    result.phases.forEach((p) => {
      const existing = deployment.phases.find((x) => x.name === p.name);
      if (existing) existing.status = p.status;
    });

    if (result.status === "passed") {
      deployment.overallStatus = "committed";
      try {
        const merged = await githubService.mergeBranch(
          deployment.branchName,
          `feat: verified content (${deployment.sessionId})`,
        );
        if (merged.merged) {
          deployment.overallStatus = "deployed";
          deployment.commitUrl = merged.prUrl;
          await githubService.deleteBranch(deployment.branchName);
          try {
            await ContentItem.updateOne(
              { type: deployment.contentType, slug: deployment.contentSlug },
              { $set: { codeAvailable: true, codeDeployedAt: new Date() } },
            );
          } catch {
            // registry sync is best-effort; never fail the deploy status
          }
        }
      } catch {
        // merge error — still committed/verifying
      }
      deployment.completedAt = new Date();
      await Deployment.updateOne(
        { sessionId: deployment.sessionId },
        {
          overallStatus: deployment.overallStatus,
          phases: deployment.phases,
          commitUrl: deployment.commitUrl,
          completedAt: deployment.completedAt,
          deploymentErrors: deployment.deploymentErrors,
        },
      );
    } else if (result.status === "failed") {
      deployment.overallStatus = "failed";
      deployment.deploymentErrors = result.error ? [result.error] : deployment.deploymentErrors;
      deployment.completedAt = new Date();
      await Deployment.updateOne(
        { sessionId: deployment.sessionId },
        {
          overallStatus: "failed",
          phases: deployment.phases,
          deploymentErrors: deployment.deploymentErrors,
          completedAt: deployment.completedAt,
        },
      );
    } else {
      await Deployment.updateOne(
        { sessionId: deployment.sessionId },
        { phases: deployment.phases },
      );
    }
  }

  const fresh = await Deployment.findOne({ sessionId: req.params.sessionId }).lean();
  res.json({ deployment: fresh });
}

export async function rollbackDeployment(req: AuthRequest, res: Response) {
  const { sessionId } = req.body;
  const deployment = await Deployment.findOne({ sessionId });
  if (!deployment) {
    res.status(404).json({ error: "Deployment not found" });
    return;
  }

  try {
    if (deployment.commitSha) {
      res.json({ message: "Manual rollback required — revert the commit on GitHub" });
      return;
    }
    deployment.overallStatus = "rolled-back";
    await deployment.save();
    res.json({ message: "Deployment cancelled before commit", status: "rolled-back" });
  } catch (err) {
    res.status(500).json({ error: (err as Error)?.message ?? "Rollback failed" });
  }
}

export function uploadImage(_req: AuthRequest, res: Response) {
  const file = (_req as unknown as { file?: { filename?: string; originalname?: string } }).file;
  if (!file?.filename) {
    res.status(400).json({ error: "No image file provided" });
    return;
  }
  res.status(201).json({ image: `/content/images/${file.filename}` });
}

export async function listImages(_req: AuthRequest, res: Response) {
  res.json({ images: [] });
}

export async function deleteImage(_req: AuthRequest, res: Response) {
  res.json({ deleted: true });
}

// ─── Stats for dashboard ─────────────────────────────────────────

export async function listDeployments(req: AuthRequest, res: Response) {
  const { limit = "50,page" } = {} as { limit?: string };
  const items = await Deployment.find()
    .sort({ createdAt: -1 })
    .limit(Math.min(100, parseInt(limit, 10) || 50))
    .lean();
  res.json({ items });
}

export async function getAdminStats(_req: AuthRequest, res: Response) {
  const [total, published, drafts, deployments, recent, byType] = await Promise.all([
    ContentItem.countDocuments(),
    ContentItem.countDocuments({ status: "published" }),
    ContentItem.countDocuments({ status: "draft" }),
    Deployment.countDocuments(),
    Deployment.find().sort({ createdAt: -1 }).limit(5).lean(),
    ContentItem.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]),
  ]);

  const types: Record<string, number> = {};
  for (const t of byType) types[t._id] = t.count;

  res.json({ stats: { total, published, drafts, deployments, types }, recent });
}
