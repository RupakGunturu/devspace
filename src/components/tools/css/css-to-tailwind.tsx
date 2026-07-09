import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CssToTailwind() {
  const [input, setInput] = useState("display: flex; align-items: center; gap: 1rem; padding: 1.5rem;");
  const [output, setOutput] = useState("");

  const map: Record<string, string> = {
    "display: flex": "flex", "display: block": "block", "display: grid": "grid",
    "align-items: center": "items-center", "align-items: flex-start": "items-start",
    "justify-content: center": "justify-center", "justify-content: space-between": "justify-between",
    "padding: 1rem": "p-4", "padding: 1.5rem": "p-6", "padding: 2rem": "p-8",
    "margin: 1rem": "m-4", "gap: 0.5rem": "gap-2", "gap: 1rem": "gap-4",
    "border-radius: 0.5rem": "rounded-sm", "border-radius: 9999px": "rounded-full",
    "font-weight: 700": "font-bold", "font-weight: 600": "font-semibold",
    "color: #ffffff": "text-white", "background-color: #3b82f6": "bg-blue-500",
    "width: 100%": "w-full", "height: 100%": "h-full",
  };

  const convert = () => {
    const rules = input.split(";").map((r) => r.trim()).filter(Boolean);
    const classes = rules.map((r) => map[r] || `/* ${r} */`).filter((c) => !c.startsWith("/*"));
    setOutput(classes.join(" ") || "No matching rules found");
  };

  return (
    <ToolLayout id="css-to-tailwind">
      <ToolInput value={input} onChange={setInput} placeholder="display: flex; align-items: center;" label="CSS Rules" rows={4} />
      <ToolButton onClick={convert}>Convert to Tailwind</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
