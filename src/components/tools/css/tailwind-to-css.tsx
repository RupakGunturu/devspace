import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TailwindToCss() {
  const [input, setInput] = useState("flex items-center gap-4 p-6 bg-blue-500 text-white rounded-sm shadow-md");
  const [output, setOutput] = useState("");

  const map: Record<string, string> = {
    "flex": "display: flex;", "block": "display: block;", "inline": "display: inline;", "grid": "display: grid;",
    "items-center": "align-items: center;", "items-start": "align-items: flex-start;", "items-end": "align-items: flex-end;",
    "justify-center": "justify-content: center;", "justify-between": "justify-content: space-between;",
    "p-4": "padding: 1rem;", "p-6": "padding: 1.5rem;", "p-8": "padding: 2rem;", "px-4": "padding-left: 1rem; padding-right: 1rem;",
    "py-2": "padding-top: 0.5rem; padding-bottom: 0.5rem;", "m-4": "margin: 1rem;", "mb-4": "margin-bottom: 1rem;",
    "gap-2": "gap: 0.5rem;", "gap-4": "gap: 1rem;",
    "rounded": "border-radius: 0.25rem;", "rounded-sm": "border-radius: 0.5rem;", "rounded-full": "border-radius: 9999px;",
    "shadow": "box-shadow: 0 1px 3px rgba(0,0,0,0.1);", "shadow-md": "box-shadow: 0 4px 6px rgba(0,0,0,0.1);",
    "text-white": "color: #ffffff;", "text-black": "color: #000000;",
    "bg-blue-500": "background-color: #3b82f6;", "bg-coral": "background-color: #ef4444;", "bg-green-500": "background-color: #22c55e;",
    "font-bold": "font-weight: 700;", "font-semibold": "font-weight: 600;",
    "text-sm": "font-size: 0.875rem;", "text-lg": "font-size: 1.125rem;", "text-xl": "font-size: 1.25rem;",
    "w-full": "width: 100%;", "h-full": "height: 100%;",
  };

  const convert = () => {
    const classes = input.split(/\s+/);
    const css = classes.map((c) => map[c] || `/* ${c} */`).filter((c) => !c.startsWith("/*")).join("\n");
    setOutput(css || "No matching classes found");
  };

  return (
    <ToolLayout id="tailwind-to-css">
      <ToolInput value={input} onChange={setInput} placeholder="flex items-center gap-4 p-6" label="Tailwind Classes" rows={3} />
      <ToolButton onClick={convert}>Convert to CSS</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
