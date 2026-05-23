"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  showToast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, tone: ToastTone = "info") => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => removeToast(id), 4500);
  }, [removeToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6">
        {toasts.map((toast) => (
          <div
            className={cn(
              "flex items-start gap-3 rounded-2xl border bg-white p-4 text-sm shadow-lg dark:bg-slate-950",
              toast.tone === "success" && "border-grass-100 text-grass-900 dark:border-grass-900 dark:text-grass-100",
              toast.tone === "error" && "border-red-200 text-red-900 dark:border-red-900 dark:text-red-100",
              toast.tone === "info" && "border-slate-200 text-slate-900 dark:border-slate-800 dark:text-slate-100"
            )}
            key={toast.id}
            role="status"
          >
            {toast.tone === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-grass-700" /> : null}
            {toast.tone === "error" ? <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" /> : null}
            {toast.tone === "info" ? <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" /> : null}
            <p className="flex-1 font-medium">{toast.message}</p>
            <button
              aria-label="Zatvori obavjestenje"
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              onClick={() => removeToast(toast.id)}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast mora biti koristen unutar ToastProvider komponente.");
  }

  return context;
}
