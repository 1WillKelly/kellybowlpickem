import { type Season, type Participant } from "@prisma/client";
import { prisma } from "server/db/client";

export const upsertTestParticipant = (seed: string): Promise<Participant> => {
  const email = `fake+${seed}-${new Date().getTime()}@example.tld`;
  return prisma.participant.upsert({
    where: {
      email,
    },
    create: {
      name: "fakey fakey",
      email,
    },
    update: {},
  });
};

export const createMatchup = async (season: Season, apiId?: string) => {
  const id = apiId ?? "fake-123";
  return prisma.footballMatchup.create({
    data: {
      startDate: new Date(),
      apiId: id,
      name: `fake matchup ${id}`,
      season: {
        connect: {
          id: season.id,
        },
      },
      seasonType: "postseason",
      week: 1,
      completed: false,
      homePointValue: 32,
      awayPointValue: 34.5,
      homeTeam: {
        create: {
          apiId: `home-${id}`,
          name: `home ${id}`,
          conference: "tests",
        },
      },
      awayTeam: {
        create: {
          apiId: `away-${id}`,
          name: `away ${id}`,
          conference: "tests",
        },
      },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });
};
