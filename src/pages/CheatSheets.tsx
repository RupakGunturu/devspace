import { Link } from "react-router-dom";
import { useEffect } from "react";
import { SectionHead, StickerCard } from "../components/site";
import { cheatSheets } from "../data/cheat-sheets";
import { ToolIcon } from "../components/tools/ToolIcon";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, { bg: string; darkBg: string; icon: string }> = {
  "version-control": { bg: "bg-orange-100", darkBg: "dark:bg-orange-900/30", icon: "text-orange-600 dark:text-orange-400" },
  "css": { bg: "bg-blue-100", darkBg: "dark:bg-blue-900/30", icon: "text-blue-600 dark:text-blue-400" },
  "computer-science": { bg: "bg-purple-100", darkBg: "dark:bg-purple-900/30", icon: "text-purple-600 dark:text-purple-400" },
  "javascript": { bg: "bg-yellow-100", darkBg: "dark:bg-yellow-900/30", icon: "text-yellow-600 dark:text-yellow-400" },
  "react": { bg: "bg-cyan-100", darkBg: "dark:bg-cyan-900/30", icon: "text-cyan-600 dark:text-cyan-400" },
  "devops": { bg: "bg-emerald-100", darkBg: "dark:bg-emerald-900/30", icon: "text-emerald-600 dark:text-emerald-400" },
  "typescript": { bg: "bg-indigo-100", darkBg: "dark:bg-indigo-900/30", icon: "text-indigo-600 dark:text-indigo-400" },
  "backend": { bg: "bg-rose-100", darkBg: "dark:bg-rose-900/30", icon: "text-rose-600 dark:text-rose-400" },
  "python": { bg: "bg-green-100", darkBg: "dark:bg-green-900/30", icon: "text-green-600 dark:text-green-400" },
  "database": { bg: "bg-amber-100", darkBg: "dark:bg-amber-900/30", icon: "text-amber-600 dark:text-amber-400" },
  "security": { bg: "bg-red-100", darkBg: "dark:bg-red-900/30", icon: "text-red-600 dark:text-red-400" },
  "performance": { bg: "bg-lime-100", darkBg: "dark:bg-lime-900/30", icon: "text-lime-600 dark:text-lime-400" },
  "productivity": { bg: "bg-pink-100", darkBg: "dark:bg-pink-900/30", icon: "text-pink-600 dark:text-pink-400" },
  "accessibility": { bg: "bg-teal-100", darkBg: "dark:bg-teal-900/30", icon: "text-teal-600 dark:text-teal-400" },
};

export default function CheatSheetsIndex() {
  useEffect(() => {
    document.title = "Cheat Sheets — DevSpace";
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
      <SectionHead idx="03" title="Cheat Sheets" />
      <p className="mb-10 max-w-xl text-sm text-muted">
        Quick references for every developer. Search, learn, copy.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {cheatSheets.map((s, i) => (
          <StickerCard
            key={s.id}
            icon={
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                CATEGORY_COLORS[s.category]?.bg ?? "bg-zinc-100",
                CATEGORY_COLORS[s.category]?.darkBg ?? "dark:bg-zinc-800",
              )}>
                <ToolIcon name={s.icon} className={CATEGORY_COLORS[s.category]?.icon} />
              </div>
            }
            title={s.title}
            index={i}
            to={`/cheat-sheets/${s.id}`}
          >
            {s.description}
          </StickerCard>
        ))}
      </div>
    </section>
  );
}
