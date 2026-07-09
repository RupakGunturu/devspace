import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TechStackSuggester() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const stacks: Record<string, { frontend: string; backend: string; database: string; deploy: string }> = {
    "blog": { frontend: "Next.js + Tailwind CSS", backend: "Next.js API Routes", database: "SQLite or PostgreSQL", deploy: "Vercel" },
    "ecommerce": { frontend: "Next.js + Stripe", backend: "Node.js + Express", database: "PostgreSQL + Redis", deploy: "Railway" },
    "social": { frontend: "React + Socket.io", backend: "Node.js + Socket.io", database: "MongoDB + Redis", deploy: "Render" },
    "dashboard": { frontend: "React + Recharts", backend: "FastAPI or Express", database: "PostgreSQL", deploy: "AWS" },
    "mobile": { frontend: "React Native or Flutter", backend: "Firebase or Supabase", database: "Firestore or PostgreSQL", deploy: "Firebase Hosting" },
    "ai": { frontend: "Next.js + Streamlit", backend: "Python + FastAPI", database: "PostgreSQL + Pinecone", deploy: "HuggingFace Spaces" },
    "portfolio": { frontend: "Next.js + Framer Motion", backend: "Static (no backend)", database: "None (static data)", deploy: "Vercel" },
    "saas": { frontend: "Next.js + shadcn/ui", backend: "Next.js + tRPC", database: "PostgreSQL + Prisma", deploy: "Vercel + PlanetScale" },
  };

  const suggest = () => {
    const lower = input.toLowerCase();
    const match = Object.entries(stacks).find(([key]) => lower.includes(key));
    if (match) {
      const s = match[1];
      setOutput(`Recommended stack for "${match[0]}":\n\nFrontend: ${s.frontend}\nBackend: ${s.backend}\nDatabase: ${s.database}\nDeployment: ${s.deploy}`);
    } else setOutput("Try describing: blog, ecommerce, social, dashboard, mobile, ai, portfolio, saas");
  };

  return (
    <ToolLayout id="tech-stack-suggester">
      <ToolInput value={input} onChange={setInput} placeholder="I want to build a social media app..." label="Project Description" rows={3} />
      <ToolButton onClick={suggest}>Suggest Stack</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
