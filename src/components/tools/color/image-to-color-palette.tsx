import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function ImageToColorPalette() {
  const [colors, setColors] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      const ctx = canvas.getContext("2d")!;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorMap: Record<string, number> = {};
      for (let i = 0; i < data.length; i += 40) {
        const r = Math.round(data[i] / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        const key = `${r},${g},${b}`;
        colorMap[key] = (colorMap[key] || 0) + 1;
      }
      const sorted = Object.entries(colorMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
      setColors(sorted.map(([k]) => { const [r, g, b] = k.split(",").map(Number); return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`; }));
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <ToolLayout id="image-to-color-palette">
      <canvas ref={canvasRef} className="hidden" />
      <input ref={fileRef} type="file" accept="image/*" onChange={handle} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-yellow file:text-white hover:file:opacity-90" />
      {colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex gap-1 h-12 rounded-sm overflow-hidden">{colors.map((c) => <div key={c} className="flex-1" style={{ backgroundColor: c }} />)}</div>
          <div className="flex flex-wrap gap-2">{colors.map((c) => <span key={c} className="font-mono text-xs px-2 py-1 bg-paper-dim/50 border border-border rounded">{c}</span>)}</div>
        </div>
      )}
    </ToolLayout>
  );
}
