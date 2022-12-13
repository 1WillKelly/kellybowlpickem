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
};
