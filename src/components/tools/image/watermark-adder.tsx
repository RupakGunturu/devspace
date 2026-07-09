import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function WatermarkAdder() {
  const [text, setText] = useState("WATERMARK");
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      ctx.font = `bold ${Math.max(20, img.width / 10)}px sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.textAlign = "center";
      ctx.fillText(text, img.width / 2, img.height / 2);
      setUrl(canvas.toDataURL());
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <ToolLayout id="watermark-adder">
      <input ref={fileRef} type="file" accept="image/*" onChange={handle} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-yellow file:text-white hover:file:opacity-90" />
      <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Watermark Text</label><input value={text} onChange={(e) => setText(e.target.value)} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm text-foreground" /></div>
      {url && <div className="flex flex-col items-center gap-4"><img src={url} alt="Watermarked" className="max-h-48 border border-border rounded" /><a href={url} download="watermarked.png" className="text-sm text-yellow hover:underline">Download</a></div>}
    </ToolLayout>
  );
}
