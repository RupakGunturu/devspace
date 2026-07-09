import { useMemo, useState } from "react";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.trim().replace(/^#/, "");
  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(m)) return null;
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function relLum([r, g, b]: [number, number, number]) {
  const s = [r, g, b].map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
}

export function ContrastChecker() {
  const [fg, setFg] = useState("#0b0e1a");
  const [bg, setBg] = useState("#f4d922");
  const result = useMemo(() => {
    const rgbFg = hexToRgb(fg);
    const rgbBg = hexToRgb(bg);
    if (!rgbFg || !rgbBg) return null;
    const l1 = relLum(rgbFg);
    const l2 = relLum(rgbBg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return {
      ratio,
      normalAA: ratio >= 4.5,
      normalAAA: ratio >= 7,
      largeAA: ratio >= 3,
      largeAAA: ratio >= 4.5,
    };
  }, [fg, bg]);

  const Row = ({ label, pass }: { label: string; pass: boolean }) => (
    <div className="flex items-center justify-between rounded-sm border-2 border-line bg-ink p-3">
      <span className="font-mono text-sm text-text">{label}</span>
      <span
        className={`rounded-sm px-2 py-1 font-mono text-xs font-bold ${
          pass ? "bg-yellow text-ink" : "bg-coral text-ink"
        }`}
      >
        {pass ? "PASS" : "FAIL"}
      </span>
    </div>
  );

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-3">
        <ColorInput label="foreground" value={fg} onChange={setFg} />
        <ColorInput label="background" value={bg} onChange={setBg} />
      </div>
      <div
        className="rounded-md border-2 border-line p-8 text-center"
        style={{ background: bg, color: fg }}
      >
        <div className="font-display text-3xl font-extrabold">Ship it or skip it?</div>
        <div className="mt-2 text-sm">Regular body text, sample for eyeballing.</div>
      </div>
      {result ? (
        <>
          <div className="text-center">
            <div className="font-mono text-xs text-muted">contrast ratio</div>
            <div className="font-display text-5xl font-extrabold text-yellow">
              {result.ratio.toFixed(2)}:1
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Row label="AA — normal text" pass={result.normalAA} />
            <Row label="AAA — normal text" pass={result.normalAAA} />
            <Row label="AA — large text" pass={result.largeAA} />
            <Row label="AAA — large text" pass={result.largeAAA} />
          </div>
        </>
      ) : (
        <div className="font-mono text-sm text-coral">Enter valid hex colors (e.g. #f4d922).</div>
      )}
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const safe = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ? value : "#000000";
  return (
    <div>
      <label className="font-mono text-xs text-muted">{label}</label>
      <div className="mt-1 flex items-center gap-2 rounded-sm border-2 border-line bg-ink p-2">
        <input
          type="color"
          value={safe}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 shrink-0 cursor-pointer rounded border-none bg-transparent"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent font-mono text-sm text-text outline-none"
        />
      </div>
    </div>
  );
}
