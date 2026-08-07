import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolToggleGroup } from "./ToolToggleGroup";
import { useToolAccent } from "@/components/ToolAccentContext";

interface SleepOption {
  label: string;
  time: string;
  cycles: number;
  quality: number;
  hours: number;
}

function formatTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const period = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function getTimeFromDate(d: Date): string {
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function SleepCycleCalculator() {
  const { color } = useToolAccent();
  const [mode, setMode] = useState("sleep");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepTime, setSleepTime] = useState("23:00");

  const CYCLE_MINUTES = 90;
  const FALL_ASLEEP_MINUTES = 15;

  const options = useMemo<SleepOption[]>(() => {
    if (mode === "sleep") {
      const [h, m] = wakeTime.split(":").map(Number);
      const wake = new Date();
      wake.setHours(h, m, 0, 0);

      return [4, 5, 6].map((cycleCount) => {
        const totalMinutes = cycleCount * CYCLE_MINUTES + FALL_ASLEEP_MINUTES;
        const bedTime = new Date(wake.getTime() - totalMinutes * 60 * 1000);
        const hours = totalMinutes / 60;
        let quality: number;
        if (cycleCount === 5) quality = 100;
        else if (cycleCount === 6) quality = 90;
        else quality = 70;
        return {
          label: `${cycleCount} cycles`,
          time: formatTime(bedTime),
          cycles: cycleCount,
          quality,
          hours: Math.round(hours * 10) / 10,
        };
      });
    } else {
      const [h, m] = sleepTime.split(":").map(Number);
      const sleep = new Date();
      sleep.setHours(h, m, 0, 0);

      return [4, 5, 6].map((cycleCount) => {
        const totalMinutes = cycleCount * CYCLE_MINUTES + FALL_ASLEEP_MINUTES;
        const wake = new Date(sleep.getTime() + totalMinutes * 60 * 1000);
        const hours = totalMinutes / 60;
        let quality: number;
        if (cycleCount === 5) quality = 100;
        else if (cycleCount === 6) quality = 90;
        else quality = 70;
        return {
          label: `${cycleCount} cycles`,
          time: formatTime(wake),
          cycles: cycleCount,
          quality,
          hours: Math.round(hours * 10) / 10,
        };
      });
    }
  }, [mode, wakeTime, sleepTime]);

  const detailedSchedule = useMemo(() => {
    const times = mode === "sleep" ? wakeTime : sleepTime;
    const [h, m] = times.split(":").map(Number);
    const ref = new Date();
    ref.setHours(h, m, 0, 0);
    const isWakeMode = mode === "wake";

    return [4, 5, 6].map((cycleCount) => {
      const totalMin = cycleCount * CYCLE_MINUTES + FALL_ASLEEP_MINUTES;
      const start = isWakeMode ? new Date(ref.getTime() - totalMin * 60 * 1000) : ref;
      const end = isWakeMode ? ref : new Date(ref.getTime() + totalMin * 60 * 1000);
      const stages: { label: string; time: string }[] = [];
      const fallAsleep = new Date(start.getTime() + FALL_ASLEEP_MINUTES * 60 * 1000);
      stages.push({ label: "Fall asleep", time: formatTime(fallAsleep) });
      for (let c = 0; c < cycleCount; c++) {
        const cycleEnd = new Date(fallAsleep.getTime() + (c + 1) * CYCLE_MINUTES * 60 * 1000);
        stages.push({ label: `Cycle ${c + 1} end`, time: formatTime(cycleEnd) });
      }
      return { cycles: cycleCount, stages, totalHours: totalMin / 60 };
    });
  }, [mode, wakeTime, sleepTime]);

  return (
    <ToolLayout id="sleep-cycle-calculator">
      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          I want to calculate
        </span>
        <ToolToggleGroup
          options={[
            { value: "sleep", label: "When to sleep" },
            { value: "wake", label: "When to wake" },
          ]}
          value={mode}
          onChange={setMode}
        />
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          {mode === "sleep" ? "Desired Wake Time" : "Desired Sleep Time"}
        </span>
        <input
          type="time"
          value={mode === "sleep" ? wakeTime : sleepTime}
          onChange={(e) =>
            mode === "sleep" ? setWakeTime(e.target.value) : setSleepTime(e.target.value)
          }
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors sm:w-auto"
          style={{ borderColor: color }}
        />
      </div>

      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Recommended {mode === "sleep" ? "Bedtimes" : "Wake Times"}
        </span>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {options.map((opt) => {
            const barColor =
              opt.quality === 100 ? "#10b981" : opt.quality >= 90 ? color : "#f59e0b";
            return (
              <div
                key={opt.cycles}
                className="rounded-md border-2 bg-input-bg p-4"
                style={{ borderColor: opt.quality === 100 ? color : "var(--border)" }}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">{opt.label}</span>
                  <span className="font-mono text-[10px] font-bold" style={{ color: barColor }}>
                    {opt.quality}%
                  </span>
                </div>
                <div className="font-display text-2xl font-extrabold" style={{ color: barColor }}>
                  {opt.time}
                </div>
                <div className="mt-1 font-mono text-xs text-muted">{opt.hours} hours</div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${opt.quality}%`, backgroundColor: barColor }}
                  />
                </div>
                {opt.quality === 100 && (
                  <div
                    className="mt-2 rounded-md px-2 py-1 text-center font-mono text-[10px] font-bold"
                    style={{ backgroundColor: color, color: "var(--foreground, #fff)" }}
                  >
                    OPTIMAL
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Detailed Sleep Phases
        </span>
        <div className="space-y-3">
          {detailedSchedule.map((sched) => (
            <div key={sched.cycles} className="rounded-md border-2 border-line bg-input-bg p-3">
              <div className="mb-2 font-mono text-xs font-bold text-input-text">
                {sched.cycles} Cycles ({sched.totalHours}h total)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sched.stages.map((stage, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-muted">{stage.label}:</span>
                    <span className="font-mono text-[10px] font-bold" style={{ color }}>
                      {stage.time}
                    </span>
                    {i < sched.stages.length - 1 && <span className="text-muted">→</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border-2 border-dashed border-line p-4 font-mono text-xs leading-relaxed text-muted">
        Each sleep cycle lasts approximately 90 minutes. Most adults need 4-6 cycles per night. The
        optimal window is 5 cycles (7.5 hours). Allow 15 minutes to fall asleep when calculating
        bedtime.
      </div>
    </ToolLayout>
  );
}
