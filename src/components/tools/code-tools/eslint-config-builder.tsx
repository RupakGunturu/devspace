import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function EslintConfigBuilder() {
  const [rules, setRules] = useState<Record<string, string>>({
    "no-console": "warn",
    "no-unused-vars": "error",
    "eqeqeq": "error",
    "no-var": "error",
    "prefer-const": "warn",
  });
  const [output, setOutput] = useState("");

  const toggle = (rule: string) => {
    setRules((prev) => {
      const current = prev[rule];
      if (current === "off") return { ...prev, [rule]: "warn" };
      if (current === "warn") return { ...prev, [rule]: "error" };
      return { ...prev, [rule]: "off" };
    });
  };

  const generate = () => setOutput(JSON.stringify({ extends: ["eslint:recommended"], rules }, null, 2));

  return (
    <ToolLayout id="eslint-config-builder">
      <div className="space-y-1.5">
        {Object.entries(rules).map(([rule, level]) => (
          <div key={rule} className="flex items-center justify-between p-2.5 bg-paper-dim/50 border border-border rounded-sm cursor-pointer" onClick={() => toggle(rule)}>
            <span className="font-mono text-sm text-foreground">{rule}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${level === "error" ? "bg-coral/10 text-coral" : level === "warn" ? "bg-yellow-500/10 text-yellow-500" : "bg-paper-dim text-muted-foreground"}`}>{level}</span>
          </div>
        ))}
      </div>
      <ToolButton onClick={generate}>Generate Config</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
