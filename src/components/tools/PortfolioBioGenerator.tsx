import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { CopyButton } from "./CopyButton";

const tones = ["Professional", "Casual", "Creative"] as const;

export function PortfolioBioGenerator() {
  const [name, setName] = useState("Alex Chen");
  const [role, setRole] = useState("Full Stack Developer");
  const [skills, setSkills] = useState("React, Node.js, TypeScript, PostgreSQL");
  const [yearsExp, setYearsExp] = useState("5");
  const [activeTone, setActiveTone] = useState<string>("Professional");

  const bios = useMemo(() => {
    const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
    return {
      Professional: `${name} is a ${role} with ${yearsExp} years of experience building scalable web applications. Proficient in ${skillList.slice(0, 3).join(", ")}, and more. Passionate about clean code and user-centric design.`,
      Casual: `Hey, I'm ${name}! I build things for the web as a ${role}. With ${yearsExp} years under my belt, I work with ${skillList.slice(0, 3).join(", ")} and love turning ideas into reality. Let's build something cool together.`,
      Creative: `${name} — ${role} by day, code artist by night. ${yearsExp} years of crafting digital experiences with ${skillList.slice(0, 3).join(", ")}. I believe great software is equal parts logic and creativity.`,
    };
  }, [name, role, skills, yearsExp]);

  return (
    <ToolLayout id="portfolio-bio-generator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border-2 border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:border-accent" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Role</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-md border-2 border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:border-accent" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Skills (comma-separated)</label>
            <input value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full rounded-md border-2 border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:border-accent" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Years of Experience</label>
            <input value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} className="w-full rounded-md border-2 border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:border-accent" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2">
            {tones.map((t) => (
              <button key={t} onClick={() => setActiveTone(t)} className={`rounded-full border-2 px-3 py-1 text-xs transition-all ${activeTone === t ? "border-accent bg-accent text-accent-fg" : "border-line text-muted"}`}>{t}</button>
            ))}
          </div>
          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">{activeTone} Bio</span>
              <CopyButton text={bios[activeTone as keyof typeof bios]} />
            </div>
            <p className="text-sm text-input-text leading-relaxed">{bios[activeTone as keyof typeof bios]}</p>
          </div>
          <div className="text-xs text-muted">{bios[activeTone as keyof typeof bios].length} characters</div>
        </div>
      </div>
    </ToolLayout>
  );
}
