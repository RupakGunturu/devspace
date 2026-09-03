import { useSyncExternalStore, useEffect } from "react";
import { request } from "./api";

// Static fallbacks (used before/without the backend, and as cache seed).
import { GAMES, type Game } from "../data/games";
import { TOOLS } from "../data/tools";
import { tips } from "../data/tips";
import { cheatSheets } from "../data/cheat-sheets";
import { SERIES, type Series } from "../data/series";
import { POSTS, type Post } from "../data/posts";
import { HIDDEN_GEMS } from "../data/hidden-gems";
import { HIRING_ITEMS } from "../data/hiring";
import { MCP_SKILLS } from "../data/mcp-skills";
import { STACK_BREAKDOWNS, type StackBreakdownItem } from "../data/stack-breakdowns";
import { learningResources } from "../data/learning-resources";

type Tool = (typeof TOOLS)[number];
type Tip = (typeof tips)[number];
type CheatSheet = (typeof cheatSheets)[number];
type HiddenGem = (typeof HIDDEN_GEMS)[number];
type HiringItem = (typeof HIRING_ITEMS)[number];
type McpSkill = (typeof MCP_SKILLS)[number];
type LearningResource = (typeof learningResources)[number];

export type ContentSection =
  | "game"
  | "tool"
  | "tip"
  | "cheat-sheet"
  | "series"
  | "post"
  | "hidden-gem"
  | "hiring"
  | "mcp-skill"
  | "stack-breakdown"
  | "learning-resource";

interface ApiContentItem {
  _id?: string;
  slug: string;
  type: ContentSection;
  title?: string;
  name?: string;
  description?: string;
  tagline?: string;
  body?: string;
  icon?: string;
  category?: string;
  tags?: string[];
  series?: string;
  excerpt?: string;
  image?: string;
  publishedAt?: string;
  externalUrl?: string;
  url?: string;
  productName?: string;
  cadence?: string;
  faviconDomain?: string;
  codeAvailable?: boolean;
  [key: string]: unknown;
}

type StoreState = Record<ContentSection, ApiContentItem[] | null>;
type Listener = () => void;

const INITIAL_STATE: StoreState = {
  game: null,
  tool: null,
  tip: null,
  "cheat-sheet": null,
  series: null,
  post: null,
  "hidden-gem": null,
  hiring: null,
  "mcp-skill": null,
  "stack-breakdown": null,
  "learning-resource": null,
};

let state: StoreState = { ...INITIAL_STATE };
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): StoreState {
  return state;
}

let loadStarted = false;
let lastAttempt = 0;

/** Fetch all public content sections once (with a cooldown + absolute fallback). */
export function loadContent({ force = false } = {}): Promise<void> {
  const now = Date.now();
  if (loadStarted && !force) return Promise.resolve();
  if (now - lastAttempt < 10_000 && !force) return Promise.resolve();
  loadStarted = true;
  lastAttempt = now;

  const sections: ContentSection[] = [
    "game",
    "tool",
    "tip",
    "cheat-sheet",
    "series",
    "post",
    "hidden-gem",
    "hiring",
    "mcp-skill",
    "stack-breakdown",
    "learning-resource",
  ];

  const tasks = sections.map(async (section) => {
    try {
      const res = await request<{ items: ApiContentItem[] }>(`/api/content?type=${section}`);
      if (res.items?.length) {
        state = { ...state, [section]: res.items };
      }
    } catch {
      // keep static fallback; ignore backend errors
    }
  });

  const done = Promise.all(tasks).then(() => emit());
  // Ensure subscribers always get a notification even on partial failure.
  done.catch(() => emit());
  return done;
}

// ─── Generic reactive accessors ─────────────────────────────────

function useSection<T>(section: ContentSection, fallback: unknown[]): T[] {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const api = snap[section];
  if (api && api.length > 0) {
    return api as unknown as T[];
  }
  return fallback as unknown as T[];
}

function useSectionMap<T>(section: ContentSection, fallback: unknown[]): Record<string, T> {
  const arr = useSection<T>(section, fallback);
  const map: Record<string, T> = {};
  for (const item of arr) {
    const api = item as ApiContentItem;
    const key = api.slug || api.title || "";
    if (key) map[key] = item;
  }
  return map;
}

// ─── Per-section hooks ──────────────────────────────────────────

export function useGames(): Game[] {
  return useSection<ApiContentItem & Game>("game", GAMES).map((g) => ({
    ...g,
    name: (g.name as string) ?? (g.title as string) ?? "",
  }));
}

export function useTools(): Tool[] {
  return useSection<ApiContentItem & Tool>("tool", TOOLS).map((t) => ({
    ...t,
    name: (t.name as string) ?? (t.title as string) ?? "",
    icon: (t.icon as string) ?? (t.title as string)?.[0],
    tagline: (t.tagline as string) ?? " ",
  }));
}

export function useTips(): Tip[] {
  return useSection<ApiContentItem & Tip>("tip", tips).map((t) => ({
    id: t.slug,
    category: (t.category as string) ?? "General",
    title: (t.title as string) ?? "",
    icon: (t.icon as string) ?? "Sparkles",
    content: (t.body as string) ?? (t.content as string) ?? "",
  }));
}

export function useCheatSheets(): CheatSheet[] {
  return useSection<ApiContentItem & CheatSheet>("cheat-sheet", cheatSheets).map((c) => ({
    id: c.slug,
    title: (c.title as string) ?? "",
    description: (c.description as string) ?? "",
    category: (c.category as string) ?? "",
    icon: (c.icon as string) ?? "FileText",
    tags: (c.tags as string[]) ?? [],
    content: (c.content as CheatSheet["content"]) ?? [],
  }));
}

export function useSeriesList() {
  return useSection<ApiContentItem & Series>("series", SERIES).map((s) => ({
    slug: s.slug,
    label: (s.title as string) ?? s.label ?? "",
    icon: (s.icon as string) ?? "FileClock",
    cadence: (s.cadence as string) ?? "",
    description: (s.description as string) ?? "",
  }));
}

export function usePosts(): Post[] {
  return useSection<ApiContentItem & Post>("post", POSTS).map((p) => ({
    id: (p.id as string) ?? p.slug,
    slug: p.slug,
    title: (p.title as string) ?? "",
    series: (p.series as string) ?? "",
    excerpt: (p.excerpt as string) ?? (p.description as string) ?? "",
    body: (p.body as string) ?? "",
    publishedAt: (p.publishedAt as string) ?? "",
    externalUrl: (p.externalUrl as string) ?? undefined,
    image: (p.image as string) ?? undefined,
  }));
}

export function useHiddenGems(): HiddenGem[] {
  return useSection<ApiContentItem & HiddenGem>("hidden-gem", HIDDEN_GEMS).map((h) => ({
    id: h.slug,
    name: (h.name as string) ?? (h.title as string) ?? "",
    url: (h.url as string) ?? "",
    description: (h.description as string) ?? "",
    icon: (h.icon as string) ?? "Link",
    category: (h.category as string) ?? "",
    tags: (h.tags as string[]) ?? [],
  }));
}

export function useHiring(): HiringItem[] {
  return useSection<ApiContentItem & HiringItem>("hiring", HIRING_ITEMS).map((h) => ({
    id: h.slug,
    name: (h.name as string) ?? (h.title as string) ?? "",
    url: (h.url as string) ?? "",
    icon: (h.icon as string) ?? "Briefcase",
    tagline: (h.tagline as string) ?? (h.description as string) ?? "",
    category: (h.category as string) ?? "",
    tags: (h.tags as string[]) ?? [],
    isListing: (h.isListing as boolean) ?? undefined,
  }));
}

export function useMcpSkills(): McpSkill[] {
  return useSection<ApiContentItem & McpSkill>("mcp-skill", MCP_SKILLS).map((m) => ({
    id: m.slug,
    name: (m.name as string) ?? (m.title as string) ?? "",
    description: (m.description as string) ?? "",
    icon: (m.icon as string) ?? "Bot",
    category: (m.category as string) ?? "",
    tags: (m.tags as string[]) ?? [],
    url: (m.url as string) ?? undefined,
  }));
}

export function useStackBreakdowns(): StackBreakdownItem[] {
  return useSection<ApiContentItem & StackBreakdownItem>("stack-breakdown", STACK_BREAKDOWNS).map(
    (s) => ({
      slug: s.slug,
      productName: (s.productName as string) ?? (s.title as string) ?? "",
      title: (s.title as string) ?? (s.productName as string) ?? "",
      description: (s.description as string) ?? "",
      icon: (s.icon as string) ?? "Layers",
      faviconDomain: (s.faviconDomain as string) ?? "",
      tags: (s.tags as string[]) ?? [],
      body: (s.body as string) ?? "",
    }),
  );
}

export function useLearningResources(): LearningResource[] {
  return useSection<ApiContentItem & LearningResource>("learning-resource", learningResources).map(
    (l) => ({
      id: l.slug,
      title: (l.title as string) ?? "",
      description: (l.description as string) ?? "",
      url: (l.url as string) ?? "",
      category: (l.category as string) ?? "",
      cost: (l.resourceCost as LearningResource["cost"]) ?? undefined,
    }),
  );
}

// ─── Lookup hooks (for detail pages) ────────────────────────────

export function useGameBySlug(slug: string): (ApiContentItem & Game) | undefined {
  const map = useSectionMap<ApiContentItem & Game>("game", GAMES);
  const g = map[slug];
  return g
    ? ({ ...g, name: (g.name as string) ?? (g.title as string) ?? "" } as ApiContentItem & Game)
    : undefined;
}

export function useToolBySlug(slug: string): (ApiContentItem & Tool) | undefined {
  const map = useSectionMap<ApiContentItem & Tool>("tool", TOOLS);
  const t = map[slug];
  return t
    ? ({
        ...t,
        name: (t.name as string) ?? (t.title as string) ?? "",
        icon: (t.icon as string) ?? "",
        tagline: (t.tagline as string) ?? "",
      } as ApiContentItem & Tool)
    : undefined;
}

export function useCheatSheetBySlug(slug: string): CheatSheet | undefined {
  const map = useSectionMap<ApiContentItem & CheatSheet>("cheat-sheet", cheatSheets);
  const c = map[slug];
  return c
    ? ({
        id: c.slug,
        title: (c.title as string) ?? "",
        description: (c.description as string) ?? "",
        category: (c.category as string) ?? "",
        icon: (c.icon as string) ?? "",
        tags: (c.tags as string[]) ?? [],
        content: (c.content as CheatSheet["content"]) ?? [],
      } as CheatSheet)
    : undefined;
}

export function useStackBreakdownBySlug(slug: string): StackBreakdownItem | undefined {
  const map = useSectionMap<ApiContentItem & StackBreakdownItem>(
    "stack-breakdown",
    STACK_BREAKDOWNS,
  );
  const s = map[slug];
  return s
    ? ({
        slug: s.slug,
        productName: (s.productName as string) ?? (s.title as string) ?? "",
        title: (s.title as string) ?? (s.productName as string) ?? "",
        description: (s.description as string) ?? "",
        icon: (s.icon as string) ?? "",
        faviconDomain: (s.faviconDomain as string) ?? "",
        tags: (s.tags as string[]) ?? [],
        body: (s.body as string) ?? "",
      } as StackBreakdownItem)
    : undefined;
}

export function usePostBySlug(slug: string): Post | undefined {
  const map = useSectionMap<ApiContentItem & Post>("post", POSTS);
  const p = map[slug];
  return p
    ? ({
        id: (p.id as string) ?? slug,
        slug: p.slug,
        title: (p.title as string) ?? "",
        series: (p.series as string) ?? "",
        excerpt: (p.excerpt as string) ?? (p.description as string) ?? "",
        body: (p.body as string) ?? "",
        publishedAt: (p.publishedAt as string) ?? "",
        externalUrl: (p.externalUrl as string) ?? undefined,
        image: (p.image as string) ?? undefined,
      } as Post)
    : undefined;
}

export function useSeriesBySlug(slug: string) {
  const list = useSeriesList();
  return list.find((s) => s.slug === slug);
}

// ─── Provider ───────────────────────────────────────────────────

export function ContentSync() {
  useEffect(() => {
    void loadContent();
  }, []);
  return null;
}
