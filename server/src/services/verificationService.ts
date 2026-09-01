import { githubService } from "./githubService";

export interface VerificationPhase {
  name: "typescript" | "eslint" | "tests" | "build";
  status: "pending" | "running" | "pass" | "fail";
  message?: string;
  durationMs?: number;
}

export interface VerificationResult {
  status: "pending" | "verifying" | "passed" | "failed";
  phases: VerificationPhase[];
  runId?: number;
  error?: string;
}

/**
 * Track a GitHub Action verification run for a preview branch.
 * Polls the workflow run until it completes. In environments without a
 * configured GITHUB_TOKEN, we cannot create branches — this returns early.
 */
export async function startVerification(
  branchName: string,
): Promise<{ runId?: number; started: boolean; error?: string }> {
  if (!process.env.GITHUB_TOKEN) {
    return { started: false, error: "GITHUB_TOKEN not configured — cannot verify remotely." };
  }

  let runId: number | null = null;
  // Give the action runner a moment to register the run, then look it up.
  for (let i = 0; i < 20; i++) {
    runId = await githubService.findLatestWorkflowRun(branchName, "verify-and-deploy.yml");
    if (runId) break;
    await new Promise((r) => setTimeout(r, 1000));
  }

  return { runId: runId ?? undefined, started: true };
}

export async function pollVerification(runId: number): Promise<VerificationResult> {
  const { status, conclusion } = await githubService.getWorkflowConclusion(runId);

  if (status === "completed") {
    const passed = conclusion === "success";
    return {
      status: passed ? "passed" : "failed",
      phases: allPhases(passed ? "pass" : "fail"),
      runId,
      error: passed
        ? undefined
        : `Build failed (${conclusion ?? "unknown"}). See GitHub Actions logs.`,
    };
  }

  return {
    status: "verifying",
    phases: allPhases("running"),
    runId,
  };
}

function allPhases(status: "pass" | "fail" | "running"): VerificationPhase[] {
  const base: VerificationPhase["name"][] = ["typescript", "eslint", "tests", "build"];
  return base.map((name, i) => ({
    name,
    status,
    ...(status === "running" && i === base.length - 1 ? {} : {}),
  }));
}
