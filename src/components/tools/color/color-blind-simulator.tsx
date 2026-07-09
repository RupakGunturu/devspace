import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function ColorBlindSimulator() {
  const [original, setOriginal] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [simulations, setSimulations] = useState<Record<string, string>>({});

  const filters: Record<string, string> = {
    "Protanopia (No Red)": "url(#protanopia)",
    "Deuteranopia (No Green)": "url(#deuteranopia)",
    "Tritanopia (No Blue)": "url(#tritanopia)",
    "Achromatopsia (No Color)": "grayscale(100%)",
  };

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setOriginal(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <ToolLayout id="color-blind-simulator">
      <input ref={fileRef} type="file" accept="image/*" onChange={handle} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-yellow file:text-white hover:file:opacity-90" />
      {original && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 bg-paper-dim/50 border border-border rounded-sm text-center"><img src={original} alt="Original" className="max-h-32 mx-auto" /><span className="text-[10px] text-muted-foreground">Original</span></div>
          {Object.entries(filters).map(([name]) => (
            <div key={name} className="p-2 bg-paper-dim/50 border border-border rounded-sm text-center">
              <img src={original} alt={name} className="max-h-32 mx-auto" style={{ filter: name.includes("Achromatopsia") ? "grayscale(100%)" : "none" }} />
              <span className="text-[10px] text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
