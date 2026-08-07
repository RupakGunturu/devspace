import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

const REFUND_METHODS = ["Full Refund", "Partial Refund", "Store Credit Only"] as const;

export function ReturnPolicyGenerator() {
  const [businessName, setBusinessName] = useState("");
  const [returnWindow, setReturnWindow] = useState("30");
  const [refundMethod, setRefundMethod] = useState<string>("Full Refund");
  const [excludedItems, setExcludedItems] = useState("");
  const [generated, setGenerated] = useState(false);
  const { color } = useToolAccent();

  const excludedList = useMemo(
    () =>
      excludedItems
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [excludedItems],
  );

  const policy = useMemo(() => {
    if (!businessName.trim()) return null;

    const days = parseInt(returnWindow) || 30;
    const method = refundMethod.toLowerCase();
    const biz = businessName.trim();
    const exclusions =
      excludedList.length > 0
        ? excludedList.map((item) => `\u2022 ${item}`).join("\n")
        : "\u2022 Gift cards\n\u2022 Downloadable software\n\u2022 Perishable goods";

    const refundLine =
      method === "full refund"
        ? "a full refund to your original payment method"
        : method === "partial refund"
          ? "a partial refund (minus any applicable restocking fees)"
          : "store credit for the full value of the returned item";

    return [
      `RETURN & REFUND POLICY`,
      `${biz}`,
      ``,
      `Last updated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      ``,
      `1. ELIGIBILITY`,
      `You may return most items purchased from ${biz} within ${days} days of delivery. To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging. Items must include all tags, labels, and accessories.`,
      ``,
      `2. RETURN TIMEFRAME`,
      `Returns must be initiated within ${days} calendar days from the date of delivery. Returns received after this period may not be eligible for ${method}. Contact our support team if you have extenuating circumstances.`,
      ``,
      `3. RETURN PROCESS`,
      `To initiate a return, please follow these steps:\n\u2022 Contact our customer support team at support@${biz.toLowerCase().replace(/[^a-z0-9]/g, "")}.com\n\u2022 Provide your order number and reason for return\n\u2022 Receive a Return Merchandise Authorization (RMA) number\n\u2022 Ship the item back using the provided return label or your own shipping method\n\u2022 Pack the item securely in its original packaging`,
      ``,
      `4. REFUND METHOD`,
      `Once we receive and inspect your return, you will receive ${refundLine}. Please allow 5\u201310 business days for the refund to appear on your statement. If you chose store credit, it will be issued immediately upon inspection and can be used on any future purchase.`,
      ``,
      `5. EXCHANGES`,
      `We offer exchanges for items of equal or lesser value. If you need an exchange, please contact us within ${days} days of delivery. If the replacement item costs more, you will be charged the difference. If it costs less, the difference will be issued as ${method === "store credit only" ? "store credit" : "a refund"}.`,
      ``,
      `6. NON-RETURNABLE ITEMS`,
      `The following items are excluded from our return policy:\n${exclusions}`,
      ``,
      `7. DAMAGED OR DEFECTIVE ITEMS`,
      `If you received a damaged or defective item, please contact us within 48 hours of delivery with photos of the damage. We will arrange for a replacement or full refund at no additional cost to you.`,
      ``,
      `8. CONTACT US`,
      `If you have any questions about our return policy, please contact us:\nEmail: support@${biz.toLowerCase().replace(/[^a-z0-9]/g, "")}.com\nPhone: (555) 000-0000\nBusiness Hours: Monday\u2013Friday, 9 AM \u2013 5 PM EST`,
    ].join("\n");
  }, [businessName, returnWindow, refundMethod, excludedList]);

  const handleGenerate = () => {
    if (businessName.trim()) setGenerated(true);
  };

  return (
    <ToolLayout id="return-policy-generator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Business Name
          </span>
          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Acme Store"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: businessName ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Return Window (days)
          </span>
          <input
            type="number"
            value={returnWindow}
            onChange={(e) => setReturnWindow(e.target.value)}
            placeholder="30"
            min="1"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: returnWindow ? color : undefined }}
          />
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Refund Method
        </span>
        <div className="flex gap-2">
          {REFUND_METHODS.map((method) => (
            <button
              key={method}
              onClick={() => setRefundMethod(method)}
              className="flex-1 rounded-md border-2 px-3 py-2.5 font-mono text-xs font-medium transition-all"
              style={
                refundMethod === method
                  ? { borderColor: color, backgroundColor: color, color: "#fff" }
                  : { borderColor: "var(--border)" }
              }
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Excluded Items (comma-separated)
        </span>
        <input
          value={excludedItems}
          onChange={(e) => setExcludedItems(e.target.value)}
          placeholder="e.g. Sale items, Custom orders, Underwear"
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
        />
      </div>

      <div>
        <ToolButton onClick={handleGenerate} disabled={!businessName.trim()}>
          Generate Return Policy
        </ToolButton>
      </div>

      {generated && policy && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Generated Policy
            </span>
            <CopyButton text={policy} />
          </div>
          <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap font-mono text-sm text-input-text leading-relaxed">
            {policy}
          </pre>
        </div>
      )}

      {!generated && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter your business details to generate a professional return policy
        </div>
      )}
    </ToolLayout>
  );
}
