import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

interface Guest {
  id: number;
  name: string;
  table: number | null;
}

let nextId = 1;

export function SeatingChartGenerator() {
  const [numTables, setNumTables] = useState(4);
  const [seatsPerTable, setSeatsPerTable] = useState(8);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newName, setNewName] = useState("");
  const [dragTarget, setDragTarget] = useState<number | null>(null);
  const { color } = useToolAccent();

  const addGuest = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setGuests((prev) => [...prev, { id: nextId++, name: trimmed, table: null }]);
    setNewName("");
  };

  const removeGuest = (id: number) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  const assignGuest = (guestId: number, tableNum: number) => {
    setGuests((prev) => prev.map((g) => (g.id === guestId ? { ...g, table: tableNum } : g)));
  };

  const unassignGuest = (guestId: number) => {
    setGuests((prev) => prev.map((g) => (g.id === guestId ? { ...g, table: null } : g)));
  };

  const autoAssign = () => {
    const unassigned = guests.filter((g) => g.table === null);
    const newGuests = [...guests];
    let guestIdx = 0;

    for (let t = 1; t <= numTables && guestIdx < unassigned.length; t++) {
      const currentAtTable = newGuests.filter((g) => g.table === t).length;
      const seatsLeft = seatsPerTable - currentAtTable;
      for (let s = 0; s < seatsLeft && guestIdx < unassigned.length; s++) {
        const gIdx = newGuests.findIndex((g) => g.id === unassigned[guestIdx].id);
        if (gIdx !== -1) newGuests[gIdx] = { ...newGuests[gIdx], table: t };
        guestIdx++;
      }
    }
    setGuests(newGuests);
  };

  const unassignAll = () => {
    setGuests((prev) => prev.map((g) => ({ ...g, table: null })));
  };

  const tables = Array.from({ length: numTables }, (_, i) => i + 1);
  const unassigned = guests.filter((g) => g.table === null);

  const reset = () => {
    setNumTables(4);
    setSeatsPerTable(8);
    setGuests([]);
    setNewName("");
  };

  return (
    <ToolLayout id="seating-chart-generator">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Number of Tables
          </label>
          <input
            type="number"
            min={1}
            value={numTables}
            onChange={(e) => setNumTables(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Seats per Table
          </label>
          <input
            type="number"
            min={1}
            value={seatsPerTable}
            onChange={(e) => setSeatsPerTable(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Add Guests
        </label>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addGuest()}
            placeholder="Guest name..."
            className="flex-1 rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
            style={{ borderColor: newName ? color : undefined }}
          />
          <ToolButton onClick={addGuest} disabled={!newName.trim()}>
            Add
          </ToolButton>
        </div>
      </div>

      {guests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={autoAssign}>Auto-Assign</ToolButton>
          <ToolButton variant="secondary" onClick={unassignAll}>
            Unassign All
          </ToolButton>
          <ToolButton variant="secondary" onClick={reset}>
            Reset
          </ToolButton>
        </div>
      )}

      {unassigned.length > 0 && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Unassigned ({unassigned.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {unassigned.map((g) => (
              <span
                key={g.id}
                className="inline-flex items-center gap-1 rounded-full border-2 border-line bg-input-bg px-3 py-1 font-mono text-xs text-input-text"
              >
                {g.name}
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) assignGuest(g.id, parseInt(e.target.value));
                  }}
                  className="bg-transparent text-[10px] text-muted outline-none"
                >
                  <option value="">assign</option>
                  {tables.map((t) => (
                    <option key={t} value={t}>
                      Table {t}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeGuest(g.id)}
                  className="text-muted transition-colors hover:text-coral"
                >
                  \u00d7
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {tables.map((t) => {
          const tableGuests = guests.filter((g) => g.table === t);
          return (
            <div key={t} className="rounded-lg border-2 border-line bg-input-bg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold" style={{ color }}>
                  Table {t}
                </span>
                <span className="font-mono text-[10px] text-muted">
                  {tableGuests.length}/{seatsPerTable}
                </span>
              </div>
              {tableGuests.length === 0 ? (
                <div className="rounded border border-dashed border-line p-3 text-center font-mono text-[10px] text-muted">
                  Empty
                </div>
              ) : (
                <div className="space-y-1">
                  {tableGuests.map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between rounded bg-paper-dim/30 px-2 py-1"
                    >
                      <span className="font-mono text-[10px] text-input-text">{g.name}</span>
                      <button
                        onClick={() => unassignGuest(g.id)}
                        className="text-muted transition-colors hover:text-coral"
                      >
                        \u00d7
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {guests.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Add guests and configure tables to generate a seating chart
        </div>
      )}
    </ToolLayout>
  );
}
