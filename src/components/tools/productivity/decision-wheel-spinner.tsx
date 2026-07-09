import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolButton } from "../ToolButton";

export default function DecisionWheelSpinner() {
  const [options, setOptions] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const list = options.split("\n").map((o) => o.trim()).filter(Boolean);
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || list.length === 0) return;
    const ctx = canvas.getContext("2d")!;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.min(cx, cy) - 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sliceAngle = (2 * Math.PI) / list.length;
    list.forEach((opt, i) => {
      const startAngle = rotation + i * sliceAngle;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      const midAngle = startAngle + sliceAngle / 2;
      ctx.fillText(opt.slice(0, 10), cx + Math.cos(midAngle) * r * 0.6, cy + Math.sin(midAngle) * r * 0.6);
    });
  }, [options, rotation, list.length]);

  const spin = () => {
    if (list.length < 2 || spinning) return;
    setSpinning(true);
    setResult("");
    let spins = 0;
    const totalSpins = 10 + Math.floor(Math.random() * 5);
    const targetAngle = Math.random() * 2 * Math.PI;
    const interval = setInterval(() => {
      spins++;
      const progress = spins / (totalSpins * 20);
      setRotation((prev) => prev + (1 - progress) * 0.3);
      if (spins >= totalSpins * 20) {
        clearInterval(interval);
        setSpinning(false);
        const finalAngle = (2 * Math.PI - (rotation % (2 * Math.PI)) + targetAngle) % (2 * Math.PI);
        const idx = Math.floor(finalAngle / (2 * Math.PI / list.length)) % list.length;
        setResult(list[idx]);
      }
    }, 16);
  };

  return (
    <ToolLayout id="decision-wheel-spinner">
      <ToolInput value={options} onChange={setOptions} placeholder="Option 1&#10;Option 2&#10;Option 3" label="Options (one per line)" rows={5} />
      <div className="flex justify-center">
        <canvas ref={canvasRef} width={300} height={300} className="border border-border rounded-full" />
      </div>
      <div className="flex justify-center">
        <ToolButton onClick={spin} className={spinning ? "opacity-50" : ""}>{spinning ? "Spinning..." : "Spin!"}</ToolButton>
      </div>
      {result && <div className="text-center p-4 bg-paper-dim/50 border border-border rounded-sm"><p className="font-display text-2xl font-bold text-yellow">{result}</p></div>}
    </ToolLayout>
  );
}
