import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

interface FormField {
  id: number;
  name: string;
  type: string;
}

const FIELD_TYPES = [
  "Text",
  "Email",
  "Phone",
  "Number",
  "Date",
  "Select",
  "Checkbox",
  "Textarea",
  "File",
  "URL",
];

let nextId = 1;

export function FormSheetMapper() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Text");
  const { color } = useToolAccent();

  const addField = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setFields((prev) => [...prev, { id: nextId++, name: trimmed, type: newType }]);
    setNewName("");
  };

  const removeField = (id: number) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const moveField = (id: number, direction: "up" | "down") => {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  };

  const csvHeaders = fields.map((f) => `"${f.name.replace(/"/g, '""')}"`).join(",");
  const previewRow = fields
    .map((f) => {
      switch (f.type) {
        case "Email":
          return "user@example.com";
        case "Phone":
          return "+1-555-0123";
        case "Number":
          return "42";
        case "Date":
          return "2025-01-15";
        case "Checkbox":
          return "TRUE";
        case "URL":
          return "https://example.com";
        case "File":
          return "file.pdf";
        default:
          return "Sample text";
      }
    })
    .join(",");

  const columnMapping = fields.map((f, i) => ({
    column: String.fromCharCode(65 + i),
    header: f.name,
    type: f.type,
    sheetType:
      f.type === "Checkbox"
        ? "Checkbox"
        : f.type === "Date"
          ? "Date"
          : f.type === "Number"
            ? "Number"
            : "Text",
  }));

  const allText = `Column Mapping:\n${columnMapping.map((m) => `${m.column}: ${m.header} (${m.type} → ${m.sheetType})`).join("\n")}\n\nCSV Headers:\n${csvHeaders}\n\nSample Row:\n${previewRow}`;

  const reset = () => {
    setFields([]);
    setNewName("");
    setNewType("Text");
  };

  return (
    <ToolLayout id="form-sheet-mapper">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addField()}
          placeholder="Field name..."
          className="sm:col-span-1 rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
          style={{ borderColor: newName ? color : undefined }}
        />
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none"
        >
          {FIELD_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <ToolButton onClick={addField} disabled={!newName.trim()}>
          Add Field
        </ToolButton>
      </div>

      {fields.length > 0 && (
        <div className="overflow-x-auto rounded-md border-2 border-line">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b-2 border-line bg-input-bg">
                <th className="px-3 py-2 text-left text-muted">#</th>
                <th className="px-3 py-2 text-left text-muted">Field Name</th>
                <th className="px-3 py-2 text-left text-muted">Type</th>
                <th className="px-3 py-2 text-left text-muted">Column</th>
                <th className="px-3 py-2 text-right text-muted"></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((f, i) => (
                <tr key={f.id} className="border-b border-line last:border-b-0">
                  <td className="px-3 py-2 text-muted">{i + 1}</td>
                  <td className="px-3 py-2 text-input-text font-medium">{f.name}</td>
                  <td className="px-3 py-2">
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px]"
                      style={{ backgroundColor: color + "20", color }}
                    >
                      {f.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-bold" style={{ color }}>
                    {String.fromCharCode(65 + i)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => moveField(f.id, "up")}
                        disabled={i === 0}
                        className="text-muted transition-colors hover:text-foreground disabled:opacity-30"
                      >
                        \u2191
                      </button>
                      <button
                        onClick={() => moveField(f.id, "down")}
                        disabled={i === fields.length - 1}
                        className="text-muted transition-colors hover:text-foreground disabled:opacity-30"
                      >
                        \u2193
                      </button>
                      <button
                        onClick={() => removeField(f.id)}
                        className="text-muted transition-colors hover:text-coral"
                      >
                        \u00d7
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {fields.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Column Mapping Preview
            </span>
            <CopyButton text={allText} />
          </div>
          <div className="rounded-lg border-2 border-line bg-input-bg p-4">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-muted">
              Spreadsheet Headers
            </span>
            <div className="flex flex-wrap gap-1.5">
              {columnMapping.map((m) => (
                <div
                  key={m.column}
                  className="flex items-center gap-1 rounded-md border-2 border-line px-2 py-1"
                >
                  <span className="font-mono text-[10px] font-bold" style={{ color }}>
                    {m.column}
                  </span>
                  <span className="font-mono text-[10px] text-input-text">{m.header}</span>
                  <span className="font-mono text-[10px] text-muted">({m.sheetType})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {fields.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Preview Table
            </span>
            <CopyButton text={`${csvHeaders}\n${previewRow}`} />
          </div>
          <div className="overflow-x-auto rounded-md border-2 border-line">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b-2 border-line bg-input-bg">
                  {fields.map((f) => (
                    <th key={f.id} className="px-3 py-2 text-left font-bold" style={{ color }}>
                      {f.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {fields.map((f, i) => (
                    <td key={f.id} className="px-3 py-2 text-input-text">
                      {f.type === "Checkbox" ? (
                        <span
                          className="inline-flex h-4 w-4 items-center justify-center rounded border-2"
                          style={{ borderColor: color }}
                        >
                          {"\u2713"}
                        </span>
                      ) : ["Text", "Textarea", "Select", "Email", "Phone", "URL", "File"].includes(
                          f.type,
                        ) ? (
                        <span className="text-muted italic">
                          {previewRow.split(",")[i] || "Sample"}
                        </span>
                      ) : (
                        previewRow.split(",")[i]
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border-2 border-line bg-input-bg p-3">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted">
              CSV Export
            </span>
            <pre className="whitespace-pre-wrap break-all font-mono text-xs text-input-text">
              {csvHeaders}
            </pre>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={reset}
          className="font-mono text-xs text-muted underline transition-colors hover:text-foreground"
        >
          Reset all fields
        </button>
      </div>

      {fields.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Add form fields above to map them to spreadsheet columns
        </div>
      )}
    </ToolLayout>
  );
}
