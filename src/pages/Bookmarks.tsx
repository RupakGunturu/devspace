import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { userActivity } from "@/lib/userActivity";
import { TOOLS, CATEGORY_COLORS } from "@/data/tools";
import { ToolIcon } from "@/components/tools/ToolIcon";
import { tips } from "@/data/tips";
import { cheatSheets } from "@/data/cheat-sheets";
import { allStackBreakdowns } from "@/data/stack-breakdowns";
import { StickerCard, SectionHead } from "@/components/site";
import { CursorHover } from "@/components/core/cursor-hover";
import BookmarkButton from "@/components/BookmarkButton";
import { cn } from "@/lib/utils";
import type { Favorite } from "@/lib/api";

const TABS = [
  { key: "all", label: "All" },
  { key: "tool", label: "Tools" },
  { key: "tip", label: "Tips" },
  { key: "cheatsheet", label: "Sheets" },
  { key: "stack-breakdown", label: "Stacks" },
] as const;

const TOOL_COLORS: Record<string, string> = {
  css: "#3b82f6", color: "#ec4899", "dev-utilities": "#64748b", "text-content": "#d97706",
  converters: "#14b8a6", ai: "#8b5cf6", seo: "#22c55e", security: "#ef4444",
  image: "#d946ef", "code-tools": "#6366f1", typography: "#78716c", math: "#10b981",
  productivity: "#eab308", fun: "#f97316",
};

const SHEET_COLORS: Record<string, string> = {
  "version-control": "#f97316", css: "#3b82f6", "computer-science": "#a855f7",
  javascript: "#eab308", react: "#06b6d4", devops: "#10b981", typescript: "#6366f1",
  backend: "#f43f5e", python: "#22c55e", database: "#d97706", security: "#ef4444",
  performance: "#84cc16", productivity: "#ec4899", accessibility: "#14b8a6",
};

const SB_COLORS: Record<string, string> = {
  instagram: "#E1306C", stripe: "#635BFF", uber: "#276EF1", amazon: "#FF9900",
  spotify: "#1DB954", netflix: "#E50914", whatsapp: "#25D366", zomato: "#E23744",
  swiggy: "#FC8019", discord: "#5865F2",
};

export default function Bookmarks() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    document.title = "Bookmarks — DevSpace";
  }, []);

  useEffect(() => {
    if (user) {
      userActivity.get().then((data) => setFavorites(data.favorites));
    }
  }, [user]);

  if (!user) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <SectionHead idx="★" title="Bookmarks" />
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <div className="text-5xl">🔖</div>
          <p className="text-muted">Sign in to see your bookmarks.</p>
          <Link
            to="/login"
            className="rounded-sm bg-yellow px-4 py-2 font-mono text-[11px] font-bold text-ink no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(244,217,34,0.4)]"
          >
            Sign In
          </Link>
        </div>
      </section>
    );
  }

  const filtered = activeTab === "all"
    ? favorites
    : favorites.filter((f) => f.type === activeTab);

  const counts = {
    all: favorites.length,
    tool: favorites.filter((f) => f.type === "tool").length,
    tip: favorites.filter((f) => f.type === "tip").length,
    cheatsheet: favorites.filter((f) => f.type === "cheatsheet").length,
    "stack-breakdown": favorites.filter((f) => f.type === "stack-breakdown").length,
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
      <SectionHead idx="★" title="Bookmarks" />
      <p className="mb-6 max-w-xl text-sm text-muted">
        All your saved tools, tips, sheets, and stacks in one place.
      </p>

      {/* Tab bar */}
      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] font-bold transition-colors ${
              activeTab === tab.key
                ? "border-yellow bg-yellow text-ink"
                : "border-line text-muted hover:border-yellow hover:text-yellow"
            }`}
          >
            {tab.label}
            {counts[tab.key as keyof typeof counts] > 0 && (
              <span className="ml-1 opacity-60">
                {counts[tab.key as keyof typeof counts]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mb-4 text-4xl">
            {activeTab === "all" ? "🔖" : activeTab === "tool" ? "🛠️" : activeTab === "tip" ? "💡" : activeTab === "cheatsheet" ? "📋" : "🧱"}
          </div>
          <p className="font-mono text-sm text-muted">
            No bookmarked {activeTab === "all" ? "items" : `${activeTab}s`} yet.
          </p>
          <Link
            to={activeTab === "tool" ? "/tools" : activeTab === "tip" ? "/tips" : activeTab === "cheatsheet" ? "/cheat-sheets" : activeTab === "stack-breakdown" ? "/stack-breakdown" : "/"}
            className="mt-4 inline-block font-mono text-xs text-yellow no-underline hover:underline"
          >
            Browse {activeTab === "all" ? "content" : `${activeTab === "cheatsheet" ? "cheat sheets" : activeTab === "stack-breakdown" ? "stack breakdowns" : `${activeTab}s`} →`}
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((fav) => {
            if (fav.type === "tool") {
              const tool = TOOLS.find((t) => t.slug === fav.slug);
              if (!tool) return null;
              return (
                <CursorHover label={tool.name} color={TOOL_COLORS[tool.category]} key={fav.slug}>
                  <div className="relative">
                    <BookmarkButton type="tool" slug={tool.slug} className="absolute right-2 top-2 z-10" />
                    <StickerCard
                      icon={
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          CATEGORY_COLORS[tool.category]?.bg ?? "bg-zinc-100",
                          CATEGORY_COLORS[tool.category]?.darkBg ?? "dark:bg-zinc-800",
                        )}>
                          <ToolIcon name={tool.icon} className={CATEGORY_COLORS[tool.category]?.icon} />
                        </div>
                      }
                      title={tool.name}
                      to={`/tools/${tool.slug}`}
                    >
                      {tool.tagline}
                    </StickerCard>
                  </div>
                </CursorHover>
              );
            }

            if (fav.type === "tip") {
              const tip = tips.find((t) => t.id === fav.slug);
              if (!tip) return null;
              return (
                <CursorHover label={tip.title} color="#eab308" key={fav.slug}>
                  <div className="relative">
                    <BookmarkButton type="tip" slug={tip.id} className="absolute right-2 top-2 z-10" />
                    <StickerCard
                      icon={tip.icon}
                      title={tip.title}
                    >
                      {tip.content.slice(0, 100)}...
                    </StickerCard>
                  </div>
                </CursorHover>
              );
            }

            if (fav.type === "cheatsheet") {
              const sheet = cheatSheets.find((s) => s.id === fav.slug);
              if (!sheet) return null;
              return (
                <CursorHover label={sheet.title} color={SHEET_COLORS[sheet.category]} key={fav.slug}>
                  <div className="relative">
                    <BookmarkButton type="cheatsheet" slug={sheet.id} className="absolute right-2 top-2 z-10" />
                    <StickerCard
                      icon={
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          CATEGORY_COLORS_MAP[sheet.category]?.bg ?? "bg-zinc-100",
                          CATEGORY_COLORS_MAP[sheet.category]?.darkBg ?? "dark:bg-zinc-800",
                        )}>
                          <ToolIcon name={sheet.icon} className={CATEGORY_COLORS_MAP[sheet.category]?.icon} />
                        </div>
                      }
                      title={sheet.title}
                      to={`/cheat-sheets/${sheet.id}`}
                    >
                      {sheet.description}
                    </StickerCard>
                  </div>
                </CursorHover>
              );
            }

            if (fav.type === "stack-breakdown") {
              const breakdowns = allStackBreakdowns();
              const sb = breakdowns.find((b) => b.slug === fav.slug);
              if (!sb) return null;
              return (
                <CursorHover label={sb.productName} color={SB_COLORS[sb.slug]} key={fav.slug}>
                  <div className="relative">
                    <BookmarkButton type="stack-breakdown" slug={sb.slug} className="absolute right-2 top-2 z-10" />
                    <StickerCard
                      icon={
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${sb.faviconDomain}&sz=64`}
                            alt={sb.productName}
                            className="h-7 w-7 rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.parentElement!.textContent = sb.icon;
                            }}
                          />
                        </div>
                      }
                      title={sb.productName}
                      to={`/stack-breakdown/${sb.slug}`}
                    >
                      {sb.description}
                    </StickerCard>
                  </div>
                </CursorHover>
              );
            }

            return null;
          })}
        </div>
      )}
    </section>
  );
}

const CATEGORY_COLORS_MAP: Record<string, { bg: string; darkBg: string; icon: string }> = {
  "version-control": { bg: "bg-orange-100", darkBg: "dark:bg-orange-900/30", icon: "text-orange-600 dark:text-orange-400" },
  css: { bg: "bg-blue-100", darkBg: "dark:bg-blue-900/30", icon: "text-blue-600 dark:text-blue-400" },
  "computer-science": { bg: "bg-purple-100", darkBg: "dark:bg-purple-900/30", icon: "text-purple-600 dark:text-purple-400" },
  javascript: { bg: "bg-yellow-100", darkBg: "dark:bg-yellow-900/30", icon: "text-yellow-600 dark:text-yellow-400" },
  react: { bg: "bg-cyan-100", darkBg: "dark:bg-cyan-900/30", icon: "text-cyan-600 dark:text-cyan-400" },
  devops: { bg: "bg-emerald-100", darkBg: "dark:bg-emerald-900/30", icon: "text-emerald-600 dark:text-emerald-400" },
  typescript: { bg: "bg-indigo-100", darkBg: "dark:bg-indigo-900/30", icon: "text-indigo-600 dark:text-indigo-400" },
  backend: { bg: "bg-rose-100", darkBg: "dark:bg-rose-900/30", icon: "text-rose-600 dark:text-rose-400" },
  python: { bg: "bg-green-100", darkBg: "dark:bg-green-900/30", icon: "text-green-600 dark:text-green-400" },
  database: { bg: "bg-amber-100", darkBg: "dark:bg-amber-900/30", icon: "text-amber-600 dark:text-amber-400" },
  security: { bg: "bg-red-100", darkBg: "dark:bg-red-900/30", icon: "text-red-600 dark:text-red-400" },
  performance: { bg: "bg-lime-100", darkBg: "dark:bg-lime-900/30", icon: "text-lime-600 dark:text-lime-400" },
  productivity: { bg: "bg-pink-100", darkBg: "dark:bg-pink-900/30", icon: "text-pink-600 dark:text-pink-400" },
  accessibility: { bg: "bg-teal-100", darkBg: "dark:bg-teal-900/30", icon: "text-teal-600 dark:text-teal-400" },
};
