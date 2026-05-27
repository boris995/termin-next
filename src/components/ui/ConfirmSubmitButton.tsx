"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

type ConfirmSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  message: string;
  variant?: "primary" | "secondary" | "ghost";
};

export function ConfirmSubmitButton({ children, message, onClick, variant = "secondary", ...props }: ConfirmSubmitButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  function closeModal(): void {
    setIsOpen(false);
  }

  function confirmSubmit(): void {
    closeModal();
    formRef.current?.requestSubmit();
  }

  return (
    <>
      <Button
        {...props}
        type="button"
        variant={variant}
        onClick={(event) => {
          event.preventDefault();
          formRef.current = event.currentTarget.form;
          setIsOpen(true);
          onClick?.(event);
        }}
      >
        {children}
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm" role="presentation">
          <div
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-950"
            role="dialog"
          >
            <p className="text-lg font-bold text-slate-950 dark:text-white">Potvrda brisanja</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Odustani
              </Button>
              <Button type="button" onClick={confirmSubmit}>
                Potvrdi
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
