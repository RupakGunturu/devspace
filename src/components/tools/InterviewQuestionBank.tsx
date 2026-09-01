import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

interface Question {
  text: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const QUESTIONS_BY_STACK: Record<
  string,
  { behavioral: Question[]; technical: Question[]; systemDesign: Question[] }
> = {
  React: {
    behavioral: [
      {
        text: "Tell me about a time you disagreed with a teammate on a technical approach. How did you resolve it?",
        difficulty: "Medium",
      },
      {
        text: "Describe a situation where you had to learn a new technology quickly for a project.",
        difficulty: "Easy",
      },
      {
        text: "Give an example of when you received tough feedback. How did you handle it?",
        difficulty: "Medium",
      },
      {
        text: "Tell me about a time you mentored someone or helped a junior developer grow.",
        difficulty: "Easy",
      },
      {
        text: "Describe a situation where you had to push back on a product requirement you disagreed with.",
        difficulty: "Hard",
      },
      {
        text: "Tell me about a project where you had to balance speed vs. code quality.",
        difficulty: "Medium",
      },
      {
        text: "Give an example of when you led a technical initiative without formal authority.",
        difficulty: "Hard",
      },
    ],
    technical: [
      {
        text: "Explain the React component lifecycle and how useEffect relates to it.",
        difficulty: "Medium",
      },
      {
        text: "What are React Server Components, and how do they differ from client components?",
        difficulty: "Hard",
      },
      { text: "How does React's reconciliation algorithm (diffing) work?", difficulty: "Hard" },
      {
        text: "Explain the difference between useMemo and useCallback with practical examples.",
        difficulty: "Medium",
      },
      { text: "What is the virtual DOM and why does React use it?", difficulty: "Easy" },
      {
        text: "How do you handle state management in a large React application?",
        difficulty: "Medium",
      },
      { text: "Explain React's Concurrent Mode and Suspense.", difficulty: "Hard" },
      { text: "How do you optimize performance in a React application?", difficulty: "Medium" },
      { text: "What are custom hooks and when would you create one?", difficulty: "Medium" },
      { text: "Explain the Context API vs. Redux — when would you use each?", difficulty: "Easy" },
      {
        text: "How does React handle forms? Compare controlled vs. uncontrolled components.",
        difficulty: "Easy",
      },
      { text: "What is React Fiber, and what problem does it solve?", difficulty: "Hard" },
    ],
    systemDesign: [
      {
        text: "Design a real-time collaborative document editor like Google Docs.",
        difficulty: "Hard",
      },
      { text: "How would you architect a large-scale e-commerce frontend?", difficulty: "Hard" },
      {
        text: "Design a notification system that supports email, push, and in-app notifications.",
        difficulty: "Hard",
      },
      { text: "How would you structure a micro-frontend architecture?", difficulty: "Hard" },
      {
        text: "Design an analytics dashboard that handles millions of data points.",
        difficulty: "Hard",
      },
    ],
  },
  Node: {
    behavioral: [
      {
        text: "Tell me about a production outage you handled. What was your process?",
        difficulty: "Hard",
      },
      { text: "Describe a time you improved a system's reliability.", difficulty: "Medium" },
      {
        text: "How do you prioritize when multiple critical bugs are reported at once?",
        difficulty: "Medium",
      },
      { text: "Give an example of when you automated a manual process.", difficulty: "Easy" },
      {
        text: "Tell me about a time you had to collaborate across teams to deliver a feature.",
        difficulty: "Easy",
      },
    ],
    technical: [
      { text: "Explain the Node.js event loop and its phases.", difficulty: "Hard" },
      {
        text: "What is the difference between process.nextTick and setImmediate?",
        difficulty: "Hard",
      },
      {
        text: "How do you handle database connections and connection pooling in Node.js?",
        difficulty: "Medium",
      },
      {
        text: "Explain middleware in Express.js and how you would implement authentication.",
        difficulty: "Medium",
      },
      { text: "What are streams in Node.js and when would you use them?", difficulty: "Medium" },
      { text: "How do you handle errors in async/await code?", difficulty: "Easy" },
      { text: "Explain clustering in Node.js and why it's useful.", difficulty: "Medium" },
      { text: "What is the purpose of package-lock.json?", difficulty: "Easy" },
      { text: "How do you handle file uploads efficiently in Node.js?", difficulty: "Medium" },
      { text: "What is the difference between spawn, exec, and fork?", difficulty: "Hard" },
      {
        text: "How do you implement rate limiting in an Express application?",
        difficulty: "Medium",
      },
      { text: "Explain JWT authentication and how you implement it.", difficulty: "Easy" },
    ],
    systemDesign: [
      { text: "Design a URL shortener service like bit.ly.", difficulty: "Hard" },
      { text: "How would you design a chat application backend?", difficulty: "Hard" },
      { text: "Design a job scheduling system.", difficulty: "Hard" },
      { text: "How would you architect a real-time notification service?", difficulty: "Hard" },
      { text: "Design a rate limiter for a public API.", difficulty: "Hard" },
    ],
  },
  Python: {
    behavioral: [
      {
        text: "Tell me about a Python project you're most proud of. What made it successful?",
        difficulty: "Easy",
      },
      {
        text: "Describe a time you had to debug a complex issue in production.",
        difficulty: "Medium",
      },
      { text: "How do you ensure code quality in your Python projects?", difficulty: "Easy" },
      {
        text: "Tell me about a time you optimized a Python application for performance.",
        difficulty: "Hard",
      },
      {
        text: "Describe a situation where you had to choose between multiple libraries for the same task.",
        difficulty: "Medium",
      },
    ],
    technical: [
      {
        text: "Explain the difference between a generator and an iterator in Python.",
        difficulty: "Medium",
      },
      { text: "What are Python decorators and how do you implement one?", difficulty: "Medium" },
      {
        text: "Explain the GIL (Global Interpreter Lock) and its impact on concurrency.",
        difficulty: "Hard",
      },
      {
        text: "What is the difference between a list and a generator comprehension?",
        difficulty: "Easy",
      },
      { text: "How do you handle memory management in Python?", difficulty: "Medium" },
      { text: "Explain metaclasses in Python and when you might use one.", difficulty: "Hard" },
      { text: "What are context managers and how do you create one?", difficulty: "Medium" },
      { text: "How does Python's type hinting work, and why is it useful?", difficulty: "Easy" },
      {
        text: "Explain async/await in Python and when to use asyncio vs. threading.",
        difficulty: "Hard",
      },
      { text: "What is the difference between __str__ and __repr__?", difficulty: "Easy" },
      { text: "How do you profile and optimize a slow Python script?", difficulty: "Medium" },
      { text: "Explain dependency injection in Python frameworks.", difficulty: "Medium" },
    ],
    systemDesign: [
      {
        text: "Design a data pipeline that processes millions of records daily.",
        difficulty: "Hard",
      },
      { text: "How would you architect a machine learning serving platform?", difficulty: "Hard" },
      {
        text: "Design a REST API with proper caching, pagination, and rate limiting.",
        difficulty: "Hard",
      },
      { text: "How would you build a real-time data streaming platform?", difficulty: "Hard" },
      { text: "Design an ETL system for migrating data between databases.", difficulty: "Hard" },
    ],
  },
  Java: {
    behavioral: [
      {
        text: "Tell me about a time you refactored legacy Java code. What was your strategy?",
        difficulty: "Medium",
      },
      {
        text: "Describe a situation where you had to optimize a Java application for memory usage.",
        difficulty: "Hard",
      },
      {
        text: "How do you approach code reviews? Give an example of meaningful feedback you gave.",
        difficulty: "Easy",
      },
      {
        text: "Tell me about a production incident involving a Java application.",
        difficulty: "Hard",
      },
      {
        text: "Describe a time you introduced a new practice or tool to your team.",
        difficulty: "Easy",
      },
    ],
    technical: [
      { text: "Explain the JVM memory model and garbage collection.", difficulty: "Hard" },
      {
        text: "What is the difference between an interface and an abstract class in Java?",
        difficulty: "Easy",
      },
      { text: "Explain the Java Stream API with examples.", difficulty: "Medium" },
      {
        text: "What are the SOLID principles? Give a Java example for each.",
        difficulty: "Medium",
      },
      {
        text: "How does Java's HashMap work internally? What happens during a collision?",
        difficulty: "Hard",
      },
      { text: "Explain synchronized vs. volatile in Java concurrency.", difficulty: "Hard" },
      { text: "What is the difference between == and .equals() in Java?", difficulty: "Easy" },
      { text: "Explain Java's Exception hierarchy and best practices.", difficulty: "Medium" },
      { text: "How do you implement a custom annotation in Java?", difficulty: "Hard" },
      { text: "What are Java records and sealed classes?", difficulty: "Medium" },
      { text: "Explain dependency injection in Spring Boot.", difficulty: "Medium" },
      { text: "How do you test Java applications? Explain JUnit and Mockito.", difficulty: "Easy" },
    ],
    systemDesign: [
      {
        text: "Design a distributed caching system for a Java microservices architecture.",
        difficulty: "Hard",
      },
      {
        text: "How would you design a high-throughput order processing system?",
        difficulty: "Hard",
      },
      { text: "Design a message queue system from scratch.", difficulty: "Hard" },
      {
        text: "How would you architect a multi-tenant SaaS application in Java?",
        difficulty: "Hard",
      },
      { text: "Design a real-time bidding platform.", difficulty: "Hard" },
    ],
  },
};

const ALL_QUESTIONS: { behavioral: Question[]; technical: Question[]; systemDesign: Question[] } = {
  behavioral: [
    { text: "Tell me about yourself and your journey as a software engineer.", difficulty: "Easy" },
    {
      text: "Describe your most challenging project and how you overcame obstacles.",
      difficulty: "Medium",
    },
    {
      text: "How do you handle disagreements with your manager or team members?",
      difficulty: "Medium",
    },
    { text: "Tell me about a time you failed. What did you learn?", difficulty: "Medium" },
    { text: "How do you stay current with new technologies?", difficulty: "Easy" },
    {
      text: "Describe a time you had to make a decision with incomplete information.",
      difficulty: "Hard",
    },
  ],
  technical: [
    { text: "Explain the difference between TCP and UDP.", difficulty: "Easy" },
    { text: "What are microservices? What are the tradeoffs vs. monoliths?", difficulty: "Medium" },
    {
      text: "Explain REST vs. GraphQL. When would you choose one over the other?",
      difficulty: "Medium",
    },
    {
      text: "How does a hash table work? What is the time complexity for operations?",
      difficulty: "Medium",
    },
    { text: "Explain the CAP theorem.", difficulty: "Hard" },
    { text: "What is a database index? How does a B-tree index work?", difficulty: "Medium" },
    {
      text: "How do you handle authentication and authorization in web applications?",
      difficulty: "Medium",
    },
    { text: "What is the difference between horizontal and vertical scaling?", difficulty: "Easy" },
  ],
  systemDesign: [
    { text: "Design a social media feed system.", difficulty: "Hard" },
    { text: "Design a ride-sharing service like Uber.", difficulty: "Hard" },
    { text: "Design a video streaming platform like YouTube.", difficulty: "Hard" },
    { text: "How would you design a globally distributed database?", difficulty: "Hard" },
    { text: "Design a search autocomplete system.", difficulty: "Hard" },
  ],
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "#10b981",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

export function InterviewQuestionBank() {
  const [stack, setStack] = useState("");
  const [selectedStack, setSelectedStack] = useState<string>("");
  const [activeCategories, setActiveCategories] = useState<string[]>(["behavioral"]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { color } = useToolAccent();

  const stacks = ["React", "Node", "Python", "Java", "Custom"];

  const questions = useMemo(() => {
    if (stack === "Custom" || !stack) return ALL_QUESTIONS;
    return QUESTIONS_BY_STACK[stack] || ALL_QUESTIONS;
  }, [stack]);

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const toggleExpanded = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allQuestionsText = useMemo(() => {
    const lines: string[] = [];
    const cats: Array<{ key: string; label: string }> = [
      { key: "behavioral", label: "Behavioral" },
      { key: "technical", label: "Technical" },
      { key: "systemDesign", label: "System Design" },
    ];
    for (const cat of cats) {
      const qs = questions[cat.key as keyof typeof questions];
      if (qs.length === 0) continue;
      lines.push(`--- ${cat.label.toUpperCase()} ---`);
      qs.forEach((q, i) => {
        lines.push(`${i + 1}. [${q.difficulty}] ${q.text}`);
      });
      lines.push("");
    }
    return lines.join("\n");
  }, [questions]);

  const categoryLabels: Record<string, string> = {
    behavioral: "Behavioral",
    technical: "Technical",
    systemDesign: "System Design",
  };

  return (
    <ToolLayout id="interview-question-bank">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Tech Stack
          </span>
          <div className="flex flex-wrap gap-2">
            {stacks.map((s) => (
              <button
                key={s}
                onClick={() => setStack(s)}
                className="rounded-md border-2 px-3 py-2 font-mono text-xs font-medium transition-all"
                style={
                  stack === s
                    ? { borderColor: color, backgroundColor: color, color: "#fff" }
                    : { borderColor: "var(--border)" }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Categories
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleCategory(key)}
                className="rounded-md border-2 px-3 py-2 font-mono text-xs font-medium transition-all"
                style={
                  activeCategories.includes(key)
                    ? { borderColor: color, backgroundColor: color, color: "#fff" }
                    : { borderColor: "var(--border)" }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <CopyButton text={allQuestionsText} />
        <span className="font-mono text-xs text-muted">
          {questions.behavioral.length + questions.technical.length + questions.systemDesign.length}{" "}
          questions total
        </span>
      </div>

      {activeCategories.map((cat) => {
        const qs = questions[cat as keyof typeof questions];
        if (qs.length === 0) return null;
        const sectionKey = `section-${cat}`;
        const isExpanded = expanded[sectionKey] !== false;

        return (
          <div key={cat} className="rounded-md border-2 border-line bg-input-bg">
            <button
              onClick={() => toggleExpanded(sectionKey)}
              className="flex w-full items-center justify-between p-4 font-mono text-sm font-medium text-input-text"
            >
              <span className="flex items-center gap-2">
                {categoryLabels[cat]}
                <span className="rounded-full bg-line px-2 py-0.5 text-xs text-muted">
                  {qs.length}
                </span>
              </span>
              <svg
                className="h-4 w-4 text-muted transition-transform"
                style={{ transform: isExpanded ? "rotate(180deg)" : undefined }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="border-t border-line px-4 pb-4">
                {qs.map((q, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 border-b border-line/50 py-3 last:border-b-0"
                  >
                    <span className="mt-0.5 font-mono text-xs text-muted">{i + 1}.</span>
                    <div className="flex-1">
                      <p className="font-mono text-sm text-input-text">{q.text}</p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 font-mono text-xs font-medium"
                      style={{
                        backgroundColor: `${DIFFICULTY_COLORS[q.difficulty]}20`,
                        color: DIFFICULTY_COLORS[q.difficulty],
                      }}
                    >
                      {q.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {activeCategories.length === 0 && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Select a category above to view questions
        </div>
      )}
    </ToolLayout>
  );
}
