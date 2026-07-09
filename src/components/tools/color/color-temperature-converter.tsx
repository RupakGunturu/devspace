import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ColorTemperatureConverter() {
  const [kelvin, setKelvin] = useState("6500");
  const [output, setOutput] = useState("");

  const convert = () => {
    const k = parseInt(kelvin);
    if (isNaN(k) || k < 1000 || k > 40000) { setOutput("Enter Kelvin value (1000-40000)"); return; }
    const temp = k / 100;
    let r = temp <= 66 ? 255 : Math.max(0, Math.min(255, 329.698727446 * Math.pow(temp - 60, -0.1332047592)));
    let g = temp <= 66 ? Math.max(0, Math.min(255, 99.4708025861 * Math.log(temp) - 161.1195681661)) : Math.max(0, Math.min(255, 288.1221695283 * Math.pow(temp - 60, -0.0755148492)));
    let b = temp >= 66 ? 255 : Math.max(0, Math.min(255, 138.5177312231 * Math.log(temp - 10) - 305.0447927307));
    const hex = `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
    setOutput(`Kelvin: ${k}K\nRGB: ${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}\nHEX: ${hex}`);
  };

  return (
    <ToolLayout id="color-temperature-converter">
      <ToolInput value={kelvin} onChange={setKelvin} placeholder="6500" label="Kelvin (1000-40000)" rows={1} />
      <ToolButton onClick={convert}>Convert</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
