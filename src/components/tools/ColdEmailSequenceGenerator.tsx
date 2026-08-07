import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

interface Email {
  subject: string;
  body: string;
}

export function ColdEmailSequenceGenerator() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [valueProp, setValueProp] = useState("");
  const [cta, setCta] = useState("");
  const [sequence, setSequence] = useState<Email[]>([]);
  const { color } = useToolAccent();

  const generate = () => {
    if (!product.trim() || !audience.trim() || !valueProp.trim() || !cta.trim()) return;

    const emails: Email[] = [
      {
        subject: `Quick idea to help ${audience} with ${product.toLowerCase()}`,
        body: `Hi there,\n\nI noticed you're working in the ${audience} space. I wanted to reach out because we built ${product} — a tool that helps ${audience.toLowerCase()} ${valueProp.toLowerCase()}.\n\nA few teams like yours have already seen great results:\n• Reduced manual work by 40%\n• Saved 10+ hours per week\n• Improved accuracy significantly\n\nI'd love to show you how it works. Would you be open to a quick 15-minute demo this week?\n\n${cta}\n\nBest,\n[Your Name]`,
      },
      {
        subject: `Following up — ${product} for ${audience}`,
        body: `Hi again,\n\nI wanted to circle back on my previous email about ${product}.\n\nI understand you're busy, so I'll keep this brief:\n\n• ${valueProp}\n• Built specifically for ${audience.toLowerCase()}\n• Quick setup — live in under 10 minutes\n\nI'm not trying to take up much of your time. Just a quick walkthrough to see if this could help your team.\n\nWould any of these times work for a brief chat?\n• Tomorrow at 2pm\n• Thursday at 10am\n• Friday at 3pm\n\n${cta}`,
      },
      {
        subject: `Last note from me — ${product}`,
        body: `Hi there,\n\nI don't want to clutter your inbox, so this will be my last follow-up.\n\nTo recap, ${product} helps ${audience.toLowerCase()} ${valueProp.toLowerCase()}.\n\nIf the timing isn't right, no worries at all. But if you're ever looking for a solution in this space, I'd be happy to chat.\n\nIn the meantime, here's a quick case study that might be useful: [Link]\n\nFeel free to reach out anytime. I'll leave the door open.\n\n${cta}\n\nAll the best,\n[Your Name]`,
      },
    ];

    setSequence(emails);
  };

  const reset = () => {
    setProduct("");
    setAudience("");
    setValueProp("");
    setCta("");
    setSequence([]);
  };

  const allText = sequence.map((e, i) => `--- Email ${i + 1}: ${e.subject} ---\n\n${e.body}`).join("\n\n");

  return (
    <ToolLayout id="cold-email-sequence-generator">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ToolInput value={product} onChange={setProduct} placeholder="e.g. DevSpace, a developer productivity tool" label="Product / Service" rows={2} />
        <ToolInput value={audience} onChange={setAudience} placeholder="e.g. SaaS startup CTOs" label="Target Audience" rows={2} />
      </div>
      <ToolInput value={valueProp} onChange={setValueProp} placeholder="e.g. automate repetitive tasks and ship features 3x faster" label="Value Proposition" rows={2} />
      <ToolInput value={cta} onChange={setCta} placeholder="e.g. Book a demo at devspace.io/demo" label="Call to Action" rows={2} />

      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={generate} disabled={!product.trim() || !audience.trim() || !valueProp.trim() || !cta.trim()}>Generate Sequence</ToolButton>
        <ToolButton variant="secondary" onClick={reset}>Reset</ToolButton>
      </div>

      {sequence.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">3-Email Sequence</span>
            <CopyButton text={allText} />
          </div>
          {sequence.map((email, i) => {
            const labels = ["Introduction", "Follow-up", "Final"];
            return (
              <div key={i} className="rounded-lg border-2 border-line bg-input-bg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color }}>
                    Email {i + 1}: {labels[i]}
                  </span>
                  <CopyButton text={`Subject: ${email.subject}\n\n${email.body}`} />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Subject</span>
                  <p className="mt-0.5 text-sm font-medium text-foreground">{email.subject}</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Body</span>
                  <pre className="mt-0.5 whitespace-pre-wrap break-all font-mono text-xs text-input-text">{email.body}</pre>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ToolLayout>
  );
}
