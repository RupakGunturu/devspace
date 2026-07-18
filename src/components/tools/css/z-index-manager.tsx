import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ZIndexManager() {
  const [items, setItems] = useState([{ name: "header", zIndex: 100 }, { name: "sidebar", zIndex: 50 }, { name: "modal", zIndex: 200 }, { name: "tooltip", zIndex: 300 }]);
  const [output, setOutput] = useState("");

  const add = () => setItems([...items, { name: "", zIndex: 0 }]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, val: string | number) => setItems(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const generate = () => {
    const sorted = [...items].sort((a, b) => b.zIndex - a.zIndex);
    setOutput(sorted.map((item) => `${item.name}: z-index: ${item.zIndex};`).join("\n"));
  };

  return (
    <ToolLayout id="z-index-manager">
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input value={item.name} onChange={(e) => update(i, "name", e.target.value)} placeholder="name" className="flex-1 p-2 bg-paper-dim/50 border border-border rounded text-xs font-mono text-foreground" />
            <div className="flex items-center gap-2">
              <input type="number" value={item.zIndex} onChange={(e) => update(i, "zIndex", Number(e.target.value))} className="w-24 p-2 bg-paper-dim/50 border border-border rounded text-xs font-mono text-foreground" placeholder="z-index" />
              <button onClick={() => remove(i)} className="text-sm text-coral">✕</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2"><ToolButton onClick={add} variant="secondary">Add</ToolButton><ToolButton onClick={generate}>Generate</ToolButton></div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
