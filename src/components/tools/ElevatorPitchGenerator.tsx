import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";
import { ToolOutput } from "./ToolOutput";

export function ElevatorPitchGenerator() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [value, setValue] = useState("");
  const [careerGoal, setCareerGoal] = useState("");

  const pitches = useMemo(() => {
    if (!name.trim() || !role.trim()) return { short: "", long: "" };
    const short = `Hi, I'm ${name.trim()}. I'm a ${role.trim()} who ${value.trim() || "brings unique expertise to every project"}. ${careerGoal.trim() ? `My goal is to ${careerGoal.trim()}.` : "I'm always looking for new challenges."} I'd love to connect and explore how we might work together.`;

    const long = `Hi, I'm ${name.trim()} — a ${role.trim()} with a focus on ${value.trim() || "delivering exceptional results"}. Throughout my career, I've developed a deep understanding of what it takes to build solutions that truly make a difference.\n\n${careerGoal.trim() ? `Right now, I'm particularly focused on ${careerGoal.trim()}. I believe this is where I can create the most impact.` : "I'm passionate about pushing boundaries and finding innovative solutions to complex problems."}\n\nWhat sets me apart is my ability to combine technical expertise with a human-centered approach. I'd love to chat about how my experience could benefit your team or project. Let's connect!`;

    return { short, long };
  }, [name, role, value, careerGoal]);

  return (
    <ToolLayout id="elevator-pitch-generator">
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolInput value={name} onChange={setName} label="Your Name" placeholder="e.g. Alex Chen" rows={2} />
        <ToolInput value={role} onChange={setRole} label="Your Role" placeholder="e.g. Product Designer & Engineer" rows={2} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolInput value={value} onChange={setValue} label="Unique Value" placeholder="e.g. bridge the gap between design and engineering" rows={2} />
        <ToolInput value={careerGoal} onChange={setCareerGoal} label="Career Goal" placeholder="e.g. lead product at a mission-driven startup" rows={2} />
      </div>
      <ToolButton onClick={() => {}} disabled={!name.trim() || !role.trim()}>
        Generate Pitches
      </ToolButton>
      {pitches.short && (
        <div className="flex flex-col gap-4">
          <ToolOutput value={pitches.short} label="30-Second Pitch" />
          <ToolOutput value={pitches.long} label="60-Second Pitch" />
        </div>
      )}
    </ToolLayout>
  );
}
