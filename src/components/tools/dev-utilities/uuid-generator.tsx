import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => {
    const result: string[] = [];
    for (let i = 0; i < count; i++) result.push(crypto.randomUUID());
    setUuids(result);
  };

  return (
    <ToolLayout id="uuid-generator">
      <div className="flex items-center gap-4">
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Count</label><input type="number" value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))} className="w-24 p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
        <ToolButton onClick={generate}>Generate</ToolButton>
      </div>
      {uuids.length > 0 && <div className="space-y-1.5">{uuids.map((uuid, i) => <div key={i} className="flex items-center justify-between p-2.5 bg-paper-dim/50 border border-border rounded-sm"><code className="font-mono text-sm text-foreground">{uuid}</code><button onClick={() => navigator.clipboard.writeText(uuid)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-paper-dim">Copy</button></div>)}</div>}
    </ToolLayout>
  );
}
