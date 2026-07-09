import { useState } from "react";

type Mode = "b64-enc" | "b64-dec" | "url-enc" | "url-dec";

function run(mode: Mode, input: string): string {
  try {
    switch (mode) {
      case "b64-enc":
        return typeof window === "undefined" ? "" : window.btoa(unescape(encodeURIComponent(input)));
      case "b64-dec":
        return typeof window === "undefined" ? "" : decodeURIComponent(escape(window.atob(input.trim())));
      case "url-enc":
        return encodeURIComponent(input);
      case "url-dec":
        return decodeURIComponent(input);
    }
  } catch (e) {
    return `⚠ ${(e as Error).message}`;
  }
}

const TABS: { id: Mode; label: string }[] = [
  { id: "b64-enc", label: "Base64 Encode" },
  { id: "b64-dec", label: "Base64 Decode" },
  { id: "url-enc", label: "URL Encode" },
  { id: "url-dec", label: "URL Decode" },
];

export function Base64UrlCodec() {
  const [mode, setMode] = useState<Mode>("b64-enc");
  const [input, setInput] = useState("hello, devspace");
  const output = run(mode, input);
  return (
    <div className="space-y-3 p-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            className={`rounded-full border-2 px-3 py-1 font-mono text-xs font-bold transition ${
              mode === t.id ? "border-yellow bg-yellow text-ink" : "border-line text-muted hover:border-yellow hover:text-yellow"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>
        <div className="mb-1 font-mono text-xs text-muted">input</div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          className="h-32 w-full resize-none rounded-sm border-2 border-line bg-ink p-3 font-mono text-sm text-text outline-none focus:border-yellow"
        />
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between font-mono text-xs text-muted">
          <span>output</span>
          <button
            onClick={() => navigator.clipboard?.writeText(output)}
            className="rounded-sm border-2 border-line px-2 py-0.5 text-[10px] text-muted hover:border-yellow hover:text-yellow"
          >
            copy
          </button>
        </div>
        <pre className="min-h-[8rem] overflow-auto whitespace-pre-wrap break-all rounded-sm border-2 border-line bg-ink p-3 font-mono text-sm text-text">
          {output}
        </pre>
      </div>
    </div>
  );
}
