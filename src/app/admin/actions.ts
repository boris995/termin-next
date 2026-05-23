"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { playerSchema } from "@/lib/validations/player";
import { teamUpdateSchema } from "@/lib/validations/team";
import { userUpdateSchema } from "@/lib/validations/user";
import { createPlayer, deletePlayer } from "@/services/players.service";
import { updateTeam } from "@/services/teams.service";
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
    redirect("/admin?error=Podaci za igraca nisu ispravni");
  }

  await createPlayer(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/players");
  redirect("/admin?success=Igrac je dodat");
}

export async function deletePlayerAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/admin?error=Igrac nije pronadjen");
  }

  await deletePlayer(id);
  revalidatePath("/admin");
  revalidatePath("/players");
  redirect("/admin?success=Igrac je obrisan");
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
    redirect("/admin?error=Podaci za korisnika nisu ispravni");
  }

  await updateUser(parsed.data);
  revalidatePath("/admin");
  redirect("/admin?success=Korisnik je azuriran");
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
    redirect("/admin?error=Podaci za tim nisu ispravni");
  }

  await updateTeam(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/teams");
  redirect("/admin?success=Tim je azuriran");
}
