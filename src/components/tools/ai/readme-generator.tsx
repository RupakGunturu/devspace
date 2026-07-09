import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ReadmeGenerator() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [tech, setTech] = useState("");
  const [features, setFeatures] = useState("");
  const [install, setInstall] = useState("npm install");
  const [output, setOutput] = useState("");

  const generate = () => {
    const featureList = features.split("\n").filter(Boolean).map((f) => `- ${f}`).join("\n");
    const techBadges = tech.split(",").map((t) => t.trim()).map((t) => `![${t}](https://img.shields.io/badge/-${t}-blue)`).join(" ");
    setOutput(`# ${name}\n\n${desc}\n\n${techBadges}\n\n## Features\n\n${featureList || "- Feature 1\n- Feature 2"}\n\n## Installation\n\n\`\`\`bash\n${install}\n\`\`\`\n\n## Usage\n\n\`\`\`bash\nnpm run dev\n\`\`\`\n\n## License\n\nMIT`);
  };

  return (
    <ToolLayout id="readme-generator">
      <ToolInput value={name} onChange={setName} placeholder="My Project" label="Project Name" rows={1} />
      <ToolInput value={desc} onChange={setDesc} placeholder="A brief description..." label="Description" rows={2} />
      <ToolInput value={tech} onChange={setTech} placeholder="React, TypeScript, Tailwind" label="Tech Stack (comma separated)" rows={1} />
      <ToolInput value={features} onChange={setFeatures} placeholder="Feature 1&#10;Feature 2" label="Features (one per line)" rows={4} />
      <ToolInput value={install} onChange={setInstall} placeholder="npm install" label="Install Command" rows={1} />
      <ToolButton onClick={generate}>Generate README</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
