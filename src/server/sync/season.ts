import { type Season } from "@prisma/client";
import {
  CFBDataSource,
  type CFBDGameMedia,
  type CFBDGame,
} from "server/datasources/college-football-data-api";
import { prisma } from "server/db/client";
import { currentSeasonYear, seasonDisplayName } from "utils/datetime";
import { syncTeams } from "./teams";

export const getSeason = async (): Promise<Season> => {
  const year = currentSeasonYear();
  const displayName = seasonDisplayName();

  return await prisma.season.upsert({
    where: {
      year,
    },
    create: {
      displayName,
      year,
    },
    update: {},
  });
};

export const syncBowlGames = async () => {
  const season = await getSeason();
  const client = new CFBDataSource();
  const [games, gamesMedia, gameTeams] = await Promise.all([
    client.postSeasonGames(season.year),
    client.postSeasonGamesMedia(season.year),
    client.bowlTeams(),
  ]);
  const teams = await syncTeams(games, gameTeams);
  console.log("Games", { games });
  console.log("Media", { gamesMedia });

  const gamesWithMedia: (CFBDGame & Partial<CFBDGameMedia>)[] = games.map(
    (g) => {
      const mediaInfo = gamesMedia.find((m) => m.id === g.id);
      if (!mediaInfo) {
        return g;
      }
      return {
        ...g,
        ...mediaInfo,
      };
    }
  );

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

  console.log("Existing matchups", existingMatchups);

  const existingMatchupIdSet = new Set(existingMatchups.map((m) => m.apiId));
  const matchupCreateFields = (m: CFBDGame & Partial<CFBDGameMedia>) => ({
    apiId: m.id.toString(),
    startDate: new Date(m.startDate),
    completed: m.completed,
    homeScore: m.homePoints,
    awayScore: m.awayPoints,
    name: m.notes,
    week: m.week,
    seasonType: m.seasonType,
    seasonId: season.id,
    homeTeamId: getTeamId(m.homeId),
    awayTeamId: getTeamId(m.awayId),
    tvChannel: m.outlet,
  });

  const matchupsToCreate = gamesWithMedia
    .filter((m) => !existingMatchupIdSet.has(m.id.toString()))
    .map(matchupCreateFields);

  await prisma.footballMatchup.createMany({
    data: matchupsToCreate,
  });

  const upserts = [];
  for (const matchup of existingMatchups) {
    const matchupData = gamesWithMedia.find(
      (m) => m.id.toString() === matchup.apiId
    );
    if (!matchupData) {
      throw new Error(`Could not find matchup ${matchup.apiId} in games`);
    }
    console.log("Matchup data", matchupData);

    const updateFields = {
      startDate: new Date(matchupData.startDate),
      completed: matchupData.completed,
      homeScore: matchupData.homePoints,
      awayScore: matchupData.awayPoints,
      tvChannel: matchupData.outlet,
    };

    if (
      matchup.startDate.getTime() !== updateFields.startDate.getTime() ||
      matchup.completed !== updateFields.completed ||
      matchup.homeScore !== updateFields.homeScore ||
      matchup.awayScore !== updateFields.awayScore ||
      matchup.tvChannel !== updateFields.tvChannel
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
