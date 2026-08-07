import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { AntdDatePicker } from "@/components/ui/antd-date-picker";

type Response = "Going" | "Maybe" | "Not Going";

interface Attendee {
  id: number;
  name: string;
  response: Response;
}

let nextId = 1;

export function RsvpTracker() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [newName, setNewName] = useState("");
  const [newResponse, setNewResponse] = useState<Response>("Going");
  const { color } = useToolAccent();

  const addAttendee = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setAttendees((prev) => [...prev, { id: nextId++, name: trimmed, response: newResponse }]);
    setNewName("");
  };

  const removeAttendee = (id: number) => {
    setAttendees((prev) => prev.filter((a) => a.id !== id));
  };

  const updateResponse = (id: number, response: Response) => {
    setAttendees((prev) => prev.map((a) => (a.id === id ? { ...a, response } : a)));
  };

  const going = attendees.filter((a) => a.response === "Going").length;
  const maybe = attendees.filter((a) => a.response === "Maybe").length;
  const declined = attendees.filter((a) => a.response === "Not Going").length;
  const total = attendees.length;

  const responseColors: Record<Response, string> = {
    Going: "#10b981",
    Maybe: "#f59e0b",
    "Not Going": "#ef4444",
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const reset = () => {
    setEventName("");
    setEventDate(null);
    setAttendees([]);
    setNewName("");
  };

  return (
    <ToolLayout id="rsvp-tracker">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Event Name
          </label>
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. Team Offsite 2025"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none placeholder:text-muted"
            style={{ borderColor: eventName ? color : undefined }}
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Event Date
          </label>
          <AntdDatePicker
            value={eventDate}
            onChange={setEventDate}
            placeholder="Select event date"
          />
        </div>
      </div>

      {eventName && (
        <div className="rounded-lg border-2 border-line bg-input-bg p-4 text-center">
          <span className="font-display text-xl font-extrabold text-foreground">{eventName}</span>
          {eventDate && (
            <p className="mt-1 font-mono text-xs text-muted">{formatDate(eventDate)}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border-2 border-line bg-input-bg p-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Going</span>
          <div className="font-display text-2xl font-extrabold" style={{ color: "#10b981" }}>
            {going}
          </div>
        </div>
        <div className="rounded-lg border-2 border-line bg-input-bg p-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Maybe</span>
          <div className="font-display text-2xl font-extrabold" style={{ color: "#f59e0b" }}>
            {maybe}
          </div>
        </div>
        <div className="rounded-lg border-2 border-line bg-input-bg p-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
            Declined
          </span>
          <div className="font-display text-2xl font-extrabold" style={{ color: "#ef4444" }}>
            {declined}
          </div>
        </div>
      </div>

      {total > 0 && (
        <div className="flex items-center gap-1 h-4 overflow-hidden rounded-full bg-line">
          {going > 0 && (
            <div
              className="h-full rounded-l-full transition-all"
              style={{ width: `${(going / total) * 100}%`, backgroundColor: "#10b981" }}
            />
          )}
          {maybe > 0 && (
            <div
              className="h-full transition-all"
              style={{ width: `${(maybe / total) * 100}%`, backgroundColor: "#f59e0b" }}
            />
          )}
          {declined > 0 && (
            <div
              className="h-full rounded-r-full transition-all"
              style={{ width: `${(declined / total) * 100}%`, backgroundColor: "#ef4444" }}
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addAttendee()}
          placeholder="Attendee name..."
          className="sm:col-span-2 rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
          style={{ borderColor: newName ? color : undefined }}
        />
        <div className="flex gap-1">
          {(["Going", "Maybe", "Not Going"] as Response[]).map((r) => (
            <button
              key={r}
              onClick={() => setNewResponse(r)}
              className="flex-1 rounded-md border-2 px-2 py-2 font-mono text-[10px] transition-all"
              style={
                newResponse === r
                  ? {
                      borderColor: responseColors[r],
                      backgroundColor: responseColors[r],
                      color: "#fff",
                    }
                  : { borderColor: "var(--border)" }
              }
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <ToolButton onClick={addAttendee} disabled={!newName.trim()}>
        Add Attendee
      </ToolButton>

      {attendees.length > 0 && (
        <div className="overflow-x-auto rounded-md border-2 border-line">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b-2 border-line bg-input-bg">
                <th className="px-3 py-2 text-left text-muted">Name</th>
                <th className="px-3 py-2 text-left text-muted">Response</th>
                <th className="px-3 py-2 text-right text-muted"></th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((a) => (
                <tr key={a.id} className="border-b border-line last:border-b-0">
                  <td className="px-3 py-2 text-input-text">{a.name}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      {(["Going", "Maybe", "Not Going"] as Response[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => updateResponse(a.id, r)}
                          className="rounded-md border-2 px-2 py-0.5 font-mono text-[10px] transition-all"
                          style={
                            a.response === r
                              ? {
                                  borderColor: responseColors[r],
                                  backgroundColor: responseColors[r],
                                  color: "#fff",
                                }
                              : { borderColor: "var(--border)" }
                          }
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => removeAttendee(a.id)}
                      className="text-muted transition-colors hover:text-coral"
                    >
                      \u00d7
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={reset}
          className="font-mono text-xs text-muted underline transition-colors hover:text-foreground"
        >
          Reset all
        </button>
      </div>
    </ToolLayout>
  );
}
