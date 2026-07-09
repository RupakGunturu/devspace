import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

const webSafeFonts = [
  { name: "Arial", family: "Arial, sans-serif", style: "Sans-serif" },
  { name: "Helvetica", family: "Helvetica, Arial, sans-serif", style: "Sans-serif" },
  { name: "Times New Roman", family: "'Times New Roman', Times, serif", style: "Serif" },
  { name: "Georgia", family: "Georgia, serif", style: "Serif" },
  { name: "Courier New", family: "'Courier New', Courier, monospace", style: "Monospace" },
  { name: "Verdana", family: "Verdana, Geneva, sans-serif", style: "Sans-serif" },
  { name: "Trebuchet MS", family: "'Trebuchet MS', sans-serif", style: "Sans-serif" },
  { name: "Palatino", family: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", style: "Serif" },
  { name: "Lucida Console", family: "'Lucida Console', Monaco, monospace", style: "Monospace" },
  { name: "Tahoma", family: "Tahoma, Geneva, sans-serif", style: "Sans-serif" },
];

export default function WebSafeFontsPreview() {
  const [preview, setPreview] = useState("The quick brown fox jumps over the lazy dog");

  return (
    <ToolLayout id="web-safe-fonts-preview">
      <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Preview Text</label><input value={preview} onChange={(e) => setPreview(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm text-foreground" /></div>
      <div className="space-y-2">
        {webSafeFonts.map((f) => (
          <div key={f.name} className="p-3 bg-paper-dim/50 border border-border rounded-sm">
            <p style={{ fontFamily: f.family }} className="text-lg text-foreground">{preview}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{f.name} — {f.style}</p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
