import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";

const naming: Record<string, { rule: string; examples: string[] }> = {
  "Variables": { rule: "Use camelCase for variables and functions", examples: ["userName", "isActive", "totalPrice"] },
  "Constants": { rule: "Use UPPER_SNAKE_CASE for constants", examples: ["API_URL", "MAX_RETRIES", "DEFAULT_TIMEOUT"] },
  "Classes": { rule: "Use PascalCase for classes and components", examples: ["UserService", "AppRouter", "UserProfile"] },
  "Files": { rule: "Use kebab-case for file names", examples: ["user-service.ts", "app-router.tsx", "user-profile.tsx"] },
  "CSS Classes": { rule: "Use BEM or kebab-case for CSS classes", examples: ["user-card", "btn-primary", "nav__item--active"] },
  "Private": { rule: "Prefix with underscore for private members", examples: ["_userId", "_fetchData()", "_isValid"] },
  "Boolean": { rule: "Use is/has/can prefix for booleans", examples: ["isActive", "hasPermission", "canEdit"] },
  "Event Handlers": { rule: "Use handle/on prefix for event handlers", examples: ["handleSubmit", "onClick", "onChange"] },
};

export default function NamingConventionGuide() {
  return (
    <ToolLayout id="naming-convention-guide">
      <div className="space-y-3">
        {Object.entries(naming).map(([name, { rule, examples }]) => (
          <div key={name} className="p-4 bg-paper-dim/50 border border-border rounded-sm">
            <h3 className="font-display font-bold text-sm text-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{rule}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {examples.map((e) => <code key={e} className="px-2 py-1 text-xs font-mono bg-paper-dim border border-border rounded">{e}</code>)}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
