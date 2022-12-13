import { prisma } from "server/db/client";
import { type CFBDGame } from "server/datasources/college-football-data-api";
import { type FootballTeam } from "@prisma/client";

interface ApiTeam {
  apiId: string;
  name: string;
  conference: string;
}

export const syncTeams = async (
  games: readonly CFBDGame[]
): Promise<FootballTeam[]> => {
  const teams = games.flatMap((game) => [
    {
      apiId: game.away_id.toString(),
      name: game.away_team,
      conference: game.away_conference,
    },
    {
      apiId: game.home_id.toString(),
      name: game.home_team,
      conference: game.home_conference,
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
  });

  const teamsToCreate = teams
    .filter((t) => !existingTeamIdSet.has(t.apiId))
    .map(createTeamFields);

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
      gameTeam.conference !== team.conference
    ) {
      await prisma.footballTeam.update({
        where: {
          id: team.id,
        },
        data: {
          name: gameTeam.name,
          conference: gameTeam.conference,
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
