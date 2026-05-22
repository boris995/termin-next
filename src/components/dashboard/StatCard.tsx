import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
};

export function StatCard({ label, value, detail, icon }: StatCardProps) {
  return (
    <Card className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{detail}</p>
      </div>
      <div className="rounded-2xl bg-grass-100 p-3 text-grass-700">{icon}</div>
    </Card>
  );
}
