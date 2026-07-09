import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function OgMetaPreviewer() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  return (
    <ToolLayout id="og-meta-previewer">
      <ToolInput value={title} onChange={setTitle} placeholder="Page Title" label="Title" rows={1} />
      <ToolInput value={description} onChange={setDescription} placeholder="Page description..." label="Description" rows={2} />
      <ToolInput value={image} onChange={setImage} placeholder="https://example.com/image.png" label="Image URL" rows={1} />
      <ToolInput value={url} onChange={setUrl} placeholder="https://example.com" label="Page URL" rows={1} />
      <div className="space-y-4">
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Twitter / X Preview</span>
          <div className="border border-border rounded-sm overflow-hidden max-w-md">
            {image && <div className="h-48 bg-paper-dim flex items-center justify-center"><img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /></div>}
            <div className="p-3">
              <p className="text-xs text-muted-foreground truncate">{url || "example.com"}</p>
              <p className="text-sm font-bold text-foreground mt-1 line-clamp-2">{title || "Page Title"}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description || "Page description..."}</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
