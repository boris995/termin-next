import { PrismaClient } from "@prisma/client";

export function ensureDatabaseConfigured(): void {
  const databaseUrl = process.env.TERMIN_POSTGRES_PRISMA_URL;

  if (!databaseUrl) {
    throw new Error(
      "TERMIN_POSTGRES_PRISMA_URL nije podesen. Provjeri .env.local Supabase PostgreSQL varijable."
    );
  }

  if (databaseUrl.includes("PROJEKAT") || databaseUrl.includes("LOZINKA") || databaseUrl.includes("UBACI_DATABASE_LOZINKU") || databaseUrl.includes("YOUR-PASSWORD")) {
    throw new Error(
      "TERMIN_POSTGRES_PRISMA_URL jos uvijek sadrzi placeholder vrijednosti."
    );
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
