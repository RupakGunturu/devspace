import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolToggleGroup } from "./ToolToggleGroup";
import { useToolAccent } from "@/components/ToolAccentContext";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

interface ExerciseDB {
  [key: string]: {
    [muscle: string]: Exercise[];
  };
}

const EXERCISE_DB: ExerciseDB = {
  strength: {
    chest: [
      { name: "Barbell Bench Press", sets: 4, reps: "5-8" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "6-10" },
      { name: "Cable Flyes", sets: 3, reps: "10-12" },
    ],
    back: [
      { name: "Deadlift", sets: 4, reps: "5-8" },
      { name: "Barbell Rows", sets: 4, reps: "6-10" },
      { name: "Lat Pulldown", sets: 3, reps: "8-12" },
    ],
    legs: [
      { name: "Barbell Squat", sets: 4, reps: "5-8" },
      { name: "Romanian Deadlift", sets: 3, reps: "6-10" },
      { name: "Leg Press", sets: 3, reps: "8-12" },
    ],
    shoulders: [
      { name: "Overhead Press", sets: 4, reps: "5-8" },
      { name: "Lateral Raises", sets: 3, reps: "10-15" },
      { name: "Face Pulls", sets: 3, reps: "12-15" },
    ],
    arms: [
      { name: "Barbell Curl", sets: 3, reps: "6-10" },
      { name: "Tricep Dips", sets: 3, reps: "6-10" },
      { name: "Hammer Curls", sets: 3, reps: "8-12" },
    ],
    core: [
      { name: "Hanging Leg Raises", sets: 3, reps: "8-12" },
      { name: "Ab Wheel Rollout", sets: 3, reps: "8-12" },
      { name: "Plank", sets: 3, reps: "45-60s" },
    ],
  },
  hypertrophy: {
    chest: [
      { name: "Incline Barbell Press", sets: 4, reps: "8-12" },
      { name: "Dumbbell Flyes", sets: 4, reps: "10-15" },
      { name: "Pec Deck Machine", sets: 3, reps: "12-15" },
    ],
    back: [
      { name: "Weighted Pull-ups", sets: 4, reps: "8-12" },
      { name: "Seated Cable Row", sets: 4, reps: "10-12" },
      { name: "Straight Arm Pulldown", sets: 3, reps: "12-15" },
    ],
    legs: [
      { name: "Hack Squat", sets: 4, reps: "10-12" },
      { name: "Leg Curl", sets: 4, reps: "10-15" },
      { name: "Leg Extension", sets: 4, reps: "12-15" },
    ],
    shoulders: [
      { name: "Dumbbell Shoulder Press", sets: 4, reps: "8-12" },
      { name: "Cable Lateral Raise", sets: 4, reps: "12-15" },
      { name: "Rear Delt Flyes", sets: 3, reps: "12-15" },
    ],
    arms: [
      { name: "Preacher Curl", sets: 4, reps: "10-12" },
      { name: "Skull Crushers", sets: 4, reps: "10-12" },
      { name: "Cable Pushdowns", sets: 3, reps: "12-15" },
    ],
    core: [
      { name: "Cable Crunches", sets: 4, reps: "12-15" },
      { name: "Decline Sit-ups", sets: 3, reps: "12-15" },
      { name: "Russian Twists", sets: 3, reps: "15-20" },
    ],
  },
  endurance: {
    chest: [
      { name: "Push-ups", sets: 3, reps: "15-20" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "15-20" },
    ],
    back: [
      { name: "Pull-ups", sets: 3, reps: "10-15" },
      { name: "Dumbbell Rows", sets: 3, reps: "15-20" },
    ],
    legs: [
      { name: "Goblet Squat", sets: 3, reps: "15-20" },
      { name: "Walking Lunges", sets: 3, reps: "15-20" },
    ],
    shoulders: [
      { name: "Dumbbell Press", sets: 3, reps: "15-20" },
      { name: "Band Pull-aparts", sets: 3, reps: "15-20" },
    ],
    arms: [
      { name: "EZ Bar Curl", sets: 3, reps: "15-20" },
      { name: "Tricep Rope Pushdown", sets: 3, reps: "15-20" },
    ],
    core: [
      { name: "Bicycle Crunches", sets: 3, reps: "20-30" },
      { name: "Mountain Climbers", sets: 3, reps: "20-30" },
    ],
  },
  "fat loss": {
    chest: [
      { name: "Dumbbell Bench Press", sets: 3, reps: "12-15" },
      { name: "Push-ups", sets: 3, reps: "15-20" },
    ],
    back: [
      { name: "Bent-over Rows", sets: 3, reps: "12-15" },
      { name: "Lat Pulldown", sets: 3, reps: "12-15" },
    ],
    legs: [
      { name: "Bulgarian Split Squat", sets: 3, reps: "12-15" },
      { name: "Kettlebell Swings", sets: 3, reps: "15-20" },
    ],
    shoulders: [
      { name: "Arnold Press", sets: 3, reps: "12-15" },
      { name: "Lateral Raises", sets: 3, reps: "15-20" },
    ],
    arms: [
      { name: "Superset Curls/Extensions", sets: 3, reps: "12-15" },
      { name: "Diamond Push-ups", sets: 3, reps: "12-15" },
    ],
    core: [
      { name: "Burpees", sets: 3, reps: "10-15" },
      { name: "Plank to Push-up", sets: 3, reps: "10-15" },
    ],
  },
};

const EQUIPMENT_MODIFIERS: Record<string, string> = {
  minimal: " (Bodyweight)",
  home: " (Dumbbells)",
  gym: "",
};

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const SPLITS: Record<number, { day: string; focus: string }[]> = {
  3: [
    { day: "Monday", focus: "chest" },
    { day: "Wednesday", focus: "back" },
    { day: "Friday", focus: "legs" },
  ],
  4: [
    { day: "Monday", focus: "chest" },
    { day: "Tuesday", focus: "back" },
    { day: "Thursday", focus: "shoulders" },
    { day: "Friday", focus: "legs" },
  ],
  5: [
    { day: "Monday", focus: "chest" },
    { day: "Tuesday", focus: "back" },
    { day: "Wednesday", focus: "legs" },
    { day: "Thursday", focus: "shoulders" },
    { day: "Friday", focus: "arms" },
  ],
  6: [
    { day: "Monday", focus: "chest" },
    { day: "Tuesday", focus: "back" },
    { day: "Wednesday", focus: "legs" },
    { day: "Thursday", focus: "shoulders" },
    { day: "Friday", focus: "arms" },
    { day: "Saturday", focus: "core" },
  ],
};

const MUSCLE_GROUPS = ["chest", "back", "legs", "shoulders", "arms", "core"];

export function WorkoutPlanGenerator() {
  const { color } = useToolAccent();
  const [goal, setGoal] = useState("strength");
  const [days, setDays] = useState("4");
  const [equipment, setEquipment] = useState("gym");
  const [experience, setExperience] = useState("intermediate");

  const plan = useMemo<WorkoutDay[] | null>(() => {
    const dayCount = parseInt(days);
    if (dayCount < 3 || dayCount > 6) return null;
    const split = SPLITS[dayCount];
    if (!split) return null;
    const db = EXERCISE_DB[goal];
    const suffix = EQUIPMENT_MODIFIERS[equipment] || "";

    return split.map((s) => ({
      day: s.day,
      focus: s.focus.charAt(0).toUpperCase() + s.focus.slice(1),
      exercises: (db[s.focus] || []).map((ex) => ({
        name: ex.name + suffix,
        sets: ex.sets,
        reps: ex.reps,
      })),
    }));
  }, [goal, days, equipment]);

  const muscleCoverage = useMemo(() => {
    if (!plan) return [];
    const covered = new Set(plan.map((d) => d.focus));
    return MUSCLE_GROUPS.map((m) => ({
      muscle: m.charAt(0).toUpperCase() + m.slice(1),
      covered: covered.has(m),
    }));
  }, [plan]);

  const totalExercises = plan?.reduce((s, d) => s + d.exercises.length, 0) ?? 0;
  const totalSets =
    plan?.reduce((s, d) => s + d.exercises.reduce((es, ex) => es + ex.sets, 0), 0) ?? 0;

  return (
    <ToolLayout id="workout-plan-generator">
      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Goal
        </span>
        <ToolToggleGroup
          options={[
            { value: "strength", label: "Strength" },
            { value: "hypertrophy", label: "Hypertrophy" },
            { value: "endurance", label: "Endurance" },
            { value: "fat loss", label: "Fat Loss" },
          ]}
          value={goal}
          onChange={setGoal}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Days Per Week
          </span>
          <ToolToggleGroup
            options={["3", "4", "5", "6"].map((d) => ({ value: d, label: `${d} days` }))}
            value={days}
            onChange={setDays}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Equipment
          </span>
          <ToolToggleGroup
            options={[
              { value: "minimal", label: "Minimal" },
              { value: "home", label: "Home" },
              { value: "gym", label: "Gym" },
            ]}
            value={equipment}
            onChange={setEquipment}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Experience
          </span>
          <ToolToggleGroup
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
            value={experience}
            onChange={setExperience}
          />
        </div>
      </div>

      {plan && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Total Exercises</div>
              <div className="mt-1 font-display text-xl font-extrabold" style={{ color }}>
                {totalExercises}
              </div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Total Sets</div>
              <div className="mt-1 font-display text-xl font-extrabold text-input-text">
                {totalSets}
              </div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Goal</div>
              <div className="mt-1 font-display text-xl font-extrabold text-input-text capitalize">
                {goal}
              </div>
            </div>
          </div>

          <div>
            <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Weekly Workout Split
            </span>
            <div className="space-y-3">
              {plan.map((day) => (
                <div key={day.day} className="rounded-md border-2 border-line bg-input-bg p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-input-text">{day.day}</span>
                    <span
                      className="rounded-full px-2 py-0.5 font-mono text-[10px] font-bold"
                      style={{ backgroundColor: color, color: "var(--foreground, #fff)" }}
                    >
                      {day.focus}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {day.exercises.map((ex, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md bg-paper-dim/10 px-3 py-1.5"
                      >
                        <span className="font-mono text-xs text-input-text">{ex.name}</span>
                        <span className="font-mono text-xs font-bold" style={{ color }}>
                          {ex.sets} x {ex.reps}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Muscle Group Coverage
            </span>
            <div className="flex flex-wrap gap-2">
              {muscleCoverage.map((m) => (
                <div
                  key={m.muscle}
                  className="flex items-center gap-1.5 rounded-full border-2 px-3 py-1"
                  style={{
                    borderColor: m.covered ? color : "var(--border)",
                    backgroundColor: m.covered ? `${color}20` : "transparent",
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: m.covered ? color : "var(--muted)" }}
                  />
                  <span
                    className="font-mono text-xs"
                    style={{ color: m.covered ? color : "var(--muted)" }}
                  >
                    {m.muscle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!plan && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Select your preferences above to generate a workout plan
        </div>
      )}
    </ToolLayout>
  );
}
