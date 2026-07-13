"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface ShiftCardProps {
  className?: string;
  topContent: React.ReactNode;
  topAnimateContent?: React.ReactNode;
  middleContent: React.ReactNode;
  bottomContent: React.ReactNode;
}

export function ShiftCard({
  className,
  topContent,
  topAnimateContent,
  middleContent,
  bottomContent,
}: ShiftCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={cn(
        "relative w-[280px] h-[360px] rounded-xl overflow-hidden cursor-pointer",
        className,
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => setIsHovered((prev) => !prev)}
    >
      {/* Top section */}
      <motion.div
        className="absolute inset-x-0 top-0 z-10"
        animate={{
          y: isHovered ? -20 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {topContent}
        <AnimatePresence>
          {isHovered && topAnimateContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {topAnimateContent}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Middle section */}
      <motion.div
        className="absolute inset-x-0 top-[80px] z-20 flex justify-center"
        animate={{
          y: isHovered ? -40 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {middleContent}
      </motion.div>

      {/* Bottom section */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-30"
        animate={{
          y: isHovered ? 0 : 100,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {bottomContent}
      </motion.div>
    </motion.div>
  );
}
