import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

export function StandupNoteFormatter() {
  const [yesterday, setYesterday] = useState("");
  const [today, setToday] = useState("");
  const [blockers, setBlockers] = useState("");
  const { color } = useToolAccent();

  const formatted = useMemo(() => {
    const yItems = yesterday
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const tItems = today
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const bItems = blockers
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (yItems.length === 0 && tItems.length === 0 && bItems.length === 0) return "";

    const lines: string[] = [];
    const dateStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    lines.push(`Daily Standup - ${dateStr}`);
    lines.push("=".repeat(40));
    lines.push("");

    lines.push("YESTERDAY");
    lines.push("-".repeat(20));
    if (yItems.length > 0) {
      yItems.forEach((item) => {
        lines.push(`  \u2022 ${item}`);
      });
    } else {
      lines.push("  (No items)");
    }
    lines.push("");

    lines.push("TODAY");
    lines.push("-".repeat(20));
    if (tItems.length > 0) {
      tItems.forEach((item) => {
        lines.push(`  \u2022 ${item}`);
      });
    } else {
      lines.push("  (No items)");
    }
    lines.push("");

    lines.push("BLOCKERS");
    lines.push("-".repeat(20));
    if (bItems.length > 0) {
      bItems.forEach((item) => {
        lines.push(`  \u2022 ${item}`);
      });
    } else {
      lines.push("  None");
    }

    return lines.join("\n");
  }, [yesterday, today, blockers]);

  const hasContent = yesterday.trim() || today.trim() || blockers.trim();

  return (
    <ToolLayout id="standup-note-formatter">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Yesterday
          </span>
          <textarea
            value={yesterday}
            onChange={(e) => setYesterday(e.target.value)}
            placeholder={"Completed auth module refactor\nMerged PR #342\nFixed staging deployment issue"}
            rows={6}
            className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: yesterday ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Today
          </span>
          <textarea
            value={today}
            onChange={(e) => setToday(e.target.value)}
            placeholder={"Start user dashboard feature\nCode review for PR #345\nSprint planning meeting"}
            rows={6}
            className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: today ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Blockers
          </span>
          <textarea
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
            placeholder={"Waiting on API credentials from DevOps\nNeed design review for dashboard"}
            rows={6}
            className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: blockers ? color : undefined }}
          />
        </div>
      </div>

      {formatted && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Formatted Standup
            </span>
            <CopyButton text={formatted} />
          </div>
          <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap font-mono text-sm text-input-text leading-relaxed">
            {formatted}
          </pre>
        </div>
      )}

      {!hasContent && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Fill in your standup sections above (one item per line)
        </div>
      )}
    </ToolLayout>
  );
}
