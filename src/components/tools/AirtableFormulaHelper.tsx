import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolInput } from "./ToolInput";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

interface FormulaMapping {
  pattern: RegExp;
  airtable: string;
  notion: string;
  description: string;
}

const MAPPINGS: FormulaMapping[] = [
  { pattern: /(?:if|when)\s+(.+?)\s+then\s+(.+?)(?:\s+else\s+(.+))?$/i, airtable: 'IF({$1}, {$2}, {$3})', notion: 'if(prop("$1"), $2, $3)', description: 'Conditional IF/THEN/ELSE' },
  { pattern: /(?:sum|total|add)\s+(.+?)\s*(?:and|,|\+)\s*(.+)/i, airtable: 'SUM({$1}, {$2})', notion: 'add($1, $2)', description: 'Sum two fields' },
  { pattern: /(?:average|avg)\s+(.+)/i, airtable: 'AVERAGE({$1})', notion: '$1.map(current => current).reduce((a, b) => a + b, 0) / $1.length', description: 'Average of a field' },
  { pattern: /count\s+(?:all\s+)?(?:rows?|records?|entries)\s*(?:where|where)\s+(.+)/i, airtable: 'IF(COUNTA(FILTER({$1})) > 0, COUNTA(FILTER({$1})), 0)', notion: 'filter(current.$1, true).length', description: 'Count rows matching condition' },
  { pattern: /concat(?:enate)?\s+(.+?)\s+and\s+(.+)/i, airtable: 'CONCATENATE({$1}, " ", {$2})', notion: '$1 + " " + $2', description: 'Concatenate two fields' },
  { pattern: /date\s+(?:diff|between)\s+(.+?)\s+and\s+(.+)/i, airtable: 'DATETIME_DIFF({$1}, {$2}, "days")', notion: 'dateBetween($1, $2, "days")', description: 'Date difference in days' },
  { pattern: /today/i, airtable: 'TODAY()', notion: 'now', description: 'Current date' },
  { pattern: /now/i, airtable: 'NOW()', notion: 'now', description: 'Current date and time' },
  { pattern: /length\s+(?:of\s+)?(.+)/i, airtable: 'LEN({$1})', notion: 'length($1)', description: 'Length of text field' },
  { pattern: /(?:upper|uppercase)\s+(.+)/i, airtable: 'UPPER({$1})', notion: 'upper($1)', description: 'Convert to uppercase' },
  { pattern: /(?:lower|lowercase)\s+(.+)/i, airtable: 'LOWER({$1})', notion: 'lower($1)', description: 'Convert to lowercase' },
  { pattern: /(?:trim|strip)\s+(.+)/i, airtable: 'TRIM({$1})', notion: 'replace($1, " ", "")', description: 'Trim whitespace' },
  { pattern: /contains?\s+(.+?)\s+(?:in|of)\s+(.+)/i, airtable: 'IF(FIND({$1}, {$2}) > 0, TRUE(), FALSE())', notion: 'contains($2, $1)', description: 'Check if text contains substring' },
  { pattern: /(?:is empty|is blank)\s+(.+)/i, airtable: 'IF({$1} = "", TRUE(), FALSE())', notion: 'empty($1)', description: 'Check if field is empty' },
  { pattern: /(?:is not empty|is not blank)\s+(.+)/i, airtable: 'IF({$1} != "", TRUE(), FALSE())', notion: '!empty($1)', description: 'Check if field is not empty' },
  { pattern: /round\s+(.+)\s+to\s+(\d+)\s*(?:decimals?|digits?)?/i, airtable: 'ROUND({$1}, $2)', notion: 'round($1, $2)', description: 'Round to N decimals' },
  { pattern: /max(?:imum)?\s+(.+)/i, airtable: 'MAX({$1})', notion: 'max($1)', description: 'Maximum value' },
  { pattern: /min(?:imum)?\s+(.+)/i, airtable: 'MIN({$1})', notion: 'min($1)', description: 'Minimum value' },
  { pattern: /replace\s+(.+?)\s+with\s+(.+?)\s+in\s+(.+)/i, airtable: 'SUBSTITUTE({$3}, {$1}, {$2})', notion: 'replace($3, $1, $2)', description: 'Replace text in string' },
  { pattern: /days?\s+(?:until|until)\s+(.+)/i, airtable: 'DATETIME_DIFF({$1}, TODAY(), "days")', notion: 'dateBetween($1, now, "days")', description: 'Days until a date' },
  { pattern: /month\s+(?:of\s+)?(.+)/i, airtable: 'MONTH({$1})', notion: 'month($1)', description: 'Extract month from date' },
  { pattern: /year\s+(?:of\s+)?(.+)/i, airtable: 'YEAR({$1})', notion: 'year($1)', description: 'Extract year from date' },
];

const REFERENCE_ITEMS = [
  { fn: "IF(condition, true_val, false_val)", desc: "Conditional logic" },
  { fn: "SUM(field1, field2, ...)", desc: "Add values" },
  { fn: "AVERAGE(field1, field2, ...)", desc: "Average values" },
  { fn: "COUNTA(field)", desc: "Count non-empty values" },
  { fn: "CONCATENATE(text1, text2, ...)", desc: "Join text strings" },
  { fn: "DATETIME_DIFF(date1, date2, unit)", desc: "Difference between dates" },
  { fn: "TODAY() / NOW()", desc: "Current date/time" },
  { fn: "LEN(text)", desc: "Text length" },
  { fn: "UPPER(text) / LOWER(text)", desc: "Case conversion" },
  { fn: "TRIM(text)", desc: "Remove extra spaces" },
  { fn: "FIND(search, text)", desc: "Find substring position" },
  { fn: "SUBSTITUTE(text, old, new)", desc: "Replace text" },
  { fn: "ROUND(number, decimals)", desc: "Round number" },
  { fn: "MAX(field) / MIN(field)", desc: "Max/min value" },
  { fn: "IF(value = \"\", ...)", desc: "Check if empty" },
];

export function AirtableFormulaHelper() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ airtable: string; notion: string; description: string } | null>(null);
  const { color } = useToolAccent();

  const generate = () => {
    if (!input.trim()) return;
    const lower = input.trim().toLowerCase();

    for (const mapping of MAPPINGS) {
      const match = lower.match(mapping.pattern);
      if (match) {
        let airtable = mapping.airtable;
        let notion = mapping.notion;
        for (let i = 1; i < match.length; i++) {
          if (match[i]) {
            airtable = airtable.replace(new RegExp(`\\$${i}`, "g"), match[i].trim());
            notion = notion.replace(new RegExp(`\\$${i}`, "g"), match[i].trim());
          }
        }
        setResult({ airtable, notion, description: mapping.description });
        return;
      }
    }

    const fields = input.match(/\{([^}]+)\}/g) || [];
    let airtableFormula = input.trim();
    let notionFormula = input.trim();

    if (fields.length > 0) {
      const firstField = (fields[0] || "").replace(/[{}]/g, "");
      airtableFormula = `/* Custom formula */\n${airtableFormula.replace(/{([^}]+)}/g, "{$1}")}`;
      notionFormula = notionFormula.replace(/{([^}]+)}/g, 'prop("$1")');
    }

    setResult({
      airtable: airtableFormula,
      notion: notionFormula,
      description: "Custom formula (manual adjustment may be needed)",
    });
  };

  const reset = () => {
    setInput("");
    setResult(null);
  };

  return (
    <ToolLayout id="airtable-formula-helper">
      <ToolInput
        value={input}
        onChange={setInput}
        placeholder={"e.g. if status is done then completion date else empty\n\nUse field names in plain English. Reference: {FieldName}"}
        label="Describe your formula in plain English"
        rows={4}
      />

      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={generate} disabled={!input.trim()}>Generate Formula</ToolButton>
        <ToolButton variant="secondary" onClick={reset}>Reset</ToolButton>
      </div>

      {result && (
        <div className="space-y-3">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">{result.description}</span>

          <div className="rounded-lg border-2 border-line bg-input-bg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold" style={{ color }}>Airtable Formula</span>
              <CopyButton text={result.airtable} />
            </div>
            <pre className="whitespace-pre-wrap break-all font-mono text-sm text-input-text">{result.airtable}</pre>
          </div>

          <div className="rounded-lg border-2 border-line bg-input-bg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold" style={{ color }}>Notion Formula</span>
              <CopyButton text={result.notion} />
            </div>
            <pre className="whitespace-pre-wrap break-all font-mono text-sm text-input-text">{result.notion}</pre>
          </div>
        </div>
      )}

      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Common Functions Reference</span>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {REFERENCE_ITEMS.map((item) => (
            <div key={item.fn} className="flex items-center justify-between rounded-md border-2 border-line bg-input-bg px-3 py-2">
              <code className="font-mono text-[10px] text-foreground">{item.fn}</code>
              <span className="font-mono text-[10px] text-muted">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
