import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function SitemapGenerator() {
  const [urls, setUrls] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const lines = urls.split("\n").filter(Boolean);
    const today = new Date().toISOString().split("T")[0];
    const entries = lines.map((url) => `  <url>\n    <loc>${url.trim()}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join("\n");
    setOutput(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`);
  };

  return (
    <ToolLayout id="sitemap-generator">
      <ToolInput value={urls} onChange={setUrls} placeholder="https://example.com/&#10;https://example.com/about&#10;https://example.com/contact" label="URLs (one per line)" rows={8} />
      <ToolButton onClick={generate}>Generate Sitemap</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
