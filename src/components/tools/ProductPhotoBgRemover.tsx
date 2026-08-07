import { useCallback, useRef, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolFileInput } from "./ToolFileInput";
import { useToolAccent } from "@/components/ToolAccentContext";

export function ProductPhotoBgRemover() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [sensitivity, setSensitivity] = useState(30);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);
  const { color } = useToolAccent();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setResultUrl(null);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
    };
    img.src = url;
  }, []);

  const removeBackground = useCallback(() => {
    const canvas = canvasRef.current;
    const resultCanvas = resultCanvasRef.current;
    if (!canvas || !resultCanvas) return;

    setProcessing(true);

    requestAnimationFrame(() => {
      const ctx = canvas.getContext("2d");
      const resultCtx = resultCanvas.getContext("2d");
      if (!ctx || !resultCtx) {
        setProcessing(false);
        return;
      }

      resultCanvas.width = canvas.width;
      resultCanvas.height = canvas.height;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const resultData = resultCtx.createImageData(canvas.width, canvas.height);
      const out = resultData.data;

      const threshold = sensitivity;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const brightness = (r + g + b) / 3;
        const maxDiff = Math.max(Math.abs(r - 255), Math.abs(g - 255), Math.abs(b - 255));

        const isWhite = brightness > 255 - threshold && maxDiff < threshold + 30;
        const isNearWhite = r > 255 - threshold && g > 255 - threshold && b > 255 - threshold;

        if (isWhite || isNearWhite) {
          const distFromEdge = Math.min(Math.abs(r - 255), Math.abs(g - 255), Math.abs(b - 255));
          const alpha =
            distFromEdge < threshold / 2 ? 0 : Math.round((distFromEdge / threshold) * 255);
          out[i] = r;
          out[i + 1] = g;
          out[i + 2] = b;
          out[i + 3] = Math.min(alpha, 128);
        } else {
          out[i] = r;
          out[i + 1] = g;
          out[i + 2] = b;
          out[i + 3] = 255;
        }
      }

      resultCtx.putImageData(resultData, 0, 0);
      setResultUrl(resultCanvas.toDataURL("image/png"));
      setProcessing(false);
    });
  }, [sensitivity]);

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "product-no-bg.png";
    a.click();
  };

  return (
    <ToolLayout id="product-photo-bg-remover">
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={resultCanvasRef} className="hidden" />

      <ToolFileInput
        accept="image/*"
        onChange={handleFileChange}
        label="Upload Product Photo (PNG, JPG)"
      />

      {originalUrl && (
        <>
          <div>
            <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Background Removal Sensitivity: {sensitivity}
            </span>
            <input
              type="range"
              min="5"
              max="100"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseInt(e.target.value))}
              className="w-full accent-current"
              style={{ accentColor: color }}
            />
            <div className="flex justify-between font-mono text-xs text-muted">
              <span>Conservative</span>
              <span>Aggressive</span>
            </div>
          </div>

          <div className="flex gap-2">
            <ToolButton
              onClick={removeBackground}
              loading={processing}
              disabled={!originalUrl || processing}
            >
              Remove Background
            </ToolButton>
            {resultUrl && (
              <ToolButton onClick={downloadResult} variant="secondary">
                Download PNG
              </ToolButton>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md border-2 border-line bg-input-bg p-3">
              <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted text-center">
                Original
              </div>
              <div
                className="flex items-center justify-center rounded-md bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] p-2"
                style={{ minHeight: "200px" }}
              >
                <img
                  src={originalUrl}
                  alt="Original"
                  className="max-h-[300px] max-w-full object-contain"
                />
              </div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3">
              <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted text-center">
                Result
              </div>
              <div
                className="flex items-center justify-center rounded-md bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] p-2"
                style={{ minHeight: "200px" }}
              >
                {resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="Result"
                    className="max-h-[300px] max-w-full object-contain"
                  />
                ) : (
                  <span className="font-mono text-sm text-muted">
                    Click "Remove Background" to process
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {!originalUrl && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Upload a product photo to remove its background
        </div>
      )}
    </ToolLayout>
  );
}
