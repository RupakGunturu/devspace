import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(200);
  const [qrUrl, setQrUrl] = useState("");

  const generate = () => {
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`);
  };

  return (
    <ToolLayout id="qr-code-generator">
      <ToolInput value={text} onChange={setText} placeholder="Enter URL or text..." label="Content" rows={2} />
      <div className="flex items-center gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Size</label>
          <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm text-foreground">
            <option value={100}>100x100</option>
            <option value={200}>200x200</option>
            <option value={300}>300x300</option>
            <option value={400}>400x400</option>
            <option value={500}>500x500</option>
          </select>
        </div>
        <ToolButton onClick={generate}>Generate QR</ToolButton>
      </div>
      {qrUrl && (
        <div className="flex flex-col items-center gap-4 p-6 bg-paper-dim/50 border border-border rounded-sm">
          <img src={qrUrl} alt="QR Code" width={size} height={size} className="rounded-sm" />
          <a href={qrUrl} download className="text-sm text-yellow hover:underline">Download QR Code</a>
        </div>
      )}
    </ToolLayout>
  );
}
