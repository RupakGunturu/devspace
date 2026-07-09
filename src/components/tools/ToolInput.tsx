interface ToolInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
}

export function ToolInput({ value, onChange, placeholder = "Enter input...", label = "Input", rows = 8 }: ToolInputProps) {
  return (
    <div className="w-full">
      <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-sm border-2 border-line bg-ink p-4 font-mono text-sm text-text outline-none placeholder:text-muted focus:border-yellow/50"
      />
    </div>
  );
}
