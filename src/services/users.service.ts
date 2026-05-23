import { ensureDatabaseConfigured, prisma } from "@/lib/db";
import type { UserUpdateInput } from "@/lib/validations/user";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: Date;
};

export async function getUsers(): Promise<AdminUser[]> {
  ensureDatabaseConfigured();

  return prisma.user.findMany({
    orderBy: [
      {
        role: "asc"
      },
      {
        createdAt: "desc"
      }
    ],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
}

export async function updateUser(input: UserUpdateInput): Promise<void> {
  ensureDatabaseConfigured();

  await prisma.user.update({
    where: {
      id: input.id
    },
    data: {
      name: input.name,
      email: input.email,
      role: input.role
    }
  });
}
