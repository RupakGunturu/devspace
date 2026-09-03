import { useMemo, useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { SectionHead, StickerCard } from "../components/site";
import { MCP_SKILL_CATEGORIES, MCP_SKILL_COLORS } from "../data/mcp-skills";
import { useMcpSkills } from "../lib/contentStore";
import { cn } from "@/lib/utils";
import { CursorHover } from "../components/core/cursor-hover";
import { usePagination } from "../hooks/use-pagination";
import { PaginationBar } from "../components/PaginationBar";

export default function McpSkills() {
  useEffect(() => {
    document.title = "MCP Skills — DevSpace";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const MCP_SKILLS = useMcpSkills();

  const filteredSkills = useMemo(() => {
    let result = MCP_SKILLS;
    if (activeCategory) {
      result = result.filter((s) => s.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [MCP_SKILLS, activeCategory, searchQuery]);

  const { page, totalPages, paginatedItems, goTo } = usePagination(filteredSkills);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
      <SectionHead idx="02" title="MCP Skills" color="coral" />
      <p className="mb-6 max-w-xl text-sm text-muted">
        Free Model Context Protocol servers and tools to extend your AI workflows. All skills listed
        here are open-source and free to use.
      </p>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search skills, tags..."
          className="w-full rounded-sm border-2 border-line bg-transparent px-4 py-2 font-mono text-sm text-foreground placeholder:text-muted focus:border-coral focus:outline-none sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={cn(
              "rounded-full border-2 px-3 py-1 font-mono text-[11px] font-bold transition-colors",
              activeCategory === null
                ? "border-coral bg-coral text-ink"
                : "border-line text-muted hover:border-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {Object.entries(MCP_SKILL_CATEGORIES).map(([key, { label, color }]) => (
            <button
              type="button"
              key={key}
              onClick={() => setActiveCategory(activeCategory === key ? null : key)}
              className={cn(
                "rounded-full border-2 px-3 py-1 font-mono text-[11px] font-bold transition-colors",
                activeCategory === key
                  ? "text-ink"
                  : "border-line text-muted hover:text-foreground",
              )}
              style={
                activeCategory === key ? { borderColor: color, backgroundColor: color } : undefined
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {paginatedItems.map((skill, i) => {
          const colors = MCP_SKILL_COLORS[skill.category];
          const Wrapper = skill.url ? "a" : "div";
          const wrapperProps = skill.url
            ? { href: skill.url, target: "_blank", rel: "noopener noreferrer" }
            : {};
          return (
            <CursorHover
              label={skill.name}
              color={MCP_SKILL_CATEGORIES[skill.category]?.color}
              key={skill.id}
            >
              <Wrapper {...wrapperProps} className="no-underline">
                <StickerCard
                  icon={
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        colors?.bg ?? "bg-zinc-100",
                        colors?.darkBg ?? "dark:bg-zinc-800",
                      )}
                    >
                      <span className={cn("text-sm font-bold", colors?.icon ?? "text-zinc-600")}>
                        {skill.name.charAt(0)}
                      </span>
                    </div>
                  }
                  title={skill.name}
                  index={i}
                  actions={
                    skill.url ? <ExternalLink className="h-4 w-4 shrink-0 text-muted" /> : undefined
                  }
                >
                  <span className="block">{skill.description}</span>
                  <span
                    className={cn(
                      "mt-2 inline-block rounded-full px-2 py-0.5 font-mono text-[10px] font-bold",
                      colors?.bg ?? "bg-zinc-100",
                      colors?.darkBg ?? "dark:bg-zinc-800",
                      colors?.icon ?? "text-zinc-600",
                    )}
                  >
                    {MCP_SKILL_CATEGORIES[skill.category]?.label}
                  </span>
                </StickerCard>
              </Wrapper>
            </CursorHover>
          );
        })}
        {filteredSkills.length === 0 && (
          <p className="col-span-full py-12 text-center font-mono text-sm text-muted">
            No MCP skills match your search.
          </p>
        )}
      </div>
      <PaginationBar page={page} totalPages={totalPages} onPageChange={goTo} />
    </section>
  );
}
