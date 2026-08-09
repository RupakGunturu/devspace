import { authApi } from "@/lib/api";
import GoogleIcon from "@/components/GoogleIcon";

interface GoogleLoginPopupProps {
  children?: React.ReactNode;
  className?: string;
  redirectTo?: string;
  showIcon?: boolean;
}

export default function GoogleLoginPopup({
  children,
  className = "",
  redirectTo = "/",
  showIcon = true,
}: GoogleLoginPopupProps) {
  const handleClick = () => {
    sessionStorage.setItem("ds_redirect", redirectTo);
    window.location.assign(authApi.getGoogleUrl());
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center justify-center gap-3 rounded-md border-[1.5px] border-line bg-paper-dim px-4 py-3 text-sm font-semibold text-foreground transition-all hover:border-foreground ${className}`}
    >
      {showIcon && <GoogleIcon className="shrink-0" />}
      {children || "Continue with Google"}
    </button>
  );
}
