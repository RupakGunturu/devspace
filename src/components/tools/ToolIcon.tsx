import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/data/tools";

type IconComponent = React.ComponentType<{ className?: string; size?: number }>;

export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as unknown as Record<string, IconComponent>)[name];
  if (!Icon) return null;
  return <Icon className={cn("shrink-0", className)} />;
}

export function ToolIconDisplay({
  name,
  size = "sm",
  category,
}: {
  name: string;
  size?: "sm" | "lg";
  category?: string;
}) {
  const Icon = (LucideIcons as unknown as Record<string, IconComponent>)[name];
  if (!Icon) return null;
  const colors = category ? CATEGORY_COLORS[category] : undefined;
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full",
        size === "sm" ? "h-6 w-6" : "h-10 w-10",
        colors ? colors.bg : "bg-zinc-100",
        colors ? colors.darkBg : "dark:bg-zinc-800",
      )}
    >
      <Icon
        className={cn(
          size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5",
          colors?.icon,
        )}
      />
    </div>
  );
}
