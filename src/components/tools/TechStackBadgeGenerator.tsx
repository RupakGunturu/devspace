import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";

const CATEGORIES: Record<string, { label: string; items: string[] }> = {
  Languages: {
    label: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "Rust", "Go", "Java"],
  },
  Frameworks: {
    label: "Frameworks",
    items: ["React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt"],
  },
  Tools: {
    label: "Tools",
    items: ["Docker", "Kubernetes", "AWS", "GCP", "Firebase"],
  },
};

const BADGE_COLORS: Record<string, string> = {
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  Python: "#3776AB",
  Rust: "#000000",
  Go: "#00ADD8",
  Java: "#ED8B00",
  React: "#61DAFB",
  Vue: "#4FC08D",
  Angular: "#DD0031",
  Svelte: "#FF3E00",
  "Next.js": "#000000",
  Nuxt: "#00DC82",
  Docker: "#2496ED",
  Kubernetes: "#326CE5",
  AWS: "#FF9900",
  GCP: "#4285F4",
  Firebase: "#FFCA28",
};

export function TechStackBadgeGenerator() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const markdown = selected.map((s) => {
    const color = BADGE_COLORS[s] || "#999";
    const fg = isLight(color) ? "#000" : "#fff";
    return `![${s}](https://img.shields.io/badge/-${encodeURIComponent(s)}-${color.replace("#", "")}?style=for-the-badge&logo=&logoColor=${fg.replace("#", "")})`;
  }).join("\n");

  function isLight(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  }

  return (
    <ToolLayout id="tech-stack-badge-generator">
      {Object.entries(CATEGORIES).map(([catKey, cat]) => (
        <div key={catKey}>
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
            {cat.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {cat.items.map((item) => {
              const active = selected.includes(item);
              const bg = BADGE_COLORS[item] || "#999";
              const fg = isLight(bg) ? "#000" : "#fff";
              return (
                <button
                  key={item}
                  onClick={() => toggle(item)}
                  className="rounded-full border-2 px-3 py-1.5 font-mono text-xs font-medium transition-all"
                  style={{
                    borderColor: active ? bg : "var(--border)",
                    backgroundColor: active ? bg : "transparent",
                    color: active ? fg : "var(--foreground)",
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {selected.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Badges ({selected.length})
            </span>
            <ToolButton onClick={() => navigator.clipboard.writeText(markdown)} variant="secondary">
              Copy Markdown
            </ToolButton>
          </div>

          <div className="flex flex-wrap gap-2">
            {selected.map((item) => {
              const bg = BADGE_COLORS[item] || "#999";
              const fg = isLight(bg) ? "#000" : "#fff";
              return (
                <div
                  key={item}
                  className="group flex items-center gap-1 rounded-full px-3 py-1.5 font-mono text-xs font-semibold"
                  style={{ backgroundColor: bg, color: fg }}
                >
                  {item}
                  <CopyButton
                    text={item}
                    className="border-0 px-1 py-0 opacity-0 group-hover:opacity-100"
                  />
                </div>
              );
            })}
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Markdown Output
              </span>
              <CopyButton text={markdown} />
            </div>
            <pre className="max-h-[200px] overflow-auto whitespace-pre-wrap break-all font-mono text-xs text-foreground">
              {markdown}
            </pre>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
