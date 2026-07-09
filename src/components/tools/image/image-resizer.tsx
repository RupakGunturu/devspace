import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function ImageResizer() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [original, setOriginal] = useState<{ w: number; h: number } | null>(null);
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      setOriginal({ w: img.width, h: img.height });
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      setUrl(canvas.toDataURL());
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <ToolLayout id="image-resizer">
      <input ref={fileRef} type="file" accept="image/*" onChange={handle} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-yellow file:text-white hover:file:opacity-90" />
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Width</label><input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Height</label><input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
      </div>
      {original && <p className="text-xs text-muted-foreground">Original: {original.w}×{original.h}</p>}
      {url && <div className="flex flex-col items-center gap-4"><img src={url} alt="Resized" className="max-h-48 border border-border rounded" /><a href={url} download="resized.png" className="text-sm text-yellow hover:underline">Download</a></div>}
    </ToolLayout>
  );
}
