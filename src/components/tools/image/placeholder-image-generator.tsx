import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function PlaceholderImageGenerator() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [bgColor, setBgColor] = useState("#374151");
  const [text, setText] = useState("400×300");
  const [url, setUrl] = useState("");

  const generate = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.font = `${Math.min(width, height) / 8}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text || `${width}×${height}`, width / 2, height / 2);
    setUrl(canvas.toDataURL());
  };

  return (
    <ToolLayout id="placeholder-image-generator">
      <div className="grid grid-cols-3 gap-4">
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Width</label><input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Height</label><input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Color</label><input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 bg-paper-dim/50 border border-border rounded-sm cursor-pointer" /></div>
      </div>
      <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Text</label><input value={text} onChange={(e) => setText(e.target.value)} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" placeholder="400×300" /></div>
      <ToolButton onClick={generate}>Generate</ToolButton>
      {url && <div className="flex flex-col items-center gap-4"><img src={url} alt="Placeholder" className="border border-border rounded-sm" /><a href={url} download="placeholder.png" className="text-sm text-yellow hover:underline">Download PNG</a></div>}
    </ToolLayout>
  );
}
