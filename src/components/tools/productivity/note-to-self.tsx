import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

const names = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hank", "Ivy", "Jack", "Kate", "Leo", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Rose", "Sam", "Tina"];

export default function NoteToSelf() {
  const [notes, setNotes] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("notes-to-self") || "[]"); } catch { return []; } });
  const [input, setInput] = useState("");

  const add = () => { if (!input.trim()) return; const updated = [input.trim(), ...notes]; setNotes(updated); localStorage.setItem("notes-to-self", JSON.stringify(updated)); setInput(""); };
  const remove = (i: number) => { const updated = notes.filter((_, idx) => idx !== i); setNotes(updated); localStorage.setItem("notes-to-self", JSON.stringify(updated)); };

  return (
    <ToolLayout id="note-to-self">
      <div className="flex flex-col sm:flex-row gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Write a private note..." className="flex-1 p-3 bg-paper-dim/50 border border-border rounded-sm text-sm text-foreground" />
        <ToolButton onClick={add}>Add</ToolButton>
      </div>
      <div className="space-y-1.5">
        {notes.map((note, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-paper-dim/50 border border-border rounded-sm">
            <span className="text-sm text-foreground">{note}</span>
            <button onClick={() => remove(i)} className="text-xs text-coral hover:text-coral px-2">✕</button>
          </div>
        ))}
      </div>
      {notes.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No notes yet. Private and stored locally.</p>}
    </ToolLayout>
  );
}
