import { useCallback, useEffect, useRef, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

const QUESTION_BANK: string[] = [
  "Tell me about yourself and your background.",
  "Why are you interested in this role?",
  "Describe a challenging project you worked on and how you handled it.",
  "How do you handle disagreements with teammates?",
  "Tell me about a time you failed and what you learned.",
  "How do you prioritize tasks when everything feels urgent?",
  "Describe your ideal work environment.",
  "How do you stay current with new technologies?",
  "Tell me about a time you had to learn something quickly.",
  "How do you approach code reviews?",
  "Explain a complex technical concept to a non-technical person.",
  "Describe a situation where you had to make a difficult decision.",
  "How do you handle feedback and criticism?",
  "Tell me about a time you went above and beyond.",
  "How do you ensure code quality in your projects?",
  "Describe your debugging process for a complex issue.",
  "How do you approach testing in your development workflow?",
  "Tell me about a time you mentored someone.",
  "How do you handle tight deadlines?",
  "Describe your experience with agile methodologies.",
  "How do you approach technical debt?",
  "Tell me about a production incident you handled.",
  "How do you design scalable systems?",
  "Describe your approach to API design.",
  "How do you handle security concerns in your applications?",
  "Tell me about a time you improved a process.",
  "How do you collaborate with designers and product managers?",
  "Describe your experience with CI/CD pipelines.",
  "How do you approach database optimization?",
  "Tell me about a time you had to advocate for a technical decision.",
  "How do you handle working on legacy code?",
  "Describe your approach to microservices vs. monoliths.",
  "How do you approach monitoring and observability?",
  "Tell me about a time you solved a particularly tricky bug.",
  "How do you handle performance optimization?",
];

const DURATION_OPTIONS = [
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
];

export function MockInterviewTimer() {
  const [duration, setDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [questionInterval, setQuestionInterval] = useState(3);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { color } = useToolAccent();

  const pickRandomQuestion = useCallback(() => {
    const available = QUESTION_BANK.filter((q) => !history.includes(q));
    const pool = available.length > 0 ? available : QUESTION_BANK;
    const q = pool[Math.floor(Math.random() * pool.length)];
    setCurrentQuestion(q);
    setHistory((prev) => [...prev, q]);
  }, [history]);

  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    questionTimerRef.current = setInterval(() => {
      pickRandomQuestion();
    }, questionInterval * 60 * 1000);

    if (!currentQuestion) pickRandomQuestion();
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
      questionTimerRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTimeLeft(duration * 60);
    setCurrentQuestion("");
    setHistory([]);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setTimeLeft(duration * 60);
    if (isRunning) {
      stopTimer();
    }
  }, [duration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  const isWarning = timeLeft < 300;
  const isCritical = timeLeft < 60;

  return (
    <ToolLayout id="mock-interview-timer">
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDuration(opt.value)}
              disabled={isRunning}
              className="rounded-md border-2 px-4 py-2 font-mono text-sm font-medium transition-all disabled:opacity-50"
              style={
                duration === opt.value
                  ? { borderColor: color, backgroundColor: color, color: "#fff" }
                  : { borderColor: "var(--border)" }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative flex h-48 w-48 items-center justify-center">
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={isCritical ? "#ef4444" : isWarning ? "#f59e0b" : color}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 90}
              strokeDashoffset={2 * Math.PI * 90 * (1 - progress / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="text-center">
            <div
              className="font-display text-4xl font-extrabold"
              style={{ color: isCritical ? "#ef4444" : isWarning ? "#f59e0b" : color }}
            >
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            <div className="font-mono text-xs text-muted">
              {isRunning ? "In Progress" : timeLeft === 0 ? "Time's Up!" : "Ready"}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {!isRunning ? (
            <ToolButton onClick={startTimer} disabled={timeLeft === 0}>
              Start
            </ToolButton>
          ) : (
            <ToolButton onClick={stopTimer} variant="secondary">
              Pause
            </ToolButton>
          )}
          <ToolButton onClick={resetTimer} variant="secondary">
            Reset
          </ToolButton>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Question Change Interval
            </span>
            <span className="font-mono text-xs text-muted">{questionInterval} min</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={questionInterval}
            onChange={(e) => setQuestionInterval(parseInt(e.target.value))}
            className="w-full accent-current"
            style={{ color }}
          />
        </div>
      </div>

      {currentQuestion && (
        <div
          className="rounded-md border-2 border-line bg-input-bg p-6 text-center"
          style={{ borderColor: color }}
        >
          <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Current Question
          </div>
          <p className="font-mono text-lg text-input-text">{currentQuestion}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Question History ({history.length})
          </div>
          <div className="max-h-[300px] space-y-2 overflow-auto">
            {history.map((q, i) => (
              <div
                key={i}
                className="flex items-start gap-2 border-b border-line/50 pb-2 last:border-b-0"
              >
                <span className="shrink-0 font-mono text-xs text-muted">{i + 1}.</span>
                <span className="font-mono text-sm text-input-text">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!currentQuestion && history.length === 0 && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Select duration and click Start to begin the mock interview
        </div>
      )}
    </ToolLayout>
  );
}
