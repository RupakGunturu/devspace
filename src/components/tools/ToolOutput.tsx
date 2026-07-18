import { CopyButton } from "./CopyButton";

interface ToolOutputProps {
  value: string;
  label?: string;
}

export function ToolOutput({ value, label = "Output" }: ToolOutputProps) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
        {value && <CopyButton text={value} />}
      </div>
      <pre className={`min-h-[120px] max-h-[400px] w-full overflow-auto whitespace-pre-wrap break-all rounded-md border-2 border-line bg-input-bg p-4 font-mono text-sm ${value ? "text-input-text" : "text-muted italic"}`}>
        {value || "Output will appear here..."}
      </pre>
    </div>
  );
}
