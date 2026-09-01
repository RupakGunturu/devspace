import type { DeploymentPhase } from "@/lib/adminApi";
import { Check, Loader2, X } from "lucide-react";

const PHASE_LABELS: Record<DeploymentPhase["name"], string> = {
  typescript: "TypeScript check",
  eslint: "ESLint (zero warnings)",
  tests: "Test suite",
  build: "Production build",
};

export function VerificationProgress({ phases }: { phases: DeploymentPhase[] }) {
  const running = phases.find((p) => p.status === "running");
  const failed = phases.find((p) => p.status === "fail");

  return (
    <div className="rounded-lg border border-line bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-foreground">
          {failed ? "Verification failed" : running ? "Verifying..." : "Verification complete"}
        </h3>
        {running && <Loader2 className="h-4 w-4 animate-spin text-yellow" />}
      </div>

      <ol className="space-y-2">
        {phases.map((phase, i) => (
          <li key={phase.name} className="flex items-center gap-2 text-sm">
            {phase.status === "pass" ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow text-ink">
                <Check className="h-3 w-3" />
              </span>
            ) : phase.status === "fail" ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coral text-ink">
                <X className="h-3 w-3" />
              </span>
            ) : phase.status === "running" ? (
              <Loader2 className="h-5 w-5 animate-spin text-yellow" />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-line text-muted">
                <span className="text-[10px]">{i + 1}</span>
              </span>
            )}
            <span
              className={
                phase.status === "fail"
                  ? "font-medium text-coral"
                  : phase.status === "pass"
                    ? "text-foreground"
                    : "text-muted"
              }
            >
              {PHASE_LABELS[phase.name]}
            </span>
            {phase.durationMs ? (
              <span className="ml-auto font-mono text-[11px] text-muted">
                {(phase.durationMs / 1000).toFixed(1)}s
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      {failed?.message && (
        <p className="mt-3 rounded-sm bg-coral/10 p-2 font-mono text-[11px] text-coral">
          {failed.message}
        </p>
      )}
    </div>
  );
}
