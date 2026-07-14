import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";

interface ToastOptions {
  description?: string;
  variant?: "default" | "success" | "danger" | "warning" | "info";
}

interface ToastItem {
  id: number;
  message: string;
  description?: string;
  variant: string;
  exiting: boolean;
}

let globalAdd: ((msg: string, opts: ToastOptions) => void) | null = null;
let idCounter = 0;

function addToast(message: ReactNode, options?: ToastOptions) {
  globalAdd?.(String(message), { variant: options?.variant ?? "default", description: options?.description });
}

function toastSuccess(message: ReactNode, options?: Omit<ToastOptions, "variant">) {
  globalAdd?.(String(message), { variant: "success", description: options?.description });
}

function toastDanger(message: ReactNode, options?: Omit<ToastOptions, "variant">) {
  globalAdd?.(String(message), { variant: "danger", description: options?.description });
}

function toastWarning(message: ReactNode, options?: Omit<ToastOptions, "variant">) {
  globalAdd?.(String(message), { variant: "warning", description: options?.description });
}

function toastInfo(message: ReactNode, options?: Omit<ToastOptions, "variant">) {
  globalAdd?.(String(message), { variant: "info", description: options?.description });
}

export const toast = Object.assign(addToast, {
  success: toastSuccess,
  danger: toastDanger,
  warning: toastWarning,
  info: toastInfo,
});

const VARIANT_CONFIG: Record<string, { border: string; indicator: string; icon: string }> = {
  default: { border: "var(--line)", indicator: "var(--muted)", icon: "●" },
  success: { border: "#00ff88", indicator: "#00ff88", icon: "✓" },
  danger: { border: "var(--coral)", indicator: "var(--coral)", icon: "✕" },
  warning: { border: "var(--yellow)", indicator: "var(--yellow)", icon: "!" },
  info: { border: "#60a5fa", indicator: "#60a5fa", icon: "i" },
};

const DISMISS_MS = 4000;

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const add = useCallback(
    (message: string, opts: ToastOptions) => {
      const id = ++idCounter;
      setToasts((prev) => [
        ...prev,
        { id, message, description: opts.description, variant: opts.variant ?? "default", exiting: false },
      ]);
      setTimeout(() => dismiss(id), DISMISS_MS);
    },
    [dismiss],
  );

  useEffect(() => {
    globalAdd = add;
    return () => {
      globalAdd = null;
    };
  }, [add]);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-sm:bottom-3 max-sm:right-3 max-sm:left-3">
      {toasts.map((t) => {
        const cfg = VARIANT_CONFIG[t.variant] ?? VARIANT_CONFIG.default;
        return (
          <div
            key={t.id}
            className={`pointer-events-auto relative w-[360px] max-sm:w-full overflow-hidden rounded-lg border shadow-2xl backdrop-blur-md ${
              t.exiting ? "toast-exit" : "toast-enter"
            }`}
            style={{
              borderColor: cfg.border,
              background: "color-mix(in oklch, var(--paper) 85%, transparent)",
            }}
          >
            <div className="flex items-start gap-3 px-4 py-3.5">
              <div
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: cfg.indicator, color: "var(--ink)" }}
              >
                {cfg.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {t.message}
                </div>
                {t.description && (
                  <div className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    {t.description}
                  </div>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="mt-0.5 shrink-0 text-lg leading-none opacity-40 transition-opacity hover:opacity-100"
                style={{ color: "var(--foreground)" }}
              >
                ×
              </button>
            </div>
            <div
              className="toast-progress h-[2px]"
              style={{ background: cfg.indicator }}
            />
          </div>
        );
      })}
    </div>
  );
}
