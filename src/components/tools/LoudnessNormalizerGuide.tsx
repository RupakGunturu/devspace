import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

type Platform = "youtube" | "spotify" | "apple" | "broadcast" | "film";

const PLATFORMS: Record<
  Platform,
  { label: string; lufs: string; truePeak: string; tips: string[] }
> = {
  youtube: {
    label: "YouTube",
    lufs: "-14 LUFS",
    truePeak: "-1.0 dBTP",
    tips: [
      "Target -14 LUFS integrated loudness",
      "Keep true peak below -1.0 dBTP",
      "YouTube normalizes loud content down, not quiet content up",
      "Consistent loudness improves viewer experience",
      "Check loudness after upload in YouTube Studio",
    ],
  },
  spotify: {
    label: "Spotify",
    lufs: "-14 LUFS",
    truePeak: "-1.0 dBTP",
    tips: [
      "Targets -14 LUFS for most content",
      "Normalizes louder tracks down to -14 LUFS",
      "Loudness normalization is applied during playback",
      "Keep dynamic range — don't over-compress",
      "Spotify uses ReplayGain-based normalization",
    ],
  },
  apple: {
    label: "Apple Podcasts",
    lufs: "-16 LUFS",
    truePeak: "-1.0 dBTP",
    tips: [
      "Apple recommends -16 LUFS for spoken word",
      "Music podcasts can target -14 to -16 LUFS",
      "Use -1.0 dBTP true peak limiter",
      "Normalize episode-to-episode for consistency",
      "Apple Sound Check relies on loudness metadata",
    ],
  },
  broadcast: {
    label: "Broadcast (TV/Radio)",
    lufs: "-24 LUFS",
    truePeak: "-2.0 dBTP",
    tips: [
      "EBU R 128 standard targets -23 LUFS (±1)",
      "ATSC A/85 targets -24 LUFS",
      "True peak must not exceed -2.0 dBTP",
      "Loudness range (LRA) should be under 20 LU",
      "Required measurement gate: -70 LUFS absolute, -10 LU relative",
    ],
  },
  film: {
    label: "Film / Cinema",
    lufs: "-27 LUFS",
    truePeak: "-2.0 dBTP",
    tips: [
      "Dolby recommends -24 to -31 LUFS for cinema",
      "Theatrical releases are typically quieter for dynamic range",
      "Dialogue normalization is critical",
      "Use separate dialogue, music, and effects stems",
      "Reference monitoring at calibrated 85 dB SPL",
    ],
  },
};

export function LoudnessNormalizerGuide() {
  const [platform, setPlatform] = useState<Platform>("youtube");
  const { color } = useToolAccent();

  const current = PLATFORMS[platform];

  return (
    <ToolLayout id="loudness-normalizer-guide">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Platform
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
              {PLATFORMS[p].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border-2 border-line bg-input-bg px-5 py-4 text-center">
          <p className="font-mono text-3xl font-bold" style={{ color }}>
            {current.lufs}
          </p>
          <p className="font-mono text-[10px] uppercase text-muted">Target Loudness</p>
        </div>
        <div className="rounded-md border-2 border-line bg-input-bg px-5 py-4 text-center">
          <p className="font-mono text-3xl font-bold" style={{ color }}>
            {current.truePeak}
          </p>
          <p className="font-mono text-[10px] uppercase text-muted">Max True Peak</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Tips for {current.label}
        </span>
        <div className="flex flex-col gap-2">
          {current.tips.map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-md border-2 border-line bg-input-bg px-4 py-2.5"
            >
              <span
                className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-sm text-foreground">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
