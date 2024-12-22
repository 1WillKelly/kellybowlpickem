import { prisma } from "server/db/client";
import {
  type CFBDTeam,
  type CFBDGame,
} from "server/datasources/college-football-data-api";
import { type FootballTeam } from "@prisma/client";

interface ApiTeam {
  apiId: string;
  name: string;
  conference: string;
  logo?: string;
}

export const syncTeams = async (
  games: readonly CFBDGame[],
  gameTeams: readonly CFBDTeam[]
): Promise<FootballTeam[]> => {
  const getLogo = (apiId: string): string | undefined => {
    const foundTeam = gameTeams.find((t) => t.id.toString() === apiId);
    if (!foundTeam || !foundTeam.logos.length) {
      return undefined;
    }
    return foundTeam.logos[0];
  };

  const teams = games.flatMap((game) => [
    {
      apiId: game.away_id.toString(),
      name: game.away_team,
      conference: game.away_conference,
      logo: getLogo(game.away_id.toString()),
    },
    {
      apiId: game.home_id.toString(),
      name: game.home_team,
      conference: game.home_conference,
      logo: getLogo(game.home_id.toString()),
    },
  ]);
  const teamApiIds = teams.map((team) => team.apiId);

  const existingTeams = await prisma.footballTeam.findMany({
    where: {
      apiId: {
        in: teamApiIds,
      },
    },
  });

  const existingTeamIdSet = new Set(existingTeams.map((t) => t.apiId));

  const createTeamFields = (team: ApiTeam) => ({
    apiId: team.apiId,
    name: team.name,
    conference: team.conference,
    logo: team.logo,
  });

  const candidatesToCreate = teams
    .filter((t) => !existingTeamIdSet.has(t.apiId))
    .map(createTeamFields);

  const existingTeamIds = new Set();
  const teamsToCreate = [];
  for (const team of candidatesToCreate) {
    if (!existingTeamIds.has(team.apiId)) {
      teamsToCreate.push(team);
    }
    existingTeamIds.add(team.apiId);
  }

  await prisma.footballTeam.createMany({
    data: teamsToCreate,
  });

  for (const team of existingTeams) {
    const gameTeam = teams.find((t) => t.apiId === team.apiId);
    if (!gameTeam) {
      throw new Error(`Could not find team ${team.apiId} in games`);
    }
    if (
      gameTeam.name !== team.name ||
      gameTeam.conference !== team.conference ||
      gameTeam.logo !== team.logo
    ) {
      await prisma.footballTeam.update({
        where: {
          id: team.id,
        },
        data: {
          name: gameTeam.name,
          conference: gameTeam.conference,
          logo: gameTeam.logo,
        },
      });
    }
  }

  // Refetch
  return await prisma.footballTeam.findMany({
    where: {
      apiId: {
        in: teamApiIds,
      },
    },
  });
};
