import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function HmacGenerator() {
  const [message, setMessage] = useState("Hello World");
  const [secret, setSecret] = useState("my-secret-key");
  const [output, setOutput] = useState("");

  const generate = async () => {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
    setOutput(Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join(""));
  };

  return (
    <ToolLayout id="hmac-generator">
      <ToolInput value={message} onChange={setMessage} placeholder="Message to sign" label="Message" rows={2} />
      <ToolInput value={secret} onChange={setSecret} placeholder="Secret key" label="Secret Key" rows={1} />
      <ToolButton onClick={generate}>Generate HMAC-SHA256</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
