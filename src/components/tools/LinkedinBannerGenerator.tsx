import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";

export function LinkedinBannerGenerator() {
  const [title, setTitle] = useState("Full Stack Developer");
  const [company, setCompany] = useState("Tech Corp");
  const [tagline, setTagline] = useState("Building the future, one commit at a time");
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [accentColor, setAccentColor] = useState("#e8c81c");

  const bannerStyle = {
    background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 50%, ${accentColor}33 100%)`,
    width: "100%",
    aspectRatio: "4 / 1",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    borderRadius: "8px",
    border: `2px solid ${accentColor}44`,
    position: "relative" as const,
    overflow: "hidden",
  };

  return (
    <ToolLayout id="linkedin-banner-generator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Job Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border-2 border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:border-accent" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Company</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full rounded-md border-2 border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:border-accent" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Tagline</label>
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full rounded-md border-2 border-line bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:border-accent" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Background</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-md border-2 border-line" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Accent</label>
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-md border-2 border-line" />
            </div>
          </div>
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Preview (1584 x 396)</label>
          <div style={bannerStyle}>
            <div style={{ position: "absolute", top: "1rem", right: "1rem", width: "60px", height: "60px", borderRadius: "50%", backgroundColor: accentColor, opacity: 0.15 }} />
            <div style={{ position: "absolute", bottom: "0.5rem", left: "1rem", width: "100px", height: "3px", backgroundColor: accentColor, borderRadius: "2px" }} />
            <h2 style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: 800, fontFamily: "system-ui", textAlign: "center", margin: 0 }}>{title}</h2>
            <p style={{ color: accentColor, fontSize: "0.9rem", fontWeight: 600, marginTop: "0.25rem" }}>{company}</p>
            <p style={{ color: "#ffffff99", fontSize: "0.75rem", marginTop: "0.5rem", fontStyle: "italic" }}>{tagline}</p>
          </div>
          <CopyButton text={`Background: ${bgColor}\nAccent: ${accentColor}\nTitle: ${title}\nCompany: ${company}\nTagline: ${tagline}`} />
        </div>
      </div>
    </ToolLayout>
  );
}
