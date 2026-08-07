import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

const QUESTION_COUNTS = [5, 10, 15] as const;
const QUESTION_TYPES = ["MCQ", "True-False", "Short Answer"] as const;

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface Question {
  id: number;
  question: string;
  options?: string[];
  answer: string;
}

function generateMCQ(topic: string, index: number): Question {
  const concepts = [
    "the primary purpose", "the key characteristic", "the main advantage",
    "the fundamental concept", "the core principle", "the essential component",
  ];
  const distractors = [
    "An unrelated side effect", "A secondary byproduct", "A minor detail",
    "An outdated approach", "A conflicting principle", "An optional feature",
  ];
  const shuffled = shuffleArray(distractors);
  const correct = `${concepts[index % concepts.length]} of ${topic}`;
  const options = shuffleArray([correct, shuffled[0], shuffled[1], shuffled[2]]);
  return {
    id: index + 1,
    question: `Which of the following best describes ${concepts[index % concepts.length]} of ${topic}?`,
    options,
    answer: correct,
  };
}

function generateTF(topic: string, index: number): Question {
  const statements = [
    { text: `${topic} is a well-established concept in its field`, answer: "True" },
    { text: `${topic} was first introduced in the 21st century`, answer: "False" },
    { text: `Understanding ${topic} requires foundational knowledge`, answer: "True" },
    { text: `${topic} has no practical applications`, answer: "False" },
    { text: `${topic} is considered a core competency`, answer: "True" },
    { text: `${topic} has been completely replaced by newer methods`, answer: "False" },
  ];
  const s = statements[index % statements.length];
  return {
    id: index + 1,
    question: `True or False: ${s.text}.`,
    answer: s.answer,
  };
}

function generateSA(topic: string, index: number): Question {
  const prompts = [
    `Explain the significance of ${topic} in your own words.`,
    `Describe two real-world applications of ${topic}.`,
    `What are the key components of ${topic}?`,
    `How does ${topic} differ from related concepts?`,
    `Why is understanding ${topic} important for this course?`,
  ];
  return {
    id: index + 1,
    question: prompts[index % prompts.length],
    answer: `(Model answer for: ${prompts[index % prompts.length]})`,
  };
}

export function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState<5 | 10 | 15>(5);
  const [type, setType] = useState<string>("MCQ");
  const [showAnswers, setShowAnswers] = useState(false);
  const [generated, setGenerated] = useState(false);
  const { color } = useToolAccent();

  const questions = useMemo(() => {
    if (!topic.trim() || !generated) return [];
    const result: Question[] = [];
    for (let i = 0; i < count; i++) {
      if (type === "MCQ") result.push(generateMCQ(topic.trim(), i));
      else if (type === "True-False") result.push(generateTF(topic.trim(), i));
      else result.push(generateSA(topic.trim(), i));
    }
    return result;
  }, [topic, count, type, generated]);

  const handleGenerate = () => {
    if (topic.trim()) {
      setGenerated(true);
      setShowAnswers(false);
    }
  };

  const fullText = useMemo(() => {
    if (questions.length === 0) return "";
    const lines = [
      `QUIZ: ${topic}`,
      `Type: ${type} | Questions: ${count}`,
      `\n${"=".repeat(50)}`,
    ];
    questions.forEach((q) => {
      lines.push(`\n${q.id}. ${q.question}`);
      q.options?.forEach((opt, i) => {
        lines.push(`   ${String.fromCharCode(65 + i)}) ${opt}`);
      });
      if (showAnswers) {
        lines.push(`   ANSWER: ${q.answer}`);
      }
    });
    if (!showAnswers) {
      lines.push(`\n${"=".repeat(50)}`);
      lines.push(`\nANSWERS (hidden):`);
      questions.forEach((q) => {
        lines.push(`${q.id}. ${q.answer}`);
      });
    }
    return lines.join("\n");
  }, [questions, topic, type, count, showAnswers]);

  return (
    <ToolLayout id="quiz-generator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Topic</span>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="e.g. Python Fundamentals"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: topic ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Question Type</span>
          <div className="flex gap-2">
            {QUESTION_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="flex-1 rounded-md border-2 px-3 py-2.5 font-mono text-xs transition-all"
                style={type === t ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Number of Questions</span>
        <div className="flex gap-2">
          {QUESTION_COUNTS.map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className="rounded-md border-2 px-6 py-2 font-mono text-sm transition-all"
              style={count === n ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={handleGenerate} disabled={!topic.trim()}>
          Generate Quiz
        </ToolButton>
        {generated && questions.length > 0 && (
          <>
            <ToolButton variant="secondary" onClick={() => setShowAnswers(!showAnswers)}>
              {showAnswers ? "Hide Answers" : "Show Answers"}
            </ToolButton>
            <CopyButton text={fullText} />
          </>
        )}
      </div>

      {generated && questions.length > 0 && (
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="rounded-md border-2 border-line bg-input-bg p-4">
              <div className="mb-2 flex items-start gap-2">
                <span className="font-mono text-sm font-bold" style={{ color }}>{q.id}.</span>
                <span className="font-mono text-sm text-input-text">{q.question}</span>
              </div>
              {q.options && (
                <div className="ml-6 space-y-1">
                  {q.options.map((opt, i) => {
                    const isCorrect = showAnswers && opt === q.answer;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-xs"
                        style={isCorrect ? { backgroundColor: "#22c55e15", color: "#22c55e" } : { color: "var(--muted)" }}
                      >
                        <span className="font-bold">{String.fromCharCode(65 + i)})</span>
                        {opt}
                        {isCorrect && <span className="ml-auto font-bold">&#10003;</span>}
                      </div>
                    );
                  })}
                </div>
              )}
              {showAnswers && !q.options && (
                <div className="ml-6 rounded-md bg-input-bg px-3 py-2 font-mono text-xs" style={{ color: "#22c55e" }}>
                  Answer: {q.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {generated && questions.length === 0 && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          No questions generated. Try a different topic.
        </div>
      )}

      {!generated && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter a topic and select options to generate your quiz
        </div>
      )}
    </ToolLayout>
  );
}
