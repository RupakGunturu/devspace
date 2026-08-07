import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

function generateBarcodePattern(seed: string): number[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const bars: number[] = [];
  for (let i = 0; i < 40; i++) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    bars.push(hash % 3 === 0 ? 3 : hash % 2 === 0 ? 2 : 1);
  }
  return bars;
}

function BarcodeVisual({ code, color }: { code: string; color: string }) {
  const bars = useMemo(() => generateBarcodePattern(code), [code]);
  return (
    <div className="flex items-end justify-center gap-px rounded-md bg-white p-3">
      {bars.map((w, i) => (
        <div
          key={i}
          className="shrink-0"
          style={{
            width: `${w}px`,
            height: `${30 + (i % 5) * 2}px`,
            backgroundColor: i % 2 === 0 ? "#000" : "transparent",
          }}
        />
      ))}
    </div>
  );
}

export function SkuBarcodeGenerator() {
  const [productName, setProductName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [sequential, setSequential] = useState("1");
  const [batchCount, setBatchCount] = useState("");
  const [generated, setGenerated] = useState(false);
  const { color } = useToolAccent();

  const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  const singleSku = useMemo(() => {
    if (!productName.trim() || !categoryCode.trim()) return null;
    const cat = sanitize(categoryCode).slice(0, 3);
    const prod = sanitize(productName).slice(0, 12);
    const seq = parseInt(sequential) || 1;
    return `${cat}-${prod}-${String(seq).padStart(3, "0")}`;
  }, [productName, categoryCode, sequential]);

  const batchSkus = useMemo(() => {
    if (!singleSku) return [];
    const count = Math.min(parseInt(batchCount) || 0, 100);
    if (count <= 0) return [];
    const base = parseInt(sequential) || 1;
    const cat = sanitize(categoryCode).slice(0, 3);
    const prod = sanitize(productName).slice(0, 12);
    return Array.from(
      { length: count },
      (_, i) => `${cat}-${prod}-${String(base + i).padStart(3, "0")}`,
    );
  }, [singleSku, batchCount, sequential, categoryCode, productName]);

  const handleGenerate = () => {
    if (singleSku) setGenerated(true);
  };

  const allSkus = batchSkus.length > 0 ? batchSkus : singleSku ? [singleSku] : [];

  return (
    <ToolLayout id="sku-barcode-generator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Product Name
          </span>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. Wireless Mouse"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: productName ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Category Code (3 letters)
          </span>
          <input
            value={categoryCode}
            onChange={(e) => setCategoryCode(e.target.value.slice(0, 3))}
            placeholder="ELC"
            maxLength={3}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted uppercase"
            style={{ borderColor: categoryCode ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Sequential #
          </span>
          <input
            type="number"
            value={sequential}
            onChange={(e) => setSequential(e.target.value)}
            placeholder="1"
            min="1"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: sequential ? color : undefined }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Batch Generate (optional, max 100)
          </span>
          <input
            type="number"
            value={batchCount}
            onChange={(e) => setBatchCount(e.target.value)}
            placeholder="1"
            min="1"
            max="100"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          />
        </div>
        <div className="flex items-end">
          <ToolButton
            onClick={handleGenerate}
            disabled={!productName.trim() || !categoryCode.trim()}
          >
            Generate SKU
          </ToolButton>
        </div>
      </div>

      {generated && allSkus.length > 0 && (
        <div className="space-y-4">
          {allSkus.length === 1 && singleSku && (
            <div className="rounded-md border-2 border-line bg-input-bg p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                  Generated SKU
                </span>
                <CopyButton text={singleSku} />
              </div>
              <div className="mb-3 font-display text-2xl font-extrabold" style={{ color }}>
                {singleSku}
              </div>
              <BarcodeVisual code={singleSku} color={color} />
              <div className="mt-2 font-mono text-xs text-muted text-center">{singleSku}</div>
            </div>
          )}

          {allSkus.length > 1 && (
            <div className="rounded-md border-2 border-line bg-input-bg p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                  Batch SKUs ({allSkus.length})
                </span>
                <CopyButton text={allSkus.join("\n")} />
              </div>
              <div className="max-h-[300px] space-y-2 overflow-auto">
                {allSkus.map((sku, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-md border border-line p-2"
                  >
                    <div className="w-16 shrink-0 text-right font-mono text-xs text-muted">
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <BarcodeVisual code={sku} color={color} />
                    </div>
                    <div className="shrink-0">
                      <CopyButton text={sku} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!generated && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter product details to generate SKU codes and barcode visuals
        </div>
      )}
    </ToolLayout>
  );
}
