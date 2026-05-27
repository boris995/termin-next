import { updateUserAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getUsers } from "@/services/users.service";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Korisnici</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Uredi ime, email i rolu korisnika.</p>
      </div>

      <section className="grid gap-4">
        {users.length > 0 ? users.map((user) => (
          <Card key={user.id}>
            <form action={updateUserAction} className="grid gap-4 lg:grid-cols-[1fr_1.2fr_160px_auto] lg:items-end">
              <input name="id" type="hidden" value={user.id} />
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Ime</label>
                <Input name="name" defaultValue={user.name} required />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Email</label>
                <Input name="email" type="email" defaultValue={user.email} required />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Rola</label>
                <select
                  className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-grass-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  defaultValue={user.role}
                  name="role"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="USER">Korisnik</option>
                </select>
              </div>
              <Button type="submit">Sacuvaj</Button>
            </form>
          </Card>
        )) : (
          <Card>
            <p className="text-sm text-slate-600 dark:text-slate-300">Nema korisnika za prikaz.</p>
          </Card>
        )}
      </section>
    </div>
  );
}
