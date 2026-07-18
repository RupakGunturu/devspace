import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";
import { ToolOutput } from "../ToolOutput";
import { ToolFileInput } from "../ToolFileInput";

export default function ImageFormatConverter() {
  const [formats, setFormats] = useState<string[]>([]);
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormats([file.type, "PNG", "JPEG", "WebP"]);
    const reader = new FileReader();
    reader.onload = () => setUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <ToolLayout id="image-format-converter">
      <ToolFileInput accept="image/*" onChange={handle} label="Choose image" />
      {url && <div className="flex justify-center"><img src={url} alt="Preview" className="max-h-32 border border-border rounded" /></div>}
      <div className="p-3 bg-paper-dim/50 border border-border rounded-sm"><span className="text-xs text-muted-foreground">Supported formats for conversion: PNG, JPEG, WebP, AVIF</span></div>
    </ToolLayout>
  );
}
