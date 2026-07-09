import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function EslintRuleExplorer() {
  const [search, setSearch] = useState("");
  const [output, setOutput] = useState("");

  const rules: Record<string, string> = {
    "no-console": "Disallow console statements — remove before production",
    "eqeqeq": "Require strict equality (=== instead of ==)",
    "no-unused-vars": "Disallow unused variables",
    "no-var": "Disallow var — use const/let instead",
    "prefer-const": "Suggest using const for variables never reassigned",
    "no-implicit-coercion": "Disallow shorthand type conversions",
    "no-duplicate-imports": "Disallow duplicate imports",
    "no-shadow": "Disallow variable declarations from shadowing outer scope",
    "prefer-template": "Suggest using template literals over string concatenation",
    "no-eval": "Disallow eval() usage",
    "no-implied-eval": "Disallow implied eval()",
    "no-new-func": "Disallow Function constructor",
    "no-return-assign": "Disallow assignment in return statement",
    "no-self-compare": "Disallow comparisons to self",
    "no-sequences": "Disallow comma operator",
    "no-throw-literal": "Disallow throwing literal exceptions",
    "no-unmodified-loop-condition": "Disallow unmodified loop conditions",
    "no-unused-expressions": "Disallow unused expressions",
    "no-useless-call": "Disallow unnecessary Function.call()",
    "no-useless-return": "Disallow unnecessary return statements",
  };

  const search_rules = () => {
    const matches = Object.entries(rules).filter(([key, desc]) => key.includes(search.toLowerCase()) || desc.toLowerCase().includes(search.toLowerCase()));
    setOutput(matches.length > 0 ? matches.map(([k, v]) => `${k}\n  → ${v}`).join("\n\n") : "No rules found. Try: console, var, unused, const, eval");
  };

  return (
    <ToolLayout id="eslint-rule-explorer">
      <ToolInput value={search} onChange={setSearch} placeholder="console" label="Search Rules" rows={1} />
      <ToolButton onClick={search_rules}>Search</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
