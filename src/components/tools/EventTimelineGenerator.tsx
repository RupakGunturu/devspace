import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

type EventType = "wedding" | "corporate" | "party";

const TIMELINES: Record<EventType, { time: string; activity: string; category: string }[]> = {
  wedding: [
    { time: "08:00 AM", activity: "Venue setup begins", category: "Setup" },
    { time: "09:00 AM", activity: "Florist arrives, decorations", category: "Setup" },
    { time: "10:00 AM", activity: "Bridal party hair & makeup", category: "Prep" },
    { time: "11:00 AM", activity: "Photographer arrives — getting ready shots", category: "Photo" },
    { time: "12:00 PM", activity: "First look / Couple photos", category: "Photo" },
    { time: "12:30 PM", activity: "Wedding party photos", category: "Photo" },
    { time: "01:00 PM", activity: "Family formal photos", category: "Photo" },
    { time: "01:30 PM", activity: "Guests arrive & seat", category: "Ceremony" },
    { time: "02:00 PM", activity: "Ceremony begins", category: "Ceremony" },
    { time: "02:30 PM", activity: "Ceremony ends — recessional", category: "Ceremony" },
    { time: "02:45 PM", activity: "Cocktail hour begins", category: "Reception" },
    { time: "03:00 PM", activity: "Couple & sunset photos", category: "Photo" },
    { time: "04:00 PM", activity: "Reception doors open", category: "Reception" },
    { time: "04:15 PM", activity: "Grand entrance & first dance", category: "Reception" },
    { time: "04:30 PM", activity: "Welcome speech & toasts", category: "Reception" },
    { time: "05:00 PM", activity: "Dinner service", category: "Reception" },
    { time: "06:00 PM", activity: "Parent dances & cake cutting", category: "Reception" },
    { time: "06:30 PM", activity: "Open dance floor", category: "Reception" },
    { time: "09:00 PM", activity: "Bouquet & garter toss", category: "Reception" },
    { time: "09:30 PM", activity: "Last dance", category: "Reception" },
    { time: "10:00 PM", activity: "Sparkler exit / Send-off", category: "Closing" },
    { time: "10:30 PM", activity: "Venue breakdown", category: "Setup" },
  ],
  corporate: [
    { time: "07:00 AM", activity: "Venue setup & AV check", category: "Setup" },
    { time: "08:00 AM", activity: "Registration desk opens", category: "Arrival" },
    { time: "08:30 AM", activity: "Welcome coffee & networking", category: "Arrival" },
    { time: "09:00 AM", activity: "Opening keynote", category: "Session" },
    { time: "10:00 AM", activity: "Breakout sessions / Workshops", category: "Session" },
    { time: "11:00 AM", activity: "Networking break", category: "Break" },
    { time: "11:15 AM", activity: "Panel discussion", category: "Session" },
    { time: "12:15 PM", activity: "Lunch break & sponsor booths", category: "Break" },
    { time: "01:15 PM", activity: "Afternoon sessions begin", category: "Session" },
    { time: "02:15 PM", activity: "Demo showcase", category: "Session" },
    { time: "03:00 PM", activity: "Afternoon networking break", category: "Break" },
    { time: "03:30 PM", activity: "Fireside chat", category: "Session" },
    { time: "04:15 PM", activity: "Closing keynote", category: "Session" },
    { time: "05:00 PM", activity: "Closing remarks & next steps", category: "Closing" },
    { time: "05:30 PM", activity: "Happy hour / Networking", category: "Closing" },
    { time: "07:00 PM", activity: "Venue breakdown", category: "Setup" },
  ],
  party: [
    { time: "02:00 PM", activity: "Venue access & setup begins", category: "Setup" },
    { time: "03:00 PM", activity: "Decorations & table setup", category: "Setup" },
    { time: "04:00 PM", activity: "DJ / Entertainment setup & sound check", category: "Setup" },
    { time: "04:30 PM", activity: "Catering arrives & food prep", category: "Setup" },
    { time: "05:00 PM", activity: "Doors open — guests arrive", category: "Arrival" },
    { time: "05:30 PM", activity: "Welcome drinks & appetizers", category: "Social" },
    { time: "06:00 PM", activity: "Party games / Activities", category: "Social" },
    { time: "06:30 PM", activity: "Dinner service", category: "Dining" },
    { time: "07:30 PM", activity: "Speeches / Toasts", category: "Event" },
    { time: "08:00 PM", activity: "Dance floor opens", category: "Entertainment" },
    { time: "09:00 PM", activity: "Special performance / Activity", category: "Entertainment" },
    { time: "10:00 PM", activity: "Cake / Dessert", category: "Dining" },
    { time: "10:30 PM", activity: "Photo booth session", category: "Social" },
    { time: "11:00 PM", activity: "Last call & wind down", category: "Closing" },
    { time: "11:30 PM", activity: "Event ends — cleanup begins", category: "Setup" },
  ],
};

const CATEGORY_COLORS: Record<string, string> = {
  Setup: "#94a3b8",
  Prep: "#a78bfa",
  Photo: "#f472b6",
  Ceremony: "#fbbf24",
  Reception: "#34d399",
  Closing: "#60a5fa",
  Arrival: "#34d399",
  Session: "#60a5fa",
  Break: "#fbbf24",
  Social: "#f472b6",
  Dining: "#fb923c",
  Entertainment: "#a78bfa",
};

export function EventTimelineGenerator() {
  const [eventType, setEventType] = useState<EventType>("wedding");
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const { color } = useToolAccent();

  const timeline = TIMELINES[eventType];

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const progress = timeline.length > 0 ? Math.round((checked.size / timeline.length) * 100) : 0;

  return (
    <ToolLayout id="event-timeline-generator">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Event Type
        </label>
        <div className="flex gap-2">
          {(["wedding", "corporate", "party"] as EventType[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setEventType(t);
                setChecked(new Set());
              }}
              className="flex-1 rounded-md border-2 px-3 py-2.5 font-mono text-xs font-medium capitalize transition-all"
              style={{
                borderColor: eventType === t ? color : undefined,
                backgroundColor: eventType === t ? color : undefined,
                color: eventType === t ? "#fff" : undefined,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 overflow-hidden rounded-full border-2 border-line bg-input-bg">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: color }}
          />
        </div>
        <span className="font-mono text-xs text-muted">
          {checked.size}/{timeline.length} ({progress}%)
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {timeline.map((item, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            className="flex cursor-pointer items-center gap-3 rounded-md border-2 border-line bg-input-bg px-4 py-2.5 transition-all hover:border-current"
            style={{
              borderColor: checked.has(i) ? color : undefined,
              backgroundColor: checked.has(i) ? `${color}10` : undefined,
            }}
          >
            <div
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2"
              style={{
                borderColor: checked.has(i) ? color : "var(--border)",
                backgroundColor: checked.has(i) ? color : "transparent",
              }}
            >
              {checked.has(i) && (
                <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="w-20 shrink-0 font-mono text-xs font-bold" style={{ color }}>
              {item.time}
            </span>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold"
              style={{
                backgroundColor: `${CATEGORY_COLORS[item.category] || "#94a3b8"}20`,
                color: CATEGORY_COLORS[item.category] || "#94a3b8",
              }}
            >
              {item.category}
            </span>
            <span
              className="font-mono text-sm text-foreground"
              style={{
                textDecoration: checked.has(i) ? "line-through" : undefined,
                opacity: checked.has(i) ? 0.5 : 1,
              }}
            >
              {item.activity}
            </span>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
