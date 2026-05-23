import Link from "next/link";
import { Trophy } from "lucide-react";
import { logoutAction } from "@/app/auth/actions";
import { getCurrentUserSafe } from "@/lib/auth";

const links = [
  { href: "/", label: "Pocetna" },
  { href: "/matches", label: "Utakmice" },
  { href: "/players", label: "Igraci" },
  { href: "/teams", label: "Timovi" },
  { href: "/admin", label: "Admin" }
];

export async function Navbar() {
  const user = await getCurrentUserSafe();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-base font-bold text-slate-950 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-grass-600 text-white">
            <Trophy className="h-5 w-5" aria-hidden="true" />
          </span>
          Termin liga
        </Link>
        <div className="flex gap-1 overflow-x-auto text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-2xl px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white">
              {link.label}
            </Link>
          ))}
          {user ? (
            <form action={logoutAction}>
              <button className="rounded-2xl px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white" type="submit">
                Odjava
              </button>
            </form>
          ) : (
            <>
              <Link href="/auth/login" className="rounded-2xl px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white">
                Prijava
              </Link>
              <Link href="/auth/register" className="rounded-2xl px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white">
                Registracija
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
