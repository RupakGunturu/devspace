import { ToolLayout } from "./ToolLayout";

interface Format {
  name: string;
  quality: string;
  size: string;
  useCase: string;
  lossless: boolean;
}

const FORMATS: Format[] = [
  {
    name: "WAV",
    quality: "Lossless (uncompressed)",
    size: "Very Large (~10MB/min)",
    useCase: "Audio editing, archiving, CD mastering",
    lossless: true,
  },
  {
    name: "MP3",
    quality: "Lossy (high quality at 320kbps)",
    size: "Small (~1MB/min)",
    useCase: "General playback, sharing, legacy compatibility",
    lossless: false,
  },
  {
    name: "OGG",
    quality: "Lossy (better quality than MP3 at same bitrate)",
    size: "Small (~0.8MB/min)",
    useCase: "Game audio, web, open-source projects",
    lossless: false,
  },
  {
    name: "FLAC",
    quality: "Lossless (compressed, ~50-70% of WAV)",
    size: "Medium (~5MB/min)",
    useCase: "Music streaming, archiving, audiophile playback",
    lossless: true,
  },
  {
    name: "AAC",
    quality: "Lossy (better than MP3 at same bitrate)",
    size: "Small (~0.9MB/min)",
    useCase: "Streaming (Apple Music, YouTube), podcasts",
    lossless: false,
  },
];

export function AudioFormatConverter() {
  return (
    <ToolLayout id="audio-format-converter">
      <div className="rounded-md border-2 border-line bg-input-bg">
        <div className="grid grid-cols-4 gap-px border-b-2 border-line">
          <div className="bg-input-bg p-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Format
          </div>
          <div className="bg-input-bg p-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Quality
          </div>
          <div className="bg-input-bg p-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
            File Size
          </div>
          <div className="bg-input-bg p-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Best For
          </div>
        </div>

        {FORMATS.map((f, i) => (
          <div
            key={f.name}
            className="grid grid-cols-4 gap-px border-b border-line last:border-b-0"
          >
            <div className="flex items-center gap-2 p-3">
              <span
                className="inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
                style={{
                  backgroundColor: f.lossless ? "#22c55e20" : "#f59e0b20",
                  color: f.lossless ? "#22c55e" : "#f59e0b",
                }}
              >
                {f.lossless ? "LOSSLESS" : "LOSSY"}
              </span>
              <span className="font-mono text-sm font-bold text-foreground">{f.name}</span>
            </div>
            <div className="flex items-center p-3">
              <span className="font-mono text-xs text-foreground">{f.quality}</span>
            </div>
            <div className="flex items-center p-3">
              <span className="font-mono text-xs text-foreground">{f.size}</span>
            </div>
            <div className="flex items-center p-3">
              <span className="font-mono text-xs text-foreground">{f.useCase}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-md border-2 border-line bg-input-bg p-4">
        <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Quick Reference
        </p>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) => (
            <span
              key={f.name}
              className="rounded-full border-2 border-line px-3 py-1 font-mono text-xs font-medium"
            >
              {f.name}
            </span>
          ))}
        </div>
        <p className="mt-3 font-mono text-xs text-muted">
          For streaming and sharing, use MP3 or AAC. For editing and archiving, use WAV or FLAC. OGG
          is ideal for web and game projects where open-source compatibility is important.
        </p>
      </div>
    </ToolLayout>
  );
}
