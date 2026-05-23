import Link from "next/link";
import { loginAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default async function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Prijava</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Prijavi se za pristup admin panelu.</p>
      </div>

      <Card>
        <form action={loginAction} className="space-y-4">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Lozinka" required />
          <Button className="w-full" type="submit">
            Prijavi se
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-slate-600 dark:text-slate-300">
        Nemas nalog?{" "}
        <Link href="/auth/register" className="font-semibold text-grass-700 hover:text-grass-900">
          Registruj se
        </Link>
      </p>
    </div>
  );
}
