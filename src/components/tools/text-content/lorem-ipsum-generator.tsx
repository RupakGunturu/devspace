import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";
import { ToolOutput } from "../ToolOutput";
import { ToolToggleGroup } from "../ToolToggleGroup";

const LOREM = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum";

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<"words" | "sentences" | "paragraphs">("sentences");
  const [output, setOutput] = useState("");

  const generate = () => {
    const words = LOREM.split(" ");
    const sentences = LOREM.split(". ").map((s) => s.trim() + ".");
    if (unit === "words") {
      const result: string[] = [];
      for (let i = 0; i < count; i++) result.push(words[i % words.length]);
      setOutput(result.join(" ") + ".");
    } else if (unit === "sentences") {
      const result: string[] = [];
      for (let i = 0; i < count; i++) result.push(sentences[i % sentences.length]);
      setOutput(result.join(" "));
    } else {
      const result: string[] = [];
      for (let i = 0; i < count; i++) result.push(sentences.slice(0, 3).join(" "));
      setOutput(result.join("\n\n"));
    }
  };

  return (
    <ToolLayout id="lorem-ipsum-generator">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Count</label>
          <input type="number" value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))} className="w-24 p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
        <ToolToggleGroup
          options={[
            { value: "words", label: "Words" },
            { value: "sentences", label: "Sentences" },
            { value: "paragraphs", label: "Paragraphs" },
          ]}
          value={unit}
          onChange={(v) => setUnit(v as any)}
        />
        <ToolButton onClick={generate}>Generate</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
