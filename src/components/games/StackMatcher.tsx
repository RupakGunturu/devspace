import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useSaveGameScore } from "@/hooks/useSaveGameScore";

interface Option {
  label: string;
  techs: string[];
  primary?: boolean;
}

interface Challenge {
  company: string;
  emoji: string;
  color: string;
  desc: string;
  correct: number;
  options: Option[];
  explain: string;
  funfact: string;
}

const TC: Record<string, string> = {
  React: "#61dafb",
  Vue: "#42b883",
  Angular: "#dd1b16",
  "Node.js": "#339933",
  Python: "#3776ab",
  Java: "#f89820",
  Go: "#00aed8",
  Ruby: "#cc342d",
  Scala: "#dc322f",
  Erlang: "#a90533",
  Rust: "#ce412b",
  Elixir: "#9a42c8",
  "C++": "#00599c",
  PHP: "#777bb4",
  TypeScript: "#3178c6",
  PostgreSQL: "#336791",
  MySQL: "#4479a1",
  MongoDB: "#47a248",
  Cassandra: "#1287b1",
  Redis: "#dc382d",
  Elasticsearch: "#f04e98",
  DynamoDB: "#4053d6",
  BigTable: "#4285f4",
  Memcached: "#8e7cc3",
  AWS: "#ff9900",
  GCP: "#4285f4",
  Azure: "#0089d6",
  Kafka: "#6cc24a",
  GraphQL: "#e10098",
  WebRTC: "#00aed8",
  WebAssembly: "#654ff0",
  Docker: "#2496ed",
  Kubernetes: "#326ce5",
  Hadoop: "#f5c518",
  FreeBSD: "#ab2b28",
  XMPP: "#5a91d4",
  Rails: "#cc0000",
  Django: "#44b78b",
  Spring: "#6db33f",
  Spark: "#e25a1c",
  gRPC: "#244c5a",
  Celery: "#a9cc54",
};

const COMPANY_SLUGS: Record<string, string> = {
  Netflix: "netflix",
  Spotify: "spotify",
  Instagram: "instagram",
  Discord: "discord",
  Airbnb: "airbnb",
  GitHub: "github",
  WhatsApp: "whatsapp",
  "Twitter / X": "x",
  Uber: "uber",
  LinkedIn: "linkedin",
  Figma: "figma",
  Notion: "notion",
};

function CompanyLogo({ company, size }: { company: string; size?: number }) {
  const s = size ?? 72;
  const slug = COMPANY_SLUGS[company];
  if (!slug) return null;
  return (
    <img
      src={`https://cdn.jsdelivr.net/npm/simple-icons@14/icons/${slug}.svg`}
      alt={`${company} logo`}
      width={s}
      height={s}
      className="object-contain"
      style={{ filter: "var(--logo-filter, none)" }}
    />
  );
}

const CHALLENGES: Challenge[] = [
  {
    company: "Netflix",
    emoji: "🎬",
    color: "#e50914",
    desc: "World's largest video streaming service — 260M subscribers, 190 countries",
    correct: 0,
    options: [
      { label: "Option A", techs: ["React", "Java", "Cassandra", "AWS"], primary: true },
      { label: "Option B", techs: ["Angular", "PHP", "MySQL", "Azure"] },
      { label: "Option C", techs: ["Vue", "Python", "PostgreSQL", "GCP"] },
      { label: "Option D", techs: ["React", "Go", "MongoDB", "Kubernetes"] },
    ],
    explain:
      "Netflix uses React for their frontend and Java microservices on the backend. Cassandra handles their massive distributed data needs and everything runs on AWS — they're one of AWS's largest customers and even open-sourced many tools like Hystrix and Zuul.",
    funfact:
      "💡 Netflix open-sourced their Chaos Monkey tool — it randomly kills servers in production to test resilience.",
  },
  {
    company: "Spotify",
    emoji: "🎵",
    color: "#1db954",
    desc: "Audio streaming platform — 600M users, 100M+ songs, 100M+ podcast episodes",
    correct: 2,
    options: [
      { label: "Option A", techs: ["Vue", "Ruby", "MongoDB", "AWS"] },
      { label: "Option B", techs: ["Angular", "Go", "Cassandra", "Azure"] },
      { label: "Option C", techs: ["React", "Python", "Java", "GCP"], primary: true },
      { label: "Option D", techs: ["React", "Node.js", "MySQL", "Docker"] },
    ],
    explain:
      "Spotify runs on React for the web client and uses Python and Java heavily on the backend. They migrated from AWS to Google Cloud (GCP) in 2016 — one of the most famous cloud migrations. They also use Kafka extensively for event streaming between their microservices.",
    funfact:
      '💡 Spotify pioneered the "squad model" — small autonomous engineering teams. It became a template the whole industry copied.',
  },
  {
    company: "Instagram",
    emoji: "📸",
    color: "#c13584",
    desc: "Photo and video sharing platform — 2B monthly active users, owned by Meta",
    correct: 1,
    options: [
      { label: "Option A", techs: ["Ruby", "Rails", "MySQL", "GCP"] },
      { label: "Option B", techs: ["Python", "Django", "PostgreSQL", "AWS"], primary: true },
      { label: "Option C", techs: ["Node.js", "Express", "MongoDB", "Azure"] },
      { label: "Option D", techs: ["Java", "Spring", "Cassandra", "AWS"] },
    ],
    explain:
      "Instagram was famously built on Python and Django from day one. They stuck with it at massive scale, which proved Python can handle billions of users. PostgreSQL manages their relational data and the whole thing runs on AWS.",
    funfact:
      "💡 Instagram launched in 2010 with just 13 engineers. They had 30M users before adding their first backend engineer.",
  },
  {
    company: "Discord",
    emoji: "💬",
    color: "#5865f2",
    desc: "Real-time communication platform — 500M accounts, 19M active servers daily",
    correct: 3,
    options: [
      { label: "Option A", techs: ["Vue", "Node.js", "MongoDB", "Redis"] },
      { label: "Option B", techs: ["Angular", "Go", "MySQL", "AWS"] },
      { label: "Option C", techs: ["React", "Python", "PostgreSQL", "Firebase"] },
      { label: "Option D", techs: ["React", "Elixir", "Cassandra", "WebRTC"], primary: true },
    ],
    explain:
      "Discord started with Node.js but switched to Elixir for their real-time messaging because of its concurrency model. They use Cassandra for message storage and WebRTC for audio/video calls. In 2023 they migrated parts of their backend from Go to Rust for performance.",
    funfact:
      "💡 Discord stores trillions of messages. They wrote a famous engineering blog post about switching from MongoDB to Cassandra to handle it.",
  },
  {
    company: "Airbnb",
    emoji: "🏠",
    color: "#ff5a5f",
    desc: "Home-sharing marketplace — 7M+ listings in 220+ countries",
    correct: 0,
    options: [
      { label: "Option A", techs: ["React", "Ruby", "MySQL", "AWS"], primary: true },
      { label: "Option B", techs: ["Vue", "Python", "MongoDB", "GCP"] },
      { label: "Option C", techs: ["Angular", "Java", "PostgreSQL", "Azure"] },
      { label: "Option D", techs: ["React", "Node.js", "Cassandra", "Docker"] },
    ],
    explain:
      "Airbnb built their backend on Ruby on Rails — a choice that worked well through hypergrowth. They use React (and previously React Native, which they built many open-source tools for) on the frontend, MySQL for data, and run on AWS.",
    funfact:
      "💡 Airbnb built and then open-sourced a tool called Lottie — it converts After Effects animations to mobile. Used by millions of apps.",
  },
  {
    company: "GitHub",
    emoji: "🐙",
    color: "#6e5494",
    desc: "Code hosting platform — 100M developers, 420M+ repositories",
    correct: 2,
    options: [
      { label: "Option A", techs: ["Python", "Django", "PostgreSQL", "MongoDB"] },
      { label: "Option B", techs: ["Go", "Node.js", "Redis", "Firebase"] },
      { label: "Option C", techs: ["Ruby", "Rails", "MySQL", "Elasticsearch"], primary: true },
      { label: "Option D", techs: ["Java", "Spring", "Cassandra", "AWS"] },
    ],
    explain:
      "GitHub was built on Ruby on Rails from the start and never fully moved away — a testament to Rails' ability to scale. MySQL stores their data and Elasticsearch powers code search. After Microsoft acquired them in 2018, they also integrated Azure services.",
    funfact:
      "💡 GitHub itself is hosted on GitHub. They also run the world's largest open-source contribution event — GitHub Arctic Code Vault stores code under Arctic ice.",
  },
  {
    company: "WhatsApp",
    emoji: "💚",
    color: "#25d366",
    desc: "Messaging app — 2B users, 100B messages per day, owned by Meta",
    correct: 1,
    options: [
      { label: "Option A", techs: ["Node.js", "MongoDB", "Redis", "WebSockets"] },
      { label: "Option B", techs: ["Erlang", "FreeBSD", "MySQL", "XMPP"], primary: true },
      { label: "Option C", techs: ["Go", "Python", "PostgreSQL", "gRPC"] },
      { label: "Option D", techs: ["Java", "Cassandra", "Kafka", "AWS"] },
    ],
    explain:
      "WhatsApp's choice of Erlang is legendary in the industry. Erlang was designed at Ericsson for telecom systems that can never go down. A single WhatsApp server handles over 2 million connections. This is why they could serve 500M users with just 50 engineers.",
    funfact:
      "💡 When Facebook bought WhatsApp for $19 billion in 2014, WhatsApp had 55 employees. That's $345M per employee.",
  },
  {
    company: "Twitter / X",
    emoji: "🐦",
    color: "#1d9bf0",
    desc: "Social media platform — 250M daily active users, 500M tweets per day",
    correct: 3,
    options: [
      { label: "Option A", techs: ["Vue", "Java", "PostgreSQL", "RabbitMQ"] },
      { label: "Option B", techs: ["Angular", "Go", "MongoDB", "Redis"] },
      { label: "Option C", techs: ["React", "Python", "Cassandra", "GCP"] },
      { label: "Option D", techs: ["React", "Scala", "MySQL", "Kafka"], primary: true },
    ],
    explain:
      'Twitter started on Ruby on Rails but famously hit the "Fail Whale" scaling issues. They rewrote core services in Scala (runs on JVM, handles concurrency well) and use Kafka for their event streaming. Their "fail whale" era taught the industry important lessons about scaling.',
    funfact:
      '💡 Twitter\'s original architecture is the reason "the fail whale" became a tech meme. It appeared when servers were overloaded in the early years.',
  },
  {
    company: "Uber",
    emoji: "🚗",
    color: "#000000",
    desc: "Ride-sharing platform — 130M monthly users, operates in 72 countries",
    correct: 2,
    options: [
      { label: "Option A", techs: ["Java", "Ruby", "PostgreSQL", "RabbitMQ"] },
      { label: "Option B", techs: ["Node.js", "Scala", "MongoDB", "Azure"] },
      { label: "Option C", techs: ["Go", "Python", "MySQL", "Kafka"], primary: true },
      { label: "Option D", techs: ["Elixir", "Java", "Cassandra", "Redis"] },
    ],
    explain:
      "Uber transitioned from Python to Go for performance-critical services because Go's concurrency model handles their real-time dispatch system far better. Python is used for data science and ML. Kafka manages the stream of location updates, trips, and pricing events.",
    funfact:
      "💡 Uber processes over 1 million writes per second across their databases. Their geospatial H3 indexing system (open-sourced) is now used in mapping applications worldwide.",
  },
  {
    company: "LinkedIn",
    emoji: "💼",
    color: "#0077b5",
    desc: "Professional networking platform — 1B members across 200 countries",
    correct: 0,
    options: [
      { label: "Option A", techs: ["React", "Java", "Kafka", "Hadoop"], primary: true },
      { label: "Option B", techs: ["Vue", "Python", "MongoDB", "Spark"] },
      { label: "Option C", techs: ["Angular", "Go", "MySQL", "RabbitMQ"] },
      { label: "Option D", techs: ["React", "Ruby", "PostgreSQL", "Redis"] },
    ],
    explain:
      "LinkedIn actually invented Apache Kafka internally before open-sourcing it — it was built to handle their activity stream data. They use Java for their backend services, Hadoop for big data processing, and have heavily contributed to open-source data infrastructure tooling.",
    funfact:
      "💡 LinkedIn created Kafka, Voldemort, and Azkaban — three widely-used open-source tools — all built to solve their own internal problems.",
  },
  {
    company: "Figma",
    emoji: "🎨",
    color: "#f24e1e",
    desc: "Collaborative design tool — 4M+ teams, real-time multiplayer editing in the browser",
    correct: 1,
    options: [
      { label: "Option A", techs: ["Vue", "Python", "WebGL", "TypeScript"] },
      { label: "Option B", techs: ["React", "Rust", "WebAssembly", "C++"], primary: true },
      { label: "Option C", techs: ["Angular", "Go", "OpenGL", "JavaScript"] },
      { label: "Option D", techs: ["React", "Java", "Canvas", "Electron"] },
    ],
    explain:
      "Figma built their rendering engine in C++ compiled to WebAssembly — this is how they achieve native-app performance inside a browser tab. The collaborative editing engine uses Operational Transforms (similar to Google Docs). They later rewrote parts in Rust for safety and performance.",
    funfact:
      "💡 Adobe tried to acquire Figma for $20B in 2022. Regulators blocked it as anticompetitive. It would have been the largest design-software acquisition ever.",
  },
  {
    company: "Notion",
    emoji: "📝",
    color: "#777777",
    desc: "All-in-one workspace — 30M+ users, used by teams at thousands of companies",
    correct: 3,
    options: [
      { label: "Option A", techs: ["Vue", "Python", "MongoDB", "GCP"] },
      { label: "Option B", techs: ["Angular", "Ruby", "MySQL", "Azure"] },
      { label: "Option C", techs: ["React", "Go", "Cassandra", "Heroku"] },
      { label: "Option D", techs: ["React", "Node.js", "PostgreSQL", "AWS"], primary: true },
    ],
    explain:
      "Notion runs a fairly standard but well-executed modern stack — React frontend, Node.js backend, PostgreSQL for their relational data, and AWS for infrastructure. Their engineering challenge is less about exotic tech choices and more about building a real-time collaborative block-based editor at scale.",
    funfact:
      "💡 Notion famously had a major outage in 2021 that lasted 10 hours. Their post-mortem was so honest and detailed it became a benchmark for how to communicate engineering failures.",
  },
];

const SEC = 25;
const TOTAL = CHALLENGES.length;

function getMult(s: number) {
  return s >= 3 ? 2.5 : s >= 2 ? 2.0 : s >= 1 ? 1.5 : 1.0;
}

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function TechBadge({ tech }: { tech: string }) {
  const color = TC[tech] ?? "#7d8590";
  return (
    <span
      className="inline-block rounded-[5px] border-[1.5px] px-2.5 py-0.5 font-mono text-[clamp(.65rem,1.8vw,.74rem)] font-semibold whitespace-nowrap transition-colors"
      style={{ borderColor: color, color: color }}
    >
      {tech}
    </span>
  );
}

export function StackMatcher() {
  const { save } = useSaveGameScore();
  const [phase, setPhase] = useState<"intro" | "game" | "end">("intro");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SEC);
  const [answered, setAnswered] = useState(false);
  const [order, setOrder] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<{ opt: Option; origIdx: number }[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ch = order.length > 0 ? CHALLENGES[order[round]] : null;
  const totalAnswered = useMemo(() => {
    let count = 0;
    for (let i = 0; i < round; i++) count++;
    if (answered) count++;
    return count;
  }, [round, answered]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const startGame = useCallback(() => {
    setScore(0);
    setRound(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setOrder(shuffle(CHALLENGES.map((_, i) => i)));
    setPhase("game");
  }, []);

  useEffect(() => {
    if (phase !== "game" || !ch || round >= TOTAL) return;
    setAnswered(false);
    setSelectedIdx(null);
    setShuffledOptions(shuffle(ch.options.map((opt, i) => ({ opt, origIdx: i }))));
    setTimeLeft(SEC);
    clearTimer();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearTimer();
  }, [phase, round, ch, clearTimer]);

  const handleTimeUp = useCallback(() => {
    setAnswered(true);
    clearTimer();
    setStreak(0);
  }, [clearTimer]);

  useEffect(() => {
    if (phase === "game" && timeLeft === 0 && !answered && ch) {
      handleTimeUp();
    }
  }, [timeLeft, phase, answered, ch, handleTimeUp]);

  const selectOption = useCallback(
    (origIdx: number) => {
      if (answered || !ch) return;
      setAnswered(true);
      setSelectedIdx(origIdx);
      clearTimer();

      const isCorrect = ch.options[origIdx]?.primary === true;

      if (isCorrect) {
        setCorrectCount((p) => p + 1);
        setStreak((s) => {
          const newStreak = s + 1;
          setBestStreak((b) => Math.max(b, newStreak));
          const mult = getMult(s);
          const gained = Math.round((100 + timeLeft * 4) * mult);
          setScore((sc) => sc + gained);
          return newStreak;
        });
      } else {
        setStreak(0);
      }
    },
    [answered, ch, clearTimer, timeLeft],
  );

  const nextRound = useCallback(() => {
    if (round + 1 >= TOTAL) {
      clearTimer();
      setPhase("end");
      save("stack-matcher", score, bestStreak);
    } else {
      setRound((r) => r + 1);
    }
  }, [round, clearTimer, score, bestStreak, save]);

  const timeStr = `${timeLeft}`;
  const timerPct = (timeLeft / SEC) * 100;
  const danger = timeLeft <= 7;
  const heroColor = ch ? (ch.color === "#000000" ? "#888888" : ch.color) : "#00ff88";

  if (phase === "intro") {
    return (
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-5 rounded-md border-2 border-line bg-paper p-8 text-center">
        <h2 className="font-display text-xl font-bold">Do you know what runs the internet?</h2>
        <p className="max-w-[400px] text-sm leading-relaxed text-muted">
          Every app you use daily is built on a specific set of technologies. Some choices will
          surprise you. Can you match each company to its real stack?
        </p>
        <div className="flex flex-wrap justify-center gap-2 max-w-[380px]">
          {["React", "Java", "Cassandra", "AWS"].map((t) => (
            <TechBadge key={t} tech={t} />
          ))}
          <span className="inline-block rounded-[5px] border border-line px-2.5 py-0.5 font-mono text-[clamp(.65rem,1.8vw,.74rem)] font-semibold text-muted">
            ← Netflix
          </span>
        </div>
        <ul className="w-full max-w-[380px] space-y-1.5 rounded-lg border border-line bg-paper-dim p-4 text-left">
          {[
            ["🏢", "Company appears — pick the correct tech stack"],
            ["⏱", "25 seconds per round — 12 companies total"],
            ["⚡", "Correct = 100 pts + speed bonus (time × 4)"],
            ["🔥", "Build a streak for a score multiplier up to ×2.5"],
            ["💡", "Each answer reveals why they made those choices"],
          ].map(([icon, text]) => (
            <li key={text} className="flex gap-2.5 text-sm text-muted">
              <span className="min-w-[22px] font-bold text-green">{icon}</span>
              {text}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={startGame}
          className="rounded-md border-0 bg-green px-11 py-3 text-sm font-bold text-ink transition-all hover:opacity-85 hover:-translate-y-0.5"
        >
          Start Matching →
        </button>
      </div>
    );
  }

  if (phase === "end") {
    const totalAnsweredCount = TOTAL;
    const acc = totalAnsweredCount > 0 ? Math.round((correctCount / totalAnsweredCount) * 100) : 0;
    const max = TOTAL * (100 + SEC * 4) * 2.5;
    const pct = score / max;
    let rank: string;
    let msg: string;
    if (pct >= 0.82) {
      rank = "🏆 Principal Engineer";
      msg =
        "You know the real-world stacks cold. This knowledge separates junior devs from seniors.";
    } else if (pct >= 0.6) {
      rank = "🥈 Senior Dev";
      msg = "Solid foundation. You know the popular ones — the exotic choices tripped you up.";
    } else if (pct >= 0.38) {
      rank = "🥉 Mid-level Dev";
      msg = "You know the tech. Learning why companies choose it is the next step.";
    } else {
      rank = "🐛 Tutorial Dev";
      msg =
        'Real-world stacks are surprising! Read the "why" in each round — that\'s where the learning is.';
    }

    return (
      <div className="mx-auto flex max-w-[500px] flex-col items-center gap-4 rounded-md border-2 border-line bg-paper p-8 text-center">
        <div className="text-4xl">🏆</div>
        <h2 className="font-display text-2xl font-bold">Stack Check Complete!</h2>
        <div className="font-mono text-6xl font-bold text-green">{score}</div>
        <div className="rounded-lg border border-green bg-green/5 px-5 py-2 text-sm font-semibold text-green">
          {rank}
        </div>
        <div className="grid w-full max-w-[340px] grid-cols-3 gap-2.5">
          {[
            { val: `${correctCount}/${TOTAL}`, lbl: "Correct" },
            { val: String(bestStreak), lbl: "Best Streak" },
            { val: `${acc}%`, lbl: "Accuracy" },
          ].map((s) => (
            <div
              key={s.lbl}
              className="rounded-lg border border-line bg-paper-dim p-2.5 text-center"
            >
              <div className="text-[10px] uppercase tracking-wider text-muted">{s.lbl}</div>
              <div className="mt-1 font-mono text-sm font-bold text-foreground">{s.val}</div>
            </div>
          ))}
        </div>
        <p className="max-w-[320px] text-sm leading-relaxed text-muted">{msg}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {order.map((i) => (
            <div key={i} title={CHALLENGES[i].company}>
              <CompanyLogo company={CHALLENGES[i].company} size={36} />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={startGame}
          className="rounded-md border-0 bg-green px-11 py-3 text-sm font-bold text-ink transition-all hover:opacity-85"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[740px] flex-col gap-5">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 max-sm:grid-cols-2">
        {[
          { lbl: "Score", val: String(score), cls: "text-green" },
          { lbl: "🔥 Streak", val: `×${getMult(streak).toFixed(1)}`, cls: "text-[var(--yellow)]" },
          { lbl: "Round", val: `${round + 1}/${TOTAL}`, cls: "text-[#79c0ff]" },
          { lbl: "Time", val: timeStr, cls: danger ? "text-coral" : "" },
        ].map((s) => (
          <div
            key={s.lbl}
            className={cn(
              "rounded-md border border-line bg-paper px-2 py-2.5 text-center",
              s.lbl === "Time" && danger && "border-coral",
            )}
          >
            <div className="text-[10px] uppercase tracking-wider text-muted">{s.lbl}</div>
            <div className={cn("mt-0.5 font-mono text-lg font-bold", s.cls)}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Timer bar */}
      <div className="h-1 rounded-full bg-line overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 linear",
            danger ? "bg-coral" : "bg-green",
          )}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Company Hero */}
      <div
        className="relative flex flex-col items-center gap-3 overflow-hidden rounded-md border-[1.5px] border-line bg-paper px-6 py-10 text-center transition-colors"
        style={{ borderColor: heroColor + "55" }}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[70px] transition-colors"
          style={{ background: heroColor }}
        />
        <div className="relative z-10 flex items-center justify-center leading-none animate-[popIn_0.3s_cubic-bezier(.34,1.56,.64,1)]">
          <CompanyLogo company={ch?.company ?? ""} />
        </div>
        <div
          className="relative z-10 text-[clamp(1.6rem,5vw,2.8rem)] font-bold leading-none"
          style={{ color: heroColor }}
        >
          {ch?.company}
        </div>
        <div className="relative z-10 max-w-[360px] text-[clamp(.78rem,2vw,.88rem)] leading-relaxed text-muted">
          {ch?.desc}
        </div>
        <div className="relative z-10 mt-1 flex items-center gap-2 text-xs text-muted">
          <span className="h-px flex-1 bg-line" />
          Which tech stack powers this company?
          <span className="h-px flex-1 bg-line" />
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-sm:grid-cols-1">
        {shuffledOptions.map(({ opt, origIdx }, i) => {
          const isPicked = selectedIdx === origIdx;
          const isCorrectOpt = answered && opt.primary === true;
          const isWrong = isPicked && !opt.primary;
          const dim = answered && !isCorrectOpt && !isWrong;
          const letters = ["A", "B", "C", "D"];

          return (
            <button
              key={`${round}-${origIdx}`}
              type="button"
              onClick={() => selectOption(origIdx)}
              disabled={answered}
              className={cn(
                "flex flex-col gap-2.5 rounded-md border-[1.5px] border-line bg-paper p-4 text-left transition-all",
                "hover:not-disabled:border-green hover:not-disabled:bg-paper-dim hover:not-disabled:-translate-y-0.5",
                "disabled:cursor-default",
                isCorrectOpt && "!border-green !bg-green/5",
                isWrong && "!border-coral !bg-coral/5",
                dim && "opacity-30",
              )}
            >
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted">
                <span>{letters[i]}</span>
                {isCorrectOpt && <span className="text-sm font-bold text-green">✅ Correct</span>}
                {isWrong && <span className="text-sm font-bold text-coral">❌</span>}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {opt.techs.map((t) => (
                  <TechBadge key={t} tech={t} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && ch && (
        <div
          className={cn(
            "animate-[fadeUp_0.3s_ease] rounded-md border p-4 text-sm",
            selectedIdx !== null && ch.options[selectedIdx]?.primary === true
              ? "border-green bg-green/5 text-green"
              : "border-coral bg-coral/5 text-coral",
          )}
        >
          <strong className="mb-1 block text-base">
            {selectedIdx !== null && ch.options[selectedIdx]?.primary === true
              ? `✅ Correct! +${Math.round((100 + timeLeft * 4) * getMult(streak - 1))} pts${timeLeft >= 20 ? " ⚡ Fast!" : ""}`
              : timeLeft === 0
                ? "⏰ Time's up!"
                : "❌ Not quite."}
          </strong>
          <div className="mt-2 border-t border-line pt-2 text-foreground leading-relaxed">
            {ch.explain}
          </div>
          <div className="mt-1.5 text-xs italic text-foreground">{ch.funfact}</div>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button
          type="button"
          onClick={nextRound}
          className="w-full rounded-md border-[1.5px] border-line bg-paper px-4 py-3 text-sm font-semibold text-foreground transition-all hover:border-green hover:text-green"
        >
          {round + 1 < TOTAL ? "Next Company →" : "See Results"}
        </button>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes popIn {
          from { transform: scale(.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
