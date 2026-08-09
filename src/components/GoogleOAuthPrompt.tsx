import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { authApi } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import { mergeLocalActivityToBackend } from "@/lib/mergeActivity";
import { clearLastAccount, getLastAccount } from "@/lib/rememberAccount";
import GoogleIcon from "@/components/GoogleIcon";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (
            callback?: (notification: {
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
              isDismissedMoment: () => boolean;
            }) => void,
          ) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

const DISMISS_KEY = "ds_prompt_dismissed";
const CARD_DISMISS_KEY = "ds_continue_dismissed";

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
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(DISMISS_KEY) === "true");
  const [cardDismissed, setCardDismissed] = useState(
    () => sessionStorage.getItem(CARD_DISMISS_KEY) === "true",
  );
  const [oneTapFailed, setOneTapFailed] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const initialized = useRef(false);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const buttonRendered = useRef(false);

  const handleCredential = useCallback(
    async (credential: string) => {
      try {
        const { token, user: authUser } = await authApi.verifyGoogleToken(credential);
        localStorage.setItem("ds_token", token);
        await refreshUser();
        mergeLocalActivityToBackend().catch(() => {});
        toast.success(`Welcome${authUser.name ? `, ${authUser.name}` : ""}!`);
      } catch {
        toast.danger("Google sign-in failed");
      }
    },
    [refreshUser],
  );

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

  useEffect(() => {
    if (!oneTapFailed || !buttonContainerRef.current || buttonRendered.current) return;
    if (!window.google?.accounts?.id) return;
    buttonRendered.current = true;
    window.google.accounts.id.renderButton(buttonContainerRef.current, {
      theme: theme === "dark" ? "filled_black" : "outline",
      size: "large",
      width: buttonContainerRef.current.offsetWidth || 280,
      text: "continue_with",
      shape: "rectangular",
    });
  }, [oneTapFailed, theme]);

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  const handleCardDismiss = () => {
    sessionStorage.setItem(CARD_DISMISS_KEY, "true");
    setCardDismissed(true);
  };

  const handleContinueAs = async () => {
    setContinuing(true);
    try {
      await refreshUser();
      if (!localStorage.getItem("ds_token")) {
        navigate("/login");
      }
    } finally {
      setContinuing(false);
    }
  };

  const handleUseAnotherAccount = () => {
    clearLastAccount();
    handleDismiss();
    navigate("/login");
  };

  if (user) {
    if (pathname !== "/" || cardDismissed) return null;
    return (
      <div className="fixed bottom-4 left-3 right-3 z-30 w-auto rounded-md border-2 border-line bg-paper p-5 shadow-lg sm:bottom-auto sm:left-auto sm:right-6 sm:top-20 sm:w-[320px]">
        <DismissButton onClick={handleCardDismiss} />
        <div className="flex items-center gap-3">
          <AccountAvatar name={user.name} avatar={user.avatar} />
          <div className="min-w-0">
            <p className="font-display text-sm font-bold">Continue as {user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 w-full rounded-md border-0 bg-green px-4 py-2.5 text-sm font-bold text-ink transition-all hover:opacity-85"
        >
          Continue to DevSpace
        </button>
      </div>
    );
  }

  if (dismissed) return null;

  if (!oneTapFailed) {
    return (
      <div className="pointer-events-none fixed bottom-4 left-3 right-3 z-30 sm:bottom-auto sm:left-auto sm:right-6 sm:top-20">
        <div id="google-one-tap-container" className="pointer-events-auto" />
      </div>
    );
  }

  const lastUser = getLastAccount();

  if (lastUser) {
    return (
      <div className="fixed bottom-4 left-3 right-3 z-30 w-auto rounded-md border-2 border-line bg-paper p-5 shadow-lg sm:bottom-auto sm:left-auto sm:right-6 sm:top-20 sm:w-[320px]">
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
    <div className="fixed bottom-4 left-3 right-3 sm:bottom-auto sm:right-6 sm:left-auto sm:top-20 z-30 w-auto sm:w-[300px] rounded-md border-2 border-line bg-paper p-5 shadow-lg">
      <DismissButton onClick={handleDismiss} />

      <div className="mb-3 flex items-center gap-2">
        <GoogleIcon className="shrink-0" />
        <span className="font-display text-sm font-bold">Sign in to DevSpace</span>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-muted">
        Save your game scores, favorites, and progress across devices.
      </p>

      <div ref={buttonContainerRef} className="w-full" />

      <p className="mt-2 text-center text-[10px] leading-relaxed text-muted">
        Your name, email, and avatar will be imported from your Google account.
      </p>

      <div className="mt-3 text-center">
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
