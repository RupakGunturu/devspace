import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function JsonDiff() {
  const [jsonA, setJsonA] = useState("");
  const [jsonB, setJsonB] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const compare = () => {
    try {
      const a = JSON.parse(jsonA);
      const b = JSON.parse(jsonB);
      const diffs: string[] = [];
      const compareObjects = (obj1: any, obj2: any, path = "") => {
        const allKeys = Array.from(new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]));
        for (const key of allKeys) {
          const currentPath = path ? `${path}.${key}` : key;
          if (!(key in (obj1 || {}))) diffs.push(`+ ${currentPath}: ${JSON.stringify(obj2[key])}`);
          else if (!(key in (obj2 || {}))) diffs.push(`- ${currentPath}: ${JSON.stringify(obj1[key])}`);
          else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
            if (typeof obj1[key] === "object" && typeof obj2[key] === "object" && obj1[key] !== null && obj2[key] !== null) compareObjects(obj1[key], obj2[key], currentPath);
            else diffs.push(`~ ${currentPath}: ${JSON.stringify(obj1[key])} → ${JSON.stringify(obj2[key])}`);
          }
        }
      };
      compareObjects(a, b);
      setResult(diffs.length > 0 ? diffs.join("\n") : "No differences found!");
      setError("");
    } catch { setError("Invalid JSON"); setResult(""); }
  };

  return (
    <ToolLayout id="json-diff">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToolInput value={jsonA} onChange={setJsonA} placeholder="JSON A..." label="Original" rows={8} />
        <ToolInput value={jsonB} onChange={setJsonB} placeholder="JSON B..." label="Modified" rows={8} />
      </div>
      <ToolButton onClick={compare}>Compare</ToolButton>
      {error && <p className="text-sm text-coral font-mono">{error}</p>}
      <ToolOutput value={result} label="Differences" />
    </ToolLayout>
  );
}
