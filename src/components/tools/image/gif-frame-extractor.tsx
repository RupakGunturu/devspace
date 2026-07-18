import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";
import { ToolFileInput } from "../ToolFileInput";

export default function GifFrameExtractor() {
  const [info, setInfo] = useState<{ name: string; size: string; type: string; lastModified: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInfo({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type,
      lastModified: new Date(file.lastModified).toLocaleString(),
    });
  };

  return (
    <ToolLayout id="gif-frame-extractor">
      <ToolFileInput accept="image/gif" onChange={handle} label="Choose GIF" />
      {info && (
        <div className="space-y-1.5">
          {Object.entries(info).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-paper-dim/50 border border-border rounded-sm">
              <span className="text-xs text-muted-foreground uppercase">{key}</span>
              <span className="font-mono text-sm text-foreground">{val}</span>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Note: Full frame extraction requires complex GIF parsing. This shows file metadata.</p>
        </div>
      )}
    </ToolLayout>
  );
}
