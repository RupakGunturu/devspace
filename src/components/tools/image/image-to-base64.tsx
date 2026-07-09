import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function ImageToBase64() {
  const [base64, setBase64] = useState("");
  const [preview, setPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <ToolLayout id="image-to-base64">
      <input ref={fileRef} type="file" accept="image/*" onChange={handle} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-yellow file:text-white hover:file:opacity-90" />
      {preview && <div className="flex justify-center p-4 bg-paper-dim/50 border border-border rounded-sm"><img src={preview} alt="Preview" className="max-h-48 rounded" /></div>}
      {base64 && (
        <div className="flex items-center justify-between p-3 bg-paper-dim/50 border border-border rounded-sm">
          <span className="text-xs text-muted-foreground">Base64 ready ({Math.round(base64.length / 1024)}KB)</span>
          <button onClick={() => navigator.clipboard.writeText(base64)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-paper-dim transition-colors">Copy</button>
        </div>
      )}
    </ToolLayout>
  );
}
