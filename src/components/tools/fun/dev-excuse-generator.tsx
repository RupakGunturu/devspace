import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function DevExcuseGenerator() {
  const [excuse, setExcuse] = useState("");
  const excuses = [
    "It works on my machine.",
    "There must be a ghost in the machine.",
    "The internet was down... for that specific API call.",
    "Mercury is in retrograde.",
    "The code was written during a full moon.",
    "I blame the intern.",
    "Stack Overflow is down.",
    "The unit tests passed... in an alternate universe.",
    "It's a feature, not a bug.",
    "The requirements changed after I wrote the code.",
    "Git merge conflict — the other developer is wrong.",
    "The deployment pipeline hates me personally.",
    "My cat walked across the keyboard.",
    "It's a known issue... known to me, just not documented.",
    "The database was taking a nap.",
    "I thought the semicolon was optional.",
    "The framework update broke everything. Again.",
    "It worked before the last commit. I swear.",
    "The server was running on hopes and dreams.",
    "Docker said 'image not found' — story of my life.",
    "The test passed on the CI server... once. In 2019.",
    "I refactored it and now nothing works.",
    "TypeScript is angry at me again.",
    "The regex looked correct at 3 AM.",
    "It's a dependency version conflict. Always.",
  ];

  const generate = () => setExcuse(excuses[Math.floor(Math.random() * excuses.length)]);

  return (
    <ToolLayout id="dev-excuse-generator">
      <div className="flex flex-col items-center gap-6 py-4">
        <ToolButton onClick={generate}>Generate Excuse</ToolButton>
        {excuse && (
          <div className="p-6 bg-paper-dim/50 border border-border rounded-sm text-center max-w-lg">
            <p className="font-display text-xl font-bold text-foreground leading-relaxed">&ldquo;{excuse}&rdquo;</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
