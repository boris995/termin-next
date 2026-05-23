import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ServiceError } from "@/lib/errors";
import { ensureDatabaseConfigured, prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";

export type AuthRole = "ADMIN" | "USER";

export async function getCurrentUser(): Promise<{ id: string; name: string; role: AuthRole } | null> {
  const supabase = createClient(await cookies());
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  return ensureAppUser({
    id: user.id,
    email: user.email,
    name: user.user_metadata.name ?? user.email.split("@")[0]
  });
}

export async function requireAdmin(): Promise<void> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }
}

export async function requireAdminApi(): Promise<void> {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    throw new ServiceError("Nemate dozvolu za ovu akciju", 403);
  }
}

export async function ensureAppUser(input: { id: string; email: string; name: string }): Promise<{ id: string; name: string; role: AuthRole }> {
  ensureDatabaseConfigured();

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ id: input.id }, { email: input.email }]
    }
  });

  if (existingUser) {
    return {
      id: existingUser.id,
      name: existingUser.name,
      role: existingUser.role
    };
  }

  const realAdminCount = await prisma.user.count({
    where: {
      role: "ADMIN",
      NOT: {
        id: "demo-admin"
      }
    }
  });
  const adminEmail = process.env.TERMIN_ADMIN_EMAIL;
  const role: AuthRole = realAdminCount === 0 || input.email === adminEmail ? "ADMIN" : "USER";
  const createdUser = await prisma.user.create({
    data: {
      id: input.id,
      email: input.email,
      name: input.name,
      role
    }
  });

  return {
    id: createdUser.id,
    name: createdUser.name,
    role: createdUser.role
  };
}
