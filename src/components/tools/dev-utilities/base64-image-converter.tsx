import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";
import { ToolFileInput } from "../ToolFileInput";
import { useToolAccent } from "@/components/ToolAccentContext";

export default function Base64ImageConverter() {
  const [output, setOutput] = useState("");
  const [preview, setPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { color } = useToolAccent();

  const convert = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setOutput(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <ToolLayout id="base64-image-converter">
      <ToolFileInput accept="image/*" onChange={convert} label="Choose image" />
      {preview && (
        <div className="flex justify-center p-4 bg-paper-dim/50 rounded-sm border border-border">
          <img src={preview} alt="Preview" className="max-h-48 rounded" />
        </div>
      )}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Base64 Output</span>
            <button onClick={() => { navigator.clipboard.writeText(output); }} className="text-xs hover:underline" style={{ color }}>Copy</button>
          </div>
          <pre className="w-full min-h-[100px] max-h-[300px] overflow-auto p-4 bg-paper-dim/50 border border-border rounded-sm text-[10px] font-mono text-foreground whitespace-pre-wrap break-all">{output}</pre>
        </div>
      )}
    </ToolLayout>
  );
}
