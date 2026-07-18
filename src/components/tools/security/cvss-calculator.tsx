import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

const rules = ["AV:N", "AV:A", "AV:L", "AC:L", "AC:H", "PR:L", "PR:H", "UI:N", "UI:R", "S:C", "S:U", "C:N", "C:L", "C:H", "I:N", "I:L", "I:H", "A:N", "A:L", "A:H"];

export default function CvssCalculator() {
  const [vector, setVector] = useState<string[]>(["AV:N", "AC:L", "PR:L", "UI:N", "S:U", "C:L", "I:L", "A:L"]);
  const [output, setOutput] = useState("");
  const { color, fg } = useToolAccent();

  const toggle = (rule: string) => {
    const group = rule.split(":")[0];
    setVector((prev) => [...prev.filter((v) => !v.startsWith(group + ":")), rule]);
  };

  const calculate = () => {
    const score = 5.5 + (vector.includes("AV:N") ? 1 : 0) + (vector.includes("AC:L") ? 0.5 : 0) + (vector.includes("C:H") ? 1 : 0) + (vector.includes("I:H") ? 1 : 0) + (vector.includes("A:H") ? 1 : 0);
    const severity = score >= 9 ? "Critical" : score >= 7 ? "High" : score >= 4 ? "Medium" : "Low";
    setOutput(`CVSS Vector: ${vector.join("/")}\nBase Score: ${Math.min(10, score).toFixed(1)}\nSeverity: ${severity}`);
  };

  const groups = ["AV", "AC", "PR", "UI", "S", "C", "I", "A"];

  return (
    <ToolLayout id="cvss-calculator">
      <div className="space-y-2">
        {groups.map((g) => (
          <div key={g} className="flex gap-1.5 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground w-8">{g}:</span>
            {rules.filter((r) => r.startsWith(g + ":")).map((r) => (
              <button
                key={r}
                onClick={() => toggle(r)}
                className="px-2 py-1 text-[10px] font-mono rounded border transition-all"
                style={vector.includes(r) ? { borderColor: color, backgroundColor: color, color: fg } : { borderColor: "var(--border)", color: "var(--muted-foreground)" }}
              >
                {r.split(":")[1]}
              </button>
            ))}
          </div>
        ))}
      </div>
      <ToolButton onClick={calculate}>Calculate Score</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
