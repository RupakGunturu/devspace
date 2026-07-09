import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function CountdownTimer() {
  const [target, setTarget] = useState("");
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const update = () => {
    if (!target) return;
    const t = new Date(target).getTime() - Date.now();
    if (t <= 0) { setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
    setDiff({
      days: Math.floor(t / 86400000),
      hours: Math.floor((t % 86400000) / 3600000),
      minutes: Math.floor((t % 3600000) / 60000),
      seconds: Math.floor((t % 60000) / 1000),
    });
  };

  useState(() => { const i = setInterval(update, 1000); return () => clearInterval(i); });

  return (
    <ToolLayout id="countdown-timer">
      <div>
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Target Date & Time</label>
        <input type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
      </div>
      <div className="flex justify-center gap-4 py-6">
        {[
          { label: "Days", value: diff.days },
          { label: "Hours", value: diff.hours },
          { label: "Minutes", value: diff.minutes },
          { label: "Seconds", value: diff.seconds },
        ].map((u) => (
          <div key={u.label} className="text-center">
            <span className="font-mono text-4xl font-bold text-foreground">{String(u.value).padStart(2, "0")}</span>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{u.label}</p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
