import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolInput } from "./ToolInput";
import { ToolOutput } from "./ToolOutput";
import { ToolButton } from "./ToolButton";
import { ToolToggleGroup } from "./ToolToggleGroup";
import { CopyButton } from "./CopyButton";

type Algo = "SHA-1" | "SHA-256" | "SHA-512";

async function hash(algo: Algo, text: string): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) return "crypto.subtle unavailable";
  const buf = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algo, buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function UuidHashGenerator() {
  const [uuids, setUuids] = useState<string[]>(() => [
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : "—",
  ]);
  const [text, setText] = useState("hello, devspace");
  const [algo, setAlgo] = useState<Algo>("SHA-256");
  const [digest, setDigest] = useState("");

  const addUuid = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      setUuids((u) => [crypto.randomUUID(), ...u].slice(0, 8));
    }
  };
  const runHash = async () => setDigest(await hash(algo, text));

  return (
    <ToolLayout id="uuid-hash-generator">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">UUIDs (v4)</span>
          <ToolButton onClick={addUuid} variant="secondary">Generate</ToolButton>
        </div>
        <ul className="space-y-1">
          {uuids.map((u, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 rounded-md border-2 border-line bg-input-bg p-2 font-mono text-xs text-input-text"
            >
              <span className="truncate">{u}</span>
              <CopyButton text={u} />
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">Hash</span>
        <ToolInput value={text} onChange={setText} placeholder="Enter text..." label="" rows={3} />
        <div className="flex flex-wrap gap-2">
          <ToolToggleGroup
            options={[
              { value: "SHA-1", label: "SHA-1" },
              { value: "SHA-256", label: "SHA-256" },
              { value: "SHA-512", label: "SHA-512" },
            ]}
            value={algo}
            onChange={(v) => setAlgo(v as Algo)}
          />
          <ToolButton onClick={runHash}>Hash it</ToolButton>
        </div>
      </div>
      {digest && <ToolOutput value={digest} label="Digest" />}
    </ToolLayout>
  );
}
