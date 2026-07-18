const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2000";

export interface PopupAuthResult {
  token: string;
}

export function openGoogleAuthPopup(): Promise<PopupAuthResult> {
  return new Promise((resolve, reject) => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${API_URL}/api/auth/google?popup=true`,
      "google-auth",
      `width=${width},height=${height},left=${left},top=${top},popup=yes`
    );

    if (!popup) {
      reject(new Error("Failed to open popup. Please allow popups for this site."));
      return;
    }

    const timeout = setTimeout(() => {
      popup.close();
      reject(new Error("Authentication timed out"));
    }, 120000);

    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;

      const data = event.data;
      if (data?.type === "google-auth-success") {
        clearTimeout(timeout);
        window.removeEventListener("message", handleMessage);
        popup.close();
        resolve({ token: data.token });
      } else if (data?.type === "google-auth-error") {
        clearTimeout(timeout);
        window.removeEventListener("message", handleMessage);
        popup.close();
        reject(new Error(data.error || "Authentication failed"));
      }
    }

    window.addEventListener("message", handleMessage);

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        clearTimeout(timeout);
        window.removeEventListener("message", handleMessage);
        reject(new Error("Authentication cancelled"));
      }
    }, 500);
  });
}
