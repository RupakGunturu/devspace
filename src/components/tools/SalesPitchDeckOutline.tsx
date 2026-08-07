import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

interface Slide {
  title: string;
  bullets: string[];
}

export function SalesPitchDeckOutline() {
  const [company, setCompany] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [market, setMarket] = useState("");
  const [revenue, setRevenue] = useState("");
  const [deck, setDeck] = useState<Slide[]>([]);
  const { color } = useToolAccent();

  const generate = () => {
    if (!company.trim() || !problem.trim() || !solution.trim() || !market.trim() || !revenue.trim()) return;

    const slides: Slide[] = [
      { title: "Title Slide", bullets: [company, "Revolutionizing the way things work", "[Your Tagline Here]"] },
      { title: "The Problem", bullets: [problem, "Current solutions are inadequate or outdated", "This costs businesses time, money, and talent", "Market frustration is at an all-time high"] },
      { title: "Our Solution", bullets: [solution, "Built with modern technology and UX in mind", "Reduces friction by 60% compared to alternatives", "Solves the core pain point identified above"] },
      { title: "How It Works", bullets: ["Step 1: Sign up in under 2 minutes", "Step 2: Connect your existing tools", "Step 3: See results within the first week", "Simple, intuitive, and powerful"] },
      { title: "Market Opportunity", bullets: [`Target: ${market}`, "TAM: $XX Billion globally", "SAM: $XX Million in our segment", "Growing at XX% year-over-year"] },
      { title: "Business Model", bullets: [`Revenue model: ${revenue}`, "Recurring revenue with high retention", "Expansion revenue through upsells", "Low customer acquisition cost"] },
      { title: "Traction & Milestones", bullets: ["XX active users/customers", "XX% month-over-month growth", "Key partnerships secured", "Major milestones achieved and ahead of schedule"] },
      { title: "Competitive Landscape", bullets: ["Direct competitors: [List them]", "Our key differentiators", "Why we win: speed, UX, pricing", "Switching costs are low — we earn loyalty"] },
      { title: "The Team", bullets: ["Founders with XX+ years in the space", "Previously at [Notable Companies]", "Strong advisory board", "Hiring key roles now"] },
      { title: "The Ask & Use of Funds", bullets: ["Raising $XXM [Seed/Series A]", "Use of funds: product, sales, marketing", "Key milestones with this capital", "Expected runway: XX months"] },
    ];

    setDeck(slides);
  };

  const reset = () => {
    setCompany("");
    setProblem("");
    setSolution("");
    setMarket("");
    setRevenue("");
    setDeck([]);
  };

  const allText = deck.map((s, i) => `Slide ${i + 1}: ${s.title}\n${s.bullets.map((b) => `  • ${b}`).join("\n")}`).join("\n\n");

  return (
    <ToolLayout id="sales-pitch-deck-outline">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ToolInput value={company} onChange={setCompany} placeholder="e.g. DevSpace" label="Company Name" rows={2} />
        <ToolInput value={problem} onChange={setProblem} placeholder="e.g. Developers waste 30% of time on repetitive tasks" label="Problem" rows={2} />
      </div>
      <ToolInput value={solution} onChange={setSolution} placeholder="e.g. An AI-powered developer toolkit that automates workflows" label="Solution" rows={2} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ToolInput value={market} onChange={setMarket} placeholder="e.g. SaaS companies with 10-500 engineers" label="Target Market" rows={2} />
        <ToolInput value={revenue} onChange={setRevenue} placeholder="e.g. SaaS subscription with usage tiers" label="Revenue Model" rows={2} />
      </div>

      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={generate} disabled={!company.trim() || !problem.trim() || !solution.trim() || !market.trim() || !revenue.trim()}>Generate Deck Outline</ToolButton>
        <ToolButton variant="secondary" onClick={reset}>Reset</ToolButton>
      </div>

      {deck.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">10-Slide Deck Outline</span>
            <CopyButton text={allText} />
          </div>
          {deck.map((slide, i) => (
            <div key={i} className="rounded-lg border-2 border-line bg-input-bg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold" style={{ backgroundColor: color, color: "#fff" }}>
                  {i + 1}
                </span>
                <span className="font-mono text-sm font-bold text-foreground">{slide.title}</span>
              </div>
              <ul className="ml-10 space-y-1">
                {slide.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-2 font-mono text-xs text-input-text">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
