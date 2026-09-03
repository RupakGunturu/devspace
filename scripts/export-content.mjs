// Generates server/content-seed.json from the real frontend data modules.
// Run: node scripts/export-content.mjs
// Uses Vite SSR to load the TS data files (handles ?raw .md imports).
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const DATA = {
  posts: { file: "/src/data/posts.ts", export: "POSTS", normalize: normalizePost },
  series: { file: "/src/data/series.ts", export: "SERIES", normalize: normalizeSeries },
  tips: { file: "/src/data/tips.ts", export: "tips", normalize: normalizeTip },
  cheatSheets: {
    file: "/src/data/cheat-sheets.ts",
    export: "cheatSheets",
    normalize: normalizeCheatSheet,
  },
  games: { file: "/src/data/games.ts", export: "GAMES", normalize: normalizeGame },
  tools: { file: "/src/data/tools.ts", export: "TOOLS", normalize: normalizeTool },
  hiddenGems: {
    file: "/src/data/hidden-gems.ts",
    export: "HIDDEN_GEMS",
    normalize: normalizeHiddenGem,
  },
  hiring: { file: "/src/data/hiring.ts", export: "HIRING_ITEMS", normalize: normalizeHiring },
  mcpSkills: {
    file: "/src/data/mcp-skills.ts",
    export: "MCP_SKILLS",
    normalize: normalizeMcpSkill,
  },
  learningResources: {
    file: "/src/data/learning-resources.ts",
    export: "learningResources",
    normalize: normalizeLearningResource,
  },
  stackBreakdowns: {
    file: "/src/data/stack-breakdowns.ts",
    export: "STACK_BREAKDOWNS",
    normalize: normalizeStackBreakdown,
  },
};

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePost(row, i) {
  return {
    id: row.id || `post-${i}`,
    slug: row.slug || slugify(row.title),
    type: "post",
    series: row.series || "uncategorized",
    title: row.title,
    excerpt: row.excerpt,
    body: row.body ?? "",
    image: row.image,
    externalUrl: row.externalUrl,
    publishedAt: row.publishedAt ? new Date(row.publishedAt).toISOString() : undefined,
    status: "published",
  };
}
function normalizeSeries(row) {
  return {
    slug: row.slug,
    type: "series",
    title: row.label,
    tagline: row.description,
    icon: row.icon,
    cadence: row.cadence,
    description: row.description,
    body: "",
    status: "published",
  };
}
function normalizeTip(row) {
  return {
    slug: row.id,
    type: "tip",
    title: row.title,
    category: row.category,
    icon: row.icon,
    body: row.content,
    tags: [],
    status: "published",
  };
}
function normalizeCheatSheet(row) {
  return {
    slug: row.id,
    type: "cheat-sheet",
    title: row.title,
    description: row.description,
    category: row.category,
    icon: row.icon,
    tags: row.tags || [],
    content: row.content || [],
    body: "",
    status: "published",
  };
}
function normalizeGame(row) {
  return {
    slug: row.slug,
    type: "game",
    name: row.name,
    title: row.name,
    tagline: row.tagline,
    description: row.description,
    icon: row.icon,
    tags: [],
    body: row.description,
    status: "published",
  };
}
function normalizeTool(row) {
  return {
    slug: row.slug || row.id,
    type: "tool",
    name: row.name || row.title,
    title: row.name || row.title,
    tagline: row.tagline || row.description,
    description: row.description || "",
    icon: row.icon,
    category: row.category,
    tags: row.tags || [],
    popular: row.popular,
    body: row.description || "",
    status: "published",
  };
}
function normalizeHiddenGem(row) {
  return {
    slug: row.id || slugify(row.name),
    type: "hidden-gem",
    title: row.name,
    name: row.name,
    description: row.description,
    url: row.url,
    icon: row.icon,
    category: row.category,
    tags: row.tags || [],
    body: row.description,
    status: "published",
  };
}
function normalizeHiring(row) {
  return {
    slug: row.id || slugify(row.name),
    type: "hiring",
    title: row.name,
    name: row.name,
    tagline: row.tagline,
    description: row.tagline || "",
    url: row.url,
    icon: row.icon,
    category: row.category,
    tags: row.tags || [],
    isListing: row.isListing,
    body: "",
    status: "published",
  };
}
function normalizeMcpSkill(row) {
  return {
    slug: row.id || slugify(row.name),
    type: "mcp-skill",
    title: row.name,
    name: row.name,
    description: row.description,
    url: row.url,
    icon: row.icon,
    category: row.category,
    tags: row.tags || [],
    body: row.description,
    status: "published",
  };
}
function normalizeLearningResource(row) {
  return {
    slug: row.id || slugify(row.title),
    type: "learning-resource",
    title: row.title,
    description: row.description,
    url: row.url,
    category: row.category,
    resourceCost: row.cost,
    tags: [],
    body: row.description,
    status: "published",
  };
}
function normalizeStackBreakdown(row) {
  return {
    slug: row.slug,
    type: "stack-breakdown",
    title: row.title || row.productName,
    productName: row.productName,
    description: row.description,
    icon: row.icon,
    faviconDomain: row.faviconDomain,
    tags: row.tags || [],
    body: row.body ?? "",
    status: "published",
  };
}

async function main() {
  const server = await createServer({
    root,
    logLevel: "error",
    server: { middlewareMode: true },
    appType: "custom",
  });

  const output = {};
  let total = 0;
  for (const [key, cfg] of Object.entries(DATA)) {
    try {
      const mod = await server.ssrLoadModule(cfg.file);
      let rows = mod[cfg.export] || [];
      if (!Array.isArray(rows) && typeof rows?.then === "function") rows = await rows;
      rows = Array.from(rows || []);
      output[key] = rows.map((r, i) => cfg.normalize(r, i));
      total += rows.length;
      console.log(`  ${String(key).padEnd(18)} ← ${cfg.file.padEnd(28)} (${rows.length})`);
    } catch (err) {
      console.error(`  ✖ Failed to load ${cfg.file}:`, err?.message);
    }
  }

  const outPath = path.resolve(root, "server", "content-seed.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\n✓ Wrote ${outPath} with ${total} content rows.`);
  await server.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
