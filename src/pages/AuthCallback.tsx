import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/components/ui/toaster";
import { mergeLocalActivityToBackend } from "@/lib/mergeActivity";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    const token = searchParams.get("token");
    const isPopup = searchParams.get("popup") === "true";

    if (token) {
      handled.current = true;

      if (isPopup && window.opener) {
        window.opener.postMessage({ type: "google-auth-success", token }, window.location.origin);
        window.close();
        return;
      }

      localStorage.setItem("ds_token", token);
      refreshUser().then(() => {
        mergeLocalActivityToBackend().catch(() => {});
        toast.success("Signed in with Google!");
        navigate("/");
      });
    } else {
      handled.current = true;

      if (isPopup && window.opener) {
        window.opener.postMessage({ type: "google-auth-error", error: "No token received" }, window.location.origin);
        window.close();
        return;
      }

      toast.danger("Authentication failed");
      navigate("/login");
    }
  }, [searchParams, refreshUser, navigate]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-4xl">⏳</div>
        <p className="text-sm text-muted">Signing you in...</p>
      </div>
    </div>
  );
}
