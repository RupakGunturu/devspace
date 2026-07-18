import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";
import { ToolFileInput } from "../ToolFileInput";

export default function PhotoExifViewer() {
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
    <ToolLayout id="photo-exif-viewer">
      <ToolFileInput accept="image/*" onChange={handle} label="Choose image" />
      {info && (
        <div className="space-y-1.5">
          {Object.entries(info).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-paper-dim/50 border border-border rounded-sm">
              <span className="text-xs text-muted-foreground uppercase">{key}</span>
              <span className="font-mono text-sm text-foreground">{val}</span>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
