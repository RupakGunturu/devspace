import { useToolAccent } from "@/components/ToolAccentContext";

interface ToolButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function ToolButton({ onClick, children, variant = "primary", className = "", disabled = false, loading = false }: ToolButtonProps) {
  const { color, fg } = useToolAccent();
  const base = "inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  if (variant === "secondary") {
    return (
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`${base} border-2 border-line bg-transparent text-foreground hover:bg-paper-dim/50 ${className}`}
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} border-2 hover:opacity-90 ${className}`}
      style={{ borderColor: color, backgroundColor: color, color: fg }}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
