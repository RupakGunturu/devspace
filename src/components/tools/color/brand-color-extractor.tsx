import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function BrandColorExtractor() {
  const [company, setCompany] = useState("");
  const [output, setOutput] = useState("");

  const brands: Record<string, string[]> = {
    "google": ["#4285F4", "#EA4335", "#FBBC05", "#34A853"],
    "facebook": ["#1877F2", "#42B72A", "#FAFAFA"],
    "twitter": ["#1DA1F2", "#14171A", "#657786"],
    "instagram": ["#E4405F", "#FCAF45", "#C13584", "#833AB4"],
    "spotify": ["#1DB954", "#191414"],
    "netflix": ["#E50914", "#221F1F"],
    "amazon": ["#FF9900", "#232F3E"],
    "apple": ["#000000", "#F5F5F7", "#0071E3"],
    "microsoft": ["#00A4EF", "#7FBA00", "#F25022", "#FFB900"],
  };

  const extract = () => {
    const lower = company.toLowerCase();
    const match = Object.entries(brands).find(([key]) => lower.includes(key));
    if (match) setOutput(`${match[0]}:\n${match[1].map((c) => `${c}  ████`).join("\n")}`);
    else setOutput("Try: google, facebook, twitter, instagram, spotify, netflix, amazon, apple, microsoft");
  };

  return (
    <ToolLayout id="brand-color-extractor">
      <ToolInput value={company} onChange={setCompany} placeholder="Google" label="Company Name" rows={1} />
      <ToolButton onClick={extract}>Extract Colors</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
