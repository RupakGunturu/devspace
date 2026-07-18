import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolInput } from "./ToolInput";
import { useToolAccent } from "@/components/ToolAccentContext";

export function RegexTester() {
  const [pattern, setPattern] = useState("\\b(\\w+)@(\\w+\\.\\w+)");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Contact: ada@example.com or grace@dev.io\nAlso: not-an-email");
  const { color } = useToolAccent();

  const { matches, error, highlighted } = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      const all: RegExpMatchArray[] = [];
      if (flags.includes("g")) {
        for (const m of text.matchAll(re)) all.push(m);
      } else {
        const m = text.match(re);
        if (m) all.push(m);
      }
      let hl: (string | { m: string })[] = [];
      if (flags.includes("g") && pattern) {
        let last = 0;
        for (const m of text.matchAll(re)) {
          const start = m.index ?? 0;
          hl.push(text.slice(last, start));
          hl.push({ m: m[0] });
          last = start + m[0].length;
        }
        hl.push(text.slice(last));
      } else {
        hl = [text];
      }
      return { matches: all, error: null as string | null, highlighted: hl };
    } catch (e) {
      return { matches: [], error: (e as Error).message, highlighted: [text] };
    }
  }, [pattern, flags, text]);

  return (
    <ToolLayout id="regex-tester">
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-1 items-center gap-1 rounded-md border-2 border-line bg-input-bg px-2 focus-within:ring-2" style={{ ["--tw-ring-color" as string]: color }}>
          <span className="font-mono text-sm text-muted">/</span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full min-w-0 bg-transparent py-2 font-mono text-sm text-input-text outline-none"
          />
          <span className="font-mono text-sm text-muted">/</span>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
            className="w-16 bg-transparent py-2 font-mono text-sm outline-none"
            style={{ color }}
          />
        </div>
      </div>
      <ToolInput value={text} onChange={setText} placeholder="Enter test text..." label="Test text" rows={5} />
      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Preview</span>
        <pre className="whitespace-pre-wrap rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text">
          {highlighted.map((chunk, i) =>
            typeof chunk === "string" ? (
              <span key={i}>{chunk}</span>
            ) : (
              <mark key={i} className="rounded-sm px-0.5" style={{ backgroundColor: color, color: "#fff" }}>
                {chunk.m}
              </mark>
            )
          )}
        </pre>
      </div>
      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          {error ? <span className="text-coral">error: {error}</span> : `${matches.length} match${matches.length === 1 ? "" : "es"}`}
        </span>
        {!error && matches.length > 0 && (
          <ul className="space-y-1">
            {matches.map((m, i) => (
              <li key={i} className="rounded-md border-2 border-line bg-input-bg p-2 font-mono text-xs text-input-text">
                <span style={{ color }}>#{i}</span> {m[0]}
                {m.length > 1 && (
                  <span className="text-muted"> → groups: [{m.slice(1).map((g) => JSON.stringify(g)).join(", ")}]</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </ToolLayout>
  );
}
