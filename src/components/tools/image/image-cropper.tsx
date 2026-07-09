import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function ImageCropper() {
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 100, h: 100 });
  const [url, setUrl] = useState("");
  const [original, setOriginal] = useState<HTMLImageElement | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => { setOriginal(img); setCrop({ x: 0, y: 0, w: Math.min(200, img.width), h: Math.min(200, img.height) }); };
    img.src = URL.createObjectURL(file);
  };

  const cropImage = () => {
    if (!original) return;
    const canvas = document.createElement("canvas");
    canvas.width = crop.w;
    canvas.height = crop.h;
    canvas.getContext("2d")!.drawImage(original, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    setUrl(canvas.toDataURL());
  };

  return (
    <ToolLayout id="image-cropper">
      <input ref={fileRef} type="file" accept="image/*" onChange={handle} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-yellow file:text-white hover:file:opacity-90" />
      {original && (
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">X</label><input type="number" value={crop.x} onChange={(e) => setCrop({ ...crop, x: Number(e.target.value) })} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" /></div>
          <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Y</label><input type="number" value={crop.y} onChange={(e) => setCrop({ ...crop, y: Number(e.target.value) })} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" /></div>
          <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Width</label><input type="number" value={crop.w} onChange={(e) => setCrop({ ...crop, w: Number(e.target.value) })} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" /></div>
          <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Height</label><input type="number" value={crop.h} onChange={(e) => setCrop({ ...crop, h: Number(e.target.value) })} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" /></div>
        </div>
      )}
      <ToolButton onClick={cropImage}>Crop</ToolButton>
      {url && <div className="flex flex-col items-center gap-4"><img src={url} alt="Cropped" className="border border-border rounded" /><a href={url} download="cropped.png" className="text-sm text-yellow hover:underline">Download</a></div>}
    </ToolLayout>
  );
}
