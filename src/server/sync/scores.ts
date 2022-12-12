import { prisma } from "server/db/client";

export const syncScores = async () => {
  const now = new Date();
  const matchupsToSync = await prisma?.footballMatchup.findMany({
    where: {
      startDate: {
        lte: now,
      },
      completed: false,
    },
  });

  return matchupsToSync;
  // TODO
};
