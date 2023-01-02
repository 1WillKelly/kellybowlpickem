import { type ParticipantPick, type FootballMatchup } from "@prisma/client";
import { CHAMPIONSHIP_POINT_VALUE } from "server/constants/point-constants";
import { prisma } from "server/db/client";
import { getSeason } from "./season";

interface CompletedPickScore {
  completed: true;
  correct: boolean;
  points: number;
}

interface IncompletePickScore {
  completed: false;
  possiblePoints: number | null;
}

type PickScore = CompletedPickScore | IncompletePickScore;

const pointValue = (
  pick: ParticipantPick,
  game: FootballMatchup
): PickScore => {
  if (game.completed) {
    if (game.homeScore === null || game.awayScore === null) {
      throw new Error(
        "Game is completed without home or away scores: " +
          game.name +
          " " +
          game.id
      );
    }
    // Special case for championship game, where they may have picked a team
    // that didn't make it to the 'ship
    if (pick.teamId !== game.homeTeamId && pick.teamId !== game.awayTeamId) {
      return {
        completed: true,
        points: 0,
        correct: false,
      };
    }

    const homeTeamWon = game.homeScore > game.awayScore;
    const participantPickedHome = pick.teamId === game.homeTeamId;
    const correct = homeTeamWon === participantPickedHome;
    const points = correct
      ? participantPickedHome
        ? game.homePointValue
        : game.awayPointValue
      : 0;

    if (points === null) {
      throw new Error("No points assigned to completed game: " + game.id);
    }
    return {
      correct,
      points,
      completed: true,
    };
  } else {
    // Special case for championship game, where they may have picked a team
    // that didn't make it to the 'ship
    if (pick.teamId !== game.homeTeamId && pick.teamId !== game.awayTeamId) {
      return {
        completed: false,
        possiblePoints: 0,
      };
    }

    return {
      completed: false,
      possiblePoints:
        pick.teamId == game.homeTeamId
          ? game.homePointValue
          : game.awayPointValue,
    };
  }
};

const calculatePossiblePoints = (
  games: readonly FootballMatchup[],
  picks: readonly ParticipantPick[]
): number => {
  const points =
    games
      .map((game) => {
        const pickForGame = picks.find((p) => p.matchupId === game.id);
        if (!pickForGame) {
          return undefined;
        }
        const pickPointValue = pointValue(pickForGame, game);
        if (pickPointValue.completed) {
          return pickPointValue.points;
        } else {
          return pickPointValue.possiblePoints ?? 0;
        }
      })
      .reduce((acc, item) => (item ?? 0) + (acc ?? 0), 0) ?? 0;
  return points + CHAMPIONSHIP_POINT_VALUE;
};

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

  const seasonGames = await prisma.footballMatchup.findMany({
    where: {
      season,
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

    const pickUpdates = game.participantPicks.flatMap((pick) => {
      const pointCalculation = pointValue(pick, game);
      if (!pointCalculation.completed) {
        throw new Error("Game is not completed: " + game.id);
      }

      const participantPicks = participantsWithPicks.find(
        (p) => p.id === pick.participantId
      )?.picks;

      if (participantPicks === undefined) {
        throw new Error("Participant picks not found: " + pick.participantId);
      }

      const possiblePoints = calculatePossiblePoints(
        seasonGames,
        participantPicks
      );

      return [
        prisma.participantPick.update({
          where: { id: pick.id },
          data: {
            settled: true,
            correct: pointCalculation.correct,
            settledPoints: pointCalculation.points,
          },
        }),
        prisma.participantSeasonScore.upsert({
          where: {
            participantId_seasonId: {
              seasonId: season.id,
              participantId: pick.participantId,
            },
          },
          create: {
            points: pointCalculation.points,
            participantId: pick.participantId,
            seasonId: season.id,
            possiblePoints,
          },
          update: {
            points: {
              increment: pointCalculation.points,
            },
            possiblePoints,
          },
        }),
      ];
    });

    // TODO pull whether championship is complete

    // Update scores
    await prisma.$transaction([...pickUpdates]);
  }
};
