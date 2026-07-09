import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function Base64ImageConverter() {
  const [output, setOutput] = useState("");
  const [preview, setPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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
      <input ref={fileRef} type="file" accept="image/*" onChange={convert} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-yellow file:text-white hover:file:opacity-90" />
      {preview && (
        <div className="flex justify-center p-4 bg-paper-dim/50 rounded-sm border border-border">
          <img src={preview} alt="Preview" className="max-h-48 rounded" />
        </div>
      )}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Base64 Output</span>
            <button onClick={() => { navigator.clipboard.writeText(output); }} className="text-xs text-yellow hover:underline">Copy</button>
          </div>
          <pre className="w-full min-h-[100px] max-h-[300px] overflow-auto p-4 bg-paper-dim/50 border border-border rounded-sm text-[10px] font-mono text-foreground whitespace-pre-wrap break-all">{output}</pre>
        </div>
      )}
    </ToolLayout>
  );
}
