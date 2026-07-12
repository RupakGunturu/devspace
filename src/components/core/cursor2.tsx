"use client";

import { SVGProps } from "react";
import { Cursor } from "@/components/core/cursor";

const MouseIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={26}
      height={31}
      fill="none"
      {...props}
    >
      <g clipPath="url(#a)">
        <path
          fill="var(--yellow)"
          fillRule="evenodd"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth={2}
          d="M21.993 14.425 2.549 2.935l4.444 23.108 4.653-10.002z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="var(--yellow)" d="M0 0h26v31H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

interface Cursor2Props {
  label?: string;
  className?: string;
}

export function Cursor2({ label = "View", className }: Cursor2Props) {
  return (
    <Cursor
      attachToParent
      variants={{
        initial: { scale: 0.3, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.3, opacity: 0 },
      }}
      transition={{
        ease: "easeInOut",
        duration: 0.15,
      }}
      className={className}
    >
      <div>
        <MouseIcon className="h-6 w-6" />
        <div className="ml-4 mt-1 rounded-[4px] bg-yellow px-2 py-0.5 font-mono text-[11px] font-bold text-ink whitespace-nowrap">
          {label}
        </div>
      </div>
    </Cursor>
  );
}
