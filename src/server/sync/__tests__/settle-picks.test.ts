import { prisma } from "server/db/client";
import { getSeason } from "../season";
import { settlePicks } from "../settle-picks";
import { createMatchup, upsertTestParticipant } from "test/test-helpers";
import { CHAMPIONSHIP_POINT_VALUE } from "server/constants/point-constants";

describe("settling picks", () => {
  beforeAll(async () => {
    await getSeason();
  });

  test("creates scores for participants", async () => {
    const season = await getSeason();
    const p1 = await upsertTestParticipant("p1");
    const p2 = await upsertTestParticipant("p2");
    const matchup1 = await createMatchup(season, `m1-${new Date().getTime()}`);
    const matchup2 = await createMatchup(season, `m2-${new Date().getTime()}`);
    // Incomplete
    const matchup3 = await createMatchup(season, `m2-${new Date().getTime()}`);
    // Championship picks
    await prisma.participantChampionshipPick.create({
      data: {
        seasonId: season.id,
        participantId: p1.id,
        teamId: matchup1.homeTeamId,
      },
    });

    await prisma.participantChampionshipPick.create({
      data: {
        seasonId: season.id,
        participantId: p2.id,
        teamId: matchup1.awayTeamId,
      },
    });

    await prisma.footballMatchup.update({
      where: { id: matchup1.id },
      data: {
        completed: true,
        homeScore: 10,
        awayScore: 7,
      },
    });

    await prisma.footballMatchup.update({
      where: { id: matchup2.id },
      data: {
        completed: true,
        homeScore: 0,
        awayScore: 42,
      },
    });

    await prisma.participantPick.createMany({
      data: [
        // Matchup 1: p1 is correct, p2 is incorrect
        {
          participantId: p1.id,
          teamId: matchup1.homeTeamId,
          matchupId: matchup1.id,
          seasonId: season.id,
        },
        {
          participantId: p2.id,
          teamId: matchup1.awayTeamId,
          matchupId: matchup1.id,
          seasonId: season.id,
        },

        // Matchup 2: both picked correctly
        {
          participantId: p1.id,
          teamId: matchup2.awayTeamId,
          matchupId: matchup2.id,
          seasonId: season.id,
        },
        {
          participantId: p2.id,
          teamId: matchup2.awayTeamId,
          matchupId: matchup2.id,
          seasonId: season.id,
        },

        // Matchup 3: incomplete
        {
          participantId: p1.id,
          teamId: matchup3.awayTeamId,
          matchupId: matchup3.id,
          seasonId: season.id,
        },
        {
          participantId: p2.id,
          teamId: matchup3.awayTeamId,
          matchupId: matchup3.id,
          seasonId: season.id,
        },
      ],
    });

    await settlePicks();

    const m1score = await prisma.participantSeasonScore.findUniqueOrThrow({
      where: {
        participantId_seasonId: {
          participantId: p1.id,
          seasonId: season.id,
        },
      },
    });

    expect(m1score.points).toEqual(
      (matchup1.homePointValue ?? 0) + (matchup2.awayPointValue ?? 0)
    );

    expect(m1score.points).toEqual(32 + 34.5);
    expect(m1score.possiblePoints).toEqual(
      m1score.points + (matchup3.awayPointValue ?? 0) + CHAMPIONSHIP_POINT_VALUE
    );

    const m2score = await prisma.participantSeasonScore.findUniqueOrThrow({
      where: {
        participantId_seasonId: {
          participantId: p2.id,
          seasonId: season.id,
        },
      },
    });

    expect(m2score.points).toEqual(matchup2.awayPointValue ?? 0);
    expect(m2score.points).toEqual(34.5);
    expect(m2score.possiblePoints).toEqual(
      m2score.points + (matchup3.awayPointValue ?? 0) + CHAMPIONSHIP_POINT_VALUE
    );

    // Do it again, test that it's the same
    await settlePicks();

    const m1scoreRefetched =
      await prisma.participantSeasonScore.findUniqueOrThrow({
        where: {
          participantId_seasonId: {
            participantId: p1.id,
            seasonId: season.id,
          },
        },
      });

    expect(m1scoreRefetched.points).toEqual(32 + 34.5);

    const m2scoreRefetched =
      await prisma.participantSeasonScore.findUniqueOrThrow({
        where: {
          participantId_seasonId: {
            participantId: p2.id,
            seasonId: season.id,
          },
        },
      });

    expect(m2scoreRefetched.points).toEqual(34.5);
  });

  test("updates scores for participants", async () => {
    await settlePicks();
    // TODO
  });
});
