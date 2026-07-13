"use client";

import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NeuFollowButtonProps {
  label?: string;
  hoverLabel?: string;
  to?: string;
  className?: string;
}

export function NeuFollowButton({
  label = "Level Up",
  hoverLabel = "Let's go",
  to = "/feed/hot-take",
  className,
}: NeuFollowButtonProps) {
  return (
    <div
      className={cn(
        "relative h-12 w-full max-w-[280px] bg-coral",
        className
      )}
    >
      <Link
        to={to}
        className="group flex h-full w-full items-center justify-between border-2 border-coral bg-background px-6 font-mono text-sm font-bold no-underline transition-colors duration-300 hover:bg-coral hover:text-white"
      >
        <span className="relative overflow-hidden">
          <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
            {label}
          </span>
          <span className="absolute left-0 top-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            {hoverLabel}
          </span>
        </span>

        <div className="pointer-events-none flex h-6 w-6 overflow-hidden text-2xl">
          <svg
            className="shrink-0 -translate-x-full text-white transition-transform duration-300 group-hover:translate-x-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
          <svg
            className="shrink-0 -translate-x-full transition-transform duration-300 group-hover:translate-x-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </Link>
    </div>
  );
}
