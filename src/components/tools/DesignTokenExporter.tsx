import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

interface ColorToken {
  name: string;
  hex: string;
}
interface SpacingToken {
  name: string;
  value: string;
}
interface FontToken {
  name: string;
  size: string;
}

type ExportFormat = "css" | "json" | "tailwind";

export function DesignTokenExporter() {
  const [colors, setColors] = useState<ColorToken[]>([{ name: "primary", hex: "#3B82F6" }]);
  const [spacings, setSpacings] = useState<SpacingToken[]>([{ name: "md", value: "16px" }]);
  const [fonts, setFonts] = useState<FontToken[]>([{ name: "body", size: "16px" }]);
  const [format, setFormat] = useState<ExportFormat>("css");
  const { color } = useToolAccent();

  const addColor = () => setColors([...colors, { name: "", hex: "#000000" }]);
  const addSpacing = () => setSpacings([...spacings, { name: "", value: "" }]);
  const addFont = () => setFonts([...fonts, { name: "", size: "" }]);

  const updateColor = (i: number, field: keyof ColorToken, val: string) => {
    const next = [...colors];
    next[i] = { ...next[i], [field]: val };
    setColors(next);
  };
  const removeColor = (i: number) => setColors(colors.filter((_, idx) => idx !== i));

  const updateSpacing = (i: number, field: keyof SpacingToken, val: string) => {
    const next = [...spacings];
    next[i] = { ...next[i], [field]: val };
    setSpacings(next);
  };
  const removeSpacing = (i: number) => setSpacings(spacings.filter((_, idx) => idx !== i));

  const updateFont = (i: number, field: keyof FontToken, val: string) => {
    const next = [...fonts];
    next[i] = { ...next[i], [field]: val };
    setFonts(next);
  };
  const removeFont = (i: number) => setFonts(fonts.filter((_, idx) => idx !== i));

  const output = useMemo(() => {
    if (format === "css") {
      const lines = [":root {"];
      colors.forEach((c) => {
        if (c.name) lines.push(`  --color-${c.name}: ${c.hex};`);
      });
      spacings.forEach((s) => {
        if (s.name) lines.push(`  --spacing-${s.name}: ${s.value};`);
      });
      fonts.forEach((f) => {
        if (f.name) lines.push(`  --font-${f.name}: ${f.size};`);
      });
      lines.push("}");
      return lines.join("\n");
    }
    if (format === "json") {
      const obj: Record<string, Record<string, string>> = {};
      colors.forEach((c) => {
        if (c.name) {
          if (!obj.colors) obj.colors = {};
          obj.colors[c.name] = c.hex;
        }
      });
      spacings.forEach((s) => {
        if (s.name) {
          if (!obj.spacing) obj.spacing = {};
          obj.spacing[s.name] = s.value;
        }
      });
      fonts.forEach((f) => {
        if (f.name) {
          if (!obj.fontSize) obj.fontSize = {};
          obj.fontSize[f.name] = f.size;
        }
      });
      return JSON.stringify(obj, null, 2);
    }
    const lines = ["module.exports = {", "  theme: {", "    extend: {"];
    if (colors.length) {
      lines.push("      colors: {");
      colors.forEach((c) => {
        if (c.name) lines.push(`        '${c.name}': '${c.hex}',`);
      });
      lines.push("      },");
    }
    if (spacings.length) {
      lines.push("      spacing: {");
      spacings.forEach((s) => {
        if (s.name) lines.push(`        '${s.name}': '${s.value}',`);
      });
      lines.push("      },");
    }
    if (fonts.length) {
      lines.push("      fontSize: {");
      fonts.forEach((f) => {
        if (f.name) lines.push(`        '${f.name}': '${f.size}',`);
      });
      lines.push("      },");
    }
    lines.push("    },");
    lines.push("  },");
    lines.push("};");
    return lines.join("\n");
  }, [colors, spacings, fonts, format]);

  return (
    <ToolLayout id="design-token-exporter">
      <div className="flex flex-wrap gap-2">
        {(["css", "json", "tailwind"] as ExportFormat[]).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className="rounded-full border-2 px-3 py-1.5 font-mono text-xs font-medium capitalize transition-all"
            style={{
              borderColor: format === f ? color : "var(--border)",
              backgroundColor: format === f ? color : undefined,
              color: format === f ? "#fff" : undefined,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Colors
            </span>
            <button onClick={addColor} className="font-mono text-xs underline" style={{ color }}>
              + Add
            </button>
          </div>
          {colors.map((c, i) => (
            <div key={i} className="mb-2 flex items-center gap-2">
              <input
                type="color"
                value={c.hex}
                onChange={(e) => updateColor(i, "hex", e.target.value)}
                className="h-8 w-8 cursor-pointer border-0 bg-transparent"
              />
              <input
                type="text"
                value={c.hex}
                onChange={(e) => updateColor(i, "hex", e.target.value)}
                className="w-24 rounded border border-line bg-input-bg px-2 py-1 font-mono text-xs text-foreground"
              />
              <input
                type="text"
                value={c.name}
                onChange={(e) => updateColor(i, "name", e.target.value)}
                placeholder="name"
                className="flex-1 rounded border border-line bg-input-bg px-2 py-1 font-mono text-xs text-foreground"
              />
              <button onClick={() => removeColor(i)} className="font-mono text-xs text-red-500">
                ✕
              </button>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Spacing
            </span>
            <button onClick={addSpacing} className="font-mono text-xs underline" style={{ color }}>
              + Add
            </button>
          </div>
          {spacings.map((s, i) => (
            <div key={i} className="mb-2 flex items-center gap-2">
              <input
                type="text"
                value={s.name}
                onChange={(e) => updateSpacing(i, "name", e.target.value)}
                placeholder="name"
                className="w-24 rounded border border-line bg-input-bg px-2 py-1 font-mono text-xs text-foreground"
              />
              <input
                type="text"
                value={s.value}
                onChange={(e) => updateSpacing(i, "value", e.target.value)}
                placeholder="e.g. 16px"
                className="flex-1 rounded border border-line bg-input-bg px-2 py-1 font-mono text-xs text-foreground"
              />
              <button onClick={() => removeSpacing(i)} className="font-mono text-xs text-red-500">
                ✕
              </button>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Font Sizes
            </span>
            <button onClick={addFont} className="font-mono text-xs underline" style={{ color }}>
              + Add
            </button>
          </div>
          {fonts.map((f, i) => (
            <div key={i} className="mb-2 flex items-center gap-2">
              <input
                type="text"
                value={f.name}
                onChange={(e) => updateFont(i, "name", e.target.value)}
                placeholder="name"
                className="w-24 rounded border border-line bg-input-bg px-2 py-1 font-mono text-xs text-foreground"
              />
              <input
                type="text"
                value={f.size}
                onChange={(e) => updateFont(i, "size", e.target.value)}
                placeholder="e.g. 16px"
                className="flex-1 rounded border border-line bg-input-bg px-2 py-1 font-mono text-xs text-foreground"
              />
              <button onClick={() => removeFont(i)} className="font-mono text-xs text-red-500">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Exported {format.toUpperCase()}
          </span>
          <CopyButton text={output} />
        </div>
        <pre className="max-h-[300px] overflow-auto rounded-md border-2 border-line bg-input-bg p-4 font-mono text-xs text-foreground">
          {output}
        </pre>
      </div>
    </ToolLayout>
  );
}
