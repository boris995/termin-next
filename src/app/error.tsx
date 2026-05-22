"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
      <h1 className="text-xl font-bold">Doslo je do greske</h1>
      <p className="mt-2 text-sm">Pokusajte ponovo ili provjerite podatke.</p>
      <Button className="mt-4" type="button" onClick={reset}>
        Ponovi
      </Button>
    </div>
  );
}
