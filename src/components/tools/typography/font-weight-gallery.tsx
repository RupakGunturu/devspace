import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function FontWeightGallery() {
  const [font, setFont] = useState("Inter");
  const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900];

  return (
    <ToolLayout id="font-weight-gallery">
      <div className="flex gap-2 items-center">
        <input value={font} onChange={(e) => setFont(e.target.value)} className="flex-1 p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm text-foreground" placeholder="Font name" />
      </div>
      <div className="space-y-2">
        {weights.map((w) => (
          <div key={w} className="p-3 bg-paper-dim/50 border border-border rounded-sm">
            <p style={{ fontFamily: font, fontWeight: w }} className="text-xl text-foreground">The quick brown fox jumps over the lazy dog</p>
            <p className="text-[10px] text-muted-foreground mt-1">{w}</p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
