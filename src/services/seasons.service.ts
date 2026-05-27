import { ensureDatabaseConfigured, prisma } from "@/lib/db";
import type { SeasonIdInput, SeasonInput, SeasonUpdateInput } from "@/lib/validations/season";
import type { Season } from "@/types";

function mapSeason(season: {
  id: string;
  name: string;
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
}): Season {
  return {
    id: season.id,
    name: season.name,
    startsAt: season.startsAt.toISOString(),
    endsAt: season.endsAt.toISOString(),
    isActive: season.isActive
  };
}

async function createStandingRowsForSeason(seasonId: string): Promise<void> {
  const teams = await prisma.team.findMany({
    select: {
      id: true
    }
  });

  await Promise.all(
    teams.map((team) =>
      prisma.standing.upsert({
        where: {
          seasonId_teamId: {
            seasonId,
            teamId: team.id
          }
        },
        update: {},
        create: {
          seasonId,
          teamId: team.id
        }
      })
    )
  );
}

export async function getSeasons(): Promise<Season[]> {
  ensureDatabaseConfigured();

  const seasons = await prisma.season.findMany({
    orderBy: [
      {
        isActive: "desc"
      },
      {
        startsAt: "desc"
      }
    ]
  });

  return seasons.map(mapSeason);
}

export async function createSeason(input: SeasonInput): Promise<void> {
  ensureDatabaseConfigured();

  const season = await prisma.season.create({
    data: {
      name: input.name,
      startsAt: input.startsAt,
      endsAt: input.endsAt
    }
  });

  await createStandingRowsForSeason(season.id);
}

export async function updateSeason(input: SeasonUpdateInput): Promise<void> {
  ensureDatabaseConfigured();

  await prisma.$transaction(async (transaction) => {
    if (input.isActive) {
      await transaction.season.updateMany({
        data: {
          isActive: false
        }
      });
    }

    await transaction.season.update({
      where: {
        id: input.id
      },
      data: {
        name: input.name,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        isActive: input.isActive
      }
    });
  });

  await createStandingRowsForSeason(input.id);
}

export async function activateSeason(input: SeasonIdInput): Promise<void> {
  ensureDatabaseConfigured();

  await prisma.$transaction([
    prisma.season.updateMany({
      data: {
        isActive: false
      }
    }),
    prisma.season.update({
      where: {
        id: input.id
      },
      data: {
        isActive: true
      }
    })
  ]);

  await createStandingRowsForSeason(input.id);
}

export async function deleteSeason(input: SeasonIdInput): Promise<void> {
  ensureDatabaseConfigured();

  await prisma.season.delete({
    where: {
      id: input.id
    }
  });
}
