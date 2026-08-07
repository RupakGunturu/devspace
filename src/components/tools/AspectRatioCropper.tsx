import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

type Ratio = "1:1" | "4:3" | "16:9" | "9:16" | "3:4";

const RATIOS: { value: Ratio; label: string; w: number; h: number }[] = [
  { value: "1:1", label: "1:1 Square", w: 1, h: 1 },
  { value: "4:3", label: "4:3", w: 4, h: 3 },
  { value: "16:9", label: "16:9", w: 16, h: 9 },
  { value: "9:16", label: "9:16", w: 9, h: 16 },
  { value: "3:4", label: "3:4", w: 3, h: 4 },
];

export function AspectRatioCropper() {
  const [origW, setOrigW] = useState("1920");
  const [origH, setOrigH] = useState("1080");
  const [ratio, setRatio] = useState<Ratio>("16:9");
  const { color } = useToolAccent();

  const result = useMemo(() => {
    const ow = parseInt(origW) || 0;
    const oh = parseInt(origH) || 0;
    if (ow <= 0 || oh <= 0) return null;
    const r = RATIOS.find((r) => r.value === ratio)!;
    const targetAspect = r.w / r.h;
    const currentAspect = ow / oh;
    let cw: number, ch: number;
    if (currentAspect > targetAspect) {
      ch = oh;
      cw = Math.round(oh * targetAspect);
    } else {
      cw = ow;
      ch = Math.round(ow / targetAspect);
    }
    const offsetX = Math.round((ow - cw) / 2);
    const offsetY = Math.round((oh - ch) / 2);
    return { cw, ch, offsetX, offsetY, ow, oh };
  }, [origW, origH, ratio]);

  return (
    <ToolLayout id="aspect-ratio-cropper">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Original Width
          </label>
          <input
            type="number"
            value={origW}
            onChange={(e) => setOrigW(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Original Height
          </label>
          <input
            type="number"
            value={origH}
            onChange={(e) => setOrigH(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Target Ratio
        </label>
        <div className="flex flex-wrap gap-2">
          {RATIOS.map((r) => (
            <button
              key={r.value}
              onClick={() => setRatio(r.value)}
              className="rounded-full border-2 px-3 py-1.5 font-mono text-xs font-medium transition-all"
              style={{
                borderColor: ratio === r.value ? color : "var(--border)",
                backgroundColor: ratio === r.value ? color : undefined,
                color: ratio === r.value ? "#fff" : undefined,
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="flex flex-col gap-4">
          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Visual Preview
            </p>
            <div className="flex items-center justify-center" style={{ minHeight: 200 }}>
              <div className="relative" style={{ width: 300, height: 200 }}>
                <div
                  className="absolute border-2 border-dashed border-red-400/50"
                  style={{
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                  }}
                />
                <div
                  className="absolute rounded border-2"
                  style={{
                    width: `${(result.cw / result.ow) * 100}%`,
                    height: `${(result.ch / result.oh) * 100}%`,
                    top: `${(result.offsetY / result.oh) * 100}%`,
                    left: `${(result.offsetX / result.ow) * 100}%`,
                    borderColor: color,
                    backgroundColor: `${color}20`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border-2 border-line bg-input-bg p-3">
              <p className="font-mono text-[10px] uppercase text-muted">Cropped Size</p>
              <p className="font-mono text-lg font-bold" style={{ color }}>
                {result.cw} × {result.ch}
              </p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3">
              <p className="font-mono text-[10px] uppercase text-muted">Crop Offset</p>
              <p className="font-mono text-lg font-bold" style={{ color }}>
                X: {result.offsetX} | Y: {result.offsetY}
              </p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
