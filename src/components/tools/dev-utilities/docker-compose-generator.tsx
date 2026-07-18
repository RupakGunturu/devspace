import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function DockerComposeGenerator() {
  const [services, setServices] = useState([{ name: "app", image: "node:18", ports: "3000:3000", env: "" }]);
  const [output, setOutput] = useState("");

  const addService = () => setServices([...services, { name: "", image: "", ports: "", env: "" }]);
  const updateService = (i: number, field: string, value: string) => setServices(services.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  const removeService = (i: number) => setServices(services.filter((_, idx) => idx !== i));

  const generate = () => {
    const svcs = services.filter((s) => s.name && s.image).map((s) => {
      let svc = `  ${s.name}:\n    image: ${s.image}`;
      if (s.ports) svc += `\n    ports:\n      - "${s.ports}"`;
      if (s.env) svc += `\n    environment:\n      - ${s.env}`;
      return svc;
    }).join("\n\n");
    setOutput(`version: '3.8'\n\nservices:\n${svcs}`);
  };

  return (
    <ToolLayout id="docker-compose-generator">
      <div className="space-y-3">
        {services.map((s, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
            <input value={s.name} onChange={(e) => updateService(i, "name", e.target.value)} placeholder="service" className="p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" />
            <input value={s.image} onChange={(e) => updateService(i, "image", e.target.value)} placeholder="image" className="p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" />
            <input value={s.ports} onChange={(e) => updateService(i, "ports", e.target.value)} placeholder="3000:3000" className="p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" />
            <button onClick={() => removeService(i)} className="text-xs text-coral hover:text-coral">✕</button>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <ToolButton onClick={addService} variant="secondary">Add Service</ToolButton>
        <ToolButton onClick={generate}>Generate</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
