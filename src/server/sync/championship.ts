import { prisma } from "server/db/client";
import { getSeason } from "./season";

export const syncChampionship = async () => {
  const season = await getSeason();
  const championshipPicks = await prisma.participantChampionshipPick.findMany({
    where: {
      season,
    },
  });
  const championshipGame = await prisma.footballMatchup.findFirstOrThrow({
    where: {
      season,
      isChampionship: true,
    },
  });
  console.log("Championship picks", championshipPicks, championshipGame);

  const existingPicks = await prisma.participantPick.findMany({
    where: {
      season,
      matchupId: championshipGame.id,
    },
  });

  console.log("Existing picks for championship", existingPicks);

  const picksToCreate = [];
  for (const pick of championshipPicks) {
    if (!existingPicks.find((p) => p.participantId === pick.participantId)) {
      picksToCreate.push({
        participantId: pick.participantId,
        teamId: pick.teamId,
        matchupId: championshipGame.id,
        seasonId: season.id,
      });
    }
  }

  console.log("Picks to create", picksToCreate);

  const createdPicks = await prisma.participantPick.createMany({
    data: picksToCreate,
  });
  console.log("Created picks", createdPicks);

  return { createdPicks, existingPicks };
};
