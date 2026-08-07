import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

type Platform = "instagram-post" | "instagram-story" | "youtube" | "tiktok" | "twitter";

const PLATFORMS: Record<Platform, { label: string; ratio: string; w: number; h: number }> = {
  "instagram-post": { label: "Instagram Post", ratio: "1:1", w: 1080, h: 1080 },
  "instagram-story": { label: "Instagram Story", ratio: "9:16", w: 1080, h: 1920 },
  youtube: { label: "YouTube", ratio: "16:9", w: 1920, h: 1080 },
  tiktok: { label: "TikTok", ratio: "9:16", w: 1080, h: 1920 },
  twitter: { label: "Twitter", ratio: "16:9", w: 1600, h: 900 },
};

export function VideoAspectRatioCalculator() {
  const [srcW, setSrcW] = useState("1920");
  const [srcH, setSrcH] = useState("1080");
  const [platform, setPlatform] = useState<Platform>("youtube");
  const { color } = useToolAccent();

  const result = useMemo(() => {
    const sw = parseInt(srcW) || 0;
    const sh = parseInt(srcH) || 0;
    if (sw <= 0 || sh <= 0) return null;
    const p = PLATFORMS[platform];
    const srcAspect = sw / sh;
    const tgtAspect = p.w / p.h;
    let action: "crop" | "pad" | "none";
    let finalW: number;
    let finalH: number;
    if (Math.abs(srcAspect - tgtAspect) < 0.01) {
      action = "none";
      finalW = p.w;
      finalH = p.h;
    } else if (srcAspect > tgtAspect) {
      action = "crop";
      finalW = Math.round(sh * tgtAspect);
      finalH = sh;
    } else {
      action = "pad";
      finalW = sw;
      finalH = Math.round(sw / tgtAspect);
    }
    return { action, finalW, finalH, targetW: p.w, targetH: p.h };
  }, [srcW, srcH, platform]);

  return (
    <ToolLayout id="video-aspect-ratio-calculator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Source Width
          </label>
          <input
            type="number"
            value={srcW}
            onChange={(e) => setSrcW(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Source Height
          </label>
          <input
            type="number"
            value={srcH}
            onChange={(e) => setSrcH(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Target Platform
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PLATFORMS) as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className="rounded-full border-2 px-3 py-1.5 font-mono text-xs font-medium transition-all"
              style={{
                borderColor: platform === p ? color : "var(--border)",
                backgroundColor: platform === p ? color : undefined,
                color: platform === p ? "#fff" : undefined,
              }}
            >
              {PLATFORMS[p].label} ({PLATFORMS[p].ratio})
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
            <div className="flex items-center justify-center gap-4" style={{ minHeight: 150 }}>
              <div className="text-center">
                <div
                  className="rounded border-2 border-dashed"
                  style={{
                    width: 80,
                    height: Math.round(80 * (parseInt(srcH) || 1080) / (parseInt(srcW) || 1920)),
                    borderColor: `${color}60`,
                    backgroundColor: `${color}15`,
                  }}
                />
                <p className="mt-1 font-mono text-[10px] text-muted">Source {srcW}×{srcH}</p>
              </div>
              <span className="font-mono text-lg text-muted">→</span>
              <div className="text-center">
                <div
                  className="rounded border-2"
                  style={{
                    width: 80,
                    height: Math.round(80 * result.targetH / result.targetW),
                    borderColor: color,
                    backgroundColor: `${color}30`,
                  }}
                />
                <p className="mt-1 font-mono text-[10px] text-muted">Target {result.targetW}×{result.targetH}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
              <p className="font-mono text-lg font-bold" style={{ color }}>
                {result.action === "none" ? "No change" : result.action === "crop" ? "Crop" : "Pad"}
              </p>
              <p className="font-mono text-[10px] uppercase text-muted">Action</p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
              <p className="font-mono text-lg font-bold" style={{ color }}>
                {result.finalW} × {result.finalH}
              </p>
              <p className="font-mono text-[10px] uppercase text-muted">Crop/Padding Size</p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
              <p className="font-mono text-lg font-bold" style={{ color }}>
                {result.targetW} × {result.targetH}
              </p>
              <p className="font-mono text-[10px] uppercase text-muted">Final Output</p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
