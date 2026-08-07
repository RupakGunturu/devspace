import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolToggleGroup } from "./ToolToggleGroup";
import { useToolAccent } from "@/components/ToolAccentContext";

interface MacroResult {
  tdee: number;
  bmr: number;
  protein: { grams: number; calories: number; pct: number };
  carbs: { grams: number; calories: number; pct: number };
  fat: { grams: number; calories: number; pct: number };
  goalCalories: number;
  goalLabel: string;
}

const ACTIVITY_LEVELS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very active": 1.9,
};

const GOAL_ADJUSTMENTS: Record<
  string,
  { label: string; delta: number; proteinPct: number; carbPct: number; fatPct: number }
> = {
  lose: { label: "Fat Loss", delta: -500, proteinPct: 35, carbPct: 35, fatPct: 30 },
  maintain: { label: "Maintenance", delta: 0, proteinPct: 30, carbPct: 40, fatPct: 30 },
  gain: { label: "Muscle Gain", delta: 300, proteinPct: 30, carbPct: 45, fatPct: 25 },
};

export function MacroCalorieCalculator() {
  const { color } = useToolAccent();
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("light");
  const [goal, setGoal] = useState("maintain");

  const result = useMemo<MacroResult | null>(() => {
    const a = parseInt(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(a) || isNaN(w) || isNaN(h) || a <= 0 || w <= 0 || h <= 0) return null;

    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const tdee = bmr * ACTIVITY_LEVELS[activity];
    const adj = GOAL_ADJUSTMENTS[goal];
    const goalCalories = Math.round(tdee + adj.delta);

    const proteinCalories = goalCalories * (adj.proteinPct / 100);
    const carbCalories = goalCalories * (adj.carbPct / 100);
    const fatCalories = goalCalories * (adj.fatPct / 100);

    return {
      tdee: Math.round(tdee),
      bmr: Math.round(bmr),
      protein: {
        grams: Math.round(proteinCalories / 4),
        calories: Math.round(proteinCalories),
        pct: adj.proteinPct,
      },
      carbs: {
        grams: Math.round(carbCalories / 4),
        calories: Math.round(carbCalories),
        pct: adj.carbPct,
      },
      fat: {
        grams: Math.round(fatCalories / 9),
        calories: Math.round(fatCalories),
        pct: adj.fatPct,
      },
      goalCalories,
      goalLabel: adj.label,
    };
  }, [gender, age, weight, height, activity, goal]);

  const proteinAngle = result ? (result.protein.pct / 100) * 360 : 0;
  const carbsAngle = result ? (result.carbs.pct / 100) * 360 : 0;
  const fatAngle = result ? (result.fat.pct / 100) * 360 : 0;

  const conicGradient = result
    ? `conic-gradient(#3b82f6 0deg ${proteinAngle}deg, #10b981 ${proteinAngle}deg ${proteinAngle + carbsAngle}deg, #f59e0b ${proteinAngle + carbsAngle}deg 360deg)`
    : "";

  return (
    <ToolLayout id="macro-calorie-calculator">
      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Gender
        </span>
        <ToolToggleGroup
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
          value={gender}
          onChange={setGender}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Age
          </span>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="30"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: age ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Weight (kg)
          </span>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: weight ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Height (cm)
          </span>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="175"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: height ? color : undefined }}
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
            { value: "active", label: "Active" },
            { value: "very active", label: "Very Active" },
          ]}
          value={activity}
          onChange={setActivity}
        />
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Goal
        </span>
        <ToolToggleGroup
          options={[
            { value: "lose", label: "Lose Fat" },
            { value: "maintain", label: "Maintain" },
            { value: "gain", label: "Gain Muscle" },
          ]}
          value={goal}
          onChange={setGoal}
        />
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
              <div className="font-mono text-xs uppercase tracking-wider text-muted">BMR</div>
              <div className="mt-1 font-display text-2xl font-extrabold text-input-text">
                {result.bmr}
              </div>
              <div className="font-mono text-[10px] text-muted">cal/day</div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
              <div className="font-mono text-xs uppercase tracking-wider text-muted">TDEE</div>
              <div className="mt-1 font-display text-2xl font-extrabold text-input-text">
                {result.tdee}
              </div>
              <div className="font-mono text-[10px] text-muted">cal/day</div>
            </div>
            <div
              className="rounded-md border-2 bg-input-bg p-4 text-center"
              style={{ borderColor: color }}
            >
              <div className="font-mono text-xs uppercase tracking-wider text-muted">
                {result.goalLabel}
              </div>
              <div className="mt-1 font-display text-2xl font-extrabold" style={{ color }}>
                {result.goalCalories}
              </div>
              <div className="font-mono text-[10px] text-muted">cal/day target</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
            <div
              className="mx-auto flex items-center justify-center"
              style={{ width: 140, height: 140 }}
            >
              <div
                className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full"
                style={{ background: conicGradient }}
              >
                <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-input-bg">
                  <span className="font-mono text-xs font-bold text-input-text">Macros</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: "Protein", data: result.protein, color: "#3b82f6" },
                { label: "Carbs", data: result.carbs, color: "#10b981" },
                { label: "Fat", data: result.fat, color: "#f59e0b" },
              ].map(({ label, data, color: c }) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: c }} />
                      <span className="font-mono text-xs text-muted">{label}</span>
                    </div>
                    <span className="font-mono text-xs font-bold" style={{ color: c }}>
                      {data.grams}g ({data.pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${data.pct}%`, backgroundColor: c }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Macro Breakdown
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { label: "Protein", data: result.protein, color: "#3b82f6" },
                { label: "Carbs", data: result.carbs, color: "#10b981" },
                { label: "Fat", data: result.fat, color: "#f59e0b" },
              ].map(({ label, data, color: c }) => (
                <div key={label} className="rounded-md bg-paper-dim/10 p-3 text-center">
                  <div className="font-mono text-xs text-muted">{label}</div>
                  <div className="mt-1 font-display text-lg font-extrabold" style={{ color: c }}>
                    {data.grams}g
                  </div>
                  <div className="font-mono text-[10px] text-muted">
                    {data.calories} cal / {data.pct}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "Lose Fat", cal: result.tdee - 500, color: "#ef4444" },
              { label: "Maintain", cal: result.tdee, color: color },
              { label: "Gain Muscle", cal: result.tdee + 300, color: "#10b981" },
            ].map(({ label, cal, color: c }) => (
              <div
                key={label}
                className="rounded-md border-2 bg-input-bg p-3 text-center"
                style={{ borderColor: label === result.goalLabel ? c : "var(--border)" }}
              >
                <div className="font-mono text-xs text-muted">{label}</div>
                <div className="mt-1 font-display text-lg font-extrabold" style={{ color: c }}>
                  {Math.round(cal)}
                </div>
                <div className="font-mono text-[10px] text-muted">cal/day</div>
              </div>
            ))}
          </div>
        </>
      )}

      {!result && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter your details to calculate TDEE and macro split
        </div>
      )}
    </ToolLayout>
  );
}
