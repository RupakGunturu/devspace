import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolFileInput } from "./ToolFileInput";

export function HeadshotBgRemover() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [sensitivity, setSensitivity] = useState("30");
  const [showBg, setShowBg] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef<ImageData | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      originalRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (!originalRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const original = new ImageData(
      new Uint8ClampedArray(originalRef.current.data),
      originalRef.current.width,
      originalRef.current.height,
    );
    const data = original.data;
    const sens = parseInt(sensitivity) || 30;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      if (brightness > 255 - sens || brightness < sens) {
        if (!showBg) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = 255;
        }
      }
    }
    ctx.putImageData(original, 0, 0);
  }, [sensitivity, showBg, imageUrl]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "processed-headshot.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <ToolLayout id="headshot-bg-remover">
      <ToolFileInput accept="image/*" onChange={handleFile} label="Choose an image file" />

      {imageUrl && (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Sensitivity: {sensitivity}
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
                View Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBg(true)}
                  className="flex-1 rounded-md border-2 px-3 py-2 font-mono text-xs font-medium transition-all"
                  style={{
                    borderColor: showBg ? "var(--foreground)" : undefined,
                    backgroundColor: showBg ? "var(--foreground)" : undefined,
                    color: showBg ? "var(--background)" : undefined,
                  }}
                >
                  Original
                </button>
                <button
                  onClick={() => setShowBg(false)}
                  className="flex-1 rounded-md border-2 px-3 py-2 font-mono text-xs font-medium transition-all"
                  style={{
                    borderColor: !showBg ? "var(--foreground)" : undefined,
                    backgroundColor: !showBg ? "var(--foreground)" : undefined,
                    color: !showBg ? "var(--background)" : undefined,
                  }}
                >
                  BG Removed
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center rounded-md border-2 border-line bg-input-bg p-4">
            <canvas
              ref={canvasRef}
              className="max-h-[300px] rounded border border-line object-contain"
              style={{ imageRendering: "auto" }}
            />
          </div>

          <ToolButton onClick={handleDownload}>Download Processed Image</ToolButton>
        </div>
      )}
    </ToolLayout>
  );
}
