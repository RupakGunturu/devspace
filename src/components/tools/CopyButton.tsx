import { useState } from "react";
import { useToolAccent } from "@/components/ToolAccentContext";

export function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const { color } = useToolAccent();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-md border-2 border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-current ${className}`}
      style={{ ["--hover-color" as string]: color }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.color = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.color = "";
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
