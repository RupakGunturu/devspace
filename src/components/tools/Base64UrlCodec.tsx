import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolInput } from "./ToolInput";
import { ToolOutput } from "./ToolOutput";
import { ToolToggleGroup } from "./ToolToggleGroup";

type Mode = "b64-enc" | "b64-dec" | "url-enc" | "url-dec";

function run(mode: Mode, input: string): string {
  try {
    switch (mode) {
      case "b64-enc":
        return typeof window === "undefined" ? "" : window.btoa(unescape(encodeURIComponent(input)));
      case "b64-dec":
        return typeof window === "undefined" ? "" : decodeURIComponent(escape(window.atob(input.trim())));
      case "url-enc":
        return encodeURIComponent(input);
      case "url-dec":
        return decodeURIComponent(input);
    }
  } catch (e) {
    return `⚠ ${(e as Error).message}`;
  }
}

export function Base64UrlCodec() {
  const [mode, setMode] = useState<Mode>("b64-enc");
  const [input, setInput] = useState("hello, devspace");
  const output = run(mode, input);
  return (
    <ToolLayout id="base64-url-codec">
      <ToolToggleGroup
        options={[
          { value: "b64-enc", label: "Base64 Encode" },
          { value: "b64-dec", label: "Base64 Decode" },
          { value: "url-enc", label: "URL Encode" },
          { value: "url-dec", label: "URL Decode" },
        ]}
        value={mode}
        onChange={(v) => setMode(v as Mode)}
      />
      <ToolInput value={input} onChange={setInput} placeholder="Enter text..." label="Input" rows={5} />
      <ToolOutput value={output} label="Output" />
    </ToolLayout>
  );
}
