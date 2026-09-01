import { useState, useEffect } from "react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const check = async () => {
      // If the profile we already have marks admin, skip the extra request.
      if (user?.role === "admin") {
        if (active) {
          setIsAdmin(true);
          setLoading(false);
        }
        return;
      }

      try {
        const { user: fetched } = await authApi.getMe();
        if (active) {
          setIsAdmin(fetched.role === "admin");
        }
      } catch {
        if (active) setIsAdmin(false);
      } finally {
        if (active) setLoading(false);
      }
    };

    check();
    return () => {
      active = false;
    };
  }, [user]);

  return { isAdmin, loading };
}
