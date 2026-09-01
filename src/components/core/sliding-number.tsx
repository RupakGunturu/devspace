import type { CSSProperties } from "react";

interface SlidingNumberProps {
  value: number | string;
  padStart?: boolean;
  padNumber?: number;
  className?: string;
}

const KEYFRAMES_NAME = "devspace-sliding-number";

function animationStyles(): CSSProperties {
  return { display: "inline-block", animation: `${KEYFRAMES_NAME} 0.25s ease-out both` };
}

const keyframeRules =
  `@keyframes ${KEYFRAMES_NAME}{from{transform:translateY(0.6em);opacity:0}` +
  `to{transform:translateY(0);opacity:1}}`;

export function SlidingNumber({
  value,
  padStart = false,
  padNumber = 2,
  className,
}: SlidingNumberProps) {
  const str = String(value).padStart(padStart ? padNumber : 0, "0");
  const style: CSSProperties = {
    display: "inline-flex",
    overflow: "hidden",
    fontVariantNumeric: "tabular-nums",
  };

  return (
    <span className={className} style={style}>
      <style>{keyframeRules}</style>
      {str.split("").map((ch, i) => (
        <span key={`${str}-${i}`} style={animationStyles()}>
          {ch}
        </span>
      ))}
    </span>
  );
}
