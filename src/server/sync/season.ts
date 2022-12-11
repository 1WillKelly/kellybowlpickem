import { type Season } from "@prisma/client";
import {
  CFBDataSource,
  type CFBDGame,
} from "server/datasources/college-football-data-api";
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

  const getTeamId = (apiId: number): string => {
    const teamId = teamIdsToApiIds[apiId.toString()];
    if (!teamId) {
      throw new Error(`Could not find team with apiId ${apiId}`);
    }
    return teamId;
  };

  const apiGameIds = games.map((g) => g.id.toString());
  const existingMatchups = await prisma.footballMatchup.findMany({
    where: {
      apiId: {
        in: apiGameIds,
      },
    },
  });

  const existingMatchupIdSet = new Set(existingMatchups.map((m) => m.apiId));
  const matchupCreateFields = (m: CFBDGame) => ({
    apiId: m.id.toString(),
    startDate: new Date(m.start_date),
    completed: m.completed,
    homeScore: m.home_points,
    awayScore: m.away_points,
    name: m.notes,
    week: m.week,
    seasonType: m.season_type,
    seasonId: season.id,
    homeTeamId: getTeamId(m.home_id),
    awayTeamId: getTeamId(m.away_id),
  });

  const matchupsToCreate = games
    .filter((m) => !existingMatchupIdSet.has(m.id.toString()))
    .map(matchupCreateFields);

  await prisma.footballMatchup.createMany({
    data: matchupsToCreate,
  });

  const upserts = [];
  for (const matchup of existingMatchups) {
    const matchupData = games.find((m) => m.id.toString() === matchup.apiId);
    if (!matchupData) {
      throw new Error(`Could not find matchup ${matchup.apiId} in games`);
    }

    const updateFields = {
      startDate: new Date(matchupData.start_date),
      completed: matchupData.completed,
      homeScore: matchupData.home_points,
      awayScore: matchupData.away_points,
      name: matchupData.notes,
    };

    if (
      matchup.startDate.getTime() !== updateFields.startDate.getTime() ||
      matchup.completed !== updateFields.completed ||
      matchup.homeScore !== updateFields.homeScore ||
      matchup.awayScore !== updateFields.awayScore ||
      matchup.name !== updateFields.name
    ) {
      upserts.push(
        prisma.footballMatchup.update({
          where: {
            id: matchup.id,
          },
          data: updateFields,
        })
      );
    }
  }

  if (upserts.length) {
    await prisma.$transaction(upserts);
  }
};
