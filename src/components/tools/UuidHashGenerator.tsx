import { useState } from "react";

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
    <div className="space-y-6 p-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="font-display text-lg font-bold text-text">UUIDs (v4)</div>
          <button
            onClick={addUuid}
            className="rounded-sm border-2 border-yellow bg-yellow px-3 py-1 font-mono text-xs font-bold text-ink"
            style={{ boxShadow: "3px 3px 0 var(--coral)" }}
          >
            generate
          </button>
        </div>
        <ul className="space-y-1">
          {uuids.map((u, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 rounded-sm border-2 border-line bg-ink p-2 font-mono text-xs text-text"
            >
              <span className="truncate">{u}</span>
              <button
                onClick={() => navigator.clipboard?.writeText(u)}
                className="shrink-0 rounded-sm border-2 border-line px-2 py-0.5 text-[10px] text-muted hover:border-yellow hover:text-yellow"
              >
                copy
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <div className="font-display text-lg font-bold text-text">Hash</div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          className="h-24 w-full resize-none rounded-sm border-2 border-line bg-ink p-3 font-mono text-sm text-text outline-none focus:border-yellow"
        />
        <div className="flex flex-wrap gap-2">
          {(["SHA-1", "SHA-256", "SHA-512"] as Algo[]).map((a) => (
            <button
              key={a}
              onClick={() => setAlgo(a)}
              className={`rounded-full border-2 px-3 py-1 font-mono text-xs font-bold ${
                algo === a ? "border-yellow bg-yellow text-ink" : "border-line text-muted hover:border-yellow hover:text-yellow"
              }`}
            >
              {a}
            </button>
          ))}
          <button
            onClick={runHash}
            className="ml-auto rounded-sm border-2 border-yellow bg-yellow px-3 py-1 font-mono text-xs font-bold text-ink"
            style={{ boxShadow: "3px 3px 0 var(--coral)" }}
          >
            hash it
          </button>
        </div>
        {digest && (
          <pre className="overflow-auto whitespace-pre-wrap break-all rounded-sm border-2 border-line bg-ink p-3 font-mono text-xs text-text">
            {digest}
          </pre>
        )}
      </div>
    </div>
  );
}
