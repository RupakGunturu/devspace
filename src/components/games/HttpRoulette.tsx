import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useSaveGameScore } from "@/hooks/useSaveGameScore";

interface Option {
  title: string;
  desc: string;
}

interface Challenge {
  code: number;
  correct: number;
  options: Option[];
  explanation: string;
  tip: string;
}

const FAMILY_COLORS: Record<string, string> = {
  green: "#00ff88",
  blue: "#79c0ff",
  orange: "#ffa657",
  red: "#ff4d6d",
};

function getAccent(code: number) {
  if (code < 300) return FAMILY_COLORS.green;
  if (code < 400) return FAMILY_COLORS.blue;
  if (code < 500) return FAMILY_COLORS.orange;
  return FAMILY_COLORS.red;
}

function getCatLabel(code: number) {
  if (code < 300) return "2xx — Success";
  if (code < 400) return "3xx — Redirect";
  if (code < 500) return "4xx — Client Error";
  return "5xx — Server Error";
}

function getFamilyKey(code: number) {
  if (code < 300) return "green";
  if (code < 400) return "blue";
  if (code < 500) return "orange";
  return "red";
}

const CHALLENGES: Challenge[] = [
  {
    code: 200,
    correct: 0,
    options: [
      { title: "OK", desc: "Request succeeded. Response body contains the requested data." },
      { title: "Created", desc: "A new resource was successfully created by the server." },
      { title: "Accepted", desc: "Request received but processing has not been completed yet." },
      {
        title: "No Content",
        desc: "Request succeeded but the server has nothing to send back.",
      },
    ],
    explanation:
      "200 is the baseline success. The server understood, processed, and returned your request. You see this thousands of times a day.",
    tip: '💡 Remember: 200 = "Yes, here you go."',
  },
  {
    code: 201,
    correct: 2,
    options: [
      { title: "OK", desc: "Standard success — the request was completed normally." },
      {
        title: "Accepted",
        desc: "Request queued but not yet acted on by the server.",
      },
      {
        title: "Created",
        desc: "A new resource was just created. Common after POST requests.",
      },
      {
        title: "No Content",
        desc: "Request succeeded, but the server returned an empty body.",
      },
    ],
    explanation:
      "201 is returned after a successful POST or PUT that created something new. The Location header usually points to the new resource.",
    tip: "💡 Register a user → 201. Login → 200.",
  },
  {
    code: 204,
    correct: 1,
    options: [
      {
        title: "OK",
        desc: "Request succeeded with data in the response body.",
      },
      {
        title: "No Content",
        desc: "Request succeeded but there is nothing to return. Common after DELETE.",
      },
      {
        title: "Not Found",
        desc: "The requested resource could not be found on the server.",
      },
      {
        title: "Reset Content",
        desc: "Client should reset the document view that sent this request.",
      },
    ],
    explanation:
      '204 means "I did what you asked, but I have nothing to say about it." Very common on DELETE requests — the item is gone, nothing to return.',
    tip: "💡 DELETE → 204. The silence is the confirmation.",
  },
  {
    code: 301,
    correct: 3,
    options: [
      {
        title: "Found",
        desc: "Temporary redirect — the resource is at a different URI right now.",
      },
      {
        title: "Not Modified",
        desc: "Your cached version is still good. No need to re-download.",
      },
      {
        title: "Temporary Redirect",
        desc: "Same as 302 but method must not change to GET.",
      },
      {
        title: "Moved Permanently",
        desc: "This URL is gone forever. All future requests should go to the new Location.",
      },
    ],
    explanation:
      "301 tells the browser (and Google) that the page has permanently moved. The new URL is in the Location header. Browsers cache this redirect automatically.",
    tip: "💡 HTTP → HTTPS redirects are usually 301s.",
  },
  {
    code: 302,
    correct: 0,
    options: [
      {
        title: "Found",
        desc: "Temporary redirect — come back to the original URL later.",
      },
      {
        title: "Moved Permanently",
        desc: "The resource has a new permanent home — update your bookmarks.",
      },
      {
        title: "See Other",
        desc: "Redirect to a different URI, always using GET method.",
      },
      {
        title: "Not Modified",
        desc: "The cached version is still valid, no download needed.",
      },
    ],
    explanation:
      "302 is a temporary redirect — \"it's somewhere else right now, but come back here later.\" Unlike 301, it isn't cached permanently and the original URL remains valid.",
    tip: "💡 Login → redirect to dashboard = 302.",
  },
  {
    code: 304,
    correct: 2,
    options: [
      {
        title: "No Content",
        desc: "Request succeeded but server has nothing to return.",
      },
      {
        title: "Bad Request",
        desc: "Server could not understand the request due to invalid syntax.",
      },
      {
        title: "Not Modified",
        desc: "Your cached copy is still valid. The server saved bandwidth by not resending.",
      },
      {
        title: "Moved Permanently",
        desc: "The resource has permanently moved to a new URL.",
      },
    ],
    explanation:
      '304 is the browser saying "I have this cached — is it still good?" and the server replying "yes." No body is sent, just the headers. Huge bandwidth saver.',
    tip: "💡 If you're seeing 304s, your caching is working perfectly.",
  },
  {
    code: 400,
    correct: 1,
    options: [
      {
        title: "Unauthorized",
        desc: "No valid authentication credentials were provided.",
      },
      {
        title: "Bad Request",
        desc: "Server can't process the request due to malformed syntax or invalid data.",
      },
      {
        title: "Unprocessable Entity",
        desc: "Request is well-formed but contains semantic errors (e.g. validation failed).",
      },
      {
        title: "Not Found",
        desc: "The requested resource does not exist on this server.",
      },
    ],
    explanation:
      '400 means "I can\'t even read what you sent me." Malformed JSON, wrong Content-Type, missing required fields — the request itself is broken before the server can do anything with it.',
    tip: "💡 400 = your code sent garbage. 422 = your code sent valid JSON with wrong values.",
  },
  {
    code: 401,
    correct: 3,
    options: [
      {
        title: "Forbidden",
        desc: "Server understood the request but refuses to authorize it.",
      },
      {
        title: "Bad Request",
        desc: "Request was malformed and could not be understood.",
      },
      {
        title: "Not Found",
        desc: "The resource does not exist at this URL.",
      },
      {
        title: "Unauthorized",
        desc: "Authentication is required and has not been provided or is invalid.",
      },
    ],
    explanation:
      '401 means "who are you?" — you\'re not logged in, your token expired, or your credentials are wrong. Despite the name "Unauthorized," it\'s really about authentication, not authorization.',
    tip: "💡 401 = not logged in. 403 = logged in but blocked. Classic confusion.",
  },
  {
    code: 403,
    correct: 0,
    options: [
      {
        title: "Forbidden",
        desc: "Server understood the request, you're authenticated, but you don't have permission.",
      },
      {
        title: "Unauthorized",
        desc: "No valid credentials — please authenticate first.",
      },
      {
        title: "Gone",
        desc: "The resource existed but has been permanently deleted.",
      },
      {
        title: "Not Found",
        desc: "No resource found at this URL on the server.",
      },
    ],
    explanation:
      '403 means "I know who you are, and the answer is still no." You\'re authenticated but not authorized. A regular user hitting an admin endpoint gets a 403.',
    tip: "💡 Hiding a resource? Return 404 instead of 403 to avoid revealing it exists.",
  },
  {
    code: 404,
    correct: 2,
    options: [
      {
        title: "Gone",
        desc: "The resource existed before but has been permanently removed.",
      },
      {
        title: "Forbidden",
        desc: "The server knows the resource exists but won't let you access it.",
      },
      {
        title: "Not Found",
        desc: "Nothing exists at this URL — the resource has never been here or was removed.",
      },
      {
        title: "Bad Request",
        desc: "The request URL was malformed or contained invalid characters.",
      },
    ],
    explanation:
      '404 is the most famous status code on the web. It simply means "nothing here." The server is reachable, the route doesn\'t match anything. Check your URL.',
    tip: "💡 404 doesn't mean the server is down — it means that specific page isn't there.",
  },
  {
    code: 429,
    correct: 1,
    options: [
      {
        title: "Service Unavailable",
        desc: "Server is temporarily down due to overload or maintenance.",
      },
      {
        title: "Too Many Requests",
        desc: "You've hit the rate limit. Slow down and retry after the Retry-After header time.",
      },
      {
        title: "Forbidden",
        desc: "Authenticated but your account lacks permission for this action.",
      },
      {
        title: "Bad Gateway",
        desc: "The upstream server returned an invalid response.",
      },
    ],
    explanation:
      "429 is the rate limiter talking. You've made too many requests in a given time window. The server usually sends a Retry-After header telling you when to try again.",
    tip: "💡 Hitting 429? Add exponential backoff to your retry logic.",
  },
  {
    code: 500,
    correct: 3,
    options: [
      {
        title: "Bad Gateway",
        desc: "The server received an invalid response from an upstream service.",
      },
      {
        title: "Service Unavailable",
        desc: "Server temporarily down — overloaded or under maintenance.",
      },
      {
        title: "Gateway Timeout",
        desc: "Upstream server took too long to respond.",
      },
      {
        title: "Internal Server Error",
        desc: "The server encountered an unexpected error. Something is broken on the backend.",
      },
    ],
    explanation:
      "500 is the server saying \"something went wrong on my end and I don't know what.\" It's the generic backend error — check your server logs, not your request.",
    tip: "💡 500 = not your fault (usually). 400 = your fault.",
  },
];

const SEC = 20;
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

const SPIN_CODES = [200, 301, 404, 500, 201, 403, 302, 204, 429, 503, 400, 401, 304, 410, 422, 502];

export function HttpRoulette() {
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
  const [spinning, setSpinning] = useState(true);
  const [displayCode, setDisplayCode] = useState(200);
  const [landed, setLanded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spinRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ch = order.length > 0 ? CHALLENGES[order[round]] : null;
  const accent = ch ? getAccent(ch.code) : FAMILY_COLORS.green;
  const catLabel = ch ? getCatLabel(ch.code) : "";
  const danger = timeLeft <= 6;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearSpin = useCallback(() => {
    if (spinRef.current) {
      clearInterval(spinRef.current);
      spinRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      clearTimer();
      clearSpin();
    },
    [clearTimer, clearSpin],
  );

  const spinIn = useCallback(
    (targetCode: number, cb: () => void) => {
      clearSpin();
      setSpinning(true);
      setLanded(false);
      let count = 0;
      const total = 14;
      spinRef.current = setInterval(() => {
        setDisplayCode(SPIN_CODES[count % SPIN_CODES.length]);
        count++;
        if (count >= total) {
          clearSpin();
          setDisplayCode(targetCode);
          setSpinning(false);
          setLanded(true);
          setTimeout(() => setLanded(false), 400);
          cb();
        }
      }, 55);
    },
    [clearSpin],
  );

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
    spinIn(ch.code, () => {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });
  }, [phase, round, ch, clearTimer, spinIn]);

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

      const isCorrect = origIdx === ch.correct;

      if (isCorrect) {
        setCorrectCount((p) => p + 1);
        setStreak((s) => {
          const newStreak = s + 1;
          setBestStreak((b) => Math.max(b, newStreak));
          const mult = getMult(s);
          const gained = Math.round((100 + timeLeft * 5) * mult);
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
      save("http-roulette", score, bestStreak);
    } else {
      setRound((r) => r + 1);
    }
  }, [round, clearTimer, score, bestStreak, save]);

  const timeStr = `${timeLeft}`;
  const timerPct = (timeLeft / SEC) * 100;

  const familyItems = useMemo(
    () => [
      { key: "green", color: FAMILY_COLORS.green, label: "2xx", sub: "Success" },
      { key: "blue", color: FAMILY_COLORS.blue, label: "3xx", sub: "Redirect" },
      { key: "orange", color: FAMILY_COLORS.orange, label: "4xx", sub: "Client Error" },
      { key: "red", color: FAMILY_COLORS.red, label: "5xx", sub: "Server Error" },
    ],
    [],
  );

  if (phase === "intro") {
    return (
      <div className="mx-auto flex max-w-[620px] flex-col items-center gap-5 rounded-md border-2 border-line bg-paper p-5 text-center sm:p-8">
        <h2 className="font-display text-xl font-bold">Read the code. Know the meaning.</h2>
        <p className="max-w-[400px] text-sm leading-relaxed text-muted">
          An HTTP status code appears. Pick the correct definition from 4 options. The fakes are
          written to confuse you — watch the family color.
        </p>
        <div className="grid w-full max-w-[380px] grid-cols-2 gap-2">
          {familyItems.map((f) => (
            <div
              key={f.key}
              className="flex items-center gap-2.5 rounded-lg border border-line bg-paper-dim px-3.5 py-2.5"
            >
              <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: f.color }} />
              <div>
                <div className="font-mono text-sm font-bold" style={{ color: f.color }}>
                  {f.label}
                </div>
                <div className="text-xs text-muted">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <ul className="w-full max-w-[380px] space-y-1.5 rounded-lg border border-line bg-paper-dim p-4 text-left">
          {[
            ["🎰", "Status code spins in — pick the correct meaning"],
            ["⏱", "20 seconds per round — 12 rounds total"],
            ["⚡", "Correct = 100 pts + speed bonus (time × 5)"],
            ["🔥", "Streak multiplier up to ×2.5"],
            ["🎨", "Color = family — use it as a clue"],
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
          Spin the Wheel →
        </button>
      </div>
    );
  }

  if (phase === "end") {
    const acc = TOTAL > 0 ? Math.round((correctCount / TOTAL) * 100) : 0;
    const max = TOTAL * (100 + SEC * 5) * 2.5;
    const pct = score / max;
    let rank: string;
    let msg: string;
    if (pct >= 0.82) {
      rank = "🏆 API Whisperer";
      msg = "You speak HTTP natively. 401 vs 403, 301 vs 302 — nothing confused you.";
    } else if (pct >= 0.6) {
      rank = "🥈 Backend Aware";
      msg = "Solid. You know the common ones cold. The edge cases tripped you up.";
    } else if (pct >= 0.38) {
      rank = "🥉 Frontend Dev";
      msg = "You know 200 and 404. Time to learn the rest — your APIs will thank you.";
    } else {
      rank = "🐛 JSON Consumer";
      msg = "The codes are a language. Learn the families first: 2xx=good, 4xx=you, 5xx=them.";
    }

    return (
      <div className="mx-auto flex max-w-[500px] flex-col items-center gap-4 rounded-md border-2 border-line bg-paper p-5 text-center sm:p-8">
        <div className="text-3xl sm:text-4xl">🏆</div>
        <h2 className="font-display text-xl font-bold sm:text-2xl">All Codes Checked!</h2>
        <div className="font-mono text-4xl font-bold text-green sm:text-6xl">{score}</div>
        <div className="rounded-lg border border-green bg-green/5 px-4 py-1.5 text-xs font-semibold text-green sm:px-5 sm:py-2 sm:text-sm">
          {rank}
        </div>
        <div className="grid w-full grid-cols-3 gap-2">
          {[
            { val: `${correctCount}/${TOTAL}`, lbl: "Correct" },
            { val: String(bestStreak), lbl: "Best Streak" },
            { val: `${acc}%`, lbl: "Accuracy" },
          ].map((s) => (
            <div
              key={s.lbl}
              className="rounded-lg border border-line bg-paper-dim p-2 text-center sm:p-2.5"
            >
              <div className="text-[9px] uppercase tracking-wider text-muted sm:text-[10px]">
                {s.lbl}
              </div>
              <div className="mt-0.5 font-mono text-xs font-bold text-foreground sm:text-sm">
                {s.val}
              </div>
            </div>
          ))}
        </div>
        <p className="max-w-[320px] text-xs leading-relaxed text-muted sm:text-sm">{msg}</p>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {order.map((i) => {
            const c = CHALLENGES[i].code;
            const color = getAccent(c);
            return (
              <span
                key={i}
                className="rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold sm:px-3 sm:py-1 sm:text-xs"
                style={{
                  color,
                  borderColor: color,
                  background: `${color}18`,
                }}
              >
                {c}
              </span>
            );
          })}
        </div>
        <button
          type="button"
          onClick={startGame}
          className="rounded-md border-0 bg-green px-8 py-2.5 text-sm font-bold text-ink transition-all hover:opacity-85 sm:px-11 sm:py-3"
        >
          Spin Again
        </button>
      </div>
    );
  }

  const letters = ["A", "B", "C", "D"];

  return (
    <div className="mx-auto flex w-full max-w-[680px] flex-col gap-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2.5 max-sm:grid-cols-2">
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

      {/* Status hero */}
      <div className="relative flex flex-col items-center gap-3 overflow-hidden rounded-md border border-line bg-paper px-6 py-10 text-center">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-[60px] transition-colors duration-400"
          style={{ background: accent }}
        />
        <div
          className={cn(
            "relative z-10 font-mono text-[clamp(4.5rem,16vw,8rem)] font-bold leading-none tracking-tighter transition-colors duration-300",
            spinning ? "opacity-45" : "",
            landed && "animate-[land_0.38s_cubic-bezier(.34,1.56,.64,1)]",
          )}
          style={{ color: spinning ? undefined : accent }}
        >
          {displayCode}
        </div>
        <div
          className={cn(
            "relative z-10 rounded-full border-[1.5px] px-3.5 py-1 font-mono text-sm font-semibold transition-all duration-300",
            spinning ? "opacity-0" : "opacity-100",
          )}
          style={{ color: accent, borderColor: accent }}
        >
          {catLabel}
        </div>
        <div className="relative z-10 text-sm text-muted">What does this status code mean?</div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
        {shuffledOptions.map(({ opt, origIdx }, i) => {
          const isPicked = selectedIdx === origIdx;
          const isCorrectOpt = answered && origIdx === ch?.correct;
          const isWrong = isPicked && origIdx !== ch?.correct;
          const dim = answered && !isCorrectOpt && !isWrong;

          return (
            <button
              key={`${round}-${origIdx}`}
              type="button"
              onClick={() => selectOption(origIdx)}
              disabled={answered}
              className={cn(
                "relative flex flex-col gap-1.5 rounded-md border-[1.5px] border-line bg-paper px-4 py-3.5 text-left transition-all",
                "hover:not-disabled:border-[#79c0ff] hover:not-disabled:bg-paper-dim hover:not-disabled:-translate-y-0.5",
                "disabled:cursor-default",
                isCorrectOpt && "!border-green !bg-green/5",
                isWrong && "!border-coral !bg-coral/5",
                dim && "opacity-30",
              )}
            >
              <span
                className={cn(
                  "absolute right-3 top-3 flex h-[22px] w-[22px] items-center justify-center rounded-full border border-line bg-paper-dim font-mono text-[11px] font-bold text-muted",
                  isCorrectOpt && "!border-green !bg-green/10 !text-green",
                  isWrong && "!border-coral !bg-coral/10 !text-coral",
                )}
              >
                {letters[i]}
              </span>
              <div className="font-bold text-foreground">{opt.title}</div>
              <div className="text-xs leading-relaxed text-muted">{opt.desc}</div>
              <div className="mt-1">
                {isCorrectOpt && (
                  <span className="text-xs font-bold text-green">✅ Correct answer</span>
                )}
                {isWrong && <span className="text-xs font-bold text-coral">❌</span>}
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
            selectedIdx !== null && selectedIdx === ch.correct
              ? "border-green bg-green/5 text-green"
              : "border-coral bg-coral/5 text-coral",
          )}
        >
          <strong className="mb-1 block text-base">
            {selectedIdx !== null && selectedIdx === ch.correct
              ? `✅ Correct! +${Math.round((100 + timeLeft * 5) * getMult(streak - 1))} pts${timeLeft >= 15 ? " ⚡ Quick!" : ""}`
              : timeLeft === 0
                ? "⏰ Time's up!"
                : `❌ Not quite. — ${ch.code} is "${ch.options[ch.correct].title}"`}
          </strong>
          <div className="mt-2 border-t border-line pt-2 text-foreground leading-relaxed">
            {ch.explanation}
          </div>
          <div className="mt-1.5 text-xs text-foreground">{ch.tip}</div>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button
          type="button"
          onClick={nextRound}
          className="w-full rounded-md border-[1.5px] border-line bg-paper px-4 py-3 text-sm font-semibold text-foreground transition-all hover:border-green hover:text-green"
        >
          {round + 1 < TOTAL ? "Next Round →" : "See Results"}
        </button>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes land {
          0% { transform: scale(1.18); }
          60% { transform: scale(0.96); }
          100% { transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
