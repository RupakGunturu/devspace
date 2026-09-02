import { useAuth } from "@/components/AuthProvider";
import { useAdmin } from "@/hooks/useAdmin";
import { Navigate, useLocation } from "react-router-dom";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const location = useLocation();

  if (authLoading || adminLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-sm text-muted">Loading admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return <>{children}</>;
}
