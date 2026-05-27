import {
  createMatchAction,
  createMatchEventAction,
  deleteMatchAction,
  deleteMatchEventAction,
  deletePlayerRatingAction,
  updateMatchAction,
  updateMatchResultAction,
  upsertPlayerRatingAction
} from "@/app/admin/actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { Input } from "@/components/ui/Input";
import type { AdminMatch } from "@/services/matches.service";
import type { MatchStatus, PlayerWithTeam, Team } from "@/types";

const selectClassName =
  "h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-grass-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100";

function toDateTimeLocal(value: string): string {
  return value.slice(0, 16);
}

function getStatusView(status: MatchStatus): {
  label: string;
  tone: "green" | "blue" | "slate" | "red";
  dotClassName: string;
} {
  if (status === "LIVE") {
    return {
      label: "Uzivo",
      tone: "red",
      dotClassName: "bg-red-500"
    };
  }

  if (status === "FINISHED") {
    return {
      label: "Zavrsena",
      tone: "green",
      dotClassName: "bg-grass-500"
    };
  }

  return {
    label: "Zakazana",
    tone: "blue",
    dotClassName: "bg-blue-500"
  };
}

function AdminMatchStatusBadge({ status }: { status: MatchStatus }) {
  const statusView = getStatusView(status);

  return (
    <Badge tone={statusView.tone}>
      <span className={`mr-2 h-2 w-2 rounded-full ${statusView.dotClassName}`} />
      {statusView.label}
    </Badge>
  );
}

export function NewMatchForm({ selectedSeasonId, teams }: { selectedSeasonId?: string; teams: Team[] }) {
  return (
    <Card className="xl:sticky xl:top-24">
      <h2 className="text-xl font-bold text-slate-950 dark:text-white">Dodaj utakmicu</h2>
      <form action={createMatchAction} className="mt-4 space-y-4">
        {selectedSeasonId ? <input name="seasonId" type="hidden" value={selectedSeasonId} /> : null}
        <TeamSelect label="Domaci tim" name="homeTeamId" teams={teams} placeholder="Domaci tim" required />
        <TeamSelect label="Gostujuci tim" name="awayTeamId" teams={teams} placeholder="Gostujuci tim" required />
        <Input name="playedAt" aria-label="Termin" type="datetime-local" required />
        <Input name="venue" aria-label="Teren" placeholder="Teren / lokacija" required />
        <Button type="submit">Sacuvaj utakmicu</Button>
      </form>
    </Card>
  );
}

export function AdminMatchCard({ match, players, teams }: { match: AdminMatch; players: PlayerWithTeam[]; teams: Team[] }) {
  return (
    <Card className="space-y-4 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-bold text-slate-950 dark:text-white">
              {match.homeTeam.name} - {match.awayTeam.name}
            </p>
            <AdminMatchStatusBadge status={match.status} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {toDateTimeLocal(match.playedAt).replace("T", " ")} - {match.venue}
          </p>
        </div>
        <form action={deleteMatchAction}>
          <input name="id" type="hidden" value={match.id} />
          <ConfirmSubmitButton message="Da li sigurno zelis obrisati ovu utakmicu? Ovo brise i njene dogadjaje i ocjene." type="submit">
            Obrisi
          </ConfirmSubmitButton>
        </form>
      </div>

      <MatchResultForm match={match} />
      <MatchDetailsForm match={match} teams={teams} />

      <div className="grid gap-3 xl:grid-cols-2">
        <MatchEventForm matchId={match.id} players={players} />
        <PlayerRatingForm matchId={match.id} players={players} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <MatchEventsList events={match.events} />
        <PlayerRatingsList ratings={match.ratings} />
      </div>
    </Card>
  );
}

function MatchResultForm({ match }: { match: AdminMatch }) {
  return (
    <div className="rounded-2xl border border-grass-200 bg-grass-50 p-3 dark:border-grass-900/60 dark:bg-grass-950/20">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase text-grass-800 dark:text-grass-200">Brzi unos rezultata</p>
        <p className="text-lg font-black text-slate-950 dark:text-white">
          {match.homeScore ?? 0}:{match.awayScore ?? 0}
        </p>
      </div>
      <form action={updateMatchResultAction} className="grid gap-3 sm:grid-cols-[90px_90px_auto] sm:items-end">
        <input name="id" type="hidden" value={match.id} />
        <Input name="homeScore" aria-label="Golovi domaci" type="number" min={0} defaultValue={match.homeScore ?? 0} required />
        <Input name="awayScore" aria-label="Golovi gosti" type="number" min={0} defaultValue={match.awayScore ?? 0} required />
        <Button type="submit">Sacuvaj rezultat</Button>
      </form>
    </div>
  );
}

function MatchDetailsForm({ match, teams }: { match: AdminMatch; teams: Team[] }) {
  return (
    <form action={updateMatchAction} className="grid gap-3 lg:grid-cols-[1fr_1fr_170px_1fr_140px_auto] lg:items-end">
      <input name="id" type="hidden" value={match.id} />
      <TeamSelect defaultValue={match.homeTeamId} label="Domaci" name="homeTeamId" teams={teams} />
      <TeamSelect defaultValue={match.awayTeamId} label="Gosti" name="awayTeamId" teams={teams} />
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Termin</label>
        <Input name="playedAt" type="datetime-local" defaultValue={toDateTimeLocal(match.playedAt)} required />
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Teren</label>
        <Input name="venue" defaultValue={match.venue} required />
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Status</label>
        <select className={selectClassName} defaultValue={match.status} name="status">
          <option value="SCHEDULED">Zakazana</option>
          <option value="LIVE">Uzivo</option>
          <option value="FINISHED">Zavrsena</option>
        </select>
      </div>
      <Button type="submit">Sacuvaj</Button>
    </form>
  );
}

function MatchEventForm({ matchId, players }: { matchId: string; players: PlayerWithTeam[] }) {
  return (
    <form action={createMatchEventAction} className="grid gap-3 md:grid-cols-[88px_1fr_140px_auto] md:items-end">
      <input name="matchId" type="hidden" value={matchId} />
      <Input name="minute" aria-label="Minut" type="number" min={0} max={130} placeholder="Min" required />
      <PlayerSelect label="Igrac" name="playerId" players={players} placeholder="Igrac" />
      <select aria-label="Tip dogadjaja" className={selectClassName} name="type" required>
        <option value="GOAL">Gol</option>
        <option value="ASSIST">Asistencija</option>
        <option value="YELLOW_CARD">Zuti karton</option>
        <option value="RED_CARD">Crveni karton</option>
        <option value="SUBSTITUTION">Izmjena</option>
      </select>
      <Button type="submit">Dodaj</Button>
    </form>
  );
}

function PlayerRatingForm({ matchId, players }: { matchId: string; players: PlayerWithTeam[] }) {
  return (
    <form action={upsertPlayerRatingAction} className="grid gap-3 md:grid-cols-[1fr_100px_auto] md:items-end">
      <input name="matchId" type="hidden" value={matchId} />
      <PlayerSelect label="Igrac za ocjenu" name="playerId" players={players} placeholder="Igrac za ocjenu" />
      <Input name="rating" aria-label="Ocjena" type="number" step="0.1" min={1} max={10} placeholder="Ocjena" required />
      <Button type="submit">Ocjena</Button>
    </form>
  );
}

function MatchEventsList({ events }: { events: AdminMatch["events"] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Timeline</p>
      <div className="max-h-48 space-y-1 overflow-y-auto pr-1 text-sm text-slate-600 dark:text-slate-300">
        {events.length > 0 ? events.map((event) => (
          <div key={event.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-800">
            <p>{event.minute}&apos; {event.type} - {event.playerName}</p>
            <form action={deleteMatchEventAction}>
              <input name="id" type="hidden" value={event.id} />
              <ConfirmSubmitButton message="Da li sigurno zelis obrisati ovaj timeline dogadjaj?" type="submit">
                Obrisi
              </ConfirmSubmitButton>
            </form>
          </div>
        )) : <p>Nema dogadjaja.</p>}
      </div>
    </div>
  );
}

function PlayerRatingsList({ ratings }: { ratings: AdminMatch["ratings"] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Ocjene</p>
      <div className="max-h-48 space-y-1 overflow-y-auto pr-1 text-sm text-slate-600 dark:text-slate-300">
        {ratings.length > 0 ? ratings.map((rating) => (
          <div key={rating.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-800">
            <p>{rating.playerName}: {rating.rating.toFixed(1)}</p>
            <form action={deletePlayerRatingAction}>
              <input name="id" type="hidden" value={rating.id} />
              <ConfirmSubmitButton message="Da li sigurno zelis obrisati ovu ocjenu igraca?" type="submit">
                Obrisi
              </ConfirmSubmitButton>
            </form>
          </div>
        )) : <p>Nema ocjena.</p>}
      </div>
    </div>
  );
}

function TeamSelect({
  defaultValue,
  label,
  name,
  placeholder,
  required,
  teams
}: {
  defaultValue?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  teams: Team[];
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">{label}</label>
      <select aria-label={label} className={selectClassName} defaultValue={defaultValue} name={name} required={required}>
        {placeholder ? <option value="">{placeholder}</option> : null}
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function PlayerSelect({
  label,
  name,
  players,
  placeholder
}: {
  label: string;
  name: string;
  players: PlayerWithTeam[];
  placeholder: string;
}) {
  return (
    <select aria-label={label} className={selectClassName} name={name} required>
      <option value="">{placeholder}</option>
      {players.map((player) => (
        <option key={player.id} value={player.id}>
          {player.name}
        </option>
      ))}
    </select>
  );
}
