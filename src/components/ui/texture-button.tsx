"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TextureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
}

export function TextureButton({
  className,
  variant = "primary",
  children,
  ...props
}: TextureButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
        "active:scale-95",
        variant === "primary" &&
          "bg-white/10 hover:bg-white/20 text-white dark:bg-black/10 dark:hover:bg-black/20 dark:text-white",
        variant === "secondary" &&
          "bg-black/5 hover:bg-black/10 text-black dark:bg-white/5 dark:hover:bg-white/10 dark:text-white",
        variant === "ghost" &&
          "hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
