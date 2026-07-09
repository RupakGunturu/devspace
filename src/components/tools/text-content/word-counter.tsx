import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function WordCounter() {
  const [input, setInput] = useState("");
  const stats = (() => {
    const text = input.trim();
    if (!text) return { words: 0, chars: 0, sentences: 0, paragraphs: 0, readingTime: "0 min" };
    const words = text.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n\n+/).filter(Boolean).length;
    const readingTime = `${Math.max(1, Math.ceil(words / 200))} min`;
    return { words, chars, sentences, paragraphs, readingTime };
  })();

  return (
    <ToolLayout id="word-counter">
      <ToolInput value={input} onChange={setInput} placeholder="Paste your text here..." label="Text" rows={10} />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(stats).map(([key, val]) => (
          <div key={key} className="p-3 bg-paper-dim/50 border border-border rounded-sm text-center">
            <span className="text-2xl font-bold text-foreground font-sans">{val}</span>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{key.replace(/([A-Z])/g, " $1")}</p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
