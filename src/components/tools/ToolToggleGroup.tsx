import { useToolAccent } from "@/components/ToolAccentContext";

interface ToggleOption {
  value: string;
  label: string;
}

interface ToolToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ToolToggleGroup({ options, value, onChange, className = "" }: ToolToggleGroupProps) {
  const { color, fg } = useToolAccent();

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="px-3 py-1.5 text-xs rounded-full border transition-all"
          style={
            value === opt.value
              ? { borderColor: color, backgroundColor: color, color: fg }
              : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
