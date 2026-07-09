interface ToolButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function ToolButton({ onClick, children, variant = "primary", className = "" }: ToolButtonProps) {
  const base = "inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium transition-all";
  const variants = {
    primary: "border-2 border-yellow bg-yellow text-ink hover:opacity-90",
    secondary: "border-2 border-line bg-transparent text-foreground hover:bg-paper-dim/50",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
