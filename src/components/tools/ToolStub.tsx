import { Lock } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Link } from "react-router-dom";

export default function ToolStub({ name, description }: { name: string; description: string }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-yellow/10 p-4">
          <Lock className="h-8 w-8 text-yellow" />
        </div>
        <h3 className="mb-2 font-display text-lg font-bold">{name}</h3>
        <p className="mb-4 max-w-sm text-sm text-muted">{description}</p>
        <Link
          to="/login"
          className="rounded-md bg-yellow px-6 py-2.5 font-mono text-xs font-bold text-ink no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(244,217,34,0.4)]"
        >
          Sign in to use this tool
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h3 className="mb-2 font-display text-lg font-bold">{name}</h3>
      <p className="mb-4 max-w-sm text-sm text-muted">{description}</p>
      <div className="rounded-md border border-line bg-paper-dim px-6 py-3 text-sm text-muted">
        Full version coming soon.
      </div>
    </div>
  );
}
