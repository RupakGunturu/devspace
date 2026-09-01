import { useState } from "react";
import { ToolLayout } from "./ToolLayout";

type Device = "iphone" | "macbook" | "ipad" | "desktop";

const DEVICE_STYLES: Record<Device, { frame: string; screen: string; label: string }> = {
  iphone: {
    frame: "w-[220px] h-[440px] rounded-[36px] border-[6px] border-gray-800 bg-gray-800 shadow-xl",
    screen: "w-full h-[396px] rounded-[28px] overflow-hidden mx-auto mt-[14px]",
    label: "iPhone",
  },
  macbook: {
    frame:
      "w-[480px] h-[320px] rounded-t-xl border-[6px] border-gray-700 border-b-0 bg-gray-700 shadow-xl",
    screen: "w-full h-[280px] rounded-t-lg overflow-hidden mx-auto",
    label: "MacBook",
  },
  ipad: {
    frame: "w-[380px] h-[300px] rounded-2xl border-[8px] border-gray-700 bg-gray-700 shadow-xl",
    screen: "w-full h-[268px] rounded-xl overflow-hidden mx-auto mt-[6px]",
    label: "iPad",
  },
  desktop: {
    frame:
      "w-[480px] h-[340px] rounded-t-lg border-[6px] border-gray-700 border-b-0 bg-gray-700 shadow-xl",
    screen: "w-full h-[300px] overflow-hidden mx-auto",
    label: "Desktop",
  },
};

export function MockupFrameGenerator() {
  const [color, setColor] = useState("#3B82F6");
  const [device, setDevice] = useState<Device>("iphone");
  const [label, setLabel] = useState("");

  const current = DEVICE_STYLES[device];

  return (
    <ToolLayout id="mockup-frame-generator">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Placeholder Color
          </label>
          <div className="flex items-center gap-2 rounded-md border-2 border-line bg-input-bg p-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-8 cursor-pointer border-0 bg-transparent"
            />
            <span className="font-mono text-sm text-foreground">{color}</span>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Device
          </label>
          <div className="flex gap-2">
            {(Object.keys(DEVICE_STYLES) as Device[]).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className="flex-1 rounded-md border-2 px-3 py-2.5 font-mono text-xs font-medium capitalize transition-all"
                style={{
                  borderColor: device === d ? color : undefined,
                  backgroundColor: device === d ? color : undefined,
                  color: device === d ? "#fff" : undefined,
                }}
              >
                {DEVICE_STYLES[d].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Device Frame Preview
        </label>
        <div className="flex items-end justify-center overflow-auto rounded-md border-2 border-line bg-gray-100 p-8">
          <div>
            <div className={current.frame}>
              <div className={current.screen} style={{ backgroundColor: color }}>
                {label && (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-mono text-sm font-bold text-white/80">{label}</span>
                  </div>
                )}
              </div>
            </div>
            {device === "macbook" || device === "desktop" ? (
              <div className="mx-auto -mt-[2px] h-3 w-[520px] rounded-b-xl bg-gray-600" />
            ) : null}
            {device === "macbook" ? (
              <div className="mx-auto -mt-1 h-2 w-[120px] rounded-b-lg bg-gray-500" />
            ) : null}
            {device === "desktop" ? (
              <div className="mx-auto mt-2 h-12 w-4 rounded-full bg-gray-500" />
            ) : null}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Screen Label (optional)
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Homepage"
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
        />
      </div>
    </ToolLayout>
  );
}
