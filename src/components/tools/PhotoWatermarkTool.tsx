import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolFileInput } from "./ToolFileInput";

type Position = "top-left" | "top-center" | "top-right" | "middle-left" | "center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right";

const POSITIONS: Position[] = [
  "top-left", "top-center", "top-right",
  "middle-left", "center", "middle-right",
  "bottom-left", "bottom-center", "bottom-right",
];

const POS_LABELS: Record<Position, string> = {
  "top-left": "TL", "top-center": "TC", "top-right": "TR",
  "middle-left": "ML", "center": "C", "middle-right": "MR",
  "bottom-left": "BL", "bottom-center": "BC", "bottom-right": "BR",
};

export function PhotoWatermarkTool() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("© My Watermark");
  const [opacity, setOpacity] = useState("30");
  const [position, setPosition] = useState<Position>("bottom-right");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const fontSize = Math.max(16, Math.round(img.width * 0.03));
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = `rgba(255, 255, 255, ${parseInt(opacity) / 100})`;
      ctx.strokeStyle = `rgba(0, 0, 0, ${parseInt(opacity) / 100 * 0.5})`;
      ctx.lineWidth = 2;

      const metrics = ctx.measureText(watermarkText);
      const tw = metrics.width;
      const th = fontSize;
      const pad = fontSize;
      let x: number, y: number;

      if (position.includes("left")) x = pad;
      else if (position.includes("right")) x = img.width - tw - pad;
      else x = (img.width - tw) / 2;

      if (position.includes("top")) y = pad + th;
      else if (position.includes("bottom")) y = img.height - pad;
      else y = (img.height + th) / 2;

      ctx.strokeText(watermarkText, x, y);
      ctx.fillText(watermarkText, x, y);
    };
    img.src = imageUrl;
  }, [imageUrl, watermarkText, opacity, position]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "watermarked.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <ToolLayout id="photo-watermark-tool">
      <ToolFileInput accept="image/*" onChange={handleFile} label="Choose an image file" />

      {imageUrl && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Watermark Text
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Opacity: {opacity}%
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Position
              </label>
              <div className="grid grid-cols-3 gap-1">
                {POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPosition(pos)}
                    className="rounded border-2 px-2 py-1.5 font-mono text-[10px] font-medium transition-all"
                    style={{
                      borderColor: position === pos ? "var(--foreground)" : "var(--border)",
                      backgroundColor: position === pos ? "var(--foreground)" : undefined,
                      color: position === pos ? "var(--background)" : undefined,
                    }}
                  >
                    {POS_LABELS[pos]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center rounded-md border-2 border-line bg-input-bg p-4">
            <canvas
              ref={canvasRef}
              className="max-h-[300px] rounded border border-line object-contain"
            />
          </div>

          <ToolButton onClick={handleDownload}>
            Download Watermarked Image
          </ToolButton>
        </div>
      )}
    </ToolLayout>
  );
}
