import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

type EventType = "wedding" | "corporate" | "party";

const CHECKLISTS: Record<EventType, Record<string, string[]>> = {
  wedding: {
    "Pre-Event (4-8 weeks)": [
      "Confirm date, time, and venue details",
      "Sign contract and pay deposit",
      "Create shot list with couple",
      "Scout locations for portraits",
      "Confirm second shooter / assistant",
      "Check all gear and charge batteries",
      "Prepare backup camera body",
    ],
    "Pre-Event (1 week)": [
      "Final timeline review with coordinator",
      "Confirm family formal shot list",
      "Prepare gear bags and memory cards",
      "Charge all batteries",
      "Format memory cards",
      "Review weather forecast",
      "Confirm transportation and parking",
    ],
    "Day-Of": [
      "Arrive early — at least 1 hour before",
      "Check in with coordinator",
      "Capture venue details and decor",
      "Photograph getting-ready moments",
      "First look / couple portraits",
      "Wedding party photos",
      "Family formal shots",
      "Ceremony — key moments coverage",
      "Cocktail hour candids",
      "Reception — speeches, dances, cake",
      "Send-off / exit shots",
    ],
    "Post-Event": [
      "Back up all files immediately",
      "Cull and select best images",
      "Edit and retouch deliverables",
      "Upload to gallery / delivery platform",
      "Deliver final gallery",
      "Send thank-you note to couple",
      "Archive RAW files",
    ],
  },
  corporate: {
    "Pre-Event (2-4 weeks)": [
      "Review brand guidelines for photo style",
      "Confirm event schedule and key speakers",
      "Identify must-capture moments",
      "Get media credentials / access passes",
      "Coordinate with event organizer",
      "Prepare gear for indoor lighting",
    ],
    "Day-Of": [
      "Arrive early for setup shots",
      "Capture venue and signage",
      "Photograph registration and arrivals",
      "Keynote and speaker coverage",
      "Audience reaction shots",
      "Networking and breakout sessions",
      "Sponsor and exhibitor booths",
      "Group photos if requested",
      "Evening reception candids",
    ],
    "Post-Event": [
      "Back up all files",
      "Select and edit top images",
      "Deliver within 48-72 hours",
      "Upload to client portal",
      "Follow up for testimonials",
      "Archive project files",
    ],
  },
  party: {
    "Pre-Event (1-2 weeks)": [
      "Confirm party details and schedule",
      "Review desired photo style",
      "Identify key people to photograph",
      "Prepare gear and backup batteries",
      "Check venue for lighting conditions",
    ],
    "Day-Of": [
      "Arrive during setup for detail shots",
      "Capture decorations and ambiance",
      "Photograph guests arriving",
      "Candid moments throughout",
      "Group photos of key guests",
      "Capture entertainment / activities",
      "Food and cake details",
      "Dance floor and dancing",
      "Final moments and send-off",
    ],
    "Post-Event": [
      "Back up all files",
      "Edit and select best images",
      "Deliver gallery within 1 week",
      "Archive project files",
    ],
  },
};

export function ClientContractChecklist() {
  const [eventType, setEventType] = useState<EventType>("wedding");
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const { color } = useToolAccent();

  const checklist = CHECKLISTS[eventType];

  const totalItems = useMemo(
    () => Object.values(checklist).reduce((sum, items) => sum + items.length, 0),
    [checklist]
  );

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const progress = totalItems > 0 ? Math.round((checked.size / totalItems) * 100) : 0;

  return (
    <ToolLayout id="client-contract-checklist">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Event Type
        </label>
        <div className="flex gap-2">
          {(["wedding", "corporate", "party"] as EventType[]).map((t) => (
            <button
              key={t}
              onClick={() => { setEventType(t); setChecked(new Set()); }}
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
          {checked.size}/{totalItems} ({progress}%)
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(checklist).map(([phase, items]) => (
          <div key={phase}>
            <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              {phase}
            </p>
            <div className="flex flex-col gap-1">
              {items.map((item) => {
                const key = `${phase}-${item}`;
                const isChecked = checked.has(key);
                return (
                  <div
                    key={key}
                    onClick={() => toggle(key)}
                    className="flex cursor-pointer items-center gap-3 rounded-md border-2 border-line bg-input-bg px-4 py-2.5 transition-all hover:border-current"
                    style={{
                      borderColor: isChecked ? color : undefined,
                      backgroundColor: isChecked ? `${color}10` : undefined,
                    }}
                  >
                    <div
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2"
                      style={{
                        borderColor: isChecked ? color : "var(--border)",
                        backgroundColor: isChecked ? color : "transparent",
                      }}
                    >
                      {isChecked && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="font-mono text-sm text-foreground"
                      style={{
                        textDecoration: isChecked ? "line-through" : undefined,
                        opacity: isChecked ? 0.5 : 1,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
