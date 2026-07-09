import { useState, useEffect } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolButton } from "../ToolButton";

export default function WorldClock() {
  const [zones, setZones] = useState(["America/New_York", "Europe/London", "Asia/Tokyo", "Asia/Kolkata", "America/Los_Angeles"]);
  const [times, setTimes] = useState<Record<string, string>>({});
  const [newZone, setNewZone] = useState("");

  const update = () => {
    const result: Record<string, string> = {};
    for (const z of zones) {
      try {
        result[z] = new Date().toLocaleString("en-US", { timeZone: z, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true, weekday: "short", month: "short", day: "numeric" });
      } catch { result[z] = "Invalid timezone"; }
    }
    setTimes(result);
  };

  useEffect(() => { update(); const i = setInterval(update, 1000); return () => clearInterval(i); }, [zones]);

  const addZone = () => { if (newZone && !zones.includes(newZone)) { setZones([...zones, newZone]); setNewZone(""); } };

  return (
    <ToolLayout id="world-clock">
      <div className="flex gap-2">
        <input value={newZone} onChange={(e) => setNewZone(e.target.value)} placeholder="e.g. Europe/Berlin" className="flex-1 p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        <ToolButton onClick={addZone}>Add Zone</ToolButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {zones.map((z) => (
          <div key={z} className="p-4 bg-paper-dim/50 border border-border rounded-sm">
            <p className="text-xs text-muted-foreground mb-1">{z}</p>
            <p className="font-mono text-xl font-bold text-foreground">{times[z] || "..."}</p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
