import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function AES() {
  const [input, setInput] = useState("Hello World");
  const [key, setKey] = useState("my-secret-key-16");
  const [output, setOutput] = useState("");

  const getKey = async (k: string) => {
    const enc = new TextEncoder();
    const keyData = enc.encode(k.padEnd(16, "0").slice(0, 16));
    return crypto.subtle.importKey("raw", keyData, "AES-GCM", false, ["encrypt", "decrypt"]);
  };

  const encrypt = async () => {
    try {
      const cryptoKey = await getKey(key);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, new TextEncoder().encode(input));
      const result = btoa(String.fromCharCode.apply(null, Array.from(iv) as number[]).concat(String.fromCharCode.apply(null, Array.from(new Uint8Array(encrypted)) as number[])));
      setOutput(result);
    } catch { setOutput("Encryption failed"); }
  };

  const decrypt = async () => {
    try {
      const data = Uint8Array.from(atob(input), (c) => c.charCodeAt(0));
      const iv = data.slice(0, 12);
      const encrypted = data.slice(12);
      const cryptoKey = await getKey(key);
      const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cryptoKey, encrypted);
      setOutput(new TextDecoder().decode(decrypted));
    } catch { setOutput("Decryption failed — check input and key"); }
  };

  return (
    <ToolLayout id="aes-encrypt-decrypt">
      <ToolInput value={input} onChange={setInput} placeholder="Text to encrypt/decrypt" label="Text" rows={3} />
      <ToolInput value={key} onChange={setKey} placeholder="16-char key" label="Key (16 chars)" rows={1} />
      <div className="flex gap-2">
        <ToolButton onClick={encrypt}>Encrypt</ToolButton>
        <ToolButton onClick={decrypt} variant="secondary">Decrypt</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
