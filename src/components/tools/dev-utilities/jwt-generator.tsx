import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function JwtGenerator() {
  const [header, setHeader] = useState('{"alg":"HS256","typ":"JWT"}');
  const [payload, setPayload] = useState('{"sub":"1234567890","name":"John Doe","iat":1516239022}');
  const [output, setOutput] = useState("");

  const generate = () => {
    try {
      const h = btoa(header).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      const p = btoa(payload).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      setOutput(`${h}.${p}.[signature]`);
    } catch { setOutput("Invalid JSON"); }
  };

  return (
    <ToolLayout id="jwt-generator">
      <ToolInput value={header} onChange={setHeader} placeholder='{"alg":"HS256"}' label="Header (JSON)" rows={3} />
      <ToolInput value={payload} onChange={setPayload} placeholder='{"sub":"123"}' label="Payload (JSON)" rows={3} />
      <ToolButton onClick={generate}>Generate JWT</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
