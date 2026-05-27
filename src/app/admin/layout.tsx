import type { ReactNode } from "react";
import { AdminNav } from "@/components/layout/AdminNav";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminNav />
      {children}
    </div>
  );
}
