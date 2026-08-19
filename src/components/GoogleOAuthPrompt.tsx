import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useGoogleIdentity } from "@/components/GoogleIdentityProvider";
import { authApi } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import { mergeLocalActivityToBackend } from "@/lib/mergeActivity";
import { clearLastAccount, getLastAccount } from "@/lib/rememberAccount";
import GoogleIcon from "@/components/GoogleIcon";
import GoogleLoginPopup from "@/components/GoogleLoginPopup";

const DISMISS_KEY = "ds_prompt_dismissed";

function AccountAvatar({
  name,
  avatar,
  size = "h-12 w-12 text-xl",
}: {
  name: string;
  avatar?: string;
  size?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-full bg-green/10 font-display font-bold text-green ${size}`}
    >
      {avatar ? (
        <img src={avatar} alt="" className="h-full w-full rounded-full object-cover" />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </div>
  );
}

function DismissButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-3 text-muted transition-colors hover:text-foreground"
      aria-label="Dismiss"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1="2" y1="2" x2="12" y2="12" />
        <line x1="12" y1="2" x2="2" y2="12" />
      </svg>
    </button>
  );
}

export default function GoogleOAuthPrompt() {
  const { user, refreshUser } = useAuth();
  const { detected, clearDetected } = useGoogleIdentity();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(DISMISS_KEY) === "true");
  const [continuing, setContinuing] = useState(false);

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  const handleContinueAs = async () => {
    setContinuing(true);
    try {
      await refreshUser();
      if (!localStorage.getItem("ds_token")) {
        navigate("/login");
      }
    } catch {
      toast.danger("Couldn't verify your session — sign in again");
      navigate("/login");
    } finally {
      setContinuing(false);
    }
  };

  const handleDetectedContinue = async () => {
    const account = detected;
    if (!account) return;
    setContinuing(true);
    try {
      const { token } = await authApi.verifyGoogleToken(account.credential);
      localStorage.setItem("ds_token", token);
      await refreshUser();
      mergeLocalActivityToBackend().catch(() => {});
      toast.success(`Welcome${account.name ? `, ${account.name}` : ""}!`);
    } catch {
      toast.danger("Google sign-in failed");
      clearDetected();
    } finally {
      setContinuing(false);
    }
  };

  const handleDetectedUseAnotherAccount = () => {
    clearDetected();
    clearLastAccount();
    window.location.assign(authApi.getGoogleUrl());
  };

  const handleUseAnotherAccount = () => {
    clearLastAccount();
    handleDismiss();
    navigate("/login");
  };

  if (user) return null;

  if (dismissed) return null;

  if (detected) {
    return (
      <div className="fixed bottom-4 left-0 right-0 z-30 w-auto rounded-md border-2 border-line bg-paper p-3 sm:p-4 shadow-lg sm:bottom-auto sm:left-auto sm:right-6 sm:top-20 sm:w-[320px]">
        <DismissButton onClick={handleDismiss} />
        <div className="flex flex-col items-center text-center">
          <AccountAvatar name={detected.name} avatar={detected.avatar} size="h-14 w-14 text-2xl" />
          <p className="mb-1 mt-3 font-display text-base font-bold">Continue as {detected.name}</p>
          <p className="mb-4 max-w-full truncate text-xs text-muted">{detected.email}</p>
          <button
            type="button"
            onClick={handleDetectedContinue}
            disabled={continuing}
            className="w-full rounded-md border-0 bg-green px-4 py-2.5 text-sm font-bold text-ink transition-all hover:opacity-85 disabled:opacity-50"
          >
            {continuing ? "Continuing..." : "Continue"}
          </button>
          <button
            type="button"
            onClick={handleDetectedUseAnotherAccount}
            className="mt-3 cursor-pointer border-0 bg-transparent p-0 font-inherit text-[11px] font-medium text-yellow no-underline hover:underline"
          >
            Use another account
          </button>
        </div>
      </div>
    );
  }

  const lastUser = getLastAccount();

  if (lastUser) {
    return (
      <div className="fixed bottom-4 left-0 right-0 z-30 w-auto rounded-md border-2 border-line bg-paper p-3 sm:p-4 shadow-lg sm:bottom-auto sm:left-auto sm:right-6 sm:top-20 sm:w-[320px]">
        <DismissButton onClick={handleDismiss} />
        <div className="flex flex-col items-center text-center">
          <AccountAvatar name={lastUser.name} avatar={lastUser.avatar} size="h-14 w-14 text-2xl" />
          <p className="mb-1 mt-3 font-display text-base font-bold">Continue as {lastUser.name}</p>
          <p className="mb-4 max-w-full truncate text-xs text-muted">{lastUser.email}</p>
          <button
            type="button"
            onClick={handleContinueAs}
            disabled={continuing}
            className="w-full rounded-md border-0 bg-green px-4 py-2.5 text-sm font-bold text-ink transition-all hover:opacity-85 disabled:opacity-50"
          >
            {continuing ? "Continuing..." : "Continue"}
          </button>
          <button
            type="button"
            onClick={handleUseAnotherAccount}
            className="mt-3 cursor-pointer border-0 bg-transparent p-0 font-inherit text-[11px] font-medium text-yellow no-underline hover:underline"
          >
            Use another account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-auto sm:right-6 sm:left-auto sm:top-20 z-30 w-auto sm:w-[300px] rounded-md border-2 border-line bg-paper p-2.5 sm:p-4 shadow-lg">
      <DismissButton onClick={handleDismiss} />

      <div className="mb-2 flex items-center gap-2">
        <GoogleIcon className="shrink-0" />
        <span className="font-display text-sm font-bold">Sign in to DevSpace</span>
      </div>

      <p className="mb-3 text-xs leading-relaxed text-muted">
        Save your game scores, favorites, and progress across devices.
      </p>

      <GoogleLoginPopup className="w-full" />

      <p className="mt-1.5 text-center text-[10px] leading-relaxed text-muted">
        Your name, email, and avatar will be imported from your Google account.
      </p>

      <div className="mt-2 text-center">
        <Link
          to="/login"
          className="text-[11px] font-medium text-foreground no-underline hover:underline"
        >
          or sign in with email
        </Link>
      </div>
    </div>
  );
}
