import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function UtmBuilder() {
  const [url, setUrl] = useState("https://example.com");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [output, setOutput] = useState("");

  const build = () => {
    const params = new URLSearchParams();
    if (source) params.set("utm_source", source);
    if (medium) params.set("utm_medium", medium);
    if (campaign) params.set("utm_campaign", campaign);
    if (term) params.set("utm_term", term);
    if (content) params.set("utm_content", content);
    setOutput(`${url}?${params.toString()}`);
  };

  return (
    <ToolLayout id="utm-builder">
      <ToolInput value={url} onChange={setUrl} placeholder="https://example.com" label="Base URL" rows={1} />
      <div className="grid grid-cols-2 gap-4">
        <ToolInput value={source} onChange={setSource} placeholder="google" label="Source" rows={1} />
        <ToolInput value={medium} onChange={setMedium} placeholder="cpc" label="Medium" rows={1} />
        <ToolInput value={campaign} onChange={setCampaign} placeholder="spring_sale" label="Campaign" rows={1} />
        <ToolInput value={term} onChange={setTerm} placeholder="running+shoes" label="Term" rows={1} />
        <ToolInput value={content} onChange={setContent} placeholder="banner_ad" label="Content" rows={1} />
      </div>
      <ToolButton onClick={build}>Build URL</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
