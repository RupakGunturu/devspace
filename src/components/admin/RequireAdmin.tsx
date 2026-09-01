import { useAuth } from "@/components/AuthProvider";
import { useAdmin } from "@/hooks/useAdmin";
import { Navigate } from "react-router-dom";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  if (authLoading || adminLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-sm text-muted">Loading admin access...</p>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
