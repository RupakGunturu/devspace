import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { decodeJwtPayload, getGoogleClientId, type GoogleIdentity } from "@/lib/googleIdentity";

interface GoogleIdentityContextValue {
  detected: GoogleIdentity | null;
  clearDetected: () => void;
}

const GoogleIdentityContext = createContext<GoogleIdentityContextValue>({
  detected: null,
  clearDetected: () => {},
});

export function GoogleIdentityProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [detected, setDetected] = useState<GoogleIdentity | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (user) {
      setDetected(null);
      return;
    }

    const clientId = getGoogleClientId();
    if (!clientId) return;

    const runPrompt = () => {
      if (started.current || !window.google?.accounts?.id) return;
      started.current = true;

      const container = document.createElement("div");
      container.id = "ds-gsi-silent";
      container.setAttribute("aria-hidden", "true");
      container.style.cssText =
        "position:fixed;width:0;height:0;overflow:hidden;border:0;top:0;left:0;visibility:hidden;";
      document.body.appendChild(container);

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          if (!response.credential) return;
          const payload = decodeJwtPayload(response.credential);
          if (!payload || typeof payload.email !== "string") return;
          setDetected({
            name: typeof payload.name === "string" && payload.name ? payload.name : "there",
            email: payload.email,
            avatar: typeof payload.picture === "string" ? payload.picture : undefined,
            credential: response.credential,
          });
        },
        auto_select: true,
        cancel_on_tap_outside: false,
        context: "signin",
        prompt_parent: container.id,
      });

      window.google.accounts.id.prompt();
    };

    if (window.google?.accounts?.id) {
      runPrompt();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          runPrompt();
        }
      }, 200);
      const timeout = setTimeout(() => clearInterval(interval), 6000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [user]);

  return (
    <GoogleIdentityContext.Provider value={{ detected, clearDetected: () => setDetected(null) }}>
      {children}
    </GoogleIdentityContext.Provider>
  );
}

export function useGoogleIdentity() {
  return useContext(GoogleIdentityContext);
}
