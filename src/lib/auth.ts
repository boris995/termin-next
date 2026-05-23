import { redirect } from "next/navigation";
import { ServiceError } from "@/lib/errors";

export type AuthRole = "ADMIN" | "USER";

export async function getCurrentUser(): Promise<{ id: string; name: string; role: AuthRole } | null> {
  return {
    id: "demo-admin",
    name: "Demo administrator",
    role: "ADMIN"
  };
}

export async function requireAdmin(): Promise<void> {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }
}

export async function requireAdminApi(): Promise<void> {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    throw new ServiceError("Nemate dozvolu za ovu akciju", 403);
  }
}
