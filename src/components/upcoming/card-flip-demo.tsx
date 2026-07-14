import { ArrowRight, Repeat2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface CardFlipProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  color?: string;
}

export default function CardFlip({
  title = "Design Systems",
  subtitle = "Explore the fundamentals",
  description = "Dive deep into the world of modern UI/UX design.",
  features = ["UI/UX", "Modern Design", "Tailwind CSS", "Kokonut UI"],
  color = "#f59e0b",
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group relative h-[320px] w-full max-w-[280px] [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "relative h-full w-full",
          "[transform-style:preserve-3d]",
          "transition-[transform] duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]"
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[backface-visibility:hidden] [transform:rotateY(0deg)]",
            "overflow-hidden rounded-2xl",
            "bg-paper",
            "border-2 border-line",
            "transition-shadow duration-500",
            "group-hover:shadow-lg"
          )}
        >
          <div className="relative h-full overflow-hidden bg-paper-dim">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% 30%, ${color}18, transparent 65%)`,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-start justify-center pt-24"
            >
              <div className="relative flex h-[100px] w-[200px] items-center justify-center">
                {[...Array(10)].map((_, i) => (
                  <div
                    className={cn(
                      "absolute h-[50px] w-[50px]",
                      "rounded-full",
                      "opacity-0",
                      "group-hover:animate-[flipScale_3s_linear_infinite]"
                    )}
                    key={i}
                    style={{
                      animationDelay: `${i * 0.3}s`,
                      background: `radial-gradient(circle, ${color}80, transparent)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 left-0 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <h3 className="font-display text-lg font-bold leading-snug tracking-tighter text-foreground transition-transform duration-500 group-hover:translate-y-[-4px]">
                  {title}
                </h3>
                <p className="line-clamp-2 text-sm tracking-tight text-muted transition-transform delay-[50ms] duration-500 group-hover:translate-y-[-4px]">
                  {subtitle}
                </p>
              </div>
              <div className="group/icon relative">
                <div
                  className="absolute inset-[-8px] rounded-lg transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to bottom right, ${color}33, ${color}1a, transparent)`,
                  }}
                />
                <Repeat2
                  aria-hidden="true"
                  className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/icon:-rotate-12 group-hover/icon:scale-110"
                  style={{ color }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[backface-visibility:hidden] [transform:rotateY(180deg)]",
            "rounded-2xl p-6",
            "bg-paper",
            "border-2 border-line",
            "flex flex-col",
            "transition-shadow duration-500",
            "group-hover:shadow-lg"
          )}
        >
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-foreground transition-transform duration-500 group-hover:translate-y-[-2px]">
                {title}
              </h3>
              <p className="line-clamp-2 text-sm text-muted tracking-tight transition-transform duration-500 group-hover:translate-y-[-2px]">
                {description}
              </p>
            </div>

            <div className="space-y-2">
              {features.map((feature, index) => (
                <div
                  className="flex items-center gap-2 text-sm text-foreground/80 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  key={feature}
                  style={{
                    transform: isFlipped ? "translateX(0)" : "translateX(-10px)",
                    opacity: isFlipped ? 1 : 0,
                    transitionDelay: `${index * 50 + 150}ms`,
                  }}
                >
                  <ArrowRight
                    aria-hidden="true"
                    className="h-3 w-3"
                    style={{ color }}
                  />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-line pt-6">
            <button
              className={cn(
                "group/start relative w-full",
                "flex items-center justify-between",
                "-m-3 rounded-xl p-3",
                "transition-[transform,background] duration-300",
                "bg-paper-dim",
                "hover:scale-[1.02] active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              )}
              type="button"
            >
              <span className="font-medium text-sm text-foreground transition-colors duration-300 group-hover/start:text-foreground">
                Start today
              </span>
              <div className="group/icon relative">
                <ArrowRight
                  aria-hidden="true"
                  className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/start:translate-x-0.5 group-hover/start:scale-110"
                  style={{ color }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes flipScale {
          0% { transform: scale(2); opacity: 0; }
          50% { transform: translate(0px, -5px) scale(1); opacity: 1; }
          100% { transform: translate(0px, 5px) scale(0.1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
