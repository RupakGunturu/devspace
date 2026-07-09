import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ColorNameFinder() {
  const [hex, setHex] = useState("#3b82f6");
  const [output, setOutput] = useState("");

  const colors: Record<string, string> = {
    "#ff0000": "Red", "#00ff00": "Lime", "#0000ff": "Blue", "#ffff00": "Yellow",
    "#ff00ff": "Fuchsia", "#00ffff": "Cyan", "#ffffff": "White", "#000000": "Black",
    "#808080": "Gray", "#800000": "Maroon", "#808000": "Olive", "#008000": "Green",
    "#800080": "Purple", "#008080": "Teal", "#000080": "Navy", "#ffa500": "Orange",
    "#3b82f6": "Blue-500", "#ef4444": "Red-500", "#22c55e": "Green-500",
  };

  const find = () => {
    const match = Object.entries(colors).find(([k]) => k.toLowerCase() === hex.toLowerCase());
    setOutput(match ? `${hex} → ${match[1]}` : `${hex} → No exact match found (try common colors like #ff0000, #3b82f6)`);
  };

  return (
    <ToolLayout id="color-name-finder">
      <div className="flex items-center gap-4"><input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="w-12 h-8 bg-background border border-border rounded cursor-pointer" /><ToolInput value={hex} onChange={setHex} placeholder="#3b82f6" label="HEX" rows={1} /></div>
      <ToolButton onClick={find}>Find Name</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
