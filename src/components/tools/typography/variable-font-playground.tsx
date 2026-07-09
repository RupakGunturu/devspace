import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function VariableFontPlayground() {
  const [weight, setWeight] = useState(400);
  const [font, setFont] = useState("Inter");

  return (
    <ToolLayout id="variable-font-playground">
      <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Font</label><input value={font} onChange={(e) => setFont(e.target.value)} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm text-foreground" /></div>
      <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Weight: {weight}</label><input type="range" min="100" max="900" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full accent-yellow" /></div>
      <div className="p-6 bg-paper-dim/50 border border-border rounded-sm text-center">
        <p style={{ fontFamily: font, fontWeight: weight }} className="text-4xl text-foreground transition-all">The quick brown fox</p>
      </div>
    </ToolLayout>
  );
}
