import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";

interface GitOperation {
  name: string;
  template: string;
  flags: { flag: string; label: string; default?: boolean }[];
}

const operations: GitOperation[] = [
  {
    name: "commit",
    template: "git commit",
    flags: [
      { flag: "-m", label: "Message (-m)" },
      { flag: "-a", label: "All modified (-a)" },
      { flag: "--amend", label: "Amend last commit" },
      { flag: "--no-verify", label: "Skip hooks" },
    ],
  },
  {
    name: "merge",
    template: "git merge",
    flags: [
      { flag: "--no-ff", label: "No fast-forward" },
      { flag: "--squash", label: "Squash commits" },
      { flag: "--abort", label: "Abort merge" },
    ],
  },
  {
    name: "rebase",
    template: "git rebase",
    flags: [
      { flag: "-i", label: "Interactive (-i)" },
      { flag: "--abort", label: "Abort rebase" },
      { flag: "--continue", label: "Continue rebase" },
      { flag: "--skip", label: "Skip commit" },
    ],
  },
  {
    name: "cherry-pick",
    template: "git cherry-pick",
    flags: [
      { flag: "--no-commit", label: "No commit" },
      { flag: "--abort", label: "Abort" },
      { flag: "-x", label: "Add reference" },
    ],
  },
  {
    name: "stash",
    template: "git stash",
    flags: [
      { flag: "push", label: "Push stash" },
      { flag: "pop", label: "Pop stash" },
      { flag: "apply", label: "Apply stash" },
      { flag: "list", label: "List stashes" },
      { flag: "drop", label: "Drop stash" },
      { flag: "clear", label: "Clear all stashes" },
    ],
  },
  {
    name: "branch",
    template: "git branch",
    flags: [
      { flag: "-d", label: "Delete (-d)" },
      { flag: "-D", label: "Force delete (-D)" },
      { flag: "-a", label: "List all (-a)" },
      { flag: "-r", label: "Remote only (-r)" },
    ],
  },
  {
    name: "checkout",
    template: "git checkout",
    flags: [
      { flag: "-b", label: "New branch (-b)" },
      { flag: "--", label: "Path separator (--)" },
    ],
  },
  {
    name: "revert",
    template: "git revert",
    flags: [
      { flag: "--no-commit", label: "No commit" },
      { flag: "--abort", label: "Abort" },
    ],
  },
  {
    name: "reset",
    template: "git reset",
    flags: [
      { flag: "--soft", label: "Soft reset" },
      { flag: "--mixed", label: "Mixed reset" },
      { flag: "--hard", label: "Hard reset" },
    ],
  },
  {
    name: "bisect",
    template: "git bisect",
    flags: [
      { flag: "start", label: "Start bisect" },
      { flag: "good", label: "Mark good" },
      { flag: "bad", label: "Mark bad" },
      { flag: "reset", label: "Reset bisect" },
    ],
  },
];

export function GitCommandBuilder() {
  const [selectedOp, setSelectedOp] = useState(0);
  const [activeFlags, setActiveFlags] = useState<Set<string>>(new Set());
  const [args, setArgs] = useState("");

  const op = operations[selectedOp];

  const toggleFlag = (flag: string) => {
    setActiveFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) next.delete(flag);
      else next.add(flag);
      return next;
    });
  };

  const command = useMemo(() => {
    const parts = [op.template];
    for (const f of op.flags) {
      if (activeFlags.has(f.flag)) {
        if (
          f.flag === "push" ||
          f.flag === "pop" ||
          f.flag === "apply" ||
          f.flag === "list" ||
          f.flag === "drop" ||
          f.flag === "clear" ||
          f.flag === "start" ||
          f.flag === "good" ||
          f.flag === "bad" ||
          f.flag === "reset"
        ) {
          parts.push(f.flag);
        } else {
          parts.push(f.flag);
        }
      }
    }
    if (args.trim()) parts.push(args.trim());
    return parts.join(" ");
  }, [op, activeFlags, args]);

  return (
    <ToolLayout id="git-command-builder">
      <div className="flex flex-wrap gap-2">
        {operations.map((o, i) => (
          <button
            key={o.name}
            onClick={() => {
              setSelectedOp(i);
              setActiveFlags(new Set());
              setArgs("");
            }}
            className={`rounded-md border-2 px-3 py-1.5 font-mono text-xs transition-all ${
              i === selectedOp
                ? "border-accent bg-accent text-accent-fg"
                : "border-line text-muted hover:border-accent/50"
            }`}
          >
            {o.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {op.flags.map((f) => (
          <button
            key={f.flag}
            onClick={() => toggleFlag(f.flag)}
            className={`rounded-full border px-3 py-1 text-xs transition-all ${
              activeFlags.has(f.flag)
                ? "border-green-500 bg-green-500/10 text-green-600"
                : "border-line text-muted hover:border-green-500/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Arguments / Reference
        </label>
        <input
          type="text"
          value={args}
          onChange={(e) => setArgs(e.target.value)}
          placeholder="branch name, commit hash, file path..."
          className="w-full rounded-md border-2 border-line bg-input-bg px-3 py-2 font-mono text-sm text-input-text outline-none focus:border-accent"
        />
      </div>

      <div className="rounded-lg border-2 border-accent bg-accent/5 p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Command
          </span>
          <CopyButton text={command} />
        </div>
        <pre className="mt-2 overflow-x-auto font-mono text-lg font-bold text-foreground">
          {command}
        </pre>
      </div>

      <div className="rounded-md border border-line bg-paper-dim p-4 text-xs text-muted">
        <p className="font-medium text-foreground">Tips</p>
        <ul className="mt-1 space-y-1">
          <li>Click the flags above to toggle them on/off</li>
          <li>Add arguments like branch names, commit hashes, or file paths</li>
          <li>The command updates in real-time as you configure options</li>
        </ul>
      </div>
    </ToolLayout>
  );
}
