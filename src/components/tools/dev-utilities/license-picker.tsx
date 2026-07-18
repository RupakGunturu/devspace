import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";
import { ToolToggleGroup } from "../ToolToggleGroup";

export default function LicensePicker() {
  const [selected, setSelected] = useState("MIT");

  const licenses: Record<string, { name: string; permissions: string[]; conditions: string[]; limitations: string[] }> = {
    "MIT": { name: "MIT License", permissions: ["Commercial use", "Modification", "Distribution", "Private use"], conditions: ["License and copyright notice"], limitations: ["Liability", "Warranty"] },
    "Apache-2.0": { name: "Apache 2.0", permissions: ["Commercial use", "Modification", "Distribution", "Patent use", "Private use"], conditions: ["License and copyright notice", "State changes", "Include copyright"], limitations: ["Liability", "Warranty"] },
    "GPL-3.0": { name: "GNU GPL v3.0", permissions: ["Commercial use", "Modification", "Distribution", "Patent use", "Private use"], conditions: ["License and copyright notice", "State changes", "Disclose source", "Same license"], limitations: ["Liability", "Warranty"] },
    "BSD-3": { name: "BSD 3-Clause", permissions: ["Commercial use", "Modification", "Distribution", "Private use"], conditions: ["License and copyright notice", "No endorsement"], limitations: ["Liability", "Warranty"] },
  };

  return (
    <ToolLayout id="license-picker">
      <ToolToggleGroup
        options={Object.keys(licenses).map((l) => ({ value: l, label: l }))}
        value={selected}
        onChange={setSelected}
      />
      <div className="space-y-3">
        <div><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Permissions</span><div className="flex flex-wrap gap-1 mt-1">{licenses[selected].permissions.map((p) => <span key={p} className="px-2 py-0.5 text-xs bg-coral/10 text-coral rounded">{p}</span>)}</div></div>
        <div><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Conditions</span><div className="flex flex-wrap gap-1 mt-1">{licenses[selected].conditions.map((c) => <span key={c} className="px-2 py-0.5 text-xs bg-yellow-500/10 text-yellow-500 rounded">{c}</span>)}</div></div>
        <div><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Limitations</span><div className="flex flex-wrap gap-1 mt-1">{licenses[selected].limitations.map((l) => <span key={l} className="px-2 py-0.5 text-xs bg-coral/10 text-coral rounded">{l}</span>)}</div></div>
      </div>
    </ToolLayout>
  );
}
