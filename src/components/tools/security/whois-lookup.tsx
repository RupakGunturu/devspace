import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function WhoisLookup() {
  const [domain, setDomain] = useState("example.com");
  const [output, setOutput] = useState("");

  const lookup = () => {
    setOutput(`Domain: ${domain}\nRegistrar: Example Registrar Inc.\nCreated: 2020-01-15\nExpires: 2025-01-15\nUpdated: 2023-06-20\n\nName Servers:\n  ns1.example.com\n  ns2.example.com\n\nStatus: clientTransferProhibited`);
  };

  return (
    <ToolLayout id="whois-lookup">
      <ToolInput value={domain} onChange={setDomain} placeholder="example.com" label="Domain" rows={1} />
      <ToolButton onClick={lookup}>Lookup</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
