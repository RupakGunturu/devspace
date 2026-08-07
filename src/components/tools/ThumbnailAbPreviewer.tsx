import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

interface Variant {
  title: string;
  bgColor: string;
  notes: string;
}

export function ThumbnailAbPreviewer() {
  const [variantA, setVariantA] = useState<Variant>({ title: "10 Tips for Better Code", bgColor: "#1E293B", notes: "" });
  const [variantB, setVariantB] = useState<Variant>({ title: "Master Programming Today", bgColor: "#7C3AED", notes: "" });
  const { color } = useToolAccent();

  const updateA = (field: keyof Variant, val: string) => setVariantA({ ...variantA, [field]: val });
  const updateB = (field: keyof Variant, val: string) => setVariantB({ ...variantB, [field]: val });

  const isLight = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  };

  return (
    <ToolLayout id="thumbnail-ab-previewer">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">Variant A</span>
          <input
            type="text"
            value={variantA.title}
            onChange={(e) => updateA("title", e.target.value)}
            placeholder="Title text"
            className="w-full rounded-md border-2 border-line bg-input-bg p-2 font-mono text-sm text-foreground outline-none"
          />
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={variantA.bgColor}
              onChange={(e) => updateA("bgColor", e.target.value)}
              className="h-8 w-8 cursor-pointer border-0 bg-transparent"
            />
            <span className="font-mono text-xs text-muted">{variantA.bgColor}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">Variant B</span>
          <input
            type="text"
            value={variantB.title}
            onChange={(e) => updateB("title", e.target.value)}
            placeholder="Title text"
            className="w-full rounded-md border-2 border-line bg-input-bg p-2 font-mono text-sm text-foreground outline-none"
          />
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={variantB.bgColor}
              onChange={(e) => updateB("bgColor", e.target.value)}
              className="h-8 w-8 cursor-pointer border-0 bg-transparent"
            />
            <span className="font-mono text-xs text-muted">{variantB.bgColor}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <p className="mb-2 font-mono text-[10px] uppercase text-muted text-center">Variant A Preview</p>
          <div
            className="flex aspect-video items-center justify-center rounded-lg p-4 text-center"
            style={{ backgroundColor: variantA.bgColor }}
          >
            <span
              className="text-lg font-bold leading-tight"
              style={{ color: isLight(variantA.bgColor) ? "#000" : "#fff" }}
            >
              {variantA.title || "Your Title"}
            </span>
          </div>
        </div>
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <p className="mb-2 font-mono text-[10px] uppercase text-muted text-center">Variant B Preview</p>
          <div
            className="flex aspect-video items-center justify-center rounded-lg p-4 text-center"
            style={{ backgroundColor: variantB.bgColor }}
          >
            <span
              className="text-lg font-bold leading-tight"
              style={{ color: isLight(variantB.bgColor) ? "#000" : "#fff" }}
            >
              {variantB.title || "Your Title"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Notes — Variant A
          </label>
          <textarea
            value={variantA.notes}
            onChange={(e) => updateA("notes", e.target.value)}
            placeholder="Observations about Variant A..."
            rows={3}
            className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Notes — Variant B
          </label>
          <textarea
            value={variantB.notes}
            onChange={(e) => updateB("notes", e.target.value)}
            placeholder="Observations about Variant B..."
            rows={3}
            className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
