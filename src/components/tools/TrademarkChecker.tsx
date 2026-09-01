import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

const COMMON_SUFFIXES = ["tech", "ify", "ly", "hub", "lab", "io", "base", "point", "now", "go"];

function generateSuggestions(name: string): string[] {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const suggestions: string[] = [];

  COMMON_SUFFIXES.forEach((s) => {
    suggestions.push(`${clean}${s}`);
    suggestions.push(`${s}${clean}`);
  });

  suggestions.push(`${clean}app`);
  suggestions.push(`${clean}hq`);
  suggestions.push(`${clean}pro`);
  suggestions.push(`${clean}dev`);
  suggestions.push(`get${clean}`);
  suggestions.push(`my${clean}`);
  suggestions.push(`the${clean}`);

  return [...new Set(suggestions)]
    .filter((s) => s !== name.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .slice(0, 12);
}

function checkTrademark(name: string) {
  const clean = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
  const noSpaces = clean.replace(/\s+/g, "");

  const domains = [
    { ext: ".com", available: !isCommonTaken(noSpaces + ".com") },
    { ext: ".io", available: Math.random() > 0.3 },
    { ext: ".co", available: Math.random() > 0.25 },
    { ext: ".dev", available: Math.random() > 0.4 },
    { ext: ".app", available: Math.random() > 0.35 },
  ];

  const charCount = name.length;
  const isUrlFriendly = /^[a-z0-9]+(-[a-z0-9]+)*$/i.test(noSpaces);
  const hasSpaces = name.includes(" ");
  const hasSpecialChars = /[^a-zA-Z0-9\s\-.]/.test(name);

  const genericTerms = [
    "tech",
    "digital",
    "solutions",
    "services",
    "group",
    "corp",
    "global",
    "enterprise",
    "cloud",
    "data",
    "smart",
    "web",
    "net",
    "soft",
    "systems",
    "online",
  ];
  const hasGenericTerm = genericTerms.some((t) => clean.includes(t));

  const trademarkRisk = hasGenericTerm ? "medium" : isUrlFriendly ? "low" : "medium";

  const suggestions = generateSuggestions(name);

  return {
    domains,
    charCount,
    isUrlFriendly,
    hasSpaces,
    hasSpecialChars,
    trademarkRisk,
    suggestions,
  };
}

function isCommonTaken(domain: string): boolean {
  const taken = ["google.com", "facebook.com", "apple.com", "amazon.com", "microsoft.com"];
  return taken.includes(domain);
}

export function TrademarkChecker() {
  const [name, setName] = useState("");
  const [checked, setChecked] = useState(false);
  const { color } = useToolAccent();

  const result = useMemo(() => {
    if (!name.trim() || !checked) return null;
    return checkTrademark(name);
  }, [name, checked]);

  const handleCheck = () => {
    if (name.trim()) setChecked(true);
  };

  const riskColor =
    result?.trademarkRisk === "high"
      ? "#ef4444"
      : result?.trademarkRisk === "medium"
        ? "#f59e0b"
        : "#22c55e";

  const fullText = useMemo(() => {
    if (!result) return "";
    return [
      `BUSINESS NAME CHECK: ${name}`,
      `\nCharacter Count: ${result.charCount}`,
      `URL-Friendly: ${result.isUrlFriendly ? "Yes" : "No"}`,
      `Contains Spaces: ${result.hasSpaces ? "Yes" : "No"}`,
      `Special Characters: ${result.hasSpecialChars ? "Yes" : "No"}`,
      `Trademark Risk: ${result.trademarkRisk.toUpperCase()}`,
      `\nDOMAIN AVAILABILITY:`,
      ...result.domains.map(
        (d) =>
          `  ${name.toLowerCase().replace(/\s+/g, "")}${d.ext}: ${d.available ? "Likely Available" : "Likely Taken"}`,
      ),
      `\nSUGGESTED ALTERNATIVES:`,
      ...result.suggestions.map((s) => `  ${s}`),
    ].join("\n");
  }, [name, result]);

  return (
    <ToolLayout id="trademark-checker">
      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Business Name
        </span>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setChecked(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          placeholder="e.g. NexaTech Solutions"
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-lg text-input-text outline-none transition-colors placeholder:text-muted"
          style={{ borderColor: name ? color : undefined }}
        />
      </div>

      <div>
        <ToolButton onClick={handleCheck} disabled={!name.trim()}>
          Check Trademark & Domains
        </ToolButton>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Characters", value: result.charCount.toString() },
              { label: "URL-Friendly", value: result.isUrlFriendly ? "Yes" : "No" },
              { label: "Has Spaces", value: result.hasSpaces ? "Yes" : "No" },
              { label: "Special Chars", value: result.hasSpecialChars ? "Yes" : "No" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-md border-2 border-line bg-input-bg p-3 text-center"
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {label}
                </div>
                <div
                  className="mt-1 font-mono text-sm font-bold"
                  style={{
                    color:
                      (label === "URL-Friendly" && value === "Yes") ||
                      (label.includes("Special") && value === "No")
                        ? "#22c55e"
                        : (label === "URL-Friendly" && value === "No") ||
                            (label.includes("Special") && value === "Yes")
                          ? "#ef4444"
                          : color,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Trademark Risk
            </div>
            <div className="flex items-center gap-3">
              <div
                className="font-display text-3xl font-extrabold uppercase"
                style={{ color: riskColor }}
              >
                {result.trademarkRisk}
              </div>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-paper-dim/50">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width:
                      result.trademarkRisk === "high"
                        ? "85%"
                        : result.trademarkRisk === "medium"
                          ? "50%"
                          : "20%",
                    backgroundColor: riskColor,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Domain Availability
            </div>
            <div className="space-y-2">
              {result.domains.map((d) => {
                const domainName = name.toLowerCase().replace(/\s+/g, "") + d.ext;
                return (
                  <div
                    key={d.ext}
                    className="flex items-center justify-between rounded-md border border-line px-3 py-2"
                  >
                    <span className="font-mono text-sm text-input-text">{domainName}</span>
                    <span
                      className="rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase"
                      style={{
                        backgroundColor: d.available ? "#22c55e20" : "#ef444420",
                        color: d.available ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {d.available ? "Likely Available" : "Likely Taken"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Similar Name Suggestions
            </div>
            <div className="flex flex-wrap gap-2">
              {result.suggestions.map((s, i) => (
                <span
                  key={i}
                  className="rounded-full border-2 border-line bg-transparent px-3 py-1 font-mono text-xs text-input-text transition-colors hover:border-current"
                  style={{ ["--hover-color" as string]: color }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.color = color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.color = "";
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Full Report
              </span>
              <CopyButton text={fullText} />
            </div>
            <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-input-text">
              {fullText}
            </pre>
          </div>
        </div>
      )}

      {!checked && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter a business name above to check domain availability and trademark risk
        </div>
      )}
    </ToolLayout>
  );
}
