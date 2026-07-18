import { useState, useRef } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";
import { ToolFileInput } from "../ToolFileInput";

export default function ImageColorPicker() {
  const [color, setColor] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
    };
    img.src = URL.createObjectURL(file);
  };

  const pick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pixel = ctx.getImageData(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 1, 1).data;
    setColor(`#${pixel[0].toString(16).padStart(2, "0")}${pixel[1].toString(16).padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`);
  };

  return (
    <ToolLayout id="image-color-picker">
      <ToolFileInput accept="image/*" onChange={handle} label="Choose image" />
      <canvas ref={canvasRef} onClick={pick} className="max-w-full border border-border rounded cursor-crosshair" />
      {color && <div className="flex items-center gap-3 p-3 bg-paper-dim/50 border border-border rounded-sm"><div className="w-10 h-10 rounded border border-border" style={{ backgroundColor: color }} /><span className="font-mono text-sm text-foreground">{color}</span></div>}
    </ToolLayout>
  );
}
