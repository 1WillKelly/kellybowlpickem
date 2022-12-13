import { CFBDataSource } from "server/datasources/college-football-data-api";
import { prisma } from "server/db/client";
import { getSeason } from "./season";
import { settlePicks } from "./settle-picks";

export const syncScores = async () => {
  const season = await getSeason();
  const now = new Date();
  const matchupsToSync = await prisma?.footballMatchup.findMany({
    where: {
      startDate: {
        lte: now,
      },
      season,
      completed: false,
    },
  });

  const client = new CFBDataSource();
  const games = await client.postSeasonGames(season.year);

  const updates = [];
  const justFinishedGamesIds = [];

  for (const game of games) {
    const matchup = matchupsToSync.find((m) => m.apiId === game.id.toString());
    if (!matchup) {
      // It's not one of the games we're tracking
      continue;
    }

    if (
      matchup.completed !== game.completed ||
      matchup.awayScore !== game.away_points ||
      matchup.homeScore !== game.home_points
    ) {
      if (matchup.completed !== game.completed) {
        // Only push the ID, because the in-memory data representation isn't
        // updated yet.
        justFinishedGamesIds.push(matchup.id);
      }

      updates.push(
        prisma.footballMatchup.update({
          where: { id: matchup.id },
          data: {
            completed: game.completed,
            homeScore: game.home_points,
            awayScore: game.away_points,
          },
        })
      );
    }
  }

  if (updates.length) {
    await prisma.$transaction(updates);
  }

  if (justFinishedGamesIds) {
    await settlePicks(justFinishedGamesIds);
  }

  return matchupsToSync;
};
