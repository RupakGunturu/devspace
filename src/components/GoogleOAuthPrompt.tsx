import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { authApi } from "@/lib/api";
import { openGoogleAuthPopup } from "@/lib/popupAuth";
import { toast } from "@/components/ui/toaster";
import { mergeLocalActivityToBackend } from "@/lib/mergeActivity";
import GoogleIcon from "@/components/GoogleIcon";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean; isDismissedMoment: () => boolean }) => void) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

const DISMISS_KEY = "ds_prompt_dismissed";

export default function GoogleOAuthPrompt() {
  const { user, refreshUser } = useAuth();
  const { theme } = useTheme();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(DISMISS_KEY) === "true");
  const [oneTapFailed, setOneTapFailed] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);
  const initialized = useRef(false);

  const handleCredential = useCallback(async (credential: string) => {
    try {
      const { token, user: authUser } = await authApi.verifyGoogleToken(credential);
      localStorage.setItem("ds_token", token);
      await refreshUser();
      mergeLocalActivityToBackend().catch(() => {});
      toast.success(`Welcome${authUser.name ? `, ${authUser.name}` : ""}!`);
    } catch {
      toast.danger("Google sign-in failed");
    }
  }, [refreshUser]);

  useEffect(() => {
    if (user || dismissed) return;

    const tryOneTap = () => {
      if (!window.google?.accounts?.id || initialized.current) return;
      initialized.current = true;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
        callback: (response: { credential?: string }) => {
          if (response.credential) {
            handleCredential(response.credential);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        context: "signin",
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setOneTapFailed(true);
        }
      });
    };

    if (window.google?.accounts?.id) {
      tryOneTap();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          tryOneTap();
        }
      }, 200);
      const timeout = setTimeout(() => clearInterval(interval), 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [user, dismissed, handleCredential]);

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  const handlePopupGoogle = async () => {
    setPopupLoading(true);
    try {
      const { token } = await openGoogleAuthPopup();
      localStorage.setItem("ds_token", token);
      await refreshUser();
      mergeLocalActivityToBackend().catch(() => {});
      toast.success("Signed in with Google!");
    } catch (err: unknown) {
      if (err instanceof Error && err.message !== "Authentication cancelled") {
        toast.danger(err.message || "Google sign-in failed");
      }
    } finally {
      setPopupLoading(false);
    }
  };

  if (user || dismissed) return null;

  if (!oneTapFailed) {
    return (
      <div className="pointer-events-none fixed bottom-4 left-3 right-3 sm:bottom-auto sm:right-6 sm:left-auto sm:top-20 z-30">
        <div id="google-one-tap-container" className="pointer-events-auto" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:bottom-auto sm:right-6 sm:left-auto sm:top-20 z-30 w-auto sm:w-[300px] rounded-md border-2 border-line bg-paper p-5 shadow-lg">
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-3 top-3 text-muted transition-colors hover:text-foreground"
        aria-label="Dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="2" y1="2" x2="12" y2="12" />
          <line x1="12" y1="2" x2="2" y2="12" />
        </svg>
      </button>

      <div className="mb-3 flex items-center gap-2">
        <GoogleIcon className="shrink-0" />
        <span className="font-display text-sm font-bold">Sign in to DevSpace</span>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-muted">
        Save your game scores, favorites, and progress across devices.
      </p>

      <button
        type="button"
        onClick={handlePopupGoogle}
        disabled={popupLoading}
        className="flex w-full items-center justify-center gap-3 rounded-md border-[1.5px] border-line bg-paper-dim px-4 py-3 text-xs font-semibold text-foreground transition-all hover:border-foreground disabled:opacity-50"
      >
        <GoogleIcon className="shrink-0" />
        {popupLoading ? "Signing in..." : "Continue with Google"}
      </button>

      <div className="mt-3 text-center">
        <Link to="/login" className="text-[11px] font-medium text-foreground no-underline hover:underline">
          or sign in with email
        </Link>
      </div>
    </div>
  );
}
