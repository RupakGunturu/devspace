import { useState } from "react";

export function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-sm border-2 border-line px-3 py-1.5 font-mono text-xs text-muted hover:border-yellow hover:text-yellow ${className}`}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
