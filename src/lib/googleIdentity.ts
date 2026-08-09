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

export const FALLBACK_GOOGLE_CLIENT_ID =
  "475552312971-qt8ik78he2t8k1kf6kpdmhp62ik7p46n.apps.googleusercontent.com";

export function getGoogleClientId(): string {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || FALLBACK_GOOGLE_CLIENT_ID;
}

export interface GoogleIdentity {
  name: string;
  email: string;
  avatar?: string;
  credential: string;
}

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
