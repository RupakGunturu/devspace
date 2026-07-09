import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TwitterCardGenerator() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    setOutput(`<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${title}" />\n<meta name="twitter:description" content="${desc}" />\n<meta name="twitter:image" content="${image}" />`);
  };

  return (
    <ToolLayout id="twitter-card-generator">
      <ToolInput value={title} onChange={setTitle} placeholder="Tweet Title" label="Title" rows={1} />
      <ToolInput value={desc} onChange={setDesc} placeholder="Tweet description" label="Description" rows={2} />
      <ToolInput value={image} onChange={setImage} placeholder="https://..." label="Image URL" rows={1} />
      <ToolButton onClick={generate}>Generate Twitter Card</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
