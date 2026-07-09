import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const generate = async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const results: Record<string, string> = {};
    for (const algo of ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]) {
      const hash = await crypto.subtle.digest(algo, data);
      results[algo] = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    setHashes(results);
  };

  return (
    <ToolLayout id="hash-generator">
      <ToolInput value={input} onChange={setInput} placeholder="Enter text to hash..." label="Input" rows={3} />
      <ToolButton onClick={generate}>Generate Hashes</ToolButton>
      {Object.entries(hashes).map(([algo, hash]) => (
        <div key={algo} className="flex items-center justify-between p-3 bg-paper-dim/50 border border-border rounded-sm">
          <div className="min-w-0"><span className="text-[10px] uppercase tracking-wider text-muted-foreground">{algo}</span><p className="font-mono text-xs text-foreground mt-0.5 break-all">{hash}</p></div>
          <button onClick={() => navigator.clipboard.writeText(hash)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-paper-dim transition-colors shrink-0 ml-2">Copy</button>
        </div>
      ))}
    </ToolLayout>
  );
}
