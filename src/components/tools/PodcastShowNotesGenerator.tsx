import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";
import { ToolOutput } from "./ToolOutput";

export function PodcastShowNotesGenerator() {
  const [title, setTitle] = useState("");
  const [guest, setGuest] = useState("");
  const [topics, setTopics] = useState("");
  const [takeaways, setTakeaways] = useState("");

  const output = useMemo(() => {
    if (!title.trim()) return "";
    const topicList = topics
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const takeawayList = takeaways
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const lines: string[] = [];
    lines.push(`# ${title.trim()} — Show Notes`);
    lines.push("");
    if (guest.trim()) lines.push(`**Guest:** ${guest.trim()}`);
    lines.push("");

    lines.push("## Summary");
    lines.push(
      `In this episode, we dive deep into ${topicList.length > 0 ? topicList.join(", ") : "the topics at hand"}${guest.trim() ? ` with guest ${guest.trim()}` : ""}. We explore key insights, actionable strategies, and real-world examples that you can apply today.`,
    );
    lines.push("");

    lines.push("## Timestamps");
    lines.push("00:00 — Introduction");
    if (topicList.length > 0) {
      topicList.forEach((t, i) => {
        const min = (i + 1) * 8;
        lines.push(
          `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")} — ${t}`,
        );
      });
    }
    lines.push(
      `${String(Math.floor(((topicList.length + 2) * 8) / 60)).padStart(2, "0")}:${String(((topicList.length + 2) * 8) % 60).padStart(2, "0")} — Closing thoughts & next steps`,
    );
    lines.push("");

    lines.push("## Key Takeaways");
    if (takeawayList.length > 0) {
      takeawayList.forEach((t) => lines.push(`- ${t}`));
    } else {
      lines.push("- Takeaway 1");
      lines.push("- Takeaway 2");
      lines.push("- Takeaway 3");
    }
    lines.push("");

    lines.push("## Resources & Links");
    lines.push("- [Episode website link]");
    lines.push("- [Related article or resource]");
    if (guest.trim()) lines.push(`- ${guest.trim()}'s website`);
    lines.push("");

    lines.push("## Call to Action");
    lines.push(
      "If you enjoyed this episode, please subscribe and leave a review! Share it with someone who would find it valuable.",
    );

    return lines.join("\n");
  }, [title, guest, topics, takeaways]);

  return (
    <ToolLayout id="podcast-show-notes-generator">
      <ToolInput
        value={title}
        onChange={setTitle}
        label="Episode Title"
        placeholder="e.g. Building Scalable APIs"
        rows={2}
      />
      <ToolInput
        value={guest}
        onChange={setGuest}
        label="Guest Name (optional)"
        placeholder="e.g. Jane Smith"
        rows={1}
      />
      <ToolInput
        value={topics}
        onChange={setTopics}
        label="Topics (comma separated)"
        placeholder="e.g. API design, scaling, monitoring"
        rows={2}
      />
      <ToolInput
        value={takeaways}
        onChange={setTakeaways}
        label="Key Takeaways (comma separated)"
        placeholder="e.g. Start with design first, use rate limiting"
        rows={2}
      />
      <ToolButton onClick={() => {}} disabled={!title.trim()}>
        Generate Show Notes
      </ToolButton>
      <ToolOutput value={output} label="Show Notes" />
    </ToolLayout>
  );
}
