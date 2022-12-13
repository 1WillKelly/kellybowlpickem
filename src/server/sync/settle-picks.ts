import { prisma } from "server/db/client";
import { getSeason } from "./season";

export const settlePicks = async (gameIds?: string[]) => {
  const season = await getSeason();
  const whereClause = gameIds?.length
    ? { id: { in: gameIds } }
    : { season, completed: true };

  const gamesToSettle = await prisma.footballMatchup.findMany({
    where: whereClause,
    include: {
      participantPicks: {
        where: {
          settled: false,
        },
      },
    },
  });

  const incompleteGames = await prisma.footballMatchup.findMany({
    where: {
      season,
      completed: false,
    },
  });

  const participantsWithPicks = await prisma.participant.findMany({
    include: {
      picks: {
        where: {
          season,
        },
      },
    },
  });

  for (const game of gamesToSettle) {
    if (game.participantPicks.length === 0) {
      continue;
    }

    console.log("Settling matchup", game.name);

    if (game.homeScore === null || game.awayScore === null) {
      throw new Error(
        "Game is completed without home or away scores: " +
          game.name +
          " " +
          game.id
      );
    }
    // Don't forget to add 45 for championship
    // TODO pull whether championship is complete

    const homeTeamWon = game.homeScore > game.awayScore;
    // Update scores
    await prisma.$transaction([]);
  }

  // TODO
};
