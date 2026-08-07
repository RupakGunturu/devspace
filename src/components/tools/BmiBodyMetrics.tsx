import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolToggleGroup } from "./ToolToggleGroup";
import { useToolAccent } from "@/components/ToolAccentContext";

interface Result {
  bmi: number;
  category: string;
  categoryColor: string;
  bmr: number;
  bodyFat: number;
  recommendation: string;
}

function getBmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6" };
  if (bmi < 25) return { label: "Normal", color: "#10b981" };
  if (bmi < 30) return { label: "Overweight", color: "#f59e0b" };
  return { label: "Obese", color: "#ef4444" };
}

function getBmiRecommendation(bmi: number): string {
  if (bmi < 18.5)
    return "Your BMI indicates you are underweight. Consider increasing caloric intake with nutrient-dense foods and consulting a healthcare provider.";
  if (bmi < 25)
    return "Your BMI is in the healthy range. Maintain your current lifestyle with balanced nutrition and regular physical activity.";
  if (bmi < 30)
    return "Your BMI indicates overweight. Consider reducing caloric intake, increasing physical activity, and consulting a nutritionist.";
  return "Your BMI indicates obesity. Please consult a healthcare professional for personalized guidance on weight management.";
}

function getMarkerPosition(bmi: number): number {
  const clamped = Math.max(10, Math.min(45, bmi));
  return ((clamped - 10) / 35) * 100;
}

export function BmiBodyMetrics() {
  const { color } = useToolAccent();
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");

  const result = useMemo<Result | null>(() => {
    let heightInCm: number;
    if (heightUnit === "cm") {
      heightInCm = parseFloat(heightCm);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inc = parseFloat(heightIn) || 0;
      heightInCm = (ft * 12 + inc) * 2.54;
    }
    const w = parseFloat(weight);
    const a = parseInt(age);
    if (isNaN(heightInCm) || heightInCm <= 0 || isNaN(w) || w <= 0 || isNaN(a) || a <= 0)
      return null;

    const heightM = heightInCm / 100;
    const weightKg = weightUnit === "lbs" ? w * 0.453592 : w;

    const bmi = weightKg / (heightM * heightM);
    const { label, color: catColor } = getBmiCategory(bmi);

    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightInCm - 5 * a + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightInCm - 5 * a - 161;
    }

    let bodyFat: number;
    if (gender === "male") {
      bodyFat = 1.2 * bmi + 0.23 * a - 16.2;
    } else {
      bodyFat = 1.2 * bmi + 0.23 * a - 5.4;
    }

    return {
      bmi: Math.round(bmi * 10) / 10,
      category: label,
      categoryColor: catColor,
      bmr: Math.round(bmr),
      bodyFat: Math.round(bodyFat * 10) / 10,
      recommendation: getBmiRecommendation(bmi),
    };
  }, [heightCm, heightFt, heightIn, weight, age, gender, heightUnit, weightUnit]);

  return (
    <ToolLayout id="bmi-body-metrics">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Height Unit
          </span>
          <ToolToggleGroup
            options={[
              { value: "cm", label: "cm" },
              { value: "ft-in", label: "ft/in" },
            ]}
            value={heightUnit}
            onChange={setHeightUnit}
          />
        </div>
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
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {heightUnit === "cm" ? (
          <div>
            <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Height (cm)
            </span>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="175"
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
              style={{ borderColor: heightCm ? color : undefined }}
            />
          </div>
        ) : (
          <>
            <div>
              <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Feet
              </span>
              <input
                type="number"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                placeholder="5"
                className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
                style={{ borderColor: heightFt ? color : undefined }}
              />
            </div>
            <div>
              <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Inches
              </span>
              <input
                type="number"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                placeholder="9"
                className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
                style={{ borderColor: heightIn ? color : undefined }}
              />
            </div>
          </>
        )}
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
      </div>

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

      {result && (
        <>
          <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
            <div className="mb-1 font-mono text-xs uppercase tracking-wider text-muted">BMI</div>
            <div
              className="font-display text-4xl font-extrabold"
              style={{ color: result.categoryColor }}
            >
              {result.bmi}
            </div>
            <div
              className="mt-1 font-mono text-sm font-bold"
              style={{ color: result.categoryColor }}
            >
              {result.category}
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] text-muted">Underweight</span>
              <span className="font-mono text-[10px] text-muted">Normal</span>
              <span className="font-mono text-[10px] text-muted">Overweight</span>
              <span className="font-mono text-[10px] text-muted">Obese</span>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-line">
              <div
                className="absolute left-0 top-0 h-full rounded-full opacity-30"
                style={{
                  background:
                    "linear-gradient(to right, #3b82f6, #10b981 30%, #f59e0b 65%, #ef4444)",
                  width: "100%",
                }}
              />
              <div
                className="absolute top-0 h-full w-1 rounded-full bg-white shadow-md transition-all duration-500"
                style={{
                  left: `${getMarkerPosition(result.bmi)}%`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
              <div className="font-mono text-xs uppercase tracking-wider text-muted">
                BMR (Mifflin-St Jeor)
              </div>
              <div className="mt-1 font-display text-2xl font-extrabold" style={{ color }}>
                {result.bmr}
              </div>
              <div className="font-mono text-[10px] text-muted">calories/day</div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
              <div className="font-mono text-xs uppercase tracking-wider text-muted">
                Estimated Body Fat
              </div>
              <div className="mt-1 font-display text-2xl font-extrabold text-input-text">
                {result.bodyFat}%
              </div>
              <div className="font-mono text-[10px] text-muted">US Navy formula estimate</div>
            </div>
          </div>

          <div className="rounded-md border-2 border-dashed border-line p-4 font-mono text-xs leading-relaxed text-muted">
            {result.recommendation}
          </div>
        </>
      )}

      {!result && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter your measurements to calculate BMI and body metrics
        </div>
      )}
    </ToolLayout>
  );
}
