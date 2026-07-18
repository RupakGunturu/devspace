import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { openGoogleAuthPopup } from "@/lib/popupAuth";
import { toast } from "@/components/ui/toaster";
import { mergeLocalActivityToBackend } from "@/lib/mergeActivity";
import GoogleIcon from "@/components/GoogleIcon";

interface GoogleLoginPopupProps {
  children?: React.ReactNode;
  className?: string;
  onSuccess?: () => void;
  showIcon?: boolean;
}

export default function GoogleLoginPopup({
  children,
  className = "",
  onSuccess,
  showIcon = true,
}: GoogleLoginPopupProps) {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { token } = await openGoogleAuthPopup();
      localStorage.setItem("ds_token", token);
      await refreshUser();
      mergeLocalActivityToBackend().catch(() => {});
      toast.success("Signed in with Google!");
      onSuccess?.();
    } catch (err: any) {
      if (err.message !== "Authentication cancelled") {
        toast.danger(err.message || "Google sign-in failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center justify-center gap-3 rounded-md border-[1.5px] border-line bg-paper-dim px-4 py-3 text-sm font-semibold text-foreground transition-all hover:border-foreground disabled:opacity-50 ${className}`}
    >
      {showIcon && <GoogleIcon className="shrink-0" />}
      {children || (loading ? "Signing in..." : "Continue with Google")}
    </button>
  );
}
