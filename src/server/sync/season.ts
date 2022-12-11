import { type FootballTeam, type Season } from "@prisma/client";
import { CFBDataSource } from "server/datasources/college-football-data-api";
import { prisma } from "server/db/client";
import { syncTeams } from "./teams";

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

export const syncBowlGames = async () => {
  const season = await getSeason();
  const client = new CFBDataSource();
  const games = await client.postSeasonGames(season.year);
  const teams = await syncTeams(games);

  const teamIdsToApiIds: Record<string, string> = {};
  for (const team of teams) {
    teamIdsToApiIds[team.apiId] = team.id;
  }

  for (const game of games) {
    const homeTeamId = teamIdsToApiIds[game.home_id.toString()];
    const awayTeamId = teamIdsToApiIds[game.away_id.toString()];

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
        homeTeamId,
        awayTeamId,
        ...commonUpdateFields,
      },
      update: commonUpdateFields,
    });
  }
};
