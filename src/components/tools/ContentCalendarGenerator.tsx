import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { AntdDatePicker } from "@/components/ui/antd-date-picker";
import { AntdCalendar } from "@/components/ui/antd-calendar";

type Platform = "instagram" | "twitter" | "linkedin" | "youtube";

const PLATFORMS: { value: Platform; label: string; abbr: string }[] = [
  { value: "instagram", label: "Instagram", abbr: "IG" },
  { value: "twitter", label: "Twitter/X", abbr: "TW" },
  { value: "linkedin", label: "LinkedIn", abbr: "LI" },
  { value: "youtube", label: "YouTube", abbr: "YT" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const CONTENT_TYPES: Record<Platform, string[]> = {
  instagram: ["Carousel Post", "Reel", "Story", "Single Image", "Collab Post", "Poll Story"],
  twitter: ["Thread", "Single Tweet", "Poll", "Quote Tweet", "Spaces Promo", "Image Post"],
  linkedin: ["Text Post", "Article Link", "Carousel Document", "Poll", "Video", "Event Post"],
  youtube: ["Long-form Video", "Short", "Community Post", "Premiere", "Live Stream", "Playlist"],
};

export function ContentCalendarGenerator() {
  const [topic, setTopic] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["instagram"]);
  const [postsPerWeek, setPostsPerWeek] = useState("5");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const { color } = useToolAccent();

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const calendar = useMemo(() => {
    if (!topic.trim() || selectedPlatforms.length === 0) return null;
    const ppw = parseInt(postsPerWeek) || 5;
    const baseDate = startDate || new Date();
    const weeks: {
      week: number;
      days: { day: string; date: string; platform: string; type: string; idea: string }[];
    }[] = [];

    for (let w = 0; w < 4; w++) {
      const days: { day: string; date: string; platform: string; type: string; idea: string }[] =
        [];
      const platformRotation = [...selectedPlatforms];
      let dayIndex = 0;

      for (let p = 0; p < ppw; p++) {
        const platform = platformRotation[p % platformRotation.length];
        const types = CONTENT_TYPES[platform];
        const type = types[Math.floor(Math.random() * types.length)];
        const date = new Date(baseDate);
        date.setDate(date.getDate() + w * 7 + dayIndex);
        const day = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
        const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        dayIndex++;
        days.push({
          day,
          date: dateStr,
          platform: PLATFORMS.find((x) => x.value === platform)?.abbr || platform,
          type,
          idea: `${topic.trim()} — ${type.toLowerCase()} for week ${w + 1}`,
        });
      }
      weeks.push({ week: w + 1, days });
    }
    return weeks;
  }, [topic, selectedPlatforms, postsPerWeek, startDate]);

  const calendarText = useMemo(() => {
    if (!calendar) return "";
    const lines: string[] = [`# Content Calendar — ${topic.trim()}`];
    lines.push(
      `Platforms: ${selectedPlatforms.map((p) => PLATFORMS.find((x) => x.value === p)?.label).join(", ")}`,
    );
    lines.push(`Posts per week: ${postsPerWeek}`);
    lines.push("");
    calendar.forEach((week) => {
      lines.push(`## Week ${week.week}`);
      week.days.forEach((d) => {
        lines.push(`- **${d.day} (${d.date})** [${d.platform}] ${d.type}: ${d.idea}`);
      });
      lines.push("");
    });
    return lines.join("\n");
  }, [calendar, topic, selectedPlatforms, postsPerWeek]);

  return (
    <ToolLayout id="content-calendar-generator">
      <ToolInput
        value={topic}
        onChange={setTopic}
        label="Topic / Niche"
        placeholder="e.g. AI tools for developers"
        rows={2}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Start Date
          </label>
          <AntdDatePicker
            value={startDate}
            onChange={setStartDate}
            placeholder="Select start date"
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Posts per Week
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => {
              const active = selectedPlatforms.includes(p.value);
              return (
                <button
                  key={p.value}
                  onClick={() => togglePlatform(p.value)}
                  className="rounded-full border-2 px-3 py-1.5 font-mono text-xs font-medium transition-all"
                  style={{
                    borderColor: active ? color : "var(--border)",
                    backgroundColor: active ? color : undefined,
                    color: active ? "#fff" : undefined,
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Posts per Week
          </label>
          <div className="flex gap-2">
            {["3", "5", "7", "10"].map((n) => (
              <button
                key={n}
                onClick={() => setPostsPerWeek(n)}
                className="flex-1 rounded-md border-2 px-3 py-2 font-mono text-sm font-medium transition-all"
                style={{
                  borderColor: postsPerWeek === n ? color : undefined,
                  backgroundColor: postsPerWeek === n ? color : undefined,
                  color: postsPerWeek === n ? "#fff" : undefined,
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ToolButton onClick={() => {}} disabled={!topic.trim() || selectedPlatforms.length === 0}>
        Generate Calendar
      </ToolButton>

      {calendar && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              4-Week Calendar
            </span>
            <CopyButton text={calendarText} />
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-4" style={{ minWidth: "max-content" }}>
              {calendar.map((week) => (
                <div key={week.week} className="w-[220px] shrink-0">
                  <p
                    className="mb-2 rounded-md px-3 py-1.5 font-mono text-xs font-bold"
                    style={{ backgroundColor: color, color: "#fff" }}
                  >
                    Week {week.week}
                  </p>
                  <div className="flex flex-col gap-1">
                    {week.days.map((d, i) => (
                      <div
                        key={i}
                        className="rounded-md border-2 border-line bg-input-bg px-3 py-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-foreground">
                            {d.day}
                          </span>
                          <span className="font-mono text-[9px] text-muted">{d.date}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono text-[10px] text-muted">{d.type}</span>
                          <span
                            className="rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold"
                            style={{
                              backgroundColor: `${color}20`,
                              color,
                            }}
                          >
                            {d.platform}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Copy-Ready
              </span>
              <CopyButton text={calendarText} />
            </div>
            <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap break-all font-mono text-xs text-foreground">
              {calendarText}
            </pre>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
