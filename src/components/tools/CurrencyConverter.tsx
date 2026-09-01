import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "\u20ac", name: "Euro" },
  { code: "GBP", symbol: "\u00a3", name: "British Pound" },
  { code: "INR", symbol: "\u20b9", name: "Indian Rupee" },
  { code: "JPY", symbol: "\u00a5", name: "Japanese Yen" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.12,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
};

export function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const { color } = useToolAccent();

  const converted = useMemo(() => {
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) return null;
    const inUsd = val / RATES[from];
    return inUsd * RATES[to];
  }, [amount, from, to]);

  const rate1 = RATES[from];
  const rate2 = RATES[to];
  const crossRate = rate1 && rate2 ? rate2 / rate1 : 0;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const getInput = (code: string) => CURRENCIES.find((c) => c.code === code);

  return (
    <ToolLayout id="currency-converter">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            From
          </span>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mb-2 w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} \u2014 {c.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1.00"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-lg text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: amount ? color : undefined }}
          />
        </div>

        <button
          onClick={swap}
          className="mb-2 hidden self-center rounded-md border-2 border-line bg-input-bg p-2 transition-colors hover:bg-paper-dim/50 sm:block"
          title="Swap currencies"
        >
          <svg
            className="h-5 w-5 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        </button>

        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            To
          </span>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mb-2 w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} \u2014 {c.name}
              </option>
            ))}
          </select>
          <div
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-lg font-bold"
            style={{ color: converted !== null ? color : undefined }}
          >
            {converted !== null ? `${getInput(to)?.symbol} ${fmt(converted)}` : "Enter amount"}
          </div>
        </div>
      </div>

      <button
        onClick={swap}
        className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-line bg-input-bg p-2 font-mono text-sm text-muted transition-colors hover:bg-paper-dim/50 sm:hidden"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
        Swap
      </button>

      {converted !== null && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="font-mono text-xs uppercase tracking-wider text-muted">
              Exchange Rate
            </div>
            <div className="mt-1 font-mono text-sm" style={{ color }}>
              1 {from} = {fmt(crossRate)} {to}
            </div>
            <div className="mt-0.5 font-mono text-xs text-muted">
              1 {to} = {fmt(1 / crossRate)} {from}
            </div>
          </div>
          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="font-mono text-xs uppercase tracking-wider text-muted">
              Conversion Summary
            </div>
            <div className="mt-1 font-mono text-sm text-input-text">
              {fmt(parseFloat(amount) || 0)} {from} = {fmt(converted)} {to}
            </div>
            <div className="mt-0.5 font-mono text-xs text-muted">
              {getInput(from)?.symbol}
              {fmt(parseFloat(amount) || 0)} \u2192 {getInput(to)?.symbol}
              {fmt(converted)}
            </div>
          </div>
        </div>
      )}

      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Quick Reference
        </span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[1, 10, 100, 1000].map((val) => {
            const inUsd = val / RATES[from];
            const result = inUsd * RATES[to];
            return (
              <div
                key={val}
                className="rounded-md border-2 border-line bg-input-bg p-2 text-center"
              >
                <div className="font-mono text-xs text-muted">
                  {val} {from}
                </div>
                <div className="font-mono text-sm font-bold" style={{ color }}>
                  {fmt(result)} {to}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
