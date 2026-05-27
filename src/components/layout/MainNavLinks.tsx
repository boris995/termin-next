"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/", label: "Pocetna" },
  { href: "/matches", label: "Utakmice" },
  { href: "/standings", label: "Tabela" },
  { href: "/players", label: "Igraci" },
  { href: "/teams", label: "Timovi" },
  { href: "/stats", label: "Statistika" }
];

const adminLink = { href: "/admin", label: "Admin" };

function isActiveLink(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNavLinks({ showAdmin = false }: { showAdmin?: boolean }) {
  const pathname = usePathname();
  const links = showAdmin ? [...publicLinks, adminLink] : publicLinks;

  return (
    <>
      {links.map((link) => {
        const isActive = isActiveLink(pathname, link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-2xl px-3 py-2 font-medium transition",
              isActive
                ? "bg-grass-600 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
