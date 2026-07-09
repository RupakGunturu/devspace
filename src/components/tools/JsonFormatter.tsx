import { useMemo, useState } from "react";

export function JsonFormatter() {
  const [input, setInput] = useState('{"hello":"world","list":[1,2,3]}');
  const [indent, setIndent] = useState(2);
  const { output, error } = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      return { output: JSON.stringify(parsed, null, indent), error: null as string | null };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, indent]);

  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="font-mono text-xs text-muted">input</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded-sm border-2 border-line bg-ink px-2 py-1 font-mono text-xs text-text"
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
          className="h-72 w-full resize-none rounded-sm border-2 border-line bg-ink p-3 font-mono text-sm text-text outline-none focus:border-yellow"
        />
      </div>
      <div>
        <div className="mb-2 font-mono text-xs text-muted">output</div>
        {error ? (
          <pre className="h-72 overflow-auto rounded-sm border-2 border-coral bg-ink p-3 font-mono text-sm text-coral">
            {error}
          </pre>
        ) : (
          <pre className="h-72 overflow-auto rounded-sm border-2 border-line bg-ink p-3 font-mono text-sm text-text">
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}
