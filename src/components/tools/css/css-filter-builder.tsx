import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CssFilterBuilder() {
  const [filters, setFilters] = useState({ brightness: 1, contrast: 1, grayscale: 0, blur: 0, saturate: 1, sepia: 0, hueRotate: 0, invert: 0 });
  const [output, setOutput] = useState("");

  const update = (key: string, val: number) => setFilters({ ...filters, [key]: val });

  const generate = () => {
    const parts: string[] = [];
    if (filters.brightness !== 1) parts.push(`brightness(${filters.brightness})`);
    if (filters.contrast !== 1) parts.push(`contrast(${filters.contrast})`);
    if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale})`);
    if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
    if (filters.saturate !== 1) parts.push(`saturate(${filters.saturate})`);
    if (filters.sepia > 0) parts.push(`sepia(${filters.sepia})`);
    if (filters.hueRotate !== 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);
    if (filters.invert > 0) parts.push(`invert(${filters.invert})`);
    setOutput(`filter: ${parts.join(" ") || "none"};`);
  };

  return (
    <ToolLayout id="css-filter-builder">
      <div className="space-y-2">
        {Object.entries({ brightness: [0, 2], contrast: [0, 2], grayscale: [0, 1], blur: [0, 10], saturate: [0, 3], sepia: [0, 1], hueRotate: [-180, 180], invert: [0, 1] }).map(([key, [min, max]]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs font-mono w-20 text-muted-foreground">{key}</span>
            <input type="range" min={min} max={max} step={key === "blur" ? 0.5 : 0.1} value={filters[key as keyof typeof filters]} onChange={(e) => update(key, parseFloat(e.target.value))} className="flex-1 accent-yellow" />
            <span className="text-xs font-mono w-12 text-right">{filters[key as keyof typeof filters]}</span>
          </div>
        ))}
      </div>
      <ToolButton onClick={generate}>Generate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
