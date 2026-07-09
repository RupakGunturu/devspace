import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function OpenGraphGenerator() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    setOutput(`<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${desc}" />\n<meta property="og:image" content="${image}" />\n<meta property="og:url" content="${url}" />\n<meta property="og:type" content="website" />`);
  };

  return (
    <ToolLayout id="open-graph-generator">
      <ToolInput value={title} onChange={setTitle} placeholder="Page Title" label="Title" rows={1} />
      <ToolInput value={desc} onChange={setDesc} placeholder="Page description" label="Description" rows={2} />
      <ToolInput value={image} onChange={setImage} placeholder="https://..." label="Image URL" rows={1} />
      <ToolInput value={url} onChange={setUrl} placeholder="https://..." label="Page URL" rows={1} />
      <ToolButton onClick={generate}>Generate OG Tags</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
