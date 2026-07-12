"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { motion, type Variants, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

interface CursorProps {
  attachToParent?: boolean;
  variants?: Variants;
  transition?: Transition;
  className?: string;
  children: ReactNode;
}

export function Cursor({
  attachToParent = false,
  variants,
  transition,
  className,
  children,
}: CursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = attachToParent ? containerRef.current?.parentElement : containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [attachToParent]);

  const defaultVariants: Variants = {
    initial: { scale: 0.3, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.3, opacity: 0 },
  };

  const defaultTransition: Transition = {
    ease: "easeInOut",
    duration: 0.15,
  };

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {isVisible && (
        <motion.div
          className={cn("pointer-events-none absolute z-50", className)}
          style={{ left: position.x, top: position.y }}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants ?? defaultVariants}
          transition={transition ?? defaultTransition}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
