import { prisma } from "server/db/client";
import { getSeason } from "../season";
import { syncChampionship } from "../championship";
import { createMatchup, upsertTestParticipant } from "test/test-helpers";

describe("syncing championship", () => {
  beforeAll(async () => {
    await getSeason();
  });

  test("creates picks for participants", async () => {
    const season = await getSeason();
    const p1 = await upsertTestParticipant("p1");
    const matchup = await createMatchup(season, `m1-${new Date().getTime()}`);

    await prisma.footballMatchup.update({
      where: {
        id: matchup.id,
      },
      data: {
        isChampionship: true,
      },
    });

    await prisma.participantChampionshipPick.create({
      data: {
        participantId: p1.id,
        teamId: matchup.homeTeamId,
        seasonId: season.id,
      },
    });

    await syncChampionship();

    const foundPick = await prisma.participantPick.findFirstOrThrow({
      where: {
        season,
        participantId: p1.id,
      },
    });

    expect(foundPick.teamId).toEqual(matchup.homeTeamId);

    await syncChampionship();

    const pickCount = await prisma.participantPick.count({
      where: {
        season,
        participantId: p1.id,
      },
    });
    expect(pickCount).toEqual(1);
  });
});
