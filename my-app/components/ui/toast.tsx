"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/cn";

type ToastTone = "success" | "danger" | "info" | "default";

export type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
};

type ToastItem = ToastInput & { id: number };

type PushToast = (toast: ToastInput) => void;

const ToastContext = createContext<PushToast>(() => {});

const toneBar: Record<ToastTone, string> = {
  default: "bg-gold",
  success: "bg-success",
  danger: "bg-danger",
  info: "bg-info",
};

/** Access a `toast(...)` push function (requires <Toaster/> in the tree). */
export function useToast() {
  return useContext(ToastContext);
}

type ToasterProps = {
  className?: string;
  closeLabel?: string;
};

/** Renders the stacked toast list, fixed to the viewport corner. */
export function Toaster({ className, closeLabel = "Dismiss" }: ToasterProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const push = useCallback<PushToast>(({ duration = 5000, ...rest }) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { ...rest, duration, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {toasts.length > 0 && (
        <div
          className={cn(
            "fixed inset-x-4 bottom-4 z-[60] flex flex-col gap-2 sm:inset-x-auto sm:end-4 sm:w-80",
            className,
          )}
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="status"
              aria-live="polite"
              className="pointer-events-auto flex gap-3 overflow-hidden rounded-md border border-line bg-charcoal p-3 text-offwhite shadow-xl"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 w-1 shrink-0 self-stretch rounded-full",
                  toneBar[toast.tone ?? "default"],
                )}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-sm text-silver">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label={closeLabel}
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className="h-6 w-6 shrink-0 rounded text-silver transition-colors hover:text-offwhite focus:outline-2 focus:outline-gold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
