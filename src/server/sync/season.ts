import { type FootballTeam, type Season } from "@prisma/client";
import { CFBDataSource } from "server/datasources/college-football-data-api";
import { prisma } from "server/db/client";

const currentSeasonYear = (): number => {
  const now = new Date();
  // If it's before October, assume we're talking about the previous year's
  // season
  if (now.getMonth() < 10) {
    return now.getFullYear() - 1;
  }
  return now.getFullYear();
};

export const getSeason = async (): Promise<Season> => {
  const year = currentSeasonYear();
  return await prisma.season.upsert({
    where: {
      year,
    },
    create: {
      displayName: `${year}-${year + 1}`,
      year,
    },
    update: {},
  });
};

const upsertTeam = async (
  apiId: string,
  name: string,
  conference: string | undefined
): Promise<FootballTeam> => {
  return await prisma.footballTeam.upsert({
    where: {
      apiId,
    },
    create: {
      apiId,
      name,
      conference,
    },
    update: {
      name,
      conference,
    },
  });
};

export const syncBowlGames = async () => {
  const season = await getSeason();
  const client = new CFBDataSource();
  const games = await client.postSeasonGames(season.year);
  for (const game of games) {
    const homeTeam = await upsertTeam(
      game.home_id.toString(),
      game.home_team,
      game.home_conference
    );
    const awayTeam = await upsertTeam(
      game.away_id.toString(),
      game.away_team,
      game.away_conference
    );

    const startDate = new Date(game.start_date);
    const apiId = game.id.toString();
    const commonUpdateFields = {
      startDate,
      completed: game.completed,
      homeScore: game.home_points,
      awayScore: game.away_points,
      name: game.notes,
    };

    await prisma.footballMatchup.upsert({
      where: {
        apiId,
      },
      create: {
        apiId,
        week: game.week,
        seasonType: game.season_type,
        seasonId: season.id,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        ...commonUpdateFields,
      },
      update: commonUpdateFields,
    });
  }
};
