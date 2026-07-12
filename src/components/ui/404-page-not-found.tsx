import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Glitch404() {
  return (
    <div className="relative inline-block">
      <span
        className="absolute inset-0 font-display text-[120px] sm:text-[160px] md:text-[200px] font-extrabold leading-none text-coral select-none opacity-0"
        style={{ animation: "glitch-1 4s ease-in-out infinite" }}
        aria-hidden="true"
      >
        404
      </span>
      <span
        className="absolute inset-0 font-display text-[120px] sm:text-[160px] md:text-[200px] font-extrabold leading-none text-yellow select-none opacity-0"
        style={{ animation: "glitch-2 4s ease-in-out infinite" }}
        aria-hidden="true"
      >
        404
      </span>
      <span
        className="relative font-display text-[120px] sm:text-[160px] md:text-[200px] font-extrabold leading-none text-yellow select-none"
        style={{ animation: "text-entry 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
      >
        404
      </span>
    </div>
  );
}

function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: 3 + (i % 5) * 2,
    left: `${(i * 5.3) % 95}%`,
    top: `${(i * 7.1 + 10) % 85}%`,
    delay: (i * 0.3) % 4,
    duration: 2.5 + (i % 4) * 0.8,
    color: i % 3 === 0 ? "var(--coral)" : "var(--yellow)",
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            top: p.top,
            backgroundColor: p.color,
            opacity: 0,
            animation: `particle-rise ${p.duration}s ease-in ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function ScanLine() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow/40 to-transparent"
        style={{ animation: "scan 4s linear infinite" }}
      />
    </div>
  );
}

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <style>{`
        @keyframes text-entry {
          0% { opacity: 0; transform: scale(0.3) rotate(-8deg); filter: blur(12px); }
          60% { opacity: 1; transform: scale(1.08) rotate(1deg); filter: blur(0); }
          80% { transform: scale(0.97) rotate(-0.5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0); }
        }
        @keyframes glitch-1 {
          0%, 88%, 100% { opacity: 0; transform: translate(0); }
          90% { opacity: 0.7; transform: translate(4px, -2px); clip-path: inset(20% 0 40% 0); }
          92% { opacity: 0; }
          94% { opacity: 0.5; transform: translate(-3px, 1px); clip-path: inset(60% 0 10% 0); }
          96% { opacity: 0; }
        }
        @keyframes glitch-2 {
          0%, 88%, 100% { opacity: 0; transform: translate(0); }
          89% { opacity: 0.5; transform: translate(-4px, 2px); clip-path: inset(50% 0 20% 0); }
          91% { opacity: 0; }
          93% { opacity: 0.6; transform: translate(3px, -1px); clip-path: inset(10% 0 60% 0); }
          95% { opacity: 0; }
        }
        @keyframes particle-rise {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          15% { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(-120px) scale(1.2); }
        }
        @keyframes scan {
          0% { top: -2%; }
          100% { top: 102%; }
        }
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 4px 4px 0 var(--coral), 0 0 0 0 transparent; }
          50% { box-shadow: 4px 4px 0 var(--coral), 0 0 16px 2px var(--yellow); }
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <Particles />
      <ScanLine />

      <div className="relative z-10 text-center px-4">
        <div className="mb-6">
          <Glitch404 />
        </div>

        <h2
          className="font-display text-2xl sm:text-3xl font-bold mb-3 opacity-0"
          style={{ animation: "slide-up 0.6s ease-out 0.4s both" }}
        >
          Looks like you're lost
        </h2>
        <p
          className="text-muted text-sm sm:text-base max-w-md mx-auto mb-8 opacity-0"
          style={{ animation: "slide-up 0.6s ease-out 0.6s both" }}
        >
          The page you're looking for doesn't exist or has been moved.
          <br />
          Let's get you back on track.
        </p>

        <div
          className="opacity-0"
          style={{ animation: "slide-up 0.6s ease-out 0.8s both" }}
        >
          <Button
            variant="default"
            onClick={() => navigate("/")}
            className="bg-yellow text-ink border-2 border-yellow font-mono text-sm font-bold hover:bg-yellow/90 cursor-pointer"
            style={{ animation: "pulse-border 3s ease-in-out infinite", boxShadow: "4px 4px 0 var(--coral)" }}
          >
            ← Go to Home
          </Button>
        </div>

        <div
          className="mt-14 overflow-hidden opacity-0"
          style={{ animation: "slide-up 0.6s ease-out 1s both" }}
          aria-hidden="true"
        >
          <div
            className="whitespace-nowrap font-mono text-[11px] text-muted/25 tracking-[0.3em] uppercase"
            style={{ animation: "ticker-scroll 15s linear infinite", width: "max-content" }}
          >
            404 NOT FOUND · PAGE MISSING · DEAD END · NOWHERE · SERVER GHOST · BROKEN LINK · VOID · &nbsp;
            404 NOT FOUND · PAGE MISSING · DEAD END · NOWHERE · SERVER GHOST · BROKEN LINK · VOID · &nbsp;
            404 NOT FOUND · PAGE MISSING · DEAD END · NOWHERE · SERVER GHOST · BROKEN LINK · VOID
          </div>
        </div>
      </div>
    </section>
  );
}
