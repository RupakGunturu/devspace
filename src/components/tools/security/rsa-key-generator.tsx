import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function RsaKeyGenerator() {
  const [keys, setKeys] = useState<{ pub: string; priv: string } | null>(null);

  const generate = async () => {
    const kp = await crypto.subtle.generateKey({ name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["encrypt", "decrypt"]);
    const pubRaw = await crypto.subtle.exportKey("spki", kp.publicKey);
    const privRaw = await crypto.subtle.exportKey("pkcs8", kp.privateKey);
    setKeys({
      pub: "-----BEGIN PUBLIC KEY-----\n" + btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(pubRaw)) as number[])).match(/.{1,64}/g)!.join("\n") + "\n-----END PUBLIC KEY-----",
      priv: "-----BEGIN PRIVATE KEY-----\n" + btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(privRaw)) as number[])).match(/.{1,64}/g)!.join("\n") + "\n-----END PRIVATE KEY-----",
    });
  };

  return (
    <ToolLayout id="rsa-key-generator">
      <ToolButton onClick={generate}>Generate RSA Key Pair</ToolButton>
      {keys && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-paper-dim/50 border border-border rounded-sm">
            <span className="text-xs text-muted-foreground">Public Key</span>
            <button onClick={() => navigator.clipboard.writeText(keys.pub)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-paper-dim">Copy</button>
          </div>
          <pre className="p-3 bg-paper-dim/50 border border-border rounded-sm text-xs font-mono text-foreground overflow-auto max-h-32">{keys.pub}</pre>
          <div className="flex items-center justify-between p-3 bg-paper-dim/50 border border-border rounded-sm">
            <span className="text-xs text-muted-foreground">Private Key</span>
            <button onClick={() => navigator.clipboard.writeText(keys.priv)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-paper-dim">Copy</button>
          </div>
          <pre className="p-3 bg-paper-dim/50 border border-border rounded-sm text-xs font-mono text-foreground overflow-auto max-h-32">{keys.priv}</pre>
        </div>
      )}
    </ToolLayout>
  );
}
