import { useRef } from "react";
import { useToolAccent } from "@/components/ToolAccentContext";

interface ToolFileInputProps {
  accept?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
}

export function ToolFileInput({ accept = "*/*", onChange, label = "Choose file", className = "" }: ToolFileInputProps) {
  const { color, fg } = useToolAccent();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className={className}>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full rounded-md border-2 border-dashed p-6 text-center text-sm font-medium transition-all hover:opacity-90"
        style={{ borderColor: color, color: fg }}
      >
        {label}
      </button>
    </div>
  );
}
