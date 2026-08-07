import { useCallback, useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";
import { AntdDatePicker } from "@/components/ui/antd-date-picker";

type Status = "present" | "absent" | "late" | null;

interface Student {
  id: number;
  name: string;
}

let nextId = 1;

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getLetterGrade(pct: number): string {
  if (pct >= 97) return "A+";
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  if (pct >= 67) return "D+";
  if (pct >= 63) return "D";
  if (pct >= 60) return "D-";
  return "F";
}

export function AttendanceTracker() {
  const [students, setStudents] = useState<Student[]>([]);
  const [newName, setNewName] = useState("");
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [attendance, setAttendance] = useState<Record<number, Record<string, Status>>>({});
  const { color } = useToolAccent();

  const addStudent = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setStudents((prev) => [...prev, { id: nextId++, name: trimmed }]);
    setNewName("");
  };

  const removeStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setAttendance((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const addDate = (date?: Date) => {
    const d = date || new Date();
    const dateStr = d.toISOString().split("T")[0];
    if (!dates.find((dt) => dt.toISOString().split("T")[0] === dateStr)) {
      setDates((prev) => [...prev, d]);
    }
  };

  const removeDate = (dateStr: string) => {
    setDates((prev) => prev.filter((d) => d.toISOString().split("T")[0] !== dateStr));
    setAttendance((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((sid) => {
        delete copy[parseInt(sid)][dateStr];
      });
      return copy;
    });
  };

  const toggleStatus = useCallback((studentId: number, dateStr: string) => {
    setAttendance((prev) => {
      const current = prev[studentId]?.[dateStr] || null;
      const next: Status =
        current === "present"
          ? "absent"
          : current === "absent"
            ? "late"
            : current === "late"
              ? null
              : "present";
      return {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [dateStr]: next,
        },
      };
    });
  }, []);

  const stats = useMemo(() => {
    return students.map((s) => {
      const record = attendance[s.id] || {};
      const totalDates = dates.length;
      let present = 0;
      let absent = 0;
      let late = 0;
      dates.forEach((d) => {
        const ds = d.toISOString().split("T")[0];
        const status = record[ds];
        if (status === "present") present++;
        else if (status === "absent") absent++;
        else if (status === "late") late++;
      });
      const attended = present + late;
      const pct = totalDates > 0 ? (attended / totalDates) * 100 : 0;
      return { ...s, present, absent, late, pct, totalDates };
    });
  }, [students, dates, attendance]);

  const overallStats = useMemo(() => {
    const totalStudents = students.length;
    const totalSessions = dates.length;
    const allPresent = stats.reduce((s, st) => s + st.present, 0);
    const allAbsent = stats.reduce((s, st) => s + st.absent, 0);
    const allLate = stats.reduce((s, st) => s + st.late, 0);
    const totalEntries = allPresent + allAbsent + allLate;
    const avgPct = totalEntries > 0 ? stats.reduce((s, st) => s + st.pct, 0) / totalStudents : 0;
    return { totalStudents, totalSessions, allPresent, allAbsent, allLate, avgPct };
  }, [students, dates, stats]);

  const statusColor = (status: Status) => {
    if (status === "present") return "#22c55e";
    if (status === "absent") return "#ef4444";
    if (status === "late") return "#f59e0b";
    return undefined;
  };

  const fullText = useMemo(() => {
    const lines = [
      `ATTENDANCE REPORT`,
      `Students: ${students.length} | Sessions: ${dates.length}`,
      `Average Attendance: ${overallStats.avgPct.toFixed(1)}%`,
      `\n${"=".repeat(50)}`,
      `\n${"Student".padEnd(20)} Present  Absent  Late   %`,
    ];
    stats.forEach((s) => {
      lines.push(
        `${s.name.padEnd(20)} ${String(s.present).padStart(7)} ${String(s.absent).padStart(7)} ${String(s.late).padStart(6)} ${s.pct.toFixed(1).padStart(6)}%`,
      );
    });
    return lines.join("\n");
  }, [students, dates, stats, overallStats]);

  return (
    <ToolLayout id="attendance-tracker">
      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Add Students
        </span>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addStudent()}
            placeholder="Student name..."
            className="flex-1 rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: newName ? color : undefined }}
          />
          <ToolButton onClick={addStudent} disabled={!newName.trim()}>
            Add
          </ToolButton>
        </div>
        {students.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {students.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1 rounded-full border-2 border-line bg-input-bg px-3 py-1 font-mono text-xs text-input-text"
              >
                {s.name}
                <button
                  onClick={() => removeStudent(s.id)}
                  className="ml-1 text-muted transition-colors hover:text-coral"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {students.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Dates
            </span>
            <span className="font-mono text-xs text-muted">
              {dates.length} session{dates.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <ToolButton variant="secondary" onClick={() => addDate()}>
              + Add Today
            </ToolButton>
            <div className="flex items-center gap-2">
              <AntdDatePicker
                value={selectedDate}
                onChange={(d) => {
                  setSelectedDate(d);
                  if (d) addDate(d);
                }}
                placeholder="Pick a date"
              />
            </div>
            {dates.map((d) => {
              const ds = d.toISOString().split("T")[0];
              return (
                <span
                  key={ds}
                  className="inline-flex items-center gap-1 rounded-full border-2 border-line bg-input-bg px-3 py-1 font-mono text-xs text-input-text"
                >
                  {formatDate(d)}
                  <button
                    onClick={() => removeDate(ds)}
                    className="ml-1 text-muted transition-colors hover:text-coral"
                  >
                    &times;
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {students.length > 0 && dates.length > 0 && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Attendance Grid
          </span>
          <div className="mb-1 flex gap-2">
            {[
              { label: "Present", color: "#22c55e" },
              { label: "Absent", color: "#ef4444" },
              { label: "Late", color: "#f59e0b" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="font-mono text-[10px] text-muted">{l.label}</span>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto rounded-md border-2 border-line">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b-2 border-line bg-input-bg">
                  <th className="px-3 py-2 text-left text-muted">Student</th>
                  {dates.map((d) => {
                    const ds = d.toISOString().split("T")[0];
                    return (
                      <th key={ds} className="px-2 py-2 text-center text-muted">
                        {formatDate(d)}
                      </th>
                    );
                  })}
                  <th className="px-3 py-2 text-center text-muted">%</th>
                  <th className="px-3 py-2 text-center text-muted">Grade</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s) => (
                  <tr key={s.id} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-2 font-bold text-input-text">{s.name}</td>
                    {dates.map((d) => {
                      const ds = d.toISOString().split("T")[0];
                      const status = attendance[s.id]?.[ds] || null;
                      const sc = statusColor(status);
                      return (
                        <td key={ds} className="px-2 py-2 text-center">
                          <button
                            onClick={() => toggleStatus(s.id, ds)}
                            className="mx-auto flex h-7 w-7 items-center justify-center rounded-md border-2 transition-all"
                            style={
                              sc
                                ? { borderColor: sc, backgroundColor: `${sc}20`, color: sc }
                                : { borderColor: "var(--border)" }
                            }
                          >
                            {status === "present" && "P"}
                            {status === "absent" && "A"}
                            {status === "late" && "L"}
                            {!status && <span className="text-muted">-</span>}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-center font-bold" style={{ color }}>
                      {s.pct.toFixed(1)}%
                    </td>
                    <td
                      className="px-3 py-2 text-center font-bold"
                      style={{
                        color: s.pct >= 90 ? "#22c55e" : s.pct >= 75 ? "#f59e0b" : "#ef4444",
                      }}
                    >
                      {getLetterGrade(s.pct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {students.length > 0 && dates.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { label: "Students", value: overallStats.totalStudents.toString() },
              { label: "Sessions", value: overallStats.totalSessions.toString() },
              { label: "Total Present", value: overallStats.allPresent.toString() },
              { label: "Total Absent", value: overallStats.allAbsent.toString() },
              { label: "Avg Attendance", value: `${overallStats.avgPct.toFixed(1)}%` },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-md border-2 border-line bg-input-bg p-3 text-center"
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {label}
                </div>
                <div className="mt-1 font-mono text-sm font-bold" style={{ color }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Export
              </span>
              <CopyButton text={fullText} />
            </div>
            <pre className="max-h-[200px] overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-input-text">
              {fullText}
            </pre>
          </div>
        </div>
      )}

      {students.length > 0 && dates.length === 0 && (
        <div className="rounded-md border-2 border-dashed border-line p-6 text-center font-mono text-sm text-muted">
          Students added! Click "+ Add Today" to start tracking attendance.
        </div>
      )}

      {students.length === 0 && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Add students above to begin tracking attendance
        </div>
      )}
    </ToolLayout>
  );
}
