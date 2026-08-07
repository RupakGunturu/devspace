import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolFileInput } from "./ToolFileInput";
import { useToolAccent } from "@/components/ToolAccentContext";

export function ExifDataViewer() {
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    type: string;
    size: string;
    width: number;
    height: number;
  } | null>(null);
  const { color } = useToolAccent();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`;

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      setFileInfo({
        name: file.name,
        type: file.type,
        size: sizeStr,
        width: img.width,
        height: img.height,
      });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <ToolLayout id="exif-data-viewer">
      <ToolFileInput accept="image/*" onChange={handleFile} label="Choose an image to inspect" />

      {fileInfo && (
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3">
              <p className="font-mono text-[10px] uppercase text-muted">Filename</p>
              <p className="mt-1 font-mono text-sm font-bold text-foreground break-all">{fileInfo.name}</p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3">
              <p className="font-mono text-[10px] uppercase text-muted">Type</p>
              <p className="mt-1 font-mono text-sm font-bold" style={{ color }}>{fileInfo.type}</p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3">
              <p className="font-mono text-[10px] uppercase text-muted">Dimensions</p>
              <p className="mt-1 font-mono text-sm font-bold" style={{ color }}>
                {fileInfo.width} × {fileInfo.height}
              </p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3">
              <p className="font-mono text-[10px] uppercase text-muted">File Size</p>
              <p className="mt-1 font-mono text-sm font-bold" style={{ color }}>{fileInfo.size}</p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
