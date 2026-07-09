import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CaseConverterTool() {
  const [input, setInput] = useState("");

  const toCamel = (s: string) => s.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : "").replace(/^(.)/, (c) => c.toLowerCase());
  const toPascal = (s: string) => s.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : "").replace(/^(.)/, (c) => c.toUpperCase());
  const toSnake = (s: string) => s.replace(/([A-Z])/g, "_$1").replace(/[-\s]+/g, "_").toLowerCase().replace(/^_/, "");
  const toKebab = (s: string) => s.replace(/([A-Z])/g, "-$1").replace(/[_\s]+/g, "-").toLowerCase().replace(/^-/, "");
  const toConstant = (s: string) => s.replace(/([A-Z])/g, "_$1").replace(/[-\s]+/g, "_").toUpperCase().replace(/^_/, "");
  const toDot = (s: string) => s.replace(/([A-Z])/g, ".$1").replace(/[-_\s]+/g, ".").toLowerCase().replace(/^\./, "");

  const results = [
    { label: "camelCase", value: toCamel(input) },
    { label: "PascalCase", value: toPascal(input) },
    { label: "snake_case", value: toSnake(input) },
    { label: "kebab-case", value: toKebab(input) },
    { label: "CONSTANT_CASE", value: toConstant(input) },
    { label: "dot.case", value: toDot(input) },
  ];

  return (
    <ToolLayout id="case-converter">
      <ToolInput value={input} onChange={setInput} placeholder="Enter text to convert..." label="Input Text" rows={3} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {results.map((r) => (
          <div key={r.label} className="flex items-center justify-between p-3 bg-paper-dim/50 border border-border rounded-sm">
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.label}</span>
              <p className="font-mono text-sm text-foreground mt-0.5 break-all">{r.value || "—"}</p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(r.value)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-paper-dim transition-colors shrink-0 ml-2">Copy</button>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
