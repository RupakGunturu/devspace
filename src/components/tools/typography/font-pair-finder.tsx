import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

const fonts = [
  { name: "Inter + Roboto Slab", pairing: "Sans + Serif" },
  { name: "Montserrat + Lora", pairing: "Sans + Serif" },
  { name: "Playfair Display + Source Sans Pro", pairing: "Serif + Sans" },
  { name: "Poppins + Merriweather", pairing: "Sans + Serif" },
  { name: "Raleway + Roboto", pairing: "Sans + Sans" },
  { name: "Oswald + Quattrocento", pairing: "Sans + Serif" },
  { name: "Nunito + PT Serif", pairing: "Sans + Serif" },
  { name: "Work Sans + Bitter", pairing: "Sans + Serif" },
  { name: "DM Sans + DM Serif", pairing: "Sans + Serif" },
  { name: "Space Grotesk + Crimson Pro", pairing: "Sans + Serif" },
];

export default function FontPairFinder() {
  const [pairs, setPairs] = useState(fonts);

  const shuffle = () => setPairs([...fonts].sort(() => Math.random() - 0.5));

  return (
    <ToolLayout id="font-pair-finder">
      <ToolButton onClick={shuffle}>Shuffle Pairs</ToolButton>
      <div className="space-y-3">
        {pairs.map((f, i) => (
          <div key={i} className="p-4 bg-paper-dim/50 border border-border rounded-sm">
            <p className="text-lg font-bold text-foreground">{f.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{f.pairing}</p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
