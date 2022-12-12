import { prisma } from "server/db/client";
import { getSeason } from "./season";

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

  return matchupsToSync;
  // TODO
};
