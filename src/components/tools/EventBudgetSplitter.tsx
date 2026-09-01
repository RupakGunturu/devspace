import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

interface Participant {
  id: number;
  name: string;
  percentage: number;
}

let nextId = 1;

export function EventBudgetSplitter() {
  const [totalBudget, setTotalBudget] = useState("");
  const [splitMode, setSplitMode] = useState<"equal" | "custom">("equal");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newName, setNewName] = useState("");
  const { color } = useToolAccent();

  const budget = parseFloat(totalBudget) || 0;

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const addParticipant = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setParticipants((prev) => [...prev, { id: nextId++, name: trimmed, percentage: 0 }]);
    setNewName("");
  };

  const removeParticipant = (id: number) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePercentage = (id: number, pct: number) => {
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, percentage: pct } : p)));
  };

  const equalSplit = useMemo(() => {
    if (participants.length === 0 || budget === 0) return [];
    const perPerson = budget / participants.length;
    return participants.map((p) => ({ ...p, amount: perPerson }));
  }, [participants, budget]);

  const customSplit = useMemo(() => {
    return participants.map((p) => ({ ...p, amount: budget * (p.percentage / 100) }));
  }, [participants, budget]);

  const splits = splitMode === "equal" ? equalSplit : customSplit;
  const totalCustomPct = participants.reduce((s, p) => s + p.percentage, 0);

  const schedule = useMemo(() => {
    if (splits.length === 0 || budget === 0) return [];
    const paymentDates = [
      "Upon confirmation",
      "2 weeks before event",
      "1 week before event",
      "Day of event",
    ];
    return splits.map((s, i) => ({
      name: s.name,
      amount: s.amount,
      payment: paymentDates[i % paymentDates.length],
    }));
  }, [splits, budget]);

  const reset = () => {
    setTotalBudget("");
    setParticipants([]);
    setNewName("");
    setSplitMode("equal");
  };

  const allText = schedule
    .map((s) => `${s.name}: $${fmt(s.amount)} — Due: ${s.payment}`)
    .join("\n");

  return (
    <ToolLayout id="event-budget-splitter">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Total Event Budget ($)
        </label>
        <input
          type="number"
          value={totalBudget}
          onChange={(e) => setTotalBudget(e.target.value)}
          placeholder="10000"
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none placeholder:text-muted"
          style={{ borderColor: totalBudget ? color : undefined }}
        />
      </div>

      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Add Organizers / Sponsors
        </span>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addParticipant()}
            placeholder="Name..."
            className="flex-1 rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
            style={{ borderColor: newName ? color : undefined }}
          />
          <ToolButton onClick={addParticipant} disabled={!newName.trim()}>
            Add
          </ToolButton>
        </div>
        {participants.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {participants.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1 rounded-full border-2 border-line bg-input-bg px-3 py-1 font-mono text-xs text-input-text"
              >
                {p.name}
                <button
                  onClick={() => removeParticipant(p.id)}
                  className="ml-1 text-muted transition-colors hover:text-coral"
                >
                  \u00d7
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-1">
        <button
          onClick={() => setSplitMode("equal")}
          className="rounded-md border-2 px-3 py-1.5 font-mono text-xs transition-all"
          style={
            splitMode === "equal"
              ? { borderColor: color, backgroundColor: color, color: "#fff" }
              : { borderColor: "var(--border)" }
          }
        >
          Equal Split
        </button>
        <button
          onClick={() => setSplitMode("custom")}
          className="rounded-md border-2 px-3 py-1.5 font-mono text-xs transition-all"
          style={
            splitMode === "custom"
              ? { borderColor: color, backgroundColor: color, color: "#fff" }
              : { borderColor: "var(--border)" }
          }
        >
          Custom %
        </button>
      </div>

      {splitMode === "custom" && participants.length > 0 && (
        <div className="space-y-2">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Custom Percentages
          </span>
          {participants.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 rounded-md border-2 border-line bg-input-bg px-3 py-2"
            >
              <span className="min-w-[100px] font-mono text-xs text-input-text">{p.name}</span>
              <input
                type="number"
                value={p.percentage || ""}
                onChange={(e) => updatePercentage(p.id, parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-20 bg-transparent font-mono text-sm text-input-text outline-none"
              />
              <span className="font-mono text-xs text-muted">%</span>
              <span className="ml-auto font-mono text-xs" style={{ color }}>
                ${fmt(budget * (p.percentage / 100))}
              </span>
            </div>
          ))}
          {totalCustomPct !== 100 && (
            <span
              className="font-mono text-[10px]"
              style={{ color: totalCustomPct > 100 ? "#ef4444" : "#f59e0b" }}
            >
              Total: {totalCustomPct}%{" "}
              {totalCustomPct < 100
                ? `(unallocated: ${fmt(budget - (budget * totalCustomPct) / 100)})`
                : "(over 100%)"}
            </span>
          )}
        </div>
      )}

      {splits.length > 0 && budget > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Per-Person Contribution
            </span>
            <CopyButton text={allText} />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {splits.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-md border-2 border-line bg-input-bg px-4 py-3"
              >
                <span className="font-mono text-sm font-medium text-foreground">{s.name}</span>
                <span className="font-display text-lg font-extrabold" style={{ color }}>
                  ${fmt(s.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {schedule.length > 0 && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Suggested Payment Schedule
          </span>
          <div className="space-y-2">
            {schedule.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-md border-2 border-line bg-input-bg px-4 py-2"
              >
                <span className="font-mono text-xs text-foreground">{s.name}</span>
                <span className="ml-auto font-mono text-xs text-muted">{s.payment}</span>
                <span className="font-mono text-xs font-bold" style={{ color }}>
                  ${fmt(s.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={reset}
        className="font-mono text-xs text-muted underline transition-colors hover:text-foreground"
      >
        Reset
      </button>

      {participants.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Add organizers or sponsors to split the budget
        </div>
      )}
    </ToolLayout>
  );
}
