import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function RegexGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const patterns: Record<string, string> = {
    "email": "/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/",
    "phone": "/^\\+?[\\d\\s-]{10,}$/",
    "url": "/^https?:\\/\\/.+$/",
    "ip address": "/^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$/",
    "date": "/^\\d{4}-\\d{2}-\\d{2}$/",
    "hex color": "/^#?([a-fA-F0-9]{6}|[a-fA-F0-3])$/",
    "username": "/^[a-zA-Z0-9_]{3,20}$/",
    "password": "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/",
    "numeric": "/^\\d+$/",
    "alphanumeric": "/^[a-zA-Z0-9]+$/",
    "slug": "/^[a-z0-9]+(?:-[a-z0-9]+)*$/",
    "html tag": "/^<([a-z]+)([^<]*)>(.*)<\\/\\1>$/",
  };

  const generate = () => {
    const lower = input.toLowerCase();
    const match = Object.entries(patterns).find(([key]) => lower.includes(key));
    if (match) setOutput(`${match[0]}: ${match[1]}`);
    else setOutput("No matching pattern. Try: email, phone, url, ip address, date, hex color, username, password, numeric, alphanumeric, slug, html tag");
  };

  return (
    <ToolLayout id="regex-generator">
      <ToolInput value={input} onChange={setInput} placeholder="email validation" label="Describe pattern" rows={2} />
      <ToolButton onClick={generate}>Generate Regex</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
