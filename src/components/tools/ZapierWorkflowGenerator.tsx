import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolInput } from "./ToolInput";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

interface WorkflowStep {
  type: "trigger" | "action" | "condition";
  app: string;
  description: string;
}

const TRIGGER_KEYWORDS: Record<string, string> = {
  "new email": "Email / Gmail",
  "receive email": "Email / Gmail",
  "new form submission": "Google Forms / Typeform",
  "form submitted": "Google Forms / Typeform",
  "new lead": "HubSpot / Salesforce",
  "new subscriber": "Mailchimp / ConvertKit",
  "new row": "Google Sheets / Airtable",
  "new spreadsheet row": "Google Sheets",
  "new record": "Airtable",
  "new deal": "Salesforce / HubSpot",
  "new task": "Trello / Asana / ClickUp",
  "new issue": "GitHub / Jira",
  "new pull request": "GitHub",
  "new commit": "GitHub",
  "new message": "Slack / Discord",
  "new file": "Google Drive / Dropbox",
  "new payment": "Stripe",
  "new order": "Shopify / WooCommerce",
  "new customer": "Shopify / Stripe",
  "new tweet": "Twitter / X",
  "new post": "WordPress / Webflow",
  schedule: "Schedule / Cron",
  daily: "Schedule / Cron",
  weekly: "Schedule / Cron",
  "every day": "Schedule / Cron",
};

const ACTION_KEYWORDS: Record<string, string> = {
  "send email": "Email / Gmail",
  "send message": "Slack / Discord",
  "post to slack": "Slack",
  "create task": "Trello / Asana / ClickUp",
  "add row": "Google Sheets",
  "add record": "Airtable",
  "create contact": "HubSpot / Salesforce",
  "add subscriber": "Mailchimp / ConvertKit",
  "send notification": "Slack / Email",
  "create file": "Google Drive / Dropbox",
  "upload file": "Google Drive / Dropbox",
  "update record": "Airtable",
  "update row": "Google Sheets",
  "send sms": "Twilio",
  "make http request": "Webhooks by Zapier",
  "call webhook": "Webhooks by Zapier",
  "create project": "Trello / Asana",
  "add comment": "GitHub / Jira",
  "create invoice": "QuickBooks / Stripe",
  "send dm": "Slack / Discord",
  "post tweet": "Twitter / X",
  "update deal": "Salesforce / HubSpot",
};

const CONDITION_KEYWORDS = ["if", "when", "only if", "filter", "check", "condition"];

function parseWorkflow(input: string): WorkflowStep[] {
  const lower = input.toLowerCase();
  const steps: WorkflowStep[] = [];

  const sentences = lower.split(/[.,;!]+/).filter((s) => s.trim().length > 0);

  let triggerFound = false;

  for (const sentence of sentences) {
    const trimmed = sentence.trim();

    const isCondition = CONDITION_KEYWORDS.some(
      (kw) => trimmed.startsWith(kw) || trimmed.includes(` ${kw} `),
    );
    if (isCondition) {
      steps.push({ type: "condition", app: "Filter by Zapier", description: trimmed });
      continue;
    }

    if (!triggerFound) {
      let matchedApp = "Unknown App";
      let matchedDesc = trimmed;

      for (const [kw, app] of Object.entries(TRIGGER_KEYWORDS)) {
        if (trimmed.includes(kw)) {
          matchedApp = app;
          matchedDesc = `When ${kw}`;
          break;
        }
      }

      steps.push({ type: "trigger", app: matchedApp, description: matchedDesc });
      triggerFound = true;
      continue;
    }

    let matchedApp = "Unknown App";
    let matchedDesc = trimmed;

    for (const [kw, app] of Object.entries(ACTION_KEYWORDS)) {
      if (trimmed.includes(kw)) {
        matchedApp = app;
        matchedDesc = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        break;
      }
    }

    steps.push({ type: "action", app: matchedApp, description: matchedDesc });
  }

  if (steps.length === 0) {
    steps.push({
      type: "trigger",
      app: "Webhooks by Zapier",
      description: "When webhook is received",
    });
    steps.push({ type: "action", app: "Unknown App", description: input.trim() });
  }

  return steps;
}

export function ZapierWorkflowGenerator() {
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const { color } = useToolAccent();

  const generate = () => {
    if (!description.trim()) return;
    setSteps(parseWorkflow(description));
  };

  const reset = () => {
    setDescription("");
    setSteps([]);
  };

  const typeColors: Record<string, string> = {
    trigger: "#10b981",
    action: "#3b82f6",
    condition: "#f59e0b",
  };

  const allText = steps
    .map((s, i) => `${i + 1}. [${s.type.toUpperCase()}] ${s.app}\n   ${s.description}`)
    .join("\n\n");

  return (
    <ToolLayout id="zapier-workflow-generator">
      <ToolInput
        value={description}
        onChange={setDescription}
        placeholder={
          "e.g. When I receive a new email with an attachment, save it to Google Drive, then send a Slack notification to my team, and if the sender is a VIP, create a task in Asana"
        }
        label="Describe your automation in plain English"
        rows={4}
      />

      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={generate} disabled={!description.trim()}>
          Generate Workflow
        </ToolButton>
        <ToolButton variant="secondary" onClick={reset}>
          Reset
        </ToolButton>
      </div>

      {steps.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Workflow Steps ({steps.length})
            </span>
            <CopyButton text={allText} />
          </div>
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute left-5 top-full h-3 w-0.5 bg-line" />
              )}
              <div className="flex items-start gap-3 rounded-lg border-2 border-line bg-input-bg p-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold text-white"
                  style={{ backgroundColor: typeColors[step.type] }}
                >
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase"
                      style={{ backgroundColor: typeColors[step.type], color: "#fff" }}
                    >
                      {step.type}
                    </span>
                    <span className="font-mono text-xs font-medium text-foreground">
                      {step.app}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-input-text">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {steps.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Describe your automation above and we&apos;ll generate the workflow steps
        </div>
      )}
    </ToolLayout>
  );
}
