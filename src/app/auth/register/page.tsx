import Link from "next/link";
import { registerAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default async function RegisterPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Registracija</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Napravi nalog za Termin ligu.</p>
      </div>

      <Card>
        <form action={registerAction} className="space-y-4">
          <Input name="name" placeholder="Ime i prezime" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" minLength={6} placeholder="Lozinka" required />
          <Button className="w-full" type="submit">
            Registruj se
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-slate-600 dark:text-slate-300">
        Vec imas nalog?{" "}
        <Link href="/auth/login" className="font-semibold text-grass-700 hover:text-grass-900">
          Prijavi se
        </Link>
      </p>
    </div>
  );
}
