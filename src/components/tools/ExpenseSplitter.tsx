import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

interface Person {
  id: number;
  name: string;
}

interface Expense {
  id: number;
  description: string;
  amount: number;
  paidBy: number;
  splitAmong: number[];
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

let nextPersonId = 1;
let nextExpenseId = 1;

export function ExpenseSplitter() {
  const [people, setPeople] = useState<Person[]>([]);
  const [newName, setNewName] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState<number>(0);
  const [selectedSplit, setSelectedSplit] = useState<number[]>([]);
  const { color } = useToolAccent();

  const addPerson = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const id = nextPersonId++;
    setPeople((prev) => [...prev, { id, name: trimmed }]);
    setNewName("");
    if (people.length === 0) setPaidBy(id);
  };

  const removePerson = (id: number) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    setExpenses((prev) =>
      prev
        .filter((e) => e.paidBy !== id)
        .map((e) => ({ ...e, splitAmong: e.splitAmong.filter((s) => s !== id) })),
    );
  };

  const toggleSplit = (id: number) => {
    setSelectedSplit((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const selectAll = () => setSelectedSplit(people.map((p) => p.id));

  const addExpense = () => {
    const val = parseFloat(amount);
    if (!desc.trim() || isNaN(val) || val <= 0 || selectedSplit.length === 0) return;
    setExpenses((prev) => [
      ...prev,
      {
        id: nextExpenseId++,
        description: desc.trim(),
        amount: val,
        paidBy,
        splitAmong: [...selectedSplit],
      },
    ]);
    setDesc("");
    setAmount("");
  };

  const removeExpense = (id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const balances = useMemo(() => {
    const map: Record<number, number> = {};
    people.forEach((p) => {
      map[p.id] = 0;
    });
    expenses.forEach((e) => {
      const share = e.amount / e.splitAmong.length;
      map[e.paidBy] = (map[e.paidBy] || 0) + e.amount;
      e.splitAmong.forEach((pid) => {
        map[pid] = (map[pid] || 0) - share;
      });
    });
    return map;
  }, [people, expenses]);

  const settlements = useMemo((): Settlement[] => {
    const debtors: { id: number; amount: number }[] = [];
    const creditors: { id: number; amount: number }[] = [];
    Object.entries(balances).forEach(([id, bal]) => {
      if (bal < -0.01) debtors.push({ id: parseInt(id), amount: -bal });
      else if (bal > 0.01) creditors.push({ id: parseInt(id), amount: bal });
    });
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const result: Settlement[] = [];
    let i = 0,
      j = 0;
    while (i < debtors.length && j < creditors.length) {
      const d = debtors[i];
      const c = creditors[j];
      const settle = Math.min(d.amount, c.amount);
      if (settle > 0.01) {
        const fromName = people.find((p) => p.id === d.id)?.name || "?";
        const toName = people.find((p) => p.id === c.id)?.name || "?";
        result.push({ from: fromName, to: toName, amount: settle });
      }
      d.amount -= settle;
      c.amount -= settle;
      if (d.amount < 0.01) i++;
      if (c.amount < 0.01) j++;
    }
    return result;
  }, [balances, people]);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const getName = (id: number) => people.find((p) => p.id === id)?.name || "?";

  return (
    <ToolLayout id="expense-splitter">
      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Add People
        </span>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPerson()}
            placeholder="Name..."
            className="flex-1 rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: newName ? color : undefined }}
          />
          <ToolButton onClick={addPerson}>Add</ToolButton>
        </div>
        {people.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {people.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1 rounded-full border-2 border-line bg-input-bg px-3 py-1 font-mono text-xs text-input-text"
              >
                {p.name}
                <button
                  onClick={() => removePerson(p.id)}
                  className="ml-1 text-muted transition-colors hover:text-coral"
                >
                  \u00d7
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {people.length >= 2 && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Add Expense
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description..."
              className="rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
            />
            <div className="flex items-center gap-1 rounded-md border-2 border-line bg-input-bg px-2">
              <span className="font-mono text-sm text-muted">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent p-2.5 font-mono text-sm text-input-text outline-none"
              />
            </div>
          </div>
          <div className="mt-2">
            <span className="mb-1 block font-mono text-xs text-muted">Paid by</span>
            <div className="flex flex-wrap gap-1">
              {people.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPaidBy(p.id)}
                  className="rounded-md border-2 px-3 py-1.5 font-mono text-xs transition-all"
                  style={
                    paidBy === p.id
                      ? { borderColor: color, backgroundColor: color, color: "#fff" }
                      : { borderColor: "var(--border)" }
                  }
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-xs text-muted">Split among</span>
              <button onClick={selectAll} className="font-mono text-xs underline" style={{ color }}>
                Select all
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {people.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleSplit(p.id)}
                  className="rounded-md border-2 px-3 py-1.5 font-mono text-xs transition-all"
                  style={
                    selectedSplit.includes(p.id)
                      ? { borderColor: color, backgroundColor: color, color: "#fff" }
                      : { borderColor: "var(--border)" }
                  }
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <ToolButton
              onClick={addExpense}
              disabled={!desc.trim() || !amount || selectedSplit.length === 0}
            >
              Add Expense
            </ToolButton>
          </div>
        </div>
      )}

      {expenses.length > 0 && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Expenses ({expenses.length})
          </span>
          <div className="overflow-x-auto rounded-md border-2 border-line">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b-2 border-line bg-input-bg">
                  <th className="px-3 py-2 text-left text-muted">Description</th>
                  <th className="px-3 py-2 text-right text-muted">Amount</th>
                  <th className="px-3 py-2 text-left text-muted">Paid By</th>
                  <th className="px-3 py-2 text-left text-muted">Split Among</th>
                  <th className="px-3 py-2 text-right text-muted"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-2 text-input-text">{e.description}</td>
                    <td className="px-3 py-2 text-right font-bold" style={{ color }}>
                      ${fmt(e.amount)}
                    </td>
                    <td className="px-3 py-2 text-input-text">{getName(e.paidBy)}</td>
                    <td className="px-3 py-2 text-input-text">
                      {e.splitAmong.map(getName).join(", ")}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => removeExpense(e.id)}
                        className="text-muted transition-colors hover:text-coral"
                      >
                        \u00d7
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-input-bg font-bold">
                  <td className="px-3 py-2 text-muted">Total</td>
                  <td className="px-3 py-2 text-right" style={{ color }}>
                    ${fmt(totalExpenses)}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {settlements.length > 0 && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Settlement Plan (Minimal Transactions)
          </span>
          <div className="space-y-2">
            {settlements.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-md border-2 border-line bg-input-bg px-4 py-3"
              >
                <span className="font-mono text-sm font-bold text-input-text">{s.from}</span>
                <svg
                  className="h-4 w-4 shrink-0 text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span className="font-mono text-sm font-bold text-input-text">{s.to}</span>
                <span className="ml-auto font-mono text-sm font-bold" style={{ color }}>
                  ${fmt(s.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {people.length >= 2 && expenses.length > 0 && settlements.length === 0 && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center font-mono text-sm text-muted">
          All expenses are settled!
        </div>
      )}

      {people.length < 2 && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Add at least 2 people to start splitting expenses
        </div>
      )}
    </ToolLayout>
  );
}
