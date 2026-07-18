import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function TypeScaleGenerator() {
  const [base, setBase] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [output, setOutput] = useState<{ name: string; size: number; px: string; rem: string }[]>([]);

  const scales = [
    { name: "Minor Second", ratio: 1.067 },
    { name: "Major Second", ratio: 1.125 },
    { name: "Minor Third", ratio: 1.2 },
    { name: "Major Third", ratio: 1.25 },
    { name: "Perfect Fourth", ratio: 1.333 },
    { name: "Augmented Fourth", ratio: 1.414 },
    { name: "Perfect Fifth", ratio: 1.5 },
    { name: "Golden Ratio", ratio: 1.618 },
  ];

  const generate = (r?: number) => {
    const useRatio = r || ratio;
    const levels = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"];
    setOutput(levels.map((name, i) => {
      const size = base * Math.pow(useRatio, i - 2);
      return { name, size, px: `${size.toFixed(1)}px`, rem: `${(size / 16).toFixed(3)}rem` };
    }));
  };

  return (
    <ToolLayout id="type-scale-generator">
      <div className="flex gap-2 flex-wrap">
        {scales.map((s) => <button key={s.name} onClick={() => { setRatio(s.ratio); generate(s.ratio); }} className="px-3 py-1.5 text-xs rounded-full border border-border text-muted-foreground hover:border-yellow/50 transition-all">{s.name}</button>)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Base Size (px)</label><input type="number" value={base} onChange={(e) => setBase(Number(e.target.value))} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Ratio</label><input type="number" step="0.01" value={ratio} onChange={(e) => setRatio(parseFloat(e.target.value))} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
      </div>
      <ToolButton onClick={() => generate()}>Generate Scale</ToolButton>
      {output.length > 0 && (
        <div className="space-y-2">
          {output.map((s) => (
            <div key={s.name} className="flex items-center justify-between p-3 bg-paper-dim/50 border border-border rounded-sm">
              <span className="text-xs text-muted-foreground w-12">{s.name}</span>
              <span className="font-sans text-foreground" style={{ fontSize: s.px }}>{s.name}</span>
              <code className="font-mono text-xs text-muted-foreground">{s.px} / {s.rem}</code>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
