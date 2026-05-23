"use client";

import { Button } from "@/components/ui/Button";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="sr-Latn">
      <body className="bg-slate-50 p-6 text-slate-950">
        <main className="mx-auto mt-16 max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900 shadow-sm">
          <h1 className="text-2xl font-black">Aplikacija trenutno nije dostupna</h1>
          <p className="mt-3 text-sm">
            Server nije uspio ucitati podatke. Provjeri produkcijske env varijable i Supabase konekciju.
          </p>
          <Button className="mt-5" onClick={reset} type="button">
            Pokusaj ponovo
          </Button>
        </main>
      </body>
    </html>
  );
}
