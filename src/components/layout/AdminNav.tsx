"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Pregled" },
  { href: "/admin/utakmice", label: "Utakmice" },
  { href: "/admin/igraci", label: "Igraci" },
  { href: "/admin/timovi", label: "Timovi" },
  { href: "/admin/tabela", label: "Tabela" },
  { href: "/admin/sezone", label: "Sezone" },
  { href: "/admin/korisnici", label: "Korisnici" }
];

function isActiveLink(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex gap-2 overflow-x-auto">
        {adminLinks.map((link) => {
          const isActive = isActiveLink(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-semibold transition",
                isActive
                  ? "bg-grass-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
