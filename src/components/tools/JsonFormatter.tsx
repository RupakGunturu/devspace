import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

export function JsonFormatter() {
  const [input, setInput] = useState('{"hello":"world","list":[1,2,3]}');
  const [indent, setIndent] = useState(2);
  const { color } = useToolAccent();
  const { output, error } = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      return { output: JSON.stringify(parsed, null, indent), error: null as string | null };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, indent]);

  return (
    <ToolLayout id="json-formatter">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">Input</span>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="rounded-md border-2 border-line bg-input-bg px-2 py-1 font-mono text-xs text-input-text"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={0}>minified</option>
            </select>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="h-72 w-full resize-none rounded-md border-2 bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: "var(--border)" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = ""; }}
          />
        </div>
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Output</span>
          {error ? (
            <pre className="h-72 overflow-auto rounded-md border-2 border-coral bg-input-bg p-3 font-mono text-sm text-coral">
              {error}
            </pre>
          ) : (
            <pre className="h-72 overflow-auto rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text">
              {output}
            </pre>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
