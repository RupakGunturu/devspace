import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

interface LineItem {
  description: string;
  qty: string;
  rate: string;
}

interface InvoiceData {
  invoiceNumber: string;
  yourName: string;
  yourEmail: string;
  yourAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceDate: string;
  dueDate: string;
  taxRate: string;
  notes: string;
}

function createEmptyLine(): LineItem {
  return { description: "", qty: "1", rate: "" };
}

export function InvoiceGenerator() {
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: "",
    yourName: "",
    yourEmail: "",
    yourAddress: "",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    taxRate: "0",
    notes: "",
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([createEmptyLine()]);
  const [showPreview, setShowPreview] = useState(false);
  const { color } = useToolAccent();

  const updateInvoice = (field: keyof InvoiceData, value: string) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string) => {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addLineItem = () => {
    setLineItems((prev) => [...prev, createEmptyLine()]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const calculations = useMemo(() => {
    let subtotal = 0;
    const items = lineItems.map((item) => {
      const qty = parseFloat(item.qty) || 0;
      const rate = parseFloat(item.rate) || 0;
      const total = qty * rate;
      subtotal += total;
      return { ...item, total, qty, rate };
    });

    const taxRate = parseFloat(invoice.taxRate) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    return { items, subtotal, taxAmount, total, taxRate };
  }, [lineItems, invoice.taxRate]);

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const previewText = useMemo(() => {
    const lines: string[] = [];
    lines.push("INVOICE");
    lines.push("");
    lines.push(`Invoice #: ${invoice.invoiceNumber || "N/A"}`);
    lines.push(`Date: ${invoice.invoiceDate || "N/A"}`);
    lines.push(`Due: ${invoice.dueDate || "N/A"}`);
    lines.push("");
    lines.push("FROM:");
    lines.push(invoice.yourName || "[Your Name]");
    lines.push(invoice.yourEmail || "");
    lines.push(invoice.yourAddress || "");
    lines.push("");
    lines.push("BILL TO:");
    lines.push(invoice.clientName || "[Client Name]");
    lines.push(invoice.clientEmail || "");
    lines.push(invoice.clientAddress || "");
    lines.push("");
    lines.push("-".repeat(60));
    lines.push(
      `${"Description".padEnd(30)} ${"Qty".padStart(5)} ${"Rate".padStart(10)} ${"Amount".padStart(12)}`
    );
    lines.push("-".repeat(60));
    for (const item of calculations.items) {
      if (!item.description && item.rate === 0) continue;
      const desc = (item.description || "Item").substring(0, 28).padEnd(30);
      const qty = String(item.qty).padStart(5);
      const rate = `$${fmt(item.rate)}`.padStart(10);
      const amount = `$${fmt(item.total)}`.padStart(12);
      lines.push(`${desc} ${qty} ${rate} ${amount}`);
    }
    lines.push("-".repeat(60));
    lines.push(`${"Subtotal:".padEnd(48)} $${fmt(calculations.subtotal)}`);
    if (calculations.taxRate > 0) {
      lines.push(`${`Tax (${calculations.taxRate}%):`.padEnd(48)} $${fmt(calculations.taxAmount)}`);
    }
    lines.push(`${"TOTAL:".padEnd(48)} $${fmt(calculations.total)}`);
    if (invoice.notes) {
      lines.push("");
      lines.push("Notes:");
      lines.push(invoice.notes);
    }
    return lines.join("\n");
  }, [invoice, calculations]);

  const printInvoice = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Invoice ${invoice.invoiceNumber || ""}</title>
      <style>body{font-family:'Courier New',monospace;max-width:700px;margin:40px auto;padding:20px;line-height:1.6;color:#1a1a2e;white-space:pre-wrap}h1{text-align:center;font-size:24px;margin-bottom:20px;letter-spacing:2px;}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{padding:8px;text-align:left;border-bottom:1px solid #ddd}th{text-align:right}.total{font-weight:bold;font-size:14px;border-top:2px solid #1a1a2e;padding-top:8px;}</style>
      </head><body>${previewText.split("\n").map((l) => l || "<br>").join("\n")}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <ToolLayout id="invoice-generator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Invoice Number
          </span>
          <input
            value={invoice.invoiceNumber}
            onChange={(e) => updateInvoice("invoiceNumber", e.target.value)}
            placeholder="INV-001"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: invoice.invoiceNumber ? color : undefined }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Invoice Date
            </span>
            <input
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) => updateInvoice("invoiceDate", e.target.value)}
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
            />
          </div>
          <div>
            <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Due Date
            </span>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => updateInvoice("dueDate", e.target.value)}
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Your Info
          </div>
          <div className="space-y-2">
            <input
              value={invoice.yourName}
              onChange={(e) => updateInvoice("yourName", e.target.value)}
              placeholder="Your Name / Business"
              className="w-full rounded-md border border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
            />
            <input
              value={invoice.yourEmail}
              onChange={(e) => updateInvoice("yourEmail", e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-md border border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
            />
            <input
              value={invoice.yourAddress}
              onChange={(e) => updateInvoice("yourAddress", e.target.value)}
              placeholder="Address"
              className="w-full rounded-md border border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
            />
          </div>
        </div>
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Client Info
          </div>
          <div className="space-y-2">
            <input
              value={invoice.clientName}
              onChange={(e) => updateInvoice("clientName", e.target.value)}
              placeholder="Client / Company Name"
              className="w-full rounded-md border border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
            />
            <input
              value={invoice.clientEmail}
              onChange={(e) => updateInvoice("clientEmail", e.target.value)}
              placeholder="client@email.com"
              className="w-full rounded-md border border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
            />
            <input
              value={invoice.clientAddress}
              onChange={(e) => updateInvoice("clientAddress", e.target.value)}
              placeholder="Address"
              className="w-full rounded-md border border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border-2 border-line bg-input-bg p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Line Items
          </span>
          <ToolButton onClick={addLineItem} variant="secondary" className="!px-3 !py-1.5">
            + Add Item
          </ToolButton>
        </div>
        <div className="space-y-2">
          {lineItems.map((item, index) => {
            const total = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
            return (
              <div key={index} className="grid grid-cols-12 items-center gap-2">
                <input
                  value={item.description}
                  onChange={(e) => updateLineItem(index, "description", e.target.value)}
                  placeholder="Description"
                  className="col-span-5 rounded-md border border-line bg-input-bg p-2 font-mono text-sm text-input-text outline-none placeholder:text-muted sm:col-span-6"
                />
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateLineItem(index, "qty", e.target.value)}
                  placeholder="1"
                  className="col-span-2 rounded-md border border-line bg-input-bg p-2 font-mono text-sm text-input-text outline-none"
                />
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateLineItem(index, "rate", e.target.value)}
                  placeholder="0.00"
                  className="col-span-2 rounded-md border border-line bg-input-bg p-2 font-mono text-sm text-input-text outline-none"
                />
                <span className="col-span-2 text-right font-mono text-sm text-input-text">
                  ${fmt(total)}
                </span>
                {lineItems.length > 1 && (
                  <button
                    onClick={() => removeLineItem(index)}
                    className="col-span-1 text-center font-mono text-sm text-muted hover:text-red-400"
                  >
                    &times;
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Tax Rate (%)
          </span>
          <input
            type="number"
            value={invoice.taxRate}
            onChange={(e) => updateInvoice("taxRate", e.target.value)}
            placeholder="0"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors"
          />
        </div>
        <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
          <div className="font-mono text-xs text-muted">Subtotal</div>
          <div className="mt-1 font-mono text-lg font-bold text-input-text">
            ${fmt(calculations.subtotal)}
          </div>
        </div>
        <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
          <div className="font-mono text-xs text-muted">Total</div>
          <div className="mt-1 font-mono text-lg font-bold" style={{ color }}>
            ${fmt(calculations.total)}
          </div>
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Notes
        </span>
        <textarea
          value={invoice.notes}
          onChange={(e) => updateInvoice("notes", e.target.value)}
          placeholder="Payment terms, thank you note, etc."
          rows={2}
          className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
        />
      </div>

      <div className="flex gap-2">
        <ToolButton onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Hide Preview" : "Show Preview"}
        </ToolButton>
        <ToolButton onClick={printInvoice} variant="secondary">
          Print / PDF
        </ToolButton>
      </div>

      {showPreview && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Invoice Preview
            </span>
            <CopyButton text={previewText} />
          </div>
          <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap font-mono text-sm text-input-text leading-relaxed">
            {previewText}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
