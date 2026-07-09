import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TailwindClassGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const map: Record<string, string> = {
    "display: flex": "flex", "display: grid": "grid", "display: block": "block", "display: inline-block": "inline-block", "display: none": "hidden",
    "flex-direction: row": "flex-row", "flex-direction: column": "flex-col", "flex-direction: row-reverse": "flex-row-reverse",
    "justify-content: center": "justify-center", "justify-content: space-between": "justify-between", "justify-content: space-around": "justify-around", "justify-content: flex-end": "justify-end",
    "align-items: center": "items-center", "align-items: flex-start": "items-start", "align-items: flex-end": "items-end", "align-items: stretch": "items-stretch",
    "flex-wrap: wrap": "flex-wrap", "gap: 8px": "gap-2", "gap: 16px": "gap-4", "gap: 24px": "gap-6",
    "padding: 8px": "p-2", "padding: 16px": "p-4", "padding: 24px": "p-6", "padding: 32px": "p-8",
    "margin: 8px": "m-2", "margin: 16px": "m-4", "margin: auto": "mx-auto",
    "border-radius: 8px": "rounded-sm", "border-radius: 9999px": "rounded-full", "border-radius: 4px": "rounded",
    "font-size: 12px": "text-xs", "font-size: 14px": "text-sm", "font-size: 16px": "text-base", "font-size: 18px": "text-lg", "font-size: 24px": "text-2xl", "font-size: 32px": "text-3xl",
    "font-weight: bold": "font-bold", "font-weight: medium": "font-medium", "text-align: center": "text-center", "text-align: left": "text-left",
    "width: 100%": "w-full", "height: 100%": "h-full", "position: relative": "relative", "position: absolute": "absolute", "position: fixed": "fixed",
    "overflow: hidden": "overflow-hidden", "overflow: auto": "overflow-auto", "cursor: pointer": "cursor-pointer",
    "opacity: 0.5": "opacity-50", "z-index: 10": "z-10", "z-index: 50": "z-50",
  };

  const generate = () => {
    const lines = input.split("\n").filter(Boolean);
    const results = lines.map((line) => {
      const trimmed = line.trim().replace(/;$/, "");
      for (const [css, tw] of Object.entries(map)) {
        if (trimmed.toLowerCase() === css.toLowerCase()) return `${css} → ${tw}`;
      }
      return `${trimmed} → (no direct match)`;
    });
    setOutput(results.join("\n"));
  };

  return (
    <ToolLayout id="tailwind-class-generator">
      <ToolInput value={input} onChange={setInput} placeholder={"display: flex;\njustify-content: center;\npadding: 16px;"} label="CSS Properties" rows={8} />
      <ToolButton onClick={generate}>Generate Tailwind</ToolButton>
      <ToolOutput value={output} label="Tailwind Classes" />
    </ToolLayout>
  );
}
