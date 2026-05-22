import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  tone?: "green" | "blue" | "slate" | "red";
};

export function Badge({ children, tone = "slate" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tone === "green" && "bg-grass-100 text-grass-700",
        tone === "blue" && "bg-blue-100 text-blue-700",
        tone === "red" && "bg-red-100 text-red-700",
        tone === "slate" && "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200"
      )}
    >
      {children}
    </span>
  );
}
