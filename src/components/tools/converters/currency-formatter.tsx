import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CurrencyFormatter() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [locale, setLocale] = useState("en-US");
  const [output, setOutput] = useState("");

  const format = () => {
    const num = parseFloat(amount);
    if (isNaN(num)) { setOutput("Enter a valid number"); return; }
    try {
      const formatted = new Intl.NumberFormat(locale, { style: "currency", currency }).format(num);
      setOutput(formatted);
    } catch { setOutput("Invalid currency/locale"); }
  };

  return (
    <ToolLayout id="currency-formatter">
      <ToolInput value={amount} onChange={setAmount} placeholder="1234.56" label="Amount" rows={1} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm text-foreground">
            {["USD", "EUR", "GBP", "JPY", "INR", "CAD", "AUD", "CNY", "BRL", "KRW"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Locale</label>
          <select value={locale} onChange={(e) => setLocale(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm text-foreground">
            {["en-US", "en-GB", "de-DE", "fr-FR", "ja-JP", "hi-IN", "pt-BR", "zh-CN"].map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <ToolButton onClick={format}>Format</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
