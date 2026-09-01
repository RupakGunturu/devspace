import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";

export function GithubProfileBuilder() {
  const [name, setName] = useState("John Doe");
  const [bio, setBio] = useState("Full Stack Developer | Open Source Enthusiast");
  const [techStack, setTechStack] = useState(
    "TypeScript, React, Node.js, Python, PostgreSQL, Docker",
  );
  const [currentLearning, setCurrentLearning] = useState("Rust, WebAssembly");
  const [funFact, setFunFact] = useState("I type at 120 WPM");
  const [socialLinks, setSocialLinks] = useState(
    "https://twitter.com/johndoe\nhttps://linkedin.com/in/johndoe",
  );

  const readme = useMemo(() => {
    const techs = techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const links = socialLinks
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    return `## Hi there, I'm ${name} 👋

${bio}

### 🛠️ Tech Stack
${techs.map((t) => `- ${t}`).join("\n")}

### 📚 Currently Learning
${currentLearning}

### 🎯 Fun Fact
${funFact}

### 🔗 Connect with me
${links.map((l) => `- ${l}`).join("\n")}

---
*Built with DevSpace*`;
  }, [name, bio, techStack, currentLearning, funFact, socialLinks]);

  return (
    <ToolLayout id="github-profile-builder">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border-2 border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Bio
            </label>
            <input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-md border-2 border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Tech Stack (comma-separated)
            </label>
            <input
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full rounded-md border-2 border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Currently Learning
            </label>
            <input
              value={currentLearning}
              onChange={(e) => setCurrentLearning(e.target.value)}
              className="w-full rounded-md border-2 border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Fun Fact
            </label>
            <input
              value={funFact}
              onChange={(e) => setFunFact(e.target.value)}
              className="w-full rounded-md border-2 border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Social Links (one per line)
            </label>
            <textarea
              value={socialLinks}
              onChange={(e) => setSocialLinks(e.target.value)}
              rows={3}
              className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none focus:border-accent"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              README.md
            </label>
            <CopyButton text={readme} />
          </div>
          <pre className="h-[500px] overflow-auto whitespace-pre-wrap rounded-md border-2 border-line bg-input-bg p-3 font-mono text-xs text-input-text">
            {readme}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}
