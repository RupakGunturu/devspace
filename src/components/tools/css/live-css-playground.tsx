import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function LiveCssPlayground() {
  const [css, setCss] = useState("background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\ncolor: white;\npadding: 2rem;\nborder-radius: 12px;\ntext-align: center;\nfont-size: 1.5rem;\nfont-weight: bold;\nbox-shadow: 0 10px 30px rgba(0,0,0,0.2);");

  return (
    <ToolLayout id="live-css-playground">
      <ToolInput value={css} onChange={setCss} placeholder="Write CSS here..." label="CSS" rows={10} />
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Live Preview</label>
        <div
          className="w-full min-h-[200px] border border-border rounded-sm overflow-hidden"
        >
          <div style={Object.fromEntries(css.split("\n").filter(Boolean).map((line) => {
            const [prop, ...valParts] = line.split(":");
            return [prop.trim(), valParts.join(":").trim().replace(";", "")];
          }))}>
            Hello World! This is a preview element.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
