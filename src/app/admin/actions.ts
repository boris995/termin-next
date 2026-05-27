"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { matchEventSchema, matchItemDeleteSchema, matchResultSchema, matchSchema, matchUpdateSchema, playerRatingSchema } from "@/lib/validations/match";
import { playerSchema, playerUpdateSchema } from "@/lib/validations/player";
import { seasonIdSchema, seasonSchema, seasonUpdateSchema } from "@/lib/validations/season";
import { standingUpdateSchema } from "@/lib/validations/standing";
import { teamUpdateSchema } from "@/lib/validations/team";
import { userUpdateSchema } from "@/lib/validations/user";
import {
  createMatch,
  createMatchEvent,
  deleteMatch,
  deleteMatchEvent,
  deletePlayerRating,
  updateMatch,
  updateMatchResult,
  upsertPlayerRating
} from "@/services/matches.service";
import { createPlayer, deletePlayer, updatePlayer } from "@/services/players.service";
import { activateSeason, createSeason, deleteSeason, updateSeason } from "@/services/seasons.service";
import { recalculateSeasonStandings, updateStanding, updateTeam } from "@/services/teams.service";
import { updateUser } from "@/services/users.service";

export async function createPlayerAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = playerSchema.safeParse({
    name: formData.get("name"),
    position: formData.get("position"),
    shirtNumber: formData.get("shirtNumber"),
    teamId: formData.get("teamId")
  });

  if (!parsed.success) {
    redirect("/admin/igraci?error=Podaci za igraca nisu ispravni");
  }

  await createPlayer(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/admin/igraci");
  revalidatePath("/players");
  redirect("/admin/igraci?success=Igrac je dodat");
}

export async function deletePlayerAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/admin/igraci?error=Igrac nije pronadjen");
  }

  await deletePlayer(id);
  revalidatePath("/admin");
  revalidatePath("/admin/igraci");
  revalidatePath("/players");
  redirect("/admin/igraci?success=Igrac je obrisan");
}

export async function updatePlayerAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = playerUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    position: formData.get("position"),
    shirtNumber: formData.get("shirtNumber"),
    teamId: formData.get("teamId")
  });

  if (!parsed.success) {
    redirect("/admin/igraci?error=Podaci za igraca nisu ispravni");
  }

  await updatePlayer(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/admin/igraci");
  revalidatePath("/players");
  revalidatePath("/matches");
  redirect("/admin/igraci?success=Igrac je azuriran");
}

export async function updateUserAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = userUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role")
  });

  if (!parsed.success) {
    redirect("/admin/korisnici?error=Podaci za korisnika nisu ispravni");
  }

  await updateUser(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/admin/korisnici");
  redirect("/admin/korisnici?success=Korisnik je azuriran");
}

export async function updateTeamAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = teamUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    shortName: formData.get("shortName"),
    city: formData.get("city"),
    foundedYear: formData.get("foundedYear"),
    primaryColor: formData.get("primaryColor"),
    logoUrl: formData.get("logoUrl")
  });

  if (!parsed.success) {
    redirect("/admin/timovi?error=Podaci za tim nisu ispravni");
  }

  await updateTeam(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/admin/timovi");
  revalidatePath("/teams");
  redirect("/admin/timovi?success=Tim je azuriran");
}

export async function updateStandingAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = standingUpdateSchema.safeParse({
    seasonId: formData.get("seasonId"),
    teamId: formData.get("teamId"),
    played: formData.get("played"),
    won: formData.get("won"),
    drawn: formData.get("drawn"),
    lost: formData.get("lost"),
    goalsFor: formData.get("goalsFor"),
    goalsAgainst: formData.get("goalsAgainst"),
    points: formData.get("points")
  });

  if (!parsed.success) {
    redirect("/admin/tabela?error=Podaci za tabelu nisu ispravni");
  }

  await updateStanding(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/admin/tabela");
  revalidatePath("/teams");
  redirect(`/admin/tabela?seasonId=${parsed.data.seasonId}&success=Tabela je azurirana`);
}

export async function recalculateStandingsAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = seasonIdSchema.safeParse({
    id: formData.get("seasonId")
  });

  if (!parsed.success) {
    redirect("/admin/tabela?error=Sezona nije pronadjena");
  }

  await recalculateSeasonStandings(parsed.data.id);
  revalidatePath("/admin");
  revalidatePath("/admin/tabela");
  revalidatePath("/teams");
  redirect(`/admin/tabela?seasonId=${parsed.data.id}&success=Tabela je preracunata iz rezultata`);
}

export async function createSeasonAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = seasonSchema.safeParse({
    name: formData.get("name"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt")
  });

  if (!parsed.success) {
    redirect("/admin/sezone?error=Podaci za sezonu nisu ispravni");
  }

  await createSeason(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/admin/sezone");
  revalidatePath("/admin/tabela");
  redirect("/admin/sezone?success=Sezona je dodata");
}

export async function updateSeasonAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = seasonUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    isActive: formData.get("isActive")
  });

  if (!parsed.success) {
    redirect("/admin/sezone?error=Podaci za sezonu nisu ispravni");
  }

  await updateSeason(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/admin/sezone");
  revalidatePath("/admin/tabela");
  revalidatePath("/matches");
  revalidatePath("/teams");
  redirect("/admin/sezone?success=Sezona je azurirana");
}

export async function activateSeasonAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = seasonIdSchema.safeParse({
    id: formData.get("id")
  });

  if (!parsed.success) {
    redirect("/admin/sezone?error=Sezona nije pronadjena");
  }

  await activateSeason(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/admin/sezone");
  revalidatePath("/admin/tabela");
  revalidatePath("/matches");
  revalidatePath("/teams");
  redirect("/admin/sezone?success=Sezona je aktivirana");
}

export async function deleteSeasonAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = seasonIdSchema.safeParse({
    id: formData.get("id")
  });

  if (!parsed.success) {
    redirect("/admin/sezone?error=Sezona nije pronadjena");
  }

  await deleteSeason(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/admin/sezone");
  revalidatePath("/admin/tabela");
  revalidatePath("/matches");
  revalidatePath("/teams");
  redirect("/admin/sezone?success=Sezona je obrisana");
}

export async function createMatchAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = matchSchema.safeParse({
    seasonId: formData.get("seasonId"),
    homeTeamId: formData.get("homeTeamId"),
    awayTeamId: formData.get("awayTeamId"),
    playedAt: formData.get("playedAt"),
    venue: formData.get("venue")
  });

  if (!parsed.success) {
    redirect("/admin/utakmice?error=Podaci za utakmicu nisu ispravni");
  }

  await createMatch(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/admin/utakmice");
  revalidatePath("/matches");
  redirect("/admin/utakmice?success=Utakmica je dodata");
}

export async function updateMatchResultAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = matchResultSchema.safeParse({
    id: formData.get("id"),
    homeScore: formData.get("homeScore"),
    awayScore: formData.get("awayScore")
  });

  if (!parsed.success) {
    redirect("/admin/utakmice?error=Rezultat nije ispravan");
  }

  const seasonId = await updateMatchResult(parsed.data);
  await recalculateSeasonStandings(seasonId);
  revalidatePath("/admin");
  revalidatePath("/admin/utakmice");
  revalidatePath("/admin/tabela");
  revalidatePath("/matches");
  revalidatePath("/teams");
  redirect(`/admin/utakmice?seasonId=${seasonId}&success=Rezultat je sacuvan i tabela je azurirana`);
}

export async function updateMatchAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = matchUpdateSchema.safeParse({
    id: formData.get("id"),
    homeTeamId: formData.get("homeTeamId"),
    awayTeamId: formData.get("awayTeamId"),
    playedAt: formData.get("playedAt"),
    venue: formData.get("venue"),
    status: formData.get("status")
  });

  if (!parsed.success) {
    redirect("/admin/utakmice?error=Podaci za utakmicu nisu ispravni");
  }

  const seasonId = await updateMatch(parsed.data);
  await recalculateSeasonStandings(seasonId);
  revalidatePath("/admin");
  revalidatePath("/admin/utakmice");
  revalidatePath("/admin/tabela");
  revalidatePath("/matches");
  revalidatePath("/teams");
  redirect(`/admin/utakmice?seasonId=${seasonId}&success=Utakmica je azurirana i tabela je azurirana`);
}

export async function deleteMatchAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/admin/utakmice?error=Utakmica nije pronadjena");
  }

  const seasonId = await deleteMatch(id);
  await recalculateSeasonStandings(seasonId);
  revalidatePath("/admin");
  revalidatePath("/admin/utakmice");
  revalidatePath("/admin/tabela");
  revalidatePath("/matches");
  revalidatePath("/teams");
  redirect(`/admin/utakmice?seasonId=${seasonId}&success=Utakmica je obrisana i tabela je azurirana`);
}

export async function createMatchEventAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = matchEventSchema.safeParse({
    matchId: formData.get("matchId"),
    playerId: formData.get("playerId"),
    type: formData.get("type"),
    minute: formData.get("minute"),
    relatedPlayerId: formData.get("relatedPlayerId")
  });

  if (!parsed.success) {
    redirect("/admin/utakmice?error=Timeline dogadjaj nije ispravan");
  }

  await createMatchEvent(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/admin/utakmice");
  revalidatePath("/matches");
  redirect("/admin/utakmice?success=Timeline dogadjaj je dodat");
}

export async function deleteMatchEventAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = matchItemDeleteSchema.safeParse({
    id: formData.get("id")
  });

  if (!parsed.success) {
    redirect("/admin/utakmice?error=Timeline dogadjaj nije pronadjen");
  }

  await deleteMatchEvent(parsed.data.id);
  revalidatePath("/admin");
  revalidatePath("/admin/utakmice");
  revalidatePath("/matches");
  redirect("/admin/utakmice?success=Timeline dogadjaj je obrisan");
}

export async function upsertPlayerRatingAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = playerRatingSchema.safeParse({
    matchId: formData.get("matchId"),
    playerId: formData.get("playerId"),
    rating: formData.get("rating")
  });

  if (!parsed.success) {
    redirect("/admin/utakmice?error=Ocjena igraca nije ispravna");
  }

  await upsertPlayerRating(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/admin/utakmice");
  revalidatePath("/players");
  redirect("/admin/utakmice?success=Ocjena je sacuvana");
}

export async function deletePlayerRatingAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = matchItemDeleteSchema.safeParse({
    id: formData.get("id")
  });

  if (!parsed.success) {
    redirect("/admin/utakmice?error=Ocjena nije pronadjena");
  }

  await deletePlayerRating(parsed.data.id);
  revalidatePath("/admin");
  revalidatePath("/admin/utakmice");
  revalidatePath("/matches");
  revalidatePath("/players");
  redirect("/admin/utakmice?success=Ocjena je obrisana");
}
