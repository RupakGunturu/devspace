import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function ImageCompressor() {
  const [quality, setQuality] = useState(0.7);
  const [original, setOriginal] = useState<{ name: string; size: number } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const compress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginal({ name: file.name, size: file.size });
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) { setCompressed({ url: URL.createObjectURL(blob), size: blob.size }); }
      }, "image/jpeg", quality);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <ToolLayout id="image-compressor">
      <input ref={fileRef} type="file" accept="image/*" onChange={compress} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-yellow file:text-white hover:file:opacity-90" />
      <div>
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Quality: {Math.round(quality * 100)}%</label>
        <input type="range" min="0.1" max="1" step="0.1" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full accent-yellow" />
      </div>
      {original && compressed && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-paper-dim/50 border border-border rounded-sm text-center"><span className="text-[10px] uppercase tracking-wider text-muted-foreground">Original</span><p className="font-mono text-lg font-bold text-foreground">{(original.size / 1024).toFixed(1)}KB</p></div>
          <div className="p-3 bg-paper-dim/50 border border-border rounded-sm text-center"><span className="text-[10px] uppercase tracking-wider text-muted-foreground">Compressed</span><p className="font-mono text-lg font-bold text-coral">{(compressed.size / 1024).toFixed(1)}KB</p><p className="text-xs text-coral">{Math.round((1 - compressed.size / original.size) * 100)}% smaller</p></div>
        </div>
      )}
      {compressed && <a href={compressed.url} download className="inline-flex items-center gap-2 px-4 py-2 bg-yellow text-white text-sm font-medium rounded-sm hover:opacity-90 transition-opacity">Download Compressed</a>}
    </ToolLayout>
  );
}
