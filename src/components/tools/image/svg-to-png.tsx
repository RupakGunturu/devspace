import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function SvgToPng() {
  const [svgInput, setSvgInput] = useState('<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#3b82f6"/><text x="100" y="110" text-anchor="middle" fill="white" font-size="20">Hello SVG</text></svg>');
  const [url, setUrl] = useState("");

  const convert = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => { ctx.drawImage(img, 0, 0); setUrl(canvas.toDataURL("image/png")); };
    img.src = "data:image/svg+xml;base64," + btoa(svgInput);
  };

  return (
    <ToolLayout id="svg-to-png">
      <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">SVG Code</label><textarea value={svgInput} onChange={(e) => setSvgInput(e.target.value)} rows={8} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
      <ToolButton onClick={convert}>Convert to PNG</ToolButton>
      {url && <div className="flex flex-col items-center gap-4"><img src={url} alt="PNG" className="border border-border rounded" /><a href={url} download="converted.png" className="text-sm text-yellow hover:underline">Download PNG</a></div>}
    </ToolLayout>
  );
}
