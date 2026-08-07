import { useCallback, useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolToggleGroup } from "./ToolToggleGroup";
import { useToolAccent } from "@/components/ToolAccentContext";

interface ScheduleEntry {
  time: string;
  amount: number;
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 30,
  light: 35,
  moderate: 40,
  heavy: 45,
};

const CLIMATE_MULTIPLIERS: Record<string, number> = {
  normal: 1,
  hot: 1.2,
  humid: 1.15,
};

export function WaterIntakeCalculator() {
  const { color } = useToolAccent();
  const [weightUnit, setWeightUnit] = useState("kg");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("light");
  const [climate, setClimate] = useState("normal");
  const [glasses, setGlasses] = useState<boolean[]>(Array(12).fill(false));

  const result = useMemo(() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return null;
    const weightKg = weightUnit === "lbs" ? w * 0.453592 : w;
    const base = weightKg * ACTIVITY_MULTIPLIERS[activity];
    const adjusted = base * CLIMATE_MULTIPLIERS[climate];
    const totalMl = Math.round(adjusted / 50) * 50;
    const totalOz = Math.round((totalMl / 29.5735) * 10) / 10;
    const glassesCount = Math.ceil(totalMl / 250);
    const liters = Math.round((totalMl / 1000) * 100) / 100;

    const schedule: ScheduleEntry[] = [];
    const wakeHour = 7;
    const bedHour = 22;
    const activeHours = bedHour - wakeHour;
    const perGlass = Math.round(totalMl / glassesCount);

    for (let i = 0; i < glassesCount; i++) {
      const h = wakeHour + Math.floor(i * (activeHours / glassesCount));
      const hourStr = h > 12 ? `${h - 12} PM` : h === 12 ? "12 PM" : `${h} AM`;
      schedule.push({ time: hourStr, amount: perGlass });
    }

    return { totalMl, totalOz, glassesCount, liters, schedule };
  }, [weight, weightUnit, activity, climate]);

  const totalLogged = useMemo(() => {
    if (!result) return 0;
    const count = glasses.filter(Boolean).length;
    return Math.round((count / Math.max(result.glassesCount, glasses.length)) * 100);
  }, [glasses, result]);

  const toggleGlass = useCallback((idx: number) => {
    setGlasses((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }, []);

  const filledCount = glasses.filter(Boolean).length;

  return (
    <ToolLayout id="water-intake-calculator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Weight Unit
          </span>
          <ToolToggleGroup
            options={[
              { value: "kg", label: "kg" },
              { value: "lbs", label: "lbs" },
            ]}
            value={weightUnit}
            onChange={setWeightUnit}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Weight ({weightUnit})
          </span>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={weightUnit === "kg" ? "70" : "154"}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: weight ? color : undefined }}
          />
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Activity Level
        </span>
        <ToolToggleGroup
          options={[
            { value: "sedentary", label: "Sedentary" },
            { value: "light", label: "Light" },
            { value: "moderate", label: "Moderate" },
            { value: "heavy", label: "Heavy" },
          ]}
          value={activity}
          onChange={setActivity}
        />
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Climate
        </span>
        <ToolToggleGroup
          options={[
            { value: "normal", label: "Normal" },
            { value: "hot", label: "Hot" },
            { value: "humid", label: "Humid" },
          ]}
          value={climate}
          onChange={setClimate}
        />
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
              <div className="font-mono text-xs uppercase tracking-wider text-muted">
                Daily Goal
              </div>
              <div className="mt-1 font-display text-2xl font-extrabold" style={{ color }}>
                {result.liters}L
              </div>
              <div className="font-mono text-[10px] text-muted">
                {result.totalMl} ml / {result.totalOz} oz
              </div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
              <div className="font-mono text-xs uppercase tracking-wider text-muted">
                Glasses Needed
              </div>
              <div className="mt-1 font-display text-2xl font-extrabold text-input-text">
                {result.glassesCount}
              </div>
              <div className="font-mono text-[10px] text-muted">250 ml each</div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
              <div className="font-mono text-xs uppercase tracking-wider text-muted">Progress</div>
              <div className="mt-1 font-display text-2xl font-extrabold text-input-text">
                {filledCount}/{result.glassesCount}
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${totalLogged}%`, backgroundColor: color }}
                />
              </div>
            </div>
          </div>

          <div>
            <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Hourly Schedule
            </span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {result.schedule.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border-2 border-line bg-input-bg px-3 py-2"
                >
                  <span className="font-mono text-sm text-muted">{entry.time}</span>
                  <span className="font-mono text-sm font-bold" style={{ color }}>
                    {entry.amount} ml
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Glass Tracker (click to log)
            </span>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: Math.max(result.glassesCount, glasses.length) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => toggleGlass(i)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all"
                  style={{
                    borderColor: glasses[i] ? color : "var(--border)",
                    backgroundColor: glasses[i] ? color : "transparent",
                    color: glasses[i] ? "var(--foreground, #fff)" : "var(--muted)",
                  }}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {!result && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter your weight and activity level to calculate water intake
        </div>
      )}
    </ToolLayout>
  );
}
