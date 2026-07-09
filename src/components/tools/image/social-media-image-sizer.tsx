import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";

export default function SocialMediaImageSizer() {
  const platforms = [
    { name: "Twitter/X Post", width: 1200, height: 675, ratio: "16:9" },
    { name: "Twitter/X Header", width: 1500, height: 500, ratio: "3:1" },
    { name: "Facebook Post", width: 1200, height: 630, ratio: "~1.91:1" },
    { name: "Facebook Cover", width: 820, height: 312, ratio: "~2.63:1" },
    { name: "Instagram Post", width: 1080, height: 1080, ratio: "1:1" },
    { name: "Instagram Story", width: 1080, height: 1920, ratio: "9:16" },
    { name: "LinkedIn Post", width: 1200, height: 627, ratio: "~1.91:1" },
    { name: "YouTube Thumbnail", width: 1280, height: 720, ratio: "16:9" },
    { name: "Pinterest Pin", width: 1000, height: 1500, ratio: "2:3" },
  ];

  return (
    <ToolLayout id="social-media-image-sizer">
      <div className="space-y-1.5">
        {platforms.map((p) => (
          <div key={p.name} className="flex items-center justify-between p-3 bg-paper-dim/50 border border-border rounded-sm">
            <span className="text-sm font-medium text-foreground">{p.name}</span>
            <span className="font-mono text-xs text-muted-foreground">{p.width}×{p.height} ({p.ratio})</span>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
