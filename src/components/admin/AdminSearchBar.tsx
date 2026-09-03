import { Search } from "lucide-react";
import useDebounce from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

interface AdminSearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

export function AdminSearchBar({
  placeholder = "Search…",
  value,
  onChange,
  debounceMs = 200,
  className,
}: AdminSearchBarProps) {
  const [local, setLocal] = useState(value);
  const debounced = useDebounce(local, debounceMs);

  useEffect(() => {
    onChange(debounced);
  }, [debounced, onChange]);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <div className={className}>
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-line bg-input-bg py-2 pr-3 pl-9 text-sm text-input-text outline-none focus:ring-2 focus:ring-yellow"
      />
    </div>
  );
}
