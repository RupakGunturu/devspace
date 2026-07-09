import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function SvgPathVisualizer() {
  const [input, setInput] = useState("M 10 80 Q 95 10 180 80");
  const [output, setOutput] = useState("");

  const explain = () => {
    const commands = input.match(/[A-Za-z][^A-Za-z]*/g) || [];
    const lines = commands.map((cmd) => {
      const type = cmd[0];
      const params = cmd.slice(1).trim();
      const names: Record<string, string> = {
        M: "Move to", L: "Line to", H: "Horizontal line", V: "Vertical line",
        C: "Cubic bezier", S: "Smooth cubic", Q: "Quadratic bezier", T: "Smooth quadratic",
        A: "Arc", Z: "Close path",
      };
      return `${type} — ${names[type] || "Unknown"}: ${params}`;
    });
    setOutput(lines.join("\n"));
  };

  return (
    <ToolLayout id="svg-path-visualizer">
      <ToolInput value={input} onChange={setInput} placeholder="M 10 80 Q 95 10 180 80" label="SVG Path" rows={3} />
      <div className="w-full p-4 bg-paper-dim/50 border border-border rounded-sm flex justify-center">
        <svg width="200" height="120" viewBox="0 0 200 120">
          <path d={input} fill="none" stroke="hsl(var(--primary-sky))" strokeWidth="2" />
        </svg>
      </div>
      <ToolButton onClick={explain}>Explain Path</ToolButton>
      <ToolOutput value={output} label="Path Breakdown" />
    </ToolLayout>
  );
}
