import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const tags = [
      `<title>${title}</title>`,
      `<meta name="description" content="${description}" />`,
      keywords && `<meta name="keywords" content="${keywords}" />`,
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${description}" />`,
      ogImage && `<meta property="og:image" content="${ogImage}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${title}" />`,
      `<meta name="twitter:description" content="${description}" />`,
    ].filter(Boolean);
    setOutput(tags.join("\n"));
  };

  return (
    <ToolLayout id="meta-tag-generator">
      <ToolInput value={title} onChange={setTitle} placeholder="Page title" label="Title" rows={1} />
      <ToolInput value={description} onChange={setDescription} placeholder="Page description" label="Description" rows={2} />
      <ToolInput value={keywords} onChange={setKeywords} placeholder="keyword1, keyword2" label="Keywords" rows={1} />
      <ToolInput value={ogImage} onChange={setOgImage} placeholder="https://..." label="OG Image URL" rows={1} />
      <ToolButton onClick={generate}>Generate Meta Tags</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
