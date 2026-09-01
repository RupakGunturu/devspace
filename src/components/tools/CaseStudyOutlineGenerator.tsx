import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";
import { ToolOutput } from "./ToolOutput";

export function CaseStudyOutlineGenerator() {
  const [project, setProject] = useState("");
  const [problem, setProblem] = useState("");
  const [role, setRole] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [results, setResults] = useState("");

  const output = useMemo(() => {
    if (!project.trim()) return "";
    const techList = technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    return `# ${project.trim()} — Case Study Outline

## 1. Overview
A brief summary of the ${project.trim()} project, its significance, and the impact it delivered.

## 2. Problem
${problem.trim() || "Describe the core problem or challenge that needed to be addressed."}

Why this problem matters:
- Business impact and stakeholder concerns
- User pain points identified through research
- Constraints and limitations faced

## 3. Process
My role: ${role.trim() || "Describe your role and responsibilities"}

Key activities:
- Discovery and research phase
- Ideation and concept development
- Iterative design and development cycles
- Testing and validation

## 4. Solution
Technologies used: ${techList.length > 0 ? techList.join(", ") : "List your tech stack"}

Key features delivered:
- Feature 1 — [description]
- Feature 2 — [description]
- Feature 3 — [description]

Architecture and technical decisions:
- [Describe key technical choices and rationale]

## 5. Results
${results.trim() || "Quantify the outcomes and business impact"}

- Metric 1: [before → after]
- Metric 2: [before → after]
- Metric 3: [before → after]

## 6. Learnings
- What went well and should be repeated
- Challenges overcome and how
- What I would do differently next time
- Advice for similar projects`;
  }, [project, problem, role, technologies, results]);

  return (
    <ToolLayout id="case-study-outline-generator">
      <ToolInput
        value={project}
        onChange={setProject}
        label="Project Name"
        placeholder="e.g. E-Commerce Platform Redesign"
        rows={2}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolInput
          value={problem}
          onChange={setProblem}
          label="Problem"
          placeholder="Describe the problem you solved"
          rows={3}
        />
        <ToolInput
          value={role}
          onChange={setRole}
          label="Your Role"
          placeholder="e.g. Lead Frontend Developer"
          rows={3}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolInput
          value={technologies}
          onChange={setTechnologies}
          label="Technologies (comma separated)"
          placeholder="e.g. React, Node.js, PostgreSQL"
          rows={2}
        />
        <ToolInput
          value={results}
          onChange={setResults}
          label="Results"
          placeholder="e.g. 40% conversion increase"
          rows={2}
        />
      </div>
      <ToolButton onClick={() => {}} disabled={!output}>
        Generate Outline
      </ToolButton>
      <ToolOutput value={output} label="Case Study Outline" />
    </ToolLayout>
  );
}
