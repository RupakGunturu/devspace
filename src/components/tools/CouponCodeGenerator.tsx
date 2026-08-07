import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomCode(length: number): string {
  let result = "";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  for (let i = 0; i < length; i++) {
    result += CHARS[arr[i] % CHARS.length];
  }
  return result;
}

export function CouponCodeGenerator() {
  const [prefix, setPrefix] = useState("SAVE");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState("20");
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("100");
  const [batchSize, setBatchSize] = useState("10");
  const [codes, setCodes] = useState<string[]>([]);
  const { color } = useToolAccent();

  const handleGenerate = () => {
    const count = Math.min(Math.max(parseInt(batchSize) || 1, 1), 500);
    const prefixClean = prefix.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const generated = Array.from({ length: count }, () => {
      const suffix = randomCode(8);
      return prefixClean ? `${prefixClean}-${suffix}` : suffix;
    });
    setCodes(generated);
  };

  const discountLabel =
    discountType === "percent" ? `${discountValue || 0}% OFF` : `$${discountValue || 0} OFF`;

  const formatPreview = useMemo(() => {
    if (codes.length === 0) return "";
    return codes
      .map(
        (code) =>
          `${code} | ${discountLabel} | Expires: ${expiryDate || "No expiry"} | Uses: ${usageLimit || "Unlimited"}`,
      )
      .join("\n");
  }, [codes, discountLabel, expiryDate, usageLimit]);

  const copyAll = async () => {
    await navigator.clipboard.writeText(formatPreview);
  };

  return (
    <ToolLayout id="coupon-code-generator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Prefix
          </span>
          <input
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="SAVE"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted uppercase"
            style={{ borderColor: prefix ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Batch Size (max 500)
          </span>
          <input
            type="number"
            value={batchSize}
            onChange={(e) => setBatchSize(e.target.value)}
            placeholder="10"
            min="1"
            max="500"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Discount Type
          </span>
          <div className="flex gap-2">
            {(["percent", "fixed"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setDiscountType(type)}
                className="flex-1 rounded-md border-2 px-3 py-2.5 font-mono text-xs font-medium transition-all"
                style={
                  discountType === type
                    ? { borderColor: color, backgroundColor: color, color: "#fff" }
                    : { borderColor: "var(--border)" }
                }
              >
                {type === "percent" ? "% Off" : "$ Off"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Discount Value
          </span>
          <input
            type="number"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder="20"
            min="0"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Expiry Date
          </span>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Usage Limit
          </span>
          <input
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            placeholder="100"
            min="1"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          />
        </div>
        <div className="flex items-end">
          <ToolButton onClick={handleGenerate}>Generate Codes</ToolButton>
        </div>
      </div>

      {codes.length > 0 && (
        <>
          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Preview ({codes.length} codes)
              </span>
              <CopyButton text={formatPreview} />
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span
                className="rounded-full border-2 border-line px-3 py-1 font-mono text-xs"
                style={{ borderColor: color, color }}
              >
                {discountLabel}
              </span>
              {expiryDate && (
                <span className="rounded-full border-2 border-line px-3 py-1 font-mono text-xs text-muted">
                  Expires: {expiryDate}
                </span>
              )}
              {usageLimit && (
                <span className="rounded-full border-2 border-line px-3 py-1 font-mono text-xs text-muted">
                  Limit: {usageLimit} uses
                </span>
              )}
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Generated Codes
            </div>
            <div className="max-h-[300px] overflow-auto">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b-2 border-line">
                    <th className="px-2 py-1.5 text-left text-muted">#</th>
                    <th className="px-2 py-1.5 text-left text-muted">Code</th>
                    <th className="px-2 py-1.5 text-right text-muted">Discount</th>
                    <th className="px-2 py-1.5 text-right text-muted"></th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((code, i) => (
                    <tr key={i} className="border-b border-line last:border-b-0">
                      <td className="px-2 py-1.5 text-muted">{i + 1}</td>
                      <td className="px-2 py-1.5 font-bold" style={{ color }}>
                        {code}
                      </td>
                      <td className="px-2 py-1.5 text-right text-input-text">{discountLabel}</td>
                      <td className="px-2 py-1.5 text-right">
                        <CopyButton text={code} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {codes.length === 0 && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Configure your coupon settings and click Generate to create codes
        </div>
      )}
    </ToolLayout>
  );
}
