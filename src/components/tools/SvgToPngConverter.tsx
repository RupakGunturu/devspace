import { useState, useRef } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";

export function SvgToPngConverter() {
  const [svgCode, setSvgCode] = useState("");
  const [width, setWidth] = useState("512");
  const [height, setHeight] = useState("512");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    const svg = svgCode.trim();
    if (!svg) return;
    const w = parseInt(width) || 512;
    const h = parseInt(height) || 512;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.download = "converted.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = url;
  };

  return (
    <ToolLayout id="svg-to-png-converter">
      <ToolInput
        value={svgCode}
        onChange={setSvgCode}
        label="SVG Code"
        placeholder='<svg viewBox="0 0 100 100">...</svg>'
        rows={8}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Width (px)
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Height (px)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          />
        </div>
      </div>

      {svgCode.trim() && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Preview
          </p>
          <div
            className="flex items-center justify-center overflow-hidden rounded-md border border-line bg-white p-4"
            style={{ minHeight: 120 }}
            dangerouslySetInnerHTML={{ __html: svgCode }}
          />
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      <ToolButton onClick={handleDownload} disabled={!svgCode.trim()}>
        Download PNG
      </ToolButton>
    </ToolLayout>
  );
}
