import { useState } from "react";
import { useToolAccent } from "@/components/ToolAccentContext";

interface ToolInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
}

export function ToolInput({ value, onChange, placeholder = "Enter input...", label = "Input", rows = 8 }: ToolInputProps) {
  const { color } = useToolAccent();
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full resize-y rounded-md border-2 bg-input-bg p-4 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
        style={{ borderColor: focused ? color : undefined }}
      />
    </div>
  );
}
