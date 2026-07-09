import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";

export default function TemperatureConverter() {
  const [celsius, setCelsius] = useState("");
  const [fahrenheit, setFahrenheit] = useState("");
  const [kelvin, setKelvin] = useState("");

  const fromC = (v: string) => {
    setCelsius(v);
    const c = parseFloat(v);
    if (isNaN(c)) { setFahrenheit(""); setKelvin(""); return; }
    setFahrenheit(((c * 9) / 5 + 32).toFixed(2));
    setKelvin((c + 273.15).toFixed(2));
  };

  const fromF = (v: string) => {
    setFahrenheit(v);
    const f = parseFloat(v);
    if (isNaN(f)) { setCelsius(""); setKelvin(""); return; }
    const c = ((f - 32) * 5) / 9;
    setCelsius(c.toFixed(2));
    setKelvin((c + 273.15).toFixed(2));
  };

  const fromK = (v: string) => {
    setKelvin(v);
    const k = parseFloat(v);
    if (isNaN(k)) { setCelsius(""); setFahrenheit(""); return; }
    const c = k - 273.15;
    setCelsius(c.toFixed(2));
    setFahrenheit(((c * 9) / 5 + 32).toFixed(2));
  };

  return (
    <ToolLayout id="temperature-converter">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Celsius (°C)", value: celsius, onChange: fromC },
          { label: "Fahrenheit (°F)", value: fahrenheit, onChange: fromF },
          { label: "Kelvin (K)", value: kelvin, onChange: fromK },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{f.label}</label>
            <input type="number" value={f.value} onChange={(e) => f.onChange(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" placeholder="0" />
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
