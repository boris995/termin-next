import { updateTeamAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getTeams } from "@/services/teams.service";

export const dynamic = "force-dynamic";

export default async function AdminTeamsPage() {
  const teams = await getTeams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Timovi</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Uredi naziv, kratice, grad, boju i logo timova.</p>
      </div>

      <section className="grid gap-4">
        {teams.length > 0 ? teams.map((team) => (
          <Card key={team.id}>
            <form action={updateTeamAction} className="grid gap-4 xl:grid-cols-[1.1fr_120px_1fr_130px_130px_1.4fr_auto] xl:items-end">
              <input name="id" type="hidden" value={team.id} />
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Naziv</label>
                <Input name="name" defaultValue={team.name} required />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Kratko</label>
                <Input name="shortName" defaultValue={team.shortName} required />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Grad</label>
                <Input name="city" defaultValue={team.city} required />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Godina</label>
                <Input name="foundedYear" type="number" defaultValue={team.foundedYear} required />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Boja</label>
                <Input name="primaryColor" type="color" defaultValue={team.primaryColor} required />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Logo URL</label>
                <Input name="logoUrl" type="url" defaultValue={team.logoUrl ?? ""} placeholder="https://..." />
              </div>
              <Button type="submit">Sacuvaj</Button>
            </form>
          </Card>
        )) : (
          <Card>
            <p className="text-sm text-slate-600 dark:text-slate-300">Nema timova za prikaz.</p>
          </Card>
        )}
      </section>
    </div>
  );
}
