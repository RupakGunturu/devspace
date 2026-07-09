import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function FaviconGenerator() {
  const [text, setText] = useState("A");
  const [color, setColor] = useState("#3b82f6");
  const [url, setUrl] = useState("");

  const generate = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.charAt(0).toUpperCase(), 16, 16);
    setUrl(canvas.toDataURL("image/png"));
  };

  return (
    <ToolLayout id="favicon-generator">
      <div className="flex gap-4 items-end">
        <div><label className="text-[10px] text-muted-foreground">Text</label><input value={text} onChange={(e) => setText(e.target.value)} className="w-16 p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground text-center" maxLength={2} /></div>
        <div><label className="text-[10px] text-muted-foreground">Color</label><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-8 bg-background border border-border rounded cursor-pointer" /></div>
        <ToolButton onClick={generate}>Generate</ToolButton>
      </div>
      {url && <div className="flex flex-col items-center gap-4"><img src={url} alt="Favicon" className="w-16 h-16 border border-border rounded" /><a href={url} download="favicon.png" className="text-sm text-yellow hover:underline">Download</a></div>}
    </ToolLayout>
  );
}
