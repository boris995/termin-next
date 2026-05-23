import { PrismaClient, MatchEventType, MatchStatus, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const season = await prisma.season.upsert({
    where: { id: "season-2026" },
    update: { isActive: true },
    create: {
      id: "season-2026",
      name: "Sezona 2026",
      startsAt: new Date("2026-05-01T00:00:00.000Z"),
      endsAt: new Date("2026-09-30T23:59:59.000Z"),
      isActive: true
    }
  });

  await prisma.user.upsert({
    where: { email: "admin@termin-liga.local" },
    update: { role: Role.ADMIN },
    create: {
      name: "Demo administrator",
      email: "admin@termin-liga.local",
      role: Role.ADMIN
    }
  });

  const teams = await Promise.all([
    upsertTeam("team-termin", "Termin Junajted", "TER", "Sarajevo", 2018, "#14904a"),
    upsertTeam("team-river", "Riversajd", "RIV", "Mostar", 2015, "#2563eb"),
    upsertTeam("team-borac", "Borac Centar", "BOR", "Banja Luka", 2012, "#dc2626"),
    upsertTeam("team-zvijezda", "Zvijezda Sjever", "ZVI", "Tuzla", 2020, "#9333ea")
  ]);

  const players = await Promise.all([
    upsertPlayer("player-1", "Marko Savic", "Napadac", 9, "team-termin"),
    upsertPlayer("player-2", "Adnan Kolic", "Vezni", 10, "team-river"),
    upsertPlayer("player-3", "Luka Petrovic", "Golman", 1, "team-borac"),
    upsertPlayer("player-4", "Emir Hadzic", "Krilo", 11, "team-zvijezda"),
    upsertPlayer("player-5", "Nikola Jovanovic", "Stoper", 5, "team-termin"),
    upsertPlayer("player-6", "Dino Selimovic", "Vezni", 8, "team-borac"),
    upsertPlayer("player-7", "Stefan Ilic", "Bek", 2, "team-river"),
    upsertPlayer("player-8", "Haris Mujagic", "Napadac", 7, "team-zvijezda"),
    upsertPlayer("player-9", "Filip Vukovic", "Stoper", 4, "team-borac"),
    upsertPlayer("player-10", "Amar Dedic", "Vezni", 6, "team-termin"),
    upsertPlayer("player-11", "Milan Radovic", "Krilo", 17, "team-river")
  ]);

  await Promise.all([
    upsertStanding(season.id, teams[0].id, 8, 6, 1, 1, 21, 10, 19),
    upsertStanding(season.id, teams[1].id, 8, 5, 1, 2, 18, 13, 16),
    upsertStanding(season.id, teams[2].id, 8, 3, 3, 2, 12, 10, 12),
    upsertStanding(season.id, teams[3].id, 8, 1, 1, 6, 9, 27, 4)
  ]);

  await upsertMatch("match-1", season.id, "team-termin", "team-river", 3, 2, "2026-05-18T18:00:00.000Z", "Gradski stadion", MatchStatus.FINISHED);
  await upsertMatch("match-2", season.id, "team-borac", "team-zvijezda", 1, 1, "2026-05-19T19:30:00.000Z", "Arena Centar", MatchStatus.FINISHED);
  await upsertMatch("match-3", season.id, "team-river", "team-borac", null, null, "2026-05-25T17:00:00.000Z", "Riversajd park", MatchStatus.SCHEDULED);
  await upsertMatch("match-4", season.id, "team-zvijezda", "team-termin", null, null, "2026-05-26T20:00:00.000Z", "Sjeverni teren", MatchStatus.SCHEDULED);

  await Promise.all([
    upsertEvent("event-1", "match-1", players[0].id, MatchEventType.GOAL, 18),
    upsertEvent("event-2", "match-1", players[0].id, MatchEventType.GOAL, 54),
    upsertEvent("event-3", "match-1", players[1].id, MatchEventType.GOAL, 72),
    upsertEvent("event-4", "match-2", players[5].id, MatchEventType.GOAL, 33),
    upsertEvent("event-5", "match-2", players[3].id, MatchEventType.GOAL, 81),
    upsertEvent("event-6", "match-1", players[10].id, MatchEventType.ASSIST, 72),
    upsertEvent("event-7", "match-1", players[9].id, MatchEventType.ASSIST, 54),
    upsertEvent("event-8", "match-2", players[7].id, MatchEventType.ASSIST, 81),
    upsertEvent("event-9", "match-2", players[8].id, MatchEventType.YELLOW_CARD, 64)
  ]);

  await Promise.all([
    upsertRating("rating-1", "match-1", players[0].id, 8.4),
    upsertRating("rating-2", "match-1", players[1].id, 8.1),
    upsertRating("rating-3", "match-2", players[2].id, 7.7),
    upsertRating("rating-4", "match-2", players[3].id, 8.0),
    upsertRating("rating-5", "match-1", players[4].id, 7.5),
    upsertRating("rating-6", "match-2", players[5].id, 7.9),
    upsertRating("rating-7", "match-1", players[6].id, 7.2),
    upsertRating("rating-8", "match-2", players[7].id, 7.8),
    upsertRating("rating-9", "match-2", players[8].id, 7.1),
    upsertRating("rating-10", "match-1", players[9].id, 7.6),
    upsertRating("rating-11", "match-1", players[10].id, 7.4)
  ]);
}

function upsertTeam(id, name, shortName, city, foundedYear, primaryColor) {
  return prisma.team.upsert({
    where: { id },
    update: { name, shortName, city, foundedYear, primaryColor },
    create: { id, name, shortName, city, foundedYear, primaryColor }
  });
}

function upsertPlayer(id, name, position, shirtNumber, teamId) {
  return prisma.player.upsert({
    where: { id },
    update: { name, position, shirtNumber, teamId },
    create: { id, name, position, shirtNumber, teamId }
  });
}

function upsertStanding(seasonId, teamId, played, won, drawn, lost, goalsFor, goalsAgainst, points) {
  return prisma.standing.upsert({
    where: { seasonId_teamId: { seasonId, teamId } },
    update: { played, won, drawn, lost, goalsFor, goalsAgainst, points },
    create: { seasonId, teamId, played, won, drawn, lost, goalsFor, goalsAgainst, points }
  });
}

function upsertMatch(id, seasonId, homeTeamId, awayTeamId, homeScore, awayScore, playedAt, venue, status) {
  return prisma.match.upsert({
    where: { id },
    update: { seasonId, homeTeamId, awayTeamId, homeScore, awayScore, playedAt: new Date(playedAt), venue, status },
    create: { id, seasonId, homeTeamId, awayTeamId, homeScore, awayScore, playedAt: new Date(playedAt), venue, status }
  });
}

function upsertEvent(id, matchId, playerId, type, minute) {
  return prisma.matchEvent.upsert({
    where: { id },
    update: { matchId, playerId, type, minute },
    create: { id, matchId, playerId, type, minute }
  });
}

function upsertRating(id, matchId, playerId, rating) {
  return prisma.playerRating.upsert({
    where: { id },
    update: { matchId, playerId, rating },
    create: { id, matchId, playerId, rating }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
