import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";

export default function LigatureExplorer() {
  const ligatures = [
    { chars: "fi", name: "fi ligature" },
    { chars: "fl", name: "fl ligature" },
    { chars: "ff", name: "ff ligature" },
    { chars: "ffi", name: "ffi ligature" },
    { chars: "ffl", name: "ffl ligature" },
  ];
  const text = "office,affle,staff,effluent,waffle";

  return (
    <ToolLayout id="ligature-explorer">
      <div className="space-y-3">
        <div className="p-4 bg-paper-dim/50 border border-border rounded-sm">
          <p className="text-2xl text-foreground" style={{ fontVariantLigatures: "common" }}>{text}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Ligatures: ON</p>
        </div>
        <div className="p-4 bg-paper-dim/50 border border-border rounded-sm">
          <p className="text-2xl text-foreground" style={{ fontVariantLigatures: "no-common" }}>{text}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Ligatures: OFF</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {ligatures.map((l) => (
          <div key={l.name} className="flex items-center justify-between p-2.5 bg-paper-dim/50 border border-border rounded-sm">
            <span className="font-mono text-sm text-foreground">{l.chars}</span>
            <span className="text-xs text-muted-foreground">{l.name}</span>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
