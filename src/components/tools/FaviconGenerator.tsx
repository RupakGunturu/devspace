import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";

export function FaviconGenerator() {
  const [initials, setInitials] = useState("AB");
  const [bgColor, setBgColor] = useState("#3B82F6");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [sizes] = useState([16, 32, 48, 180]);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    sizes.forEach((size, i) => {
      const canvas = canvasRefs.current[i];
      if (!canvas) return;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = textColor;
      const fontSize = size * 0.45;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(initials.slice(0, 2).toUpperCase(), size / 2, size / 2);
    });
  }, [initials, bgColor, textColor, sizes]);

  const download = (size: number, index: number) => {
    const canvas = canvasRefs.current[index];
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `favicon-${size}x${size}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <ToolLayout id="favicon-generator">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Initials (1-2 chars)
          </label>
          <input
            type="text"
            value={initials}
            onChange={(e) => setInitials(e.target.value.slice(0, 2))}
            maxLength={2}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Background Color
          </label>
          <div className="flex items-center gap-2 rounded-md border-2 border-line bg-input-bg p-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-8 w-8 cursor-pointer border-0 bg-transparent"
            />
            <span className="font-mono text-sm text-foreground">{bgColor}</span>
          </div>
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Text Color
          </label>
          <div className="flex items-center gap-2 rounded-md border-2 border-line bg-input-bg p-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-8 w-8 cursor-pointer border-0 bg-transparent"
            />
            <span className="font-mono text-sm text-foreground">{textColor}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {sizes.map((size, i) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <canvas
              ref={(el) => { canvasRefs.current[i] = el; }}
              className="rounded-md border-2 border-line"
              style={{ width: Math.max(size, 48), height: Math.max(size, 48), imageRendering: "pixelated" }}
            />
            <span className="font-mono text-[10px] text-muted">
              {size}×{size}
            </span>
            <ButtonDownload onClick={() => download(size, i)} />
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}

function ButtonDownload({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border-2 border-line px-2 py-1 font-mono text-[10px] text-muted transition-colors hover:border-foreground hover:text-foreground"
    >
      Download
    </button>
  );
}
