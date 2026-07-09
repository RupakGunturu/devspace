import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function NoiseTextureGenerator() {
  const [size, setSize] = useState(200);
  const [opacity, setOpacity] = useState(0.05);
  const [url, setUrl] = useState("");

  const generate = () => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = opacity * 255;
    }
    ctx.putImageData(imageData, 0, 0);
    setUrl(canvas.toDataURL());
  };

  return (
    <ToolLayout id="noise-texture-generator">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Size: {size}px</label><input type="range" min="50" max="400" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-yellow" /></div>
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Opacity: {Math.round(opacity * 100)}%</label><input type="range" min="0.01" max="0.3" step="0.01" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full accent-yellow" /></div>
      </div>
      <ToolButton onClick={generate}>Generate Noise</ToolButton>
      {url && <div className="flex flex-col items-center gap-4"><img src={url} alt="Noise" className="border border-border rounded-sm bg-white" /><div className="p-4 bg-paper-dim/50 border border-border rounded-sm w-full"><span className="text-[10px] uppercase tracking-wider text-muted-foreground">CSS Usage</span><p className="font-mono text-xs text-foreground mt-1 break-all">background-image: url("{url.slice(0, 50)}...");</p></div></div>}
    </ToolLayout>
  );
}
