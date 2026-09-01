import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";
import { ToolOutput } from "./ToolOutput";

export function LinkedinAboutGenerator() {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [goal, setGoal] = useState("");

  const output = (() => {
    if (!role.trim()) return "";
    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const lines: string[] = [];
    lines.push(`${role.trim()} with a passion for building impactful solutions.`);
    if (experience.trim()) {
      lines.push("");
      lines.push(
        `Over the years, I've had the privilege of working across ${experience.trim()}, gaining deep expertise in delivering results that matter.`,
      );
    }
    if (skillList.length > 0) {
      lines.push("");
      lines.push(
        `My core strengths include ${skillList.slice(0, -1).join(", ")}${skillList.length > 1 ? " and " : ""}${skillList[skillList.length - 1]}.`,
      );
    }
    if (goal.trim()) {
      lines.push("");
      lines.push(
        `Currently, I'm focused on ${goal.trim()} — always looking to connect with like-minded professionals and explore new opportunities.`,
      );
    }
    lines.push("");
    lines.push("Let's connect and build something great together.");
    return lines.join("\n");
  })();

  return (
    <ToolLayout id="linkedin-about-generator">
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolInput
          value={role}
          onChange={setRole}
          label="Current Role"
          placeholder="e.g. Senior Full-Stack Developer"
          rows={2}
        />
        <ToolInput
          value={experience}
          onChange={setExperience}
          label="Past Experience"
          placeholder="e.g. startups, agencies, and enterprise SaaS"
          rows={2}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolInput
          value={skills}
          onChange={setSkills}
          label="Skills (comma separated)"
          placeholder="e.g. React, Node.js, System Design"
          rows={2}
        />
        <ToolInput
          value={goal}
          onChange={setGoal}
          label="Career Goal"
          placeholder="e.g. leading engineering teams"
          rows={2}
        />
      </div>
      <ToolButton onClick={() => {}} disabled={!output}>
        Generate
      </ToolButton>
      <ToolOutput value={output} label="LinkedIn About Section" />
    </ToolLayout>
  );
}
