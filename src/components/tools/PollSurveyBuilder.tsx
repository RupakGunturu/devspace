import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

interface Option {
  id: number;
  text: string;
  votes: number;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

let nextQId = 1;
let nextOId = 1;

export function PollSurveyBuilder() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOption, setNewOption] = useState("");
  const [activeQ, setActiveQ] = useState<number | null>(null);
  const { color } = useToolAccent();

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    const id = nextQId++;
    setQuestions((prev) => [...prev, { id, text: newQuestion.trim(), options: [] }]);
    setActiveQ(id);
    setNewQuestion("");
  };

  const addOption = () => {
    if (!newOption.trim() || activeQ === null) return;
    setQuestions((prev) => prev.map((q) => q.id === activeQ ? { ...q, options: [...q.options, { id: nextOId++, text: newOption.trim(), votes: 0 }] } : q));
    setNewOption("");
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (activeQ === id) setActiveQ(questions.length > 1 ? questions.find((q) => q.id !== id)!.id : null);
  };

  const removeOption = (qId: number, oId: number) => {
    setQuestions((prev) => prev.map((q) => q.id === qId ? { ...q, options: q.options.filter((o) => o.id !== oId) } : q));
  };

  const addVote = (qId: number, oId: number) => {
    setQuestions((prev) => prev.map((q) => q.id === qId ? { ...q, options: q.options.map((o) => o.id === oId ? { ...o, votes: o.votes + 1 } : o) } : q));
  };

  const activeQuestion = questions.find((q) => q.id === activeQ);
  const totalVotes = activeQuestion ? activeQuestion.options.reduce((s, o) => s + o.votes, 0) : 0;

  const allText = questions.map((q) => {
    const lines = [q.text, ...q.options.map((o) => `  ${o.text}: ${o.votes} votes`)];
    return lines.join("\n");
  }).join("\n\n");

  const reset = () => {
    setQuestions([]);
    setNewQuestion("");
    setNewOption("");
    setActiveQ(null);
  };

  return (
    <ToolLayout id="poll-survey-builder">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">New Question</label>
          <input value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addQuestion()} placeholder="What's your question?" className="w-full rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted" style={{ borderColor: newQuestion ? color : undefined }} />
        </div>
        <div className="flex items-end">
          <ToolButton onClick={addQuestion} disabled={!newQuestion.trim()}>Add Question</ToolButton>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, i) => (
            <button key={q.id} onClick={() => setActiveQ(q.id)} className="rounded-md border-2 px-3 py-1.5 font-mono text-xs transition-all" style={activeQ === q.id ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}>
              Q{i + 1}
            </button>
          ))}
        </div>
      )}

      {activeQuestion && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-foreground">{activeQuestion.text}</span>
            <button onClick={() => removeQuestion(activeQ!)} className="text-muted transition-colors hover:text-coral font-mono text-xs">\u00d7 Remove</button>
          </div>

          <div className="flex gap-2">
            <input value={newOption} onChange={(e) => setNewOption(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addOption()} placeholder="Add an option..." className="flex-1 rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted" />
            <ToolButton onClick={addOption} disabled={!newOption.trim()}>Add Option</ToolButton>
          </div>

          {activeQuestion.options.length > 0 && (
            <div className="space-y-2">
              {activeQuestion.options.map((opt) => {
                const pct = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                return (
                  <div key={opt.id} className="rounded-md border-2 border-line bg-input-bg px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-foreground">{opt.text}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted">{opt.votes} votes ({pct.toFixed(0)}%)</span>
                        <button onClick={() => removeOption(activeQ!, opt.id)} className="text-muted transition-colors hover:text-coral">\u00d7</button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 overflow-hidden rounded-full bg-line">
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                      <button onClick={() => addVote(activeQ!, opt.id)} className="shrink-0 rounded-md border-2 px-2 py-0.5 font-mono text-[10px] transition-all hover:opacity-80" style={{ borderColor: color, color }}>
                        +1
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalVotes > 0 && (
            <div className="flex items-center justify-between rounded-md border-2 border-line bg-input-bg px-3 py-2">
              <span className="font-mono text-xs text-muted">Total votes: {totalVotes}</span>
              <CopyButton text={activeQuestion.options.map((o) => `${o.text}: ${o.votes} (${totalVotes > 0 ? ((o.votes / totalVotes) * 100).toFixed(0) : 0}%)`).join("\n")} />
            </div>
          )}
        </div>
      )}

      {questions.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted">{questions.length} question{questions.length !== 1 ? "s" : ""}</span>
          <div className="flex gap-2">
            <CopyButton text={allText} />
            <button onClick={reset} className="font-mono text-xs text-muted underline transition-colors hover:text-foreground">Reset all</button>
          </div>
        </div>
      )}

      {questions.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Create a question above to start building your poll or survey
        </div>
      )}
    </ToolLayout>
  );
}
