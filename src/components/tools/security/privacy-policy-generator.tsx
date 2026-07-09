import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function PrivacyPolicyGenerator() {
  const [appName, setAppName] = useState("");
  const [dataCollected, setDataCollected] = useState("");
  const [email, setEmail] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const items = dataCollected.split(",").map((d) => d.trim()).filter(Boolean);
    setOutput(`# Privacy Policy for ${appName || "Our App"}\n\nLast updated: ${new Date().toLocaleDateString()}\n\n## Information We Collect\n\nWe collect the following information:\n${items.map((i) => `- ${i}`).join("\n") || "- No personal data collected"}\n\n## How We Use Your Information\n\nWe use the collected information to provide and improve our services.\n\n## Data Security\n\nWe implement appropriate security measures to protect your personal information.\n\n## Contact Us\n\nIf you have questions about this privacy policy, contact us at ${email || "privacy@example.com"}.`);
  };

  return (
    <ToolLayout id="privacy-policy-generator">
      <ToolInput value={appName} onChange={setAppName} placeholder="My App" label="App Name" rows={1} />
      <ToolInput value={dataCollected} onChange={setDataCollected} placeholder="name, email, usage data" label="Data Collected (comma separated)" rows={1} />
      <ToolInput value={email} onChange={setEmail} placeholder="privacy@example.com" label="Contact Email" rows={1} />
      <ToolButton onClick={generate}>Generate Policy</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
