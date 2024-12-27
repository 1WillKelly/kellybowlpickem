import { router, publicProcedure } from "../trpc";
import { getSeason } from "server/sync/season";
import { z } from "zod";

export const participantsRouter = router({
  participants: publicProcedure.query(async ({ ctx }) => {
    const season = await getSeason();
    const participants = await ctx.prisma.participant.findMany({
      where: {
        picks: {
          some: {
            matchup: {
              season,
            },
          },
        },
      },
    });
    return participants.map((p) => ({
      ...p,
      email: undefined,
    }));
  }),
  participantsWithScores: publicProcedure
    .input(
      z.object({
        participantIds: z.string().array().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const whereClause = input.participantIds
        ? {
            where: {
              id: {
                in: input.participantIds,
              },
            },
          }
        : undefined;

      const season = await getSeason();
      const upcomingGames = await ctx.prisma.footballMatchup.findMany({
        where: {
          season,
          completed: false,
        },
        take: 3,
        orderBy: {
          startDate: "asc",
        },
      });
      const participants = await ctx.prisma.participant.findMany({
        ...whereClause,
        include: {
          seasonScores: {
            where: {
              season,
            },
          },
          picks: {
            where: {
              matchupId: {
                in: upcomingGames.map((m) => m.id),
              },
            },
            orderBy: {
              matchup: {
                startDate: "asc",
              },
            },
            include: {
              team: {
                select: {
                  name: true,
                  logo: true,
                },
              },
              matchup: {
                select: {
                  startDate: true,
                  homeTeamId: true,
                  awayTeamId: true,
                  homePointValue: true,
                  awayPointValue: true,
                },
              },
            },
          },
        },
      });
      return {
        // Strip out email so we don't leak it to the frontend
        participants: participants.map((p) => ({
          ...p,
          email: undefined,
        })),
        upcomingGames,
      };
    }),
});
