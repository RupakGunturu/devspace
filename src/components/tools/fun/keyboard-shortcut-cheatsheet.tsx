import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";
import { ToolToggleGroup } from "../ToolToggleGroup";

const shortcuts: Record<string, Record<string, string>> = {
  "VS Code": { "Ctrl+P": "Quick Open", "Ctrl+Shift+P": "Command Palette", "Ctrl+`": "Toggle Terminal", "Ctrl+D": "Select Next Occurrence", "Ctrl+Shift+K": "Delete Line", "Alt+↑/↓": "Move Line", "Ctrl+/": "Toggle Comment", "Ctrl+Shift+L": "Select All Occurrences" },
  "Mac": { "Cmd+C": "Copy", "Cmd+V": "Paste", "Cmd+Z": "Undo", "Cmd+Shift+Z": "Redo", "Cmd+S": "Save", "Cmd+F": "Find", "Cmd+H": "Find & Replace", "Cmd+G": "Go to Line" },
  "Figma": { "Ctrl+G": "Group", "Ctrl+Shift+G": "Ungroup", "Ctrl+D": "Duplicate", "Ctrl+R": "Rename", "H": "Hand Tool", "V": "Move Tool", "F": "Frame Tool", "T": "Text Tool" },
};

export default function KeyboardShortcutCheatsheet() {
  const [active, setActive] = useState("VS Code");

  return (
    <ToolLayout id="keyboard-shortcut-cheatsheet">
      <ToolToggleGroup
        options={Object.keys(shortcuts).map((app) => ({ value: app, label: app }))}
        value={active}
        onChange={setActive}
      />
      <div className="space-y-1.5">
        {Object.entries(shortcuts[active]).map(([key, desc]) => (
          <div key={key} className="flex items-center justify-between p-2.5 bg-paper-dim/50 border border-border rounded-sm">
            <code className="font-mono text-xs text-foreground bg-paper-dim px-2 py-1 rounded">{key}</code>
            <span className="text-sm text-muted-foreground">{desc}</span>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
