import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";
import { ToolOutput } from "./ToolOutput";

type Genre = "fantasy" | "sci-fi" | "romance" | "thriller" | "comedy" | "drama";

const GENRE_BEATS: Record<Genre, { act1: string[]; act2: string[]; act3: string[] }> = {
  fantasy: {
    act1: ["Ordinary world — protagonist's mundane life", "Call to adventure — discovers the magical world", "Refusal of the call — hesitation or doubt", "Meeting the mentor — gains a guide or magical ally", "Crossing the threshold — enters the new world"],
    act2: ["Tests and allies — builds relationships, faces challenges", "Approach to the inmost cave — preparation for the main confrontation", "The ordeal — major setback or loss", "Reward — gains a key item, knowledge, or power", "The road back — consequences of the ordeal"],
    act3: ["Final battle — climactic confrontation with the antagonist", "Resurrection — ultimate transformation or sacrifice", "Return with the elixir — brings wisdom back to the ordinary world"],
  },
  "sci-fi": {
    act1: ["World introduction — establish the sci-fi setting and rules", "Inciting incident — technological or scientific disruption", "Discovery — protagonist uncovers a deeper truth", "Alliance — teams up with unexpected allies", "Point of no return — commits to the mission"],
    act2: ["Escalation — stakes rise with each challenge", "Technology reveal — new tools or threats emerge", "Moral dilemma — ethical questions around technology", "Reversal — everything the protagonist believed is challenged", "Lowest point — resources depleted, trust broken"],
    act3: ["Climactic revelation — the true nature of the threat is revealed", "Final confrontation — human ingenuity vs. technological power", "New world order — society is transformed by the events"],
  },
  romance: {
    act1: ["Meet-cute — the protagonists first encounter", "First impressions — attraction and conflict", "Common ground — discovering shared interests", "Growing attraction — subtle romantic tension builds", "First date — the relationship begins"],
    act2: ["Deepening bond — getting to know each other", "Complication — an obstacle threatens the relationship", "Misunderstanding — miscommunication or external interference", "Separation — the couple parts ways", "Reflection — each protagonist evaluates what they want"],
    act3: ["Grand gesture — one protagonist makes a bold move", "Reconciliation — addressing the issues that drove them apart", "Together — the couple commits to a shared future"],
  },
  thriller: {
    act1: ["Normal life — establish the protagonist's routine", "Disturbance — something feels off", "Discovery — uncovering a conspiracy or danger", "Escalation — the threat becomes personal", "Alliance — forming a team or finding a mentor"],
    act2: ["Investigation — digging deeper into the mystery", "Near misses — close calls with the antagonist", "Betrayal — an ally proves untrustworthy", "Capture or setback — protagonist is trapped or outmaneuvered", "Escape — breaking free through ingenuity"],
    act3: ["Final pursuit — tracking down the antagonist", "Climactic confrontation — the truth is fully revealed", "Resolution — restoring order, but changed"],
  },
  comedy: {
    act1: ["Status quo — establish the comedic premise", "Inciting incident — a ridiculous situation unfolds", "Escalation — things spiral out of control", "Unlikely ally — a funny sidekick appears", "Commitment — protagonist is locked into the situation"],
    act2: ["Misunderstandings pile up — comedic complications grow", "Failed attempts — protagonist's plans backfire hilariously", "Escalation — the situation becomes absurd", "Low point — all seems lost (comically)", "Breakthrough — a ridiculous idea emerges"],
    act3: ["Big set piece — the most absurd, funny climax", "Resolution — chaos resolves in an unexpected way", "New normal — life returns, but funnier"],
  },
  drama: {
    act1: ["Ordinary world — protagonist's current life", "Inciting incident — a disruption changes everything", "Internal conflict — protagonist wrestles with the decision", "First step — takes action despite uncertainty", "New reality — adjusting to the changed world"],
    act2: ["Rising tension — stakes increase emotionally", "Relationship strain — bonds are tested", "Self-discovery — protagonist confronts their flaws", "Darkest moment — the emotional low point", "Turning point — a realization or choice must be made"],
    act3: ["Climax — the emotional peak of the story", "Transformation — protagonist changes fundamentally", "Resolution — life goes on, but everything is different"],
  },
};

export function PlotOutlineGenerator() {
  const [genre, setGenre] = useState<Genre>("fantasy");
  const [protagonist, setProtagonist] = useState("");
  const [setting, setSetting] = useState("");
  const [conflict, setConflict] = useState("");

  const output = useMemo(() => {
    if (!protagonist.trim()) return "";
    const beats = GENRE_BEATS[genre];
    const lines: string[] = [];

    lines.push(`# Plot Outline — ${genre.charAt(0).toUpperCase() + genre.slice(1)}`);
    lines.push("");
    lines.push(`**Protagonist:** ${protagonist.trim()}`);
    if (setting.trim()) lines.push(`**Setting:** ${setting.trim()}`);
    if (conflict.trim()) lines.push(`**Core Conflict:** ${conflict.trim()}`);
    lines.push("");

    lines.push("## Act 1 — Setup");
    beats.act1.forEach((b, i) => lines.push(`${i + 1}. ${b}`));
    lines.push("");

    lines.push("## Act 2 — Confrontation");
    beats.act2.forEach((b, i) => lines.push(`${i + 1}. ${b}`));
    lines.push("");

    lines.push("## Act 3 — Resolution");
    beats.act3.forEach((b, i) => lines.push(`${i + 1}. ${b}`));

    return lines.join("\n");
  }, [genre, protagonist, setting, conflict]);

  return (
    <ToolLayout id="plot-outline-generator">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Genre
        </label>
        <div className="flex flex-wrap gap-2">
          {(["fantasy", "sci-fi", "romance", "thriller", "comedy", "drama"] as Genre[]).map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className="rounded-full border-2 px-3 py-1.5 font-mono text-xs font-medium capitalize transition-all"
              style={{
                borderColor: genre === g ? "var(--foreground)" : "var(--border)",
                backgroundColor: genre === g ? "var(--foreground)" : undefined,
                color: genre === g ? "var(--background)" : undefined,
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolInput value={protagonist} onChange={setProtagonist} label="Protagonist" placeholder="e.g. Elara, a reluctant chosen one" rows={2} />
        <ToolInput value={setting} onChange={setSetting} label="Setting" placeholder="e.g. A floating city above the clouds" rows={2} />
      </div>
      <ToolInput value={conflict} onChange={setConflict} label="Core Conflict" placeholder="e.g. A war between memory and identity" rows={2} />
      <ToolButton onClick={() => {}} disabled={!protagonist.trim()}>
        Generate Outline
      </ToolButton>
      <ToolOutput value={output} label="3-Act Plot Outline" />
    </ToolLayout>
  );
}
