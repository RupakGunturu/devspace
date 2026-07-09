import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function PasswordHasher() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const hash = async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const sha256 = await crypto.subtle.digest("SHA-256", data);
    const sha1 = await crypto.subtle.digest("SHA-1", data);
    setHashes({
      "SHA-256": Array.from(new Uint8Array(sha256)).map((b) => b.toString(16).padStart(2, "0")).join(""),
      "SHA-1": Array.from(new Uint8Array(sha1)).map((b) => b.toString(16).padStart(2, "0")).join(""),
    });
  };

  return (
    <ToolLayout id="password-hasher">
      <ToolInput value={input} onChange={setInput} placeholder="Enter password to hash..." label="Password" rows={2} />
      <ToolButton onClick={hash}>Hash</ToolButton>
      {Object.entries(hashes).map(([algo, h]) => (
        <div key={algo} className="flex items-center justify-between p-3 bg-paper-dim/50 border border-border rounded-sm">
          <div className="min-w-0"><span className="text-[10px] uppercase tracking-wider text-muted-foreground">{algo}</span><p className="font-mono text-xs text-foreground mt-0.5 break-all">{h}</p></div>
          <button onClick={() => navigator.clipboard.writeText(h)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-paper-dim transition-colors shrink-0 ml-2">Copy</button>
        </div>
      ))}
    </ToolLayout>
  );
}
