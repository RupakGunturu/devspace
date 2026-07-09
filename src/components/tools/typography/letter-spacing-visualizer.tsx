import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function LetterSpacingVisualizer() {
  const [text, setText] = useState("Hello World");
  const spacings = [-2, -1, 0, 0.5, 1, 2, 3, 5];

  return (
    <ToolLayout id="letter-spacing-visualizer">
      <ToolInput value={text} onChange={setText} placeholder="Enter text..." label="Text" rows={1} />
      <div className="space-y-2">
        {spacings.map((s) => (
          <div key={s} className="p-3 bg-paper-dim/50 border border-border rounded-sm">
            <p style={{ letterSpacing: `${s}px` }} className="text-lg text-foreground">{text}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{s}px</p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
