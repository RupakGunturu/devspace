import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function SslDecoder() {
  const [pem, setPem] = useState("");
  const [output, setOutput] = useState("");

  const decode = () => {
    try {
      const base64 = pem.replace(/-----BEGIN CERTIFICATE-----/, "").replace(/-----END CERTIFICATE-----/, "").replace(/\s/g, "");
      const decoded = atob(base64);
      setOutput(`Certificate decoded successfully!\n\nLength: ${decoded.length} bytes\n\nNote: Full X.509 parsing requires a dedicated library. This shows the raw decoded data.`);
    } catch { setOutput("Invalid PEM certificate format"); }
  };

  return (
    <ToolLayout id="ssl-decoder">
      <ToolInput value={pem} onChange={setPem} placeholder="-----BEGIN CERTIFICATE-----&#10;MIIB...&#10;-----END CERTIFICATE-----" label="PEM Certificate" rows={8} />
      <ToolButton onClick={decode}>Decode</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
