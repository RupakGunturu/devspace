"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { SVGProps } from "react";
import { cn } from "@/lib/utils";

const MouseIcon = ({ color = "var(--yellow)", ...props }: SVGProps<SVGSVGElement> & { color?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={26}
      height={31}
      fill="none"
      {...props}
    >
      <g clipPath="url(#mouse-clip)">
        <path
          fill={color}
          fillRule="evenodd"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth={2}
          d="M21.993 14.425 2.549 2.935l4.444 23.108 4.653-10.002z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="mouse-clip">
          <path fill={color} d="M0 0h26v31H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

interface CursorHoverProps {
  label: string;
  color?: string;
  children: ReactNode;
}

export function CursorHover({ label, color = "var(--yellow)", children }: CursorHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative cursor-none [&_*]:cursor-none">
      {children}
      {hovered && (
        <motion.div
          className={cn("pointer-events-none absolute z-50")}
          style={{ left: position.x, top: position.y }}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.15 }}
        >
          <MouseIcon color={color} className="h-6 w-6" />
          <div
            className="ml-4 mt-1 rounded-[4px] border px-2 py-0.5 font-mono text-[11px] font-bold whitespace-nowrap bg-background"
            style={{ borderColor: color, color: color }}
          >
            {label}
          </div>
        </motion.div>
      )}
    </div>
  );
}
